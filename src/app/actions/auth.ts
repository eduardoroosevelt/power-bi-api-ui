"use server";

import { cookies } from "next/headers";
import { apiRequest } from "@/app/actions/api";
import { LoginRequest, LoginResponse } from "@/shared/types/swagger";

export const loginAction = async (payload: LoginRequest) => {
  const response = await apiRequest<LoginResponse, LoginRequest>("/api/auth/login", {
    method: "POST",
    body: payload,
    auth: false
  });

  if (response.accessToken) {
    cookies().set("accessToken", response.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    });
  }

  return response;
};

export const logoutAction = async () => {
  cookies().delete("accessToken");
};
