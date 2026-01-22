import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { OrgaoForm, OrgaosAdminViewPage } from "./OrgaosAdminViewPage";

const OrgaosHarness = () => {
  const { register } = useForm<OrgaoForm>();
  return (
    <OrgaosAdminViewPage
      orgaos={[]}
      loading={false}
      open={false}
      editing={null}
      confirm={null}
      onOpenChange={vi.fn()}
      onEdit={vi.fn()}
      onDeleteRequest={vi.fn()}
      onConfirmDelete={vi.fn()}
      onCancelDelete={vi.fn()}
      register={register}
      errors={{}}
      isSubmitting={false}
      onSubmit={vi.fn()}
    />
  );
};

describe("OrgaosAdminViewPage", () => {
  it("renders heading and new orgao action", () => {
    render(<OrgaosHarness />);

    expect(screen.getByText("Órgãos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Novo órgão" })).toBeInTheDocument();
  });
});
