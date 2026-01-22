import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockReportsViewPage = vi.fn();
const mockListReports = vi.fn();

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock("@/services/admin/report/admin.report.service", () => ({
  adminReportService: {
    listReports: (...args: unknown[]) => mockListReports(...args),
    createReport: vi.fn()
  }
}));

vi.mock("./ReportsAdminViewPage", () => ({
  ReportsAdminViewPage: (props: unknown) => {
    mockReportsViewPage(props);
    return null;
  }
}));

import { ReportsAdminViewModel } from "./ReportsAdminViewModel";

describe("ReportsAdminViewModel", () => {
  beforeEach(() => {
    mockReportsViewPage.mockClear();
    mockListReports.mockReset();
  });

  it("loads reports on mount", async () => {
    mockListReports.mockResolvedValue([]);

    render(<ReportsAdminViewModel />);

    await waitFor(() => {
      expect(mockListReports).toHaveBeenCalled();
    });

    const props = mockReportsViewPage.mock.calls.at(-1)?.[0];
    expect(props).toMatchObject({ loading: false, reports: [] });
  });
});
