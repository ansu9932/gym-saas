import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 20), 50);

  const notifications = await Notification.find({
    gym: req.user.gym._id
  })
    .populate("member", "fullName phoneNumber endDate")
    .sort({ createdAt: -1 })
    .limit(limit);

  const unreadCount = await Notification.countDocuments({
    gym: req.user.gym._id,
    readAt: null
  });

  res.json({
    items: notifications,
    unreadCount
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      gym: req.user.gym._id
    },
    {
      readAt: new Date()
    },
    {
      new: true
    }
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.json(notification);
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    {
      gym: req.user.gym._id,
      readAt: null
    },
    {
      readAt: new Date()
    }
  );

  res.status(204).send();
});
