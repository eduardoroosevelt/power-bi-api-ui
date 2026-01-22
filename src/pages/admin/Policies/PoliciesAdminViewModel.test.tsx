import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockPoliciesViewPage = vi.fn();
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
    addPolicy: vi.fn()
  }
}));

vi.mock("./PoliciesAdminViewPage", () => ({
  PoliciesAdminViewPage: (props: unknown) => {
    mockPoliciesViewPage(props);
    return null;
  }
}));

import { PoliciesAdminViewModel } from "./PoliciesAdminViewModel";

describe("PoliciesAdminViewModel", () => {
  it("provides default select options", () => {
    mockUseParams.mockReturnValue({ reportId: "1" });

    render(<PoliciesAdminViewModel />);

    const props = mockPoliciesViewPage.mock.calls.at(-1)?.[0];
    expect(props?.subjectTypes).toEqual(["USER", "GROUP"]);
    expect(props?.policyEffects).toEqual(["ALLOW_ALL", "ALLOW_LIST"]);
  });
});
