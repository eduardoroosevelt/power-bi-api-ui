import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { LoginForm, LoginViewPage } from "./LoginViewPage";

const TestHarness = ({
  errors,
  isSubmitting,
  onSubmit
}: {
  errors: Record<string, { message?: string }>;
  isSubmitting: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) => {
  const { register } = useForm<LoginForm>();
  return (
    <LoginViewPage
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
    />
  );
};

describe("LoginViewPage", () => {
  it("renders validation errors when provided", () => {
    render(
      <TestHarness
        errors={{
          username: { message: "Informe o usuário" },
          password: { message: "Informe a senha" }
        }}
        isSubmitting={false}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText("Informe o usuário")).toBeInTheDocument();
    expect(screen.getByText("Informe a senha")).toBeInTheDocument();
  });

  it("disables submit button while submitting", () => {
    render(
      <TestHarness errors={{}} isSubmitting={true} onSubmit={vi.fn()} />
    );

    const submitButton = screen.getByRole("button", { name: "Entrando..." });
    expect(submitButton).toBeDisabled();
  });
});
