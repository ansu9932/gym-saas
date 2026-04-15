import { Notification } from "../models/Notification.js";

export const createNotification = async ({
  gymId,
  memberId,
  type,
  title,
  message,
  metadata
}) =>
  Notification.create({
    gym: gymId,
    member: memberId,
    type,
    title,
    message,
    metadata
  });
