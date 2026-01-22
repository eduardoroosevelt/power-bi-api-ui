import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { MemoryRouter } from "react-router-dom";
import { ReportForm, ReportsAdminViewPage } from "./ReportsAdminViewPage";

const ReportsHarness = () => {
  const { register } = useForm<ReportForm>();
  return (
    <ReportsAdminViewPage
      reports={[]}
      loading={false}
      open={false}
      onOpenChange={vi.fn()}
      register={register}
      errors={{}}
      isSubmitting={false}
      onSubmit={vi.fn()}
    />
  );
};

describe("ReportsAdminViewPage", () => {
  it("renders heading and new report action", () => {
    render(
      <MemoryRouter>
        <ReportsHarness />
      </MemoryRouter>
    );

    expect(screen.getByText("Administração de Reports")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Novo report" })).toBeInTheDocument();
  });
});
