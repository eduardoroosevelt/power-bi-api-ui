import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { PoliciesAdminViewPage, PolicyForm } from "./PoliciesAdminViewPage";

const PoliciesHarness = () => {
  const { register } = useForm<PolicyForm>();
  return (
    <PoliciesAdminViewPage
      policies={[]}
      open={false}
      onOpenChange={vi.fn()}
      register={register}
      errors={{}}
      isSubmitting={false}
      onSubmit={vi.fn()}
      subjectTypes={[]}
      policyEffects={[]}
    />
  );
};

describe("PoliciesAdminViewPage", () => {
  it("renders heading and new policy action", () => {
    render(<PoliciesHarness />);

    expect(screen.getByText("Políticas do Report")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova política" })).toBeInTheDocument();
  });
});
