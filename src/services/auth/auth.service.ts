import { apiClient } from "@/shared/api/axios";
import { LoginRequest, LoginResponse } from "@/shared/types/swagger";

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await apiClient.post<LoginResponse>("/api/auth/login", payload);
    return data;
  }
};
