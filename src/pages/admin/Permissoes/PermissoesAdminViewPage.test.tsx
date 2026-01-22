import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { PermissaoForm, PermissoesAdminViewPage } from "./PermissoesAdminViewPage";

const PermissoesHarness = () => {
  const { register } = useForm<PermissaoForm>();
  return (
    <PermissoesAdminViewPage
      permissoes={[]}
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

describe("PermissoesAdminViewPage", () => {
  it("renders heading and new permissao action", () => {
    render(<PermissoesHarness />);

    expect(screen.getByText("Permissões")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova permissão" })).toBeInTheDocument();
  });
});
