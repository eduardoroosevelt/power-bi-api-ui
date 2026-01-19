import { loginAction } from "@/app/actions/auth";
import { withAuthHandling } from "@/shared/api/client";
import { LoginRequest } from "@/shared/types/swagger";

export const authService = {
  async login(payload: LoginRequest) {
    return withAuthHandling(() => loginAction(payload));
  }
};
