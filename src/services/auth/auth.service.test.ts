import { describe, expect, it, vi, beforeEach } from "vitest";

const postMock = vi.hoisted(() => vi.fn());

vi.mock("@/shared/api/axios", () => ({
  apiClient: {
    post: postMock
  }
}));

import { authService } from "./auth.service";

describe("authService", () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it("posts login data and returns the response payload", async () => {
    postMock.mockResolvedValue({ data: { accessToken: "token" } });

    const result = await authService.login({ username: "ana", password: "senha" });

    expect(postMock).toHaveBeenCalledWith("/api/auth/login", {
      username: "ana",
      password: "senha"
    });
    expect(result).toEqual({ accessToken: "token" });
  });
});
