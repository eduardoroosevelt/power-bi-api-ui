import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { GrupoForm, GruposAdminViewPage } from "./GruposAdminViewPage";

const GruposHarness = () => {
  const { register } = useForm<GrupoForm>();
  return (
    <GruposAdminViewPage
      grupos={[]}
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

describe("GruposAdminViewPage", () => {
  it("renders heading and new grupo action", () => {
    render(<GruposHarness />);

    expect(screen.getByText("Grupos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Novo grupo" })).toBeInTheDocument();
  });
});
