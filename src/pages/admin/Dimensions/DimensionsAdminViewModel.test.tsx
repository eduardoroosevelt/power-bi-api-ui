import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDimensionsViewPage = vi.fn();
const mockGetReport = vi.fn();
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

vi.mock("@/services/reports/reports.service", () => ({
  reportsService: {
    getReport: (...args: unknown[]) => mockGetReport(...args)
  }
}));

vi.mock("@/services/admin/report/admin.report.service", () => ({
  adminReportService: {
    addDimension: vi.fn()
  }
}));

vi.mock("./DimensionsAdminViewPage", () => ({
  DimensionsAdminViewPage: (props: unknown) => {
    mockDimensionsViewPage(props);
    return null;
  }
}));

import { DimensionsAdminViewModel } from "./DimensionsAdminViewModel";

describe("DimensionsAdminViewModel", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ reportId: "1" });
    mockDimensionsViewPage.mockClear();
    mockGetReport.mockReset();
  });

  it("loads report dimensions on mount", async () => {
    mockGetReport.mockResolvedValue({ dimensions: [] });

    render(<DimensionsAdminViewModel />);

    await waitFor(() => {
      expect(mockGetReport).toHaveBeenCalledWith(1);
    });

    const props = mockDimensionsViewPage.mock.calls.at(-1)?.[0];
    expect(props).toMatchObject({ loading: false, dimensions: [] });
    expect(props?.valueTypes).toEqual(["STRING", "INT", "UUID"]);
  });
});
