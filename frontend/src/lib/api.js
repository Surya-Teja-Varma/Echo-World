import { axiosInstance } from "./axios";

// Authentication
export const signup = async (signupData) => {
  try {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const login = async (loginData) => {
  try {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    // Gracefully handle a 401 Unauthorized error by logging out
    if (error.response?.status === 401) {
      console.log("Session expired or unauthorized, logging out.");
      await logout(); // Ensure a clean logout
    }
    console.error("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/onboarding", userData);
    return response.data;
  } catch (error) {
    console.error("Onboarding error:", error);
    throw error;
  }
};

export async function getUserFriends() {
  try {
    const response = await axiosInstance.get("/users/friends");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
}

export async function getRecommendedUsers() {
  try {
    const response = await axiosInstance.get("/users");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    throw error;
  }
}

export async function getOutgoingFriendReqs() {
  try {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching outgoing friend requests:", error);
    throw error;
  }
}

export async function sendFriendRequest(userId) {
  try {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
}

export async function getFriendRequests() {
  try {
    const response = await axiosInstance.get("/users/friend-requests");
    return response.data || { incomingReqs: [], acceptedReqs: [] };
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    throw error;
  }
}

export async function  acceptFriendRequest(requestId) {
  try {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
    return response.data;
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
}

// Chat
export async function getStreamToken() {
  try {
    const response = await axiosInstance.get("/chat/token");
    return response.data;
  } catch (error) {
    console.error("Error fetching Stream token:", error);
    throw error;
  }
}