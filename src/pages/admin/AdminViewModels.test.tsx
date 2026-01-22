import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockReportsViewPage = vi.fn();
const mockDimensionsViewPage = vi.fn();
const mockPoliciesViewPage = vi.fn();
const mockRulesViewPage = vi.fn();
const mockOrgaosViewPage = vi.fn();
const mockPermissoesViewPage = vi.fn();
const mockUnidadesViewPage = vi.fn();
const mockGruposViewPage = vi.fn();
const mockGrupoPermissoesViewPage = vi.fn();

const mockListReports = vi.fn();
const mockCreateReport = vi.fn();
const mockAddDimension = vi.fn();
const mockAddPolicy = vi.fn();
const mockGetReport = vi.fn();
const mockAddRule = vi.fn();
const mockAddRuleValue = vi.fn();
const mockListOrgaos = vi.fn();
const mockCreateOrgao = vi.fn();
const mockUpdateOrgao = vi.fn();
const mockDeleteOrgao = vi.fn();
const mockListPermissoes = vi.fn();
const mockCreatePermissao = vi.fn();
const mockUpdatePermissao = vi.fn();
const mockDeletePermissao = vi.fn();
const mockListUnidades = vi.fn();
const mockCreateUnidade = vi.fn();
const mockUpdateUnidade = vi.fn();
const mockDeleteUnidade = vi.fn();
const mockListGrupos = vi.fn();
const mockCreateGrupo = vi.fn();
const mockUpdateGrupo = vi.fn();
const mockDeleteGrupo = vi.fn();
const mockListGrupoPermissoes = vi.fn();
const mockAddGrupoPermissao = vi.fn();
const mockRemoveGrupoPermissao = vi.fn();

const mockUseParams = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useParams: () => mockUseParams()
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("@/services/admin/report/admin.report.service", () => ({
  adminReportService: {
    listReports: (...args: unknown[]) => mockListReports(...args),
    createReport: (...args: unknown[]) => mockCreateReport(...args),
    addDimension: (...args: unknown[]) => mockAddDimension(...args),
    addPolicy: (...args: unknown[]) => mockAddPolicy(...args)
  }
}));

vi.mock("@/services/reports/reports.service", () => ({
  reportsService: {
    getReport: (...args: unknown[]) => mockGetReport(...args)
  }
}));

vi.mock("@/services/admin/policy/admin.policy.service", () => ({
  adminPolicyService: {
    addRule: (...args: unknown[]) => mockAddRule(...args)
  }
}));

vi.mock("@/services/admin/rule/admin.rule.service", () => ({
  adminRuleService: {
    addRuleValue: (...args: unknown[]) => mockAddRuleValue(...args)
  }
}));

vi.mock("@/services/admin/orgao/admin.orgao.service", () => ({
  adminOrgaoService: {
    listOrgaos: (...args: unknown[]) => mockListOrgaos(...args),
    createOrgao: (...args: unknown[]) => mockCreateOrgao(...args),
    updateOrgao: (...args: unknown[]) => mockUpdateOrgao(...args),
    deleteOrgao: (...args: unknown[]) => mockDeleteOrgao(...args)
  }
}));

vi.mock("@/services/admin/permissao/admin.permissao.service", () => ({
  adminPermissaoService: {
    listPermissoes: (...args: unknown[]) => mockListPermissoes(...args),
    createPermissao: (...args: unknown[]) => mockCreatePermissao(...args),
    updatePermissao: (...args: unknown[]) => mockUpdatePermissao(...args),
    deletePermissao: (...args: unknown[]) => mockDeletePermissao(...args)
  }
}));

vi.mock("@/services/admin/unidade/admin.unidade.service", () => ({
  adminUnidadeService: {
    listUnidades: (...args: unknown[]) => mockListUnidades(...args),
    createUnidade: (...args: unknown[]) => mockCreateUnidade(...args),
    updateUnidade: (...args: unknown[]) => mockUpdateUnidade(...args),
    deleteUnidade: (...args: unknown[]) => mockDeleteUnidade(...args)
  }
}));

vi.mock("@/services/admin/grupo/admin.grupo.service", () => ({
  adminGrupoService: {
    listGrupos: (...args: unknown[]) => mockListGrupos(...args),
    createGrupo: (...args: unknown[]) => mockCreateGrupo(...args),
    updateGrupo: (...args: unknown[]) => mockUpdateGrupo(...args),
    deleteGrupo: (...args: unknown[]) => mockDeleteGrupo(...args)
  }
}));

vi.mock("@/services/admin/grupo-permissao/admin.grupo-permissao.service", () => ({
  adminGrupoPermissaoService: {
    listGrupoPermissoes: (...args: unknown[]) => mockListGrupoPermissoes(...args),
    addGrupoPermissao: (...args: unknown[]) => mockAddGrupoPermissao(...args),
    removeGrupoPermissao: (...args: unknown[]) => mockRemoveGrupoPermissao(...args)
  }
}));

vi.mock("./Reports/ReportsAdminViewPage", () => ({
  ReportsAdminViewPage: (props: unknown) => {
    mockReportsViewPage(props);
    return null;
  }
}));

vi.mock("./Dimensions/DimensionsAdminViewPage", () => ({
  DimensionsAdminViewPage: (props: unknown) => {
    mockDimensionsViewPage(props);
    return null;
  }
}));

vi.mock("./Policies/PoliciesAdminViewPage", () => ({
  PoliciesAdminViewPage: (props: unknown) => {
    mockPoliciesViewPage(props);
    return null;
  }
}));

vi.mock("./Rules/RulesAdminViewPage", () => ({
  RulesAdminViewPage: (props: unknown) => {
    mockRulesViewPage(props);
    return null;
  }
}));

vi.mock("./Orgaos/OrgaosAdminViewPage", () => ({
  OrgaosAdminViewPage: (props: unknown) => {
    mockOrgaosViewPage(props);
    return null;
  }
}));

vi.mock("./Permissoes/PermissoesAdminViewPage", () => ({
  PermissoesAdminViewPage: (props: unknown) => {
    mockPermissoesViewPage(props);
    return null;
  }
}));

vi.mock("./Unidades/UnidadesAdminViewPage", () => ({
  UnidadesAdminViewPage: (props: unknown) => {
    mockUnidadesViewPage(props);
    return null;
  }
}));

vi.mock("./Grupos/GruposAdminViewPage", () => ({
  GruposAdminViewPage: (props: unknown) => {
    mockGruposViewPage(props);
    return null;
  }
}));

vi.mock("./GrupoPermissoes/GrupoPermissoesViewPage", () => ({
  GrupoPermissoesViewPage: (props: unknown) => {
    mockGrupoPermissoesViewPage(props);
    return null;
  }
}));

import { ReportsAdminViewModel } from "./Reports/ReportsAdminViewModel";
import { DimensionsAdminViewModel } from "./Dimensions/DimensionsAdminViewModel";
import { PoliciesAdminViewModel } from "./Policies/PoliciesAdminViewModel";
import { RulesAdminViewModel } from "./Rules/RulesAdminViewModel";
import { OrgaosAdminViewModel } from "./Orgaos/OrgaosAdminViewModel";
import { PermissoesAdminViewModel } from "./Permissoes/PermissoesAdminViewModel";
import { UnidadesAdminViewModel } from "./Unidades/UnidadesAdminViewModel";
import { GruposAdminViewModel } from "./Grupos/GruposAdminViewModel";
import { GrupoPermissoesViewModel } from "./GrupoPermissoes/GrupoPermissoesViewModel";

const getLastProps = (mockFn: ReturnType<typeof vi.fn>) => {
  const calls = mockFn.mock.calls;
  return calls[calls.length - 1]?.[0];
};

describe("Admin view models", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({});
    mockReportsViewPage.mockClear();
    mockDimensionsViewPage.mockClear();
    mockPoliciesViewPage.mockClear();
    mockRulesViewPage.mockClear();
    mockOrgaosViewPage.mockClear();
    mockPermissoesViewPage.mockClear();
    mockUnidadesViewPage.mockClear();
    mockGruposViewPage.mockClear();
    mockGrupoPermissoesViewPage.mockClear();
    mockListReports.mockReset();
    mockGetReport.mockReset();
    mockListOrgaos.mockReset();
    mockListPermissoes.mockReset();
    mockListUnidades.mockReset();
    mockListGrupos.mockReset();
    mockListGrupoPermissoes.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads reports on mount", async () => {
    mockListReports.mockResolvedValue([]);

    render(<ReportsAdminViewModel />);

    await waitFor(() => {
      expect(mockListReports).toHaveBeenCalled();
    });

    const props = getLastProps(mockReportsViewPage);
    expect(props).toMatchObject({ loading: false, reports: [] });
  });

  it("loads report dimensions for the reportId", async () => {
    mockUseParams.mockReturnValue({ reportId: "1" });
    mockGetReport.mockResolvedValue({ dimensions: [] });

    render(<DimensionsAdminViewModel />);

    await waitFor(() => {
      expect(mockGetReport).toHaveBeenCalledWith(1);
    });

    const props = getLastProps(mockDimensionsViewPage);
    expect(props).toMatchObject({ loading: false, dimensions: [] });
    expect(props?.valueTypes).toEqual(["STRING", "INT", "UUID"]);
  });

  it("renders policies view model defaults", () => {
    render(<PoliciesAdminViewModel />);

    const props = getLastProps(mockPoliciesViewPage);
    expect(props?.subjectTypes).toEqual(["USER", "GROUP"]);
    expect(props?.policyEffects).toEqual(["ALLOW_ALL", "ALLOW_LIST"]);
  });

  it("renders rules view model defaults", () => {
    render(<RulesAdminViewModel />);

    const props = getLastProps(mockRulesViewPage);
    expect(props?.operatorOptions).toEqual(["IN"]);
    expect(props?.valuesModeOptions).toEqual(["STATIC", "FROM_USER_ATTRIBUTE"]);
  });

  it("loads orgaos on mount", async () => {
    mockListOrgaos.mockResolvedValue([]);

    render(<OrgaosAdminViewModel />);

    await waitFor(() => {
      expect(mockListOrgaos).toHaveBeenCalled();
    });

    const props = getLastProps(mockOrgaosViewPage);
    expect(props).toMatchObject({ loading: false, orgaos: [] });
  });

  it("loads permissoes on mount", async () => {
    mockListPermissoes.mockResolvedValue([]);

    render(<PermissoesAdminViewModel />);

    await waitFor(() => {
      expect(mockListPermissoes).toHaveBeenCalled();
    });

    const props = getLastProps(mockPermissoesViewPage);
    expect(props).toMatchObject({ loading: false, permissoes: [] });
  });

  it("loads unidades and orgaos on mount", async () => {
    mockListUnidades.mockResolvedValue([]);
    mockListOrgaos.mockResolvedValue([]);

    render(<UnidadesAdminViewModel />);

    await waitFor(() => {
      expect(mockListUnidades).toHaveBeenCalled();
      expect(mockListOrgaos).toHaveBeenCalled();
    });

    const props = getLastProps(mockUnidadesViewPage);
    expect(props).toMatchObject({ loading: false, unidades: [], orgaos: [] });
  });

  it("loads grupos on mount", async () => {
    mockListGrupos.mockResolvedValue([]);

    render(<GruposAdminViewModel />);

    await waitFor(() => {
      expect(mockListGrupos).toHaveBeenCalled();
    });

    const props = getLastProps(mockGruposViewPage);
    expect(props).toMatchObject({ loading: false, grupos: [] });
  });

  it("loads grupo permissoes on mount", async () => {
    mockUseParams.mockReturnValue({ grupoId: "10" });
    mockListGrupoPermissoes.mockResolvedValue([]);

    render(<GrupoPermissoesViewModel />);

    await waitFor(() => {
      expect(mockListGrupoPermissoes).toHaveBeenCalledWith(10);
    });

    const props = getLastProps(mockGrupoPermissoesViewPage);
    expect(props).toMatchObject({ loading: false, permissoes: [] });
  });
});
