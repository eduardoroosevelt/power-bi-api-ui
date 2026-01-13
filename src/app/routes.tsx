import { RouteObject } from "react-router-dom";
import { LoginPage } from "@/features/auth/LoginPage";
import { AppLayout } from "@/app/layout/AppLayout";
import { ProtectedRoute } from "@/app/layout/ProtectedRoute";
import { ReportViewPage } from "@/features/reports/ReportViewPage";
import { ReportsAdminPage } from "@/features/admin/pages/ReportsAdminPage";
import { DimensionsAdminPage } from "@/features/admin/pages/DimensionsAdminPage";
import { PoliciesAdminPage } from "@/features/admin/pages/PoliciesAdminPage";
import { RulesAdminPage } from "@/features/admin/pages/RulesAdminPage";
import { HomePage } from "@/features/reports/HomePage";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "reports/:reportInternalId",
        element: <ReportViewPage />
      },
      {
        path: "admin/reports",
        element: <ReportsAdminPage />
      },
      {
        path: "admin/reports/:reportId/dimensions",
        element: <DimensionsAdminPage />
      },
      {
        path: "admin/reports/:reportId/policies",
        element: <PoliciesAdminPage />
      },
      {
        path: "admin/policies/:policyId/rules",
        element: <RulesAdminPage />
      }
    ]
  }
];
