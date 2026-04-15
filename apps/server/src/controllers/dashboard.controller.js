import dayjs from "dayjs";
import { Member } from "../models/Member.js";
import { Notification } from "../models/Notification.js";
import { buildMemberStatus } from "../utils/membership.js";

const buildLastSixMonths = () =>
  Array.from({ length: 6 }).map((_, index) => dayjs().subtract(5 - index, "month"));

const mapSeries = (months, aggregation, valueKey) =>
  months.map((month) => {
    const key = month.format("YYYY-MM");
    const match = aggregation.find((item) => item._id === key);

    return {
      label: month.format("MMM"),
      value: match?.[valueKey] || 0
    };
  });

export const getOverview = async (req, res, next) => {
  try {
    const gymId = req.user.gym._id;

    const [members, unreadNotifications, revenueRaw, newMembersRaw] = await Promise.all([
      Member.find({ gym: gymId }).populate("membershipPlan").sort({ createdAt: -1 }),
      Notification.countDocuments({ gym: gymId, readAt: null }),
      Member.aggregate([
        {
          $match: {
            gym: gymId,
            paymentStatus: { $in: ["paid", "partial"] }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m",
                date: "$startDate"
              }
            },
            revenue: { $sum: "$amountPaid" }
          }
        }
      ]),
      Member.aggregate([
        {
          $match: {
            gym: gymId
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m",
                date: "$createdAt"
              }
            },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const summary = members.reduce(
      (accumulator, member) => {
        const { status } = buildMemberStatus(member);

        accumulator.totalMembers += 1;

        if (status === "active") {
          accumulator.activeMemberships += 1;
        }

        if (status === "expiring") {
          accumulator.expiringSoon += 1;
        }

        if (status === "expired") {
          accumulator.expiredMembers += 1;
        }

        if (member.paymentStatus === "paid" || member.paymentStatus === "partial") {
          accumulator.monthlyRevenue += member.amountPaid || 0;
        }

        return accumulator;
      },
      {
        totalMembers: 0,
        activeMemberships: 0,
        expiringSoon: 0,
        expiredMembers: 0,
        monthlyRevenue: 0
      }
    );

    const months = buildLastSixMonths();
    const revenueSeries = mapSeries(months, revenueRaw, "revenue");
    const newMembersSeries = mapSeries(months, newMembersRaw, "count");

    const expiringMembers = members
      .map((member) => ({
        ...member.toObject(),
        ...buildMemberStatus(member)
      }))
      .filter((member) => member.status === "expiring")
      .sort((left, right) => new Date(left.endDate) - new Date(right.endDate))
      .slice(0, 6);

    const recentMembers = members.slice(0, 5).map((member) => ({
      ...member.toObject(),
      ...buildMemberStatus(member)
    }));

    const planMix = Object.values(
      members.reduce((accumulator, member) => {
        const key = member.planName;
        accumulator[key] = accumulator[key] || {
          name: key,
          value: 0
        };
        accumulator[key].value += 1;
        return accumulator;
      }, {})
    );

    res.json({
      stats: {
        ...summary,
        unreadNotifications
      },
      charts: {
        revenue: revenueSeries,
        newMembers: newMembersSeries,
        planMix
      },
      expiringMembers,
      recentMembers
    });
  } catch (error) {
    next(error);
  }
};
