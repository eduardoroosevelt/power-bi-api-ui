import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockRulesViewPage = vi.fn();
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

vi.mock("@/services/admin/policy/admin.policy.service", () => ({
  adminPolicyService: {
    addRule: vi.fn()
  }
}));

vi.mock("@/services/admin/rule/admin.rule.service", () => ({
  adminRuleService: {
    addRuleValue: vi.fn()
  }
}));

vi.mock("./RulesAdminViewPage", () => ({
  RulesAdminViewPage: (props: unknown) => {
    mockRulesViewPage(props);
    return null;
  }
}));

import { RulesAdminViewModel } from "./RulesAdminViewModel";

describe("RulesAdminViewModel", () => {
  it("provides default select options", () => {
    mockUseParams.mockReturnValue({ policyId: "1" });

    render(<RulesAdminViewModel />);

    const props = mockRulesViewPage.mock.calls.at(-1)?.[0];
    expect(props?.operatorOptions).toEqual(["IN"]);
    expect(props?.valuesModeOptions).toEqual(["STATIC", "FROM_USER_ATTRIBUTE"]);
  });
});
