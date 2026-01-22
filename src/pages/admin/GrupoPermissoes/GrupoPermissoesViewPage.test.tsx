import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { GrupoPermissaoForm, GrupoPermissoesViewPage } from "./GrupoPermissoesViewPage";

const GrupoPermissoesHarness = () => {
  const { register } = useForm<GrupoPermissaoForm>();
  return (
    <GrupoPermissoesViewPage
      permissoes={[]}
      loading={false}
      confirm={null}
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

describe("GrupoPermissoesViewPage", () => {
  it("renders heading and add action", () => {
    render(<GrupoPermissoesHarness />);

    expect(screen.getByText("Permissões do grupo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
  });
});
