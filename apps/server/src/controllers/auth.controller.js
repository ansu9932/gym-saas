import slugify from "slugify";
import { Gym } from "../models/Gym.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import { USER_ROLES } from "../constants/roles.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/tokens.js";

const sanitizeAuthUser = async (userId) => {
  const user = await User.findById(userId).select("-password").populate("gym");
  const unreadNotifications = await Notification.countDocuments({
    gym: user.gym._id,
    readAt: null
  });

  return {
    token: signToken(user),
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      unreadNotifications,
      gym: {
        id: user.gym._id,
        name: user.gym.name,
        slug: user.gym.slug,
        themePreference: user.gym.themePreference
      }
    }
  };
};

const ensureUniqueGymSlug = async (gymName) => {
  const base = slugify(gymName, { lower: true, strict: true }) || "gym";
  let slug = base;
  let counter = 2;

  while (await Gym.exists({ slug })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
};

export const register = asyncHandler(async (req, res) => {
  const { gymName, ownerName, email, password, phoneNumber } = req.body;

  if (!gymName || !ownerName || !email || !password) {
    res.status(400);
    throw new Error("Gym name, owner name, email, and password are required");
  }

  const emailExists = await User.exists({ email: email.toLowerCase() });

  if (emailExists) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const gym = await Gym.create({
    name: gymName,
    slug: await ensureUniqueGymSlug(gymName),
    contactEmail: email,
    phoneNumber
  });

  const user = await User.create({
    gym: gym._id,
    fullName: ownerName,
    email,
    password,
    role: USER_ROLES.ADMIN
  });

  gym.owner = user._id;
  await gym.save();

  res.status(201).json(await sanitizeAuthUser(user._id));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() })
    .select("+password")
    .populate("gym");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  user.lastLoginAt = new Date();
  await user.save();

  res.json(await sanitizeAuthUser(user._id));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(await sanitizeAuthUser(req.user._id));
});

export const createStaff = asyncHandler(async (req, res) => {
  const { fullName, email, password, role = USER_ROLES.STAFF } = req.body;

  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error("Full name, email, and password are required");
  }

  const existingUser = await User.exists({ email: email.toLowerCase() });

  if (existingUser) {
    res.status(409);
    throw new Error("A user with this email already exists");
  }

  const staffMember = await User.create({
    gym: req.user.gym._id,
    fullName,
    email,
    password,
    role
  });

  res.status(201).json({
    id: staffMember._id,
    fullName: staffMember.fullName,
    email: staffMember.email,
    role: staffMember.role
  });
});

export const listStaff = asyncHandler(async (req, res) => {
  const users = await User.find({
    gym: req.user.gym._id
  })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json(users);
});
