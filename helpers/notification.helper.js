import { Notifications } from "../models/notification.model.js";

export const markAllNotificationsAsSeen = async (recieverId, type, country, state, isPartner) => {
  try {
    let query;

    if (recieverId) {
      // If senderId is provided, target notifications by senderId
      query = { "recipient.userId": recieverId };
    } else {
      // If senderId is undefined, target notifications with no recipient.userId
      query = { "recipient.userId": { $exists: false } };
    }

    if (state) {
      query.state = { $regex: new RegExp(`^${state}$`, "i") }; // Case-insensitive state match
    }

    let change = {}

    if(type === "seen"){
      change = { status: "seen" };
    }else {
      change = { isRead: true, status: "seen" };
    }

    if(isPartner === "partner"){
      change.isSeenBy = "partner";
    }

    const result = await Notifications.updateMany(query, change);

    console.log(`${result.modifiedCount} notifications marked as seen.`);
  } catch (error) {
    console.error("Error marking notifications as seen:", error);
  }
};

export const deleteAllNotificationsForUser = async (recieverId) => {
  try {
    const query = recieverId
      ? { "recipient.userId": recieverId }
      : { "recipient.userId": { $exists: false } };

    const result = await Notifications.deleteMany(query);

    console.log(`${result.deletedCount} notifications deleted.`);
  } catch (error) {
    console.error("Error deleting notifications:", error);
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notification = await Notifications.findById(notificationId);

    if (!notification) {
      console.error("Notification not found!");
      return;
    }

    notification.isRead = true;
    await notification.save();

    console.log(`Notification with ID: ${notificationId} marked as read`);
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const getNotificationsForAdmin = async ( page = 1, limit = 10, country, state, adminRole ) => {
  try {
    const skip = (page - 1) * limit;
    if ((adminRole === "4" || adminRole === "5") && !state) {
      return { notifications: [], currentPage: page, totalPages: 0, totalNotifications: 0, nextPage: null, prevPage: null, hasNextPage: false, hasPrevPage: false };
    }

    let query = {
      "recipient.userId": { $exists: false },
      "recipient.role": "0",
    };

    if (adminRole === "4" || adminRole === "5") {
    

      if (state) {
        query.state = { $regex: new RegExp(`^${state}$`, "i") }; // Case-insensitive state match
      }
    }
    
    const notifications = await Notifications.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalNotifications = await Notifications.countDocuments(query);
    const totalPages = Math.ceil(totalNotifications / limit);

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    if (!notifications) {
      console.error("notifications for admin not found!");
      return;
    }

    return { notifications, currentPage: page, totalPages, totalNotifications, nextPage, prevPage, hasNextPage, hasPrevPage, };
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const getNotificationsForUser = async (id, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const notifications = await Notifications.find({ "recipient.userId": id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalNotifications = await Notifications.countDocuments({
      "recipient.userId": id,
    });
    const totalPages = Math.ceil(totalNotifications / limit);

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    if (!notifications) {
      console.error("notifications for users not found!");
      return;
    }

    return { notifications, currentPage: page, totalPages, totalNotifications, nextPage, prevPage, hasNextPage, hasPrevPage, };
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const deleteNotificationsForUser = async (id) => {
  try {
    const notifications = await Notifications.findByIdAndDelete(id);

    if (!notifications) {
      console.error("notifications for users not found!");
      return;
    }

    return notifications;
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};


export const countUnseenForUser = async (id) => {
  try {
    const count = await Notifications.countDocuments({ "recipient.userId": id , status: "unseen"});

    if (!count) {
      console.error("count for users not found!");
      return;
    }

    return count;
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const countUnseenForAdmin = async (country,state, isPartner) => {
  try {

    let query = {
      "recipient.userId": { $exists: false },
      "recipient.role": "0",
    };

    if(isPartner === "partner"){
      query.isSeenBy = {$exists : false};
    }else{
      query.status = "unseen"
    }
    if (state) {
      query.state = { $regex: new RegExp(`^${state}$`, "i") }; // Case-insensitive state match
    }

    const count = await Notifications.countDocuments(query);

    if (!count) {
      console.error("notifications for users not found!");
      return;
    }

    return count;
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

export const createNotification = async (notification) => {
  try {
    let newNotification = new Notifications({
      title: notification.title,
      message: notification.message,
      sender: {
        userId: notification.sender.userId,
        role: notification.sender.role,
      },
      recipient: notification?.recipient?.userId
        ? {
            userId: notification.recipient.userId,
            role: notification.recipient.role,
            isGroup: notification.recipient.isGroup,
          }
        : {
            role: notification.recipient.role,
            isGroup: notification.recipient.isGroup,
          },
      status: "unseen",
      // readBy: [],
      isRead: false,
      pathData: notification.pathData || {},
      routePath: notification.routePath || "/",
      state: notification?.state?.toLowerCase(),
      country: notification?.country?.toLowerCase()
    });

    newNotification = await newNotification.save();
    console.log("New notification created successfully.");
    return newNotification;
  } catch (error) {
    console.log("Error creating new notification:", error);
  }
};
