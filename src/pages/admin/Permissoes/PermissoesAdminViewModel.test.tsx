import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPermissoesViewPage = vi.fn();
const mockListPermissoes = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("@/services/admin/permissao/admin.permissao.service", () => ({
  adminPermissaoService: {
    listPermissoes: (...args: unknown[]) => mockListPermissoes(...args),
    createPermissao: vi.fn(),
    updatePermissao: vi.fn(),
    deletePermissao: vi.fn()
  }
}));

vi.mock("./PermissoesAdminViewPage", () => ({
  PermissoesAdminViewPage: (props: unknown) => {
    mockPermissoesViewPage(props);
    return null;
  }
}));

import { PermissoesAdminViewModel } from "./PermissoesAdminViewModel";

describe("PermissoesAdminViewModel", () => {
  beforeEach(() => {
    mockPermissoesViewPage.mockClear();
    mockListPermissoes.mockReset();
  });

  it("loads permissoes on mount", async () => {
    mockListPermissoes.mockResolvedValue([]);

    render(<PermissoesAdminViewModel />);

    await waitFor(() => {
      expect(mockListPermissoes).toHaveBeenCalled();
    });

    const props = mockPermissoesViewPage.mock.calls.at(-1)?.[0];
    expect(props).toMatchObject({ loading: false, permissoes: [] });
  });
});
