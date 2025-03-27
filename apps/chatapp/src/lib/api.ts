import { Conversation, User } from "@/utils/types";
import axiosInstance from "./axios";
import Cookies from "js-cookie";

export const AuthAPI = {
  login: async (
    email: string,
    password: string
  ): Promise<{ token: string }> => {
    const res = await axiosInstance.post("/user/login", {
      email,
      password,
    });
    if (res.data.token) {
      Cookies.set("userToken", res.data.token);
    }
    return res.data;
  },

  verifyToken: async (): Promise<{ payload: User; message?: string }> => {
    const token = Cookies.get("userToken");
    const res = await axiosInstance.get("user/verifyToken", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data as { payload: User; error?: string };
  },
  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<{ token: string }> => {
    const res = await axiosInstance.post("/user/register", {
      username,
      email,
      password,
    });
    if (res.data.token) {
      Cookies.set("userToken", res.data.token);
    }
    return res.data;
  },
};

export const ConversationAPI = {
  getAll: async (): Promise<Conversation[]> => {
    const res = await axiosInstance.get("/conversations/getAll");
    return res.data as Conversation[];
  },
  getById: async (id: string): Promise<{ data: Conversation }> => {
    const res = await axiosInstance.get(`/conversations/${id}`);
    return res.data as { data: Conversation };
  },
  create: async (
    type: "direct" | "group",
    receiverId: string
  ): Promise<{ data: Conversation }> => {
    const res = await axiosInstance.post("/conversations/create", {
      type,
      receiverId,
    });
    return res.data as { data: Conversation };
  },
};
