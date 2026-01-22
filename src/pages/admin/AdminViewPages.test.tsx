import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import { MemoryRouter } from "react-router-dom";
import { DimensionsAdminViewPage, DimensionForm } from "./Dimensions/DimensionsAdminViewPage";
import { GrupoPermissoesViewPage, GrupoPermissaoForm } from "./GrupoPermissoes/GrupoPermissoesViewPage";
import { GruposAdminViewPage, GrupoForm } from "./Grupos/GruposAdminViewPage";
import { OrgaosAdminViewPage, OrgaoForm } from "./Orgaos/OrgaosAdminViewPage";
import { PermissoesAdminViewPage, PermissaoForm } from "./Permissoes/PermissoesAdminViewPage";
import { PoliciesAdminViewPage, PolicyForm } from "./Policies/PoliciesAdminViewPage";
import { ReportsAdminViewPage, ReportForm } from "./Reports/ReportsAdminViewPage";
import { RulesAdminViewPage, RuleForm, RuleValueForm } from "./Rules/RulesAdminViewPage";
import { UnidadesAdminViewPage, UnidadeForm } from "./Unidades/UnidadesAdminViewPage";

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
      valueTypes={["STRING", "INT", "UUID"]}
    />
  );
};

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
      subjectTypes={["USER", "GROUP"]}
      policyEffects={["ALLOW_ALL", "ALLOW_LIST"]}
    />
  );
};

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
      operatorOptions={["IN"]}
      valuesModeOptions={["STATIC", "FROM_USER_ATTRIBUTE"]}
    />
  );
};

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

describe("Admin view pages", () => {
  it("renders reports admin page headings", () => {
    render(
      <MemoryRouter>
        <ReportsHarness />
      </MemoryRouter>
    );
    expect(screen.getByText("Administração de Reports")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Novo report" })).toBeInTheDocument();
  });

  it("renders dimensions admin page headings", () => {
    render(<DimensionsHarness />);
    expect(screen.getByText("Dimensões do Report")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova dimensão" })).toBeInTheDocument();
  });

  it("renders policies admin page headings", () => {
    render(<PoliciesHarness />);
    expect(screen.getByText("Políticas do Report")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova política" })).toBeInTheDocument();
  });

  it("renders rules admin page headings", () => {
    render(<RulesHarness />);
    expect(screen.getByText("Regras da Política")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova regra" })).toBeInTheDocument();
  });

  it("renders orgaos admin page headings", () => {
    render(<OrgaosHarness />);
    expect(screen.getByText("Órgãos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Novo órgão" })).toBeInTheDocument();
  });

  it("renders permissoes admin page headings", () => {
    render(<PermissoesHarness />);
    expect(screen.getByText("Permissões")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova permissão" })).toBeInTheDocument();
  });

  it("renders grupos admin page headings", () => {
    render(<GruposHarness />);
    expect(screen.getByText("Grupos")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Novo grupo" })).toBeInTheDocument();
  });

  it("renders grupo permissoes admin page headings", () => {
    render(<GrupoPermissoesHarness />);
    expect(screen.getByText("Permissões do grupo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
  });

  it("renders unidades admin page headings", () => {
    render(<UnidadesHarness />);
    expect(screen.getByText("Unidades")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nova unidade" })).toBeInTheDocument();
  });

});
