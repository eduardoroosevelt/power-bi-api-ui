import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { RuleForm, RuleValueForm, RulesAdminViewPage } from "./RulesAdminViewPage";

const RulesHarness = () => {
  const { register } = useForm<RuleForm>();
  const { register: valueRegister } = useForm<RuleValueForm>();
  return (
    <RulesAdminViewPage
      rules={[]}
      open={false}
      valueOpen={false}
      onOpenChange={vi.fn()}
      onValueOpenChange={vi.fn()}
      onSelectRule={vi.fn()}
      register={register}
      errors={{}}
      isSubmitting={false}
      onSubmit={vi.fn()}
      valueRegister={valueRegister}
      valueErrors={{}}
      onAddValueSubmit={vi.fn()}
      operatorOptions={[]}
      valuesModeOptions={[]}
    />
  );
};

describe("RulesAdminViewPage", () => {
  it("renders heading and new rule action", () => {
    render(<RulesHarness />);

    expect(screen.getByText("Regras da Política")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova regra" })).toBeInTheDocument();
  });
});
