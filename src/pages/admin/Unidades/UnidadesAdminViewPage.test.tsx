import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { UnidadeForm, UnidadesAdminViewPage } from "./UnidadesAdminViewPage";

const UnidadesHarness = () => {
  const { register } = useForm<UnidadeForm>();
  return (
    <UnidadesAdminViewPage
      unidades={[]}
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

describe("UnidadesAdminViewPage", () => {
  it("renders heading and new unidade action", () => {
    render(<UnidadesHarness />);

    expect(screen.getByText("Unidades")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova unidade" })).toBeInTheDocument();
  });
});
