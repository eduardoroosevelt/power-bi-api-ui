import { RouteObject } from "react-router-dom";
import { LoginPage } from "@/features/auth/LoginPage";
import { AppLayout } from "@/app/layout/AppLayout";
import { ProtectedRoute } from "@/app/layout/ProtectedRoute";
import { ReportViewPage } from "@/features/reports/ReportViewPage";
import { ReportsAdminPage } from "@/features/admin/pages/ReportsAdminPage";
import { DimensionsAdminPage } from "@/features/admin/pages/DimensionsAdminPage";
import { PoliciesAdminPage } from "@/features/admin/pages/PoliciesAdminPage";
import { RulesAdminPage } from "@/features/admin/pages/RulesAdminPage";
import { OrgaosAdminPage } from "@/features/admin/pages/OrgaosAdminPage";
import { UnidadesAdminPage } from "@/features/admin/pages/UnidadesAdminPage";
import { PermissoesAdminPage } from "@/features/admin/pages/PermissoesAdminPage";
import { GruposAdminPage } from "@/features/admin/pages/GruposAdminPage";
import { GrupoPermissoesPage } from "@/features/admin/pages/GrupoPermissoesPage";
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
      },
      {
        path: "admin/orgaos",
        element: <OrgaosAdminPage />
      },
      {
        path: "admin/unidades",
        element: <UnidadesAdminPage />
      },
      {
        path: "admin/permissoes",
        element: <PermissoesAdminPage />
      },
      {
        path: "admin/grupos",
        element: <GruposAdminPage />
      },
      {
        path: "admin/grupos/:grupoId/permissoes",
        element: <GrupoPermissoesPage />
      }
    ]
  }
];
