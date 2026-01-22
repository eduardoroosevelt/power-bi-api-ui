import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockOrgaosViewPage = vi.fn();
const mockListOrgaos = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("@/services/admin/orgao/admin.orgao.service", () => ({
  adminOrgaoService: {
    listOrgaos: (...args: unknown[]) => mockListOrgaos(...args),
    createOrgao: vi.fn(),
    updateOrgao: vi.fn(),
    deleteOrgao: vi.fn()
  }
}));

vi.mock("./OrgaosAdminViewPage", () => ({
  OrgaosAdminViewPage: (props: unknown) => {
    mockOrgaosViewPage(props);
    return null;
  }
}));

import { OrgaosAdminViewModel } from "./OrgaosAdminViewModel";

describe("OrgaosAdminViewModel", () => {
  beforeEach(() => {
    mockOrgaosViewPage.mockClear();
    mockListOrgaos.mockReset();
  });

  it("loads orgaos on mount", async () => {
    mockListOrgaos.mockResolvedValue([]);

    render(<OrgaosAdminViewModel />);

    await waitFor(() => {
      expect(mockListOrgaos).toHaveBeenCalled();
    });

    const props = mockOrgaosViewPage.mock.calls.at(-1)?.[0];
    expect(props).toMatchObject({ loading: false, orgaos: [] });
  });
});
