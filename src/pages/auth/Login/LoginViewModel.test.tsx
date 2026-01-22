import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockAuthLogin = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock("@/store/auth.store", () => ({
  useAuthStore: (selector: (state: { login: typeof mockLogin }) => unknown) =>
    selector({ login: mockLogin })
}));

vi.mock("@/services/auth/auth.service", () => ({
  authService: {
    login: (payload: unknown) => mockAuthLogin(payload)
  }
}));

vi.mock("sonner", () => ({
  toast: {
    success: (message: string) => mockToastSuccess(message),
    error: (message: string) => mockToastError(message)
  }
}));

import { LoginViewModel } from "./LoginViewModel";

describe("LoginViewModel", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogin.mockReset();
    mockAuthLogin.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it("logs in and navigates on success", async () => {
    mockAuthLogin.mockResolvedValue({ accessToken: "token" });
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginViewModel />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Usuário"), "admin");
    await user.type(screen.getByLabelText("Senha"), "secret");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mockAuthLogin).toHaveBeenCalledWith({ username: "admin", password: "secret" });
      expect(mockLogin).toHaveBeenCalledWith({ accessToken: "token" });
      expect(mockToastSuccess).toHaveBeenCalledWith("Login realizado com sucesso");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("shows error toast on failure", async () => {
    mockAuthLogin.mockRejectedValue("nope");
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginViewModel />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Usuário"), "admin");
    await user.type(screen.getByLabelText("Senha"), "secret");
    await user.click(screen.getByRole("button", { name: "Entrar" }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Falha ao autenticar");
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
