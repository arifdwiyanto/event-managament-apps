
import apiFetch from "../../../services/apiFetch";
import { UserNotification } from "../types";

// --- Regular User Notifications ---

export const fetchNotifications = async (): Promise<UserNotification[]> => {
  const response = await apiFetch.get("/notifications");
  return response.data;
};

export const fetchUnreadCount = async (): Promise<number> => {
  const response = await apiFetch.get("/notifications/unread-count");
  return response.data.count;
};

export const markAsRead = async (id: string): Promise<void> => {
  await apiFetch.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await apiFetch.patch("/notifications/read-all");
};

// --- Organizer & Team Notifications ---

export const fetchOrgNotifications = async (): Promise<UserNotification[]> => {
  const response = await apiFetch.get("/notifications/org");
  return response.data;
};

export const fetchOrgUnreadCount = async (): Promise<number> => {
  const response = await apiFetch.get("/notifications/org/unread-count");
  return response.data.count;
};

export const markOrgAsRead = async (id: string): Promise<void> => {
  await apiFetch.patch(`/notifications/org/${id}/read`);
};

export const markAllOrgAsRead = async (): Promise<void> => {
  await apiFetch.patch("/notifications/org/read-all");
};
