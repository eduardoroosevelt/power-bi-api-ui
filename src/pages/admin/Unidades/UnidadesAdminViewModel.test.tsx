import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUnidadesViewPage = vi.fn();
const mockListUnidades = vi.fn();
const mockListOrgaos = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("@/services/admin/unidade/admin.unidade.service", () => ({
  adminUnidadeService: {
    listUnidades: (...args: unknown[]) => mockListUnidades(...args),
    createUnidade: vi.fn(),
    updateUnidade: vi.fn(),
    deleteUnidade: vi.fn()
  }
}));

vi.mock("@/services/admin/orgao/admin.orgao.service", () => ({
  adminOrgaoService: {
    listOrgaos: (...args: unknown[]) => mockListOrgaos(...args)
  }
}));

vi.mock("./UnidadesAdminViewPage", () => ({
  UnidadesAdminViewPage: (props: unknown) => {
    mockUnidadesViewPage(props);
    return null;
  }
}));

import { UnidadesAdminViewModel } from "./UnidadesAdminViewModel";

describe("UnidadesAdminViewModel", () => {
  beforeEach(() => {
    mockUnidadesViewPage.mockClear();
    mockListUnidades.mockReset();
    mockListOrgaos.mockReset();
  });

  it("loads unidades and orgaos on mount", async () => {
    mockListUnidades.mockResolvedValue([]);
    mockListOrgaos.mockResolvedValue([]);

    render(<UnidadesAdminViewModel />);

    await waitFor(() => {
      expect(mockListUnidades).toHaveBeenCalled();
      expect(mockListOrgaos).toHaveBeenCalled();
    });

    const props = mockUnidadesViewPage.mock.calls.at(-1)?.[0];
    expect(props).toMatchObject({ loading: false, unidades: [], orgaos: [] });
  });
});
