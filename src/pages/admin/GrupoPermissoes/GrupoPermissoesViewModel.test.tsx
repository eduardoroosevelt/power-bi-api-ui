import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGrupoPermissoesViewPage = vi.fn();
const mockListGrupoPermissoes = vi.fn();
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

vi.mock("@/services/admin/grupo-permissao/admin.grupo-permissao.service", () => ({
  adminGrupoPermissaoService: {
    listGrupoPermissoes: (...args: unknown[]) => mockListGrupoPermissoes(...args),
    addGrupoPermissao: vi.fn(),
    removeGrupoPermissao: vi.fn()
  }
}));

vi.mock("./GrupoPermissoesViewPage", () => ({
  GrupoPermissoesViewPage: (props: unknown) => {
    mockGrupoPermissoesViewPage(props);
    return null;
  }
}));

import { GrupoPermissoesViewModel } from "./GrupoPermissoesViewModel";

describe("GrupoPermissoesViewModel", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ grupoId: "10" });
    mockGrupoPermissoesViewPage.mockClear();
    mockListGrupoPermissoes.mockReset();
  });

  it("loads grupo permissoes on mount", async () => {
    mockListGrupoPermissoes.mockResolvedValue([]);

    render(<GrupoPermissoesViewModel />);

    await waitFor(() => {
      expect(mockListGrupoPermissoes).toHaveBeenCalledWith(10);
    });

    const props = mockGrupoPermissoesViewPage.mock.calls.at(-1)?.[0];
    expect(props).toMatchObject({ loading: false, permissoes: [] });
  });
});
