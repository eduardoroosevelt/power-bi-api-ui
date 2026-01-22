import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGruposViewPage = vi.fn();
const mockListGrupos = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("@/services/admin/grupo/admin.grupo.service", () => ({
  adminGrupoService: {
    listGrupos: (...args: unknown[]) => mockListGrupos(...args),
    createGrupo: vi.fn(),
    updateGrupo: vi.fn(),
    deleteGrupo: vi.fn()
  }
}));

vi.mock("./GruposAdminViewPage", () => ({
  GruposAdminViewPage: (props: unknown) => {
    mockGruposViewPage(props);
    return null;
  }
}));

import { GruposAdminViewModel } from "./GruposAdminViewModel";

describe("GruposAdminViewModel", () => {
  beforeEach(() => {
    mockGruposViewPage.mockClear();
    mockListGrupos.mockReset();
  });

  it("loads grupos on mount", async () => {
    mockListGrupos.mockResolvedValue([]);

    render(<GruposAdminViewModel />);

    await waitFor(() => {
      expect(mockListGrupos).toHaveBeenCalled();
    });

    const props = mockGruposViewPage.mock.calls.at(-1)?.[0];
    expect(props).toMatchObject({ loading: false, grupos: [] });
  });
});
