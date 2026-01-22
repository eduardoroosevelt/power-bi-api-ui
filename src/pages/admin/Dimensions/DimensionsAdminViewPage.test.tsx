import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { DimensionForm, DimensionsAdminViewPage } from "./DimensionsAdminViewPage";

const DimensionsHarness = () => {
  const { register } = useForm<DimensionForm>();
  return (
    <DimensionsAdminViewPage
      dimensions={[]}
      loading={false}
      open={false}
      onOpenChange={vi.fn()}
      register={register}
      errors={{}}
      isSubmitting={false}
      onSubmit={vi.fn()}
      valueTypes={[]}
    />
  );
};

describe("DimensionsAdminViewPage", () => {
  it("renders heading and new dimension action", () => {
    render(<DimensionsHarness />);

    expect(screen.getByText("Dimensões do Report")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova dimensão" })).toBeInTheDocument();
  });
});
