import { RouteObject } from "react-router-dom";
import { LoginViewModel } from "@/pages/auth/Login/LoginViewModel";
import { AppLayout } from "@/app/layout/AppLayout";
import { ProtectedRoute } from "@/app/layout/ProtectedRoute";
import { ReportViewViewModel } from "@/pages/reports/ReportView/ReportViewViewModel";
import { ReportsAdminViewModel } from "@/pages/admin/Reports/ReportsAdminViewModel";
import { DimensionsAdminViewModel } from "@/pages/admin/Dimensions/DimensionsAdminViewModel";
import { PoliciesAdminViewModel } from "@/pages/admin/Policies/PoliciesAdminViewModel";
import { RulesAdminViewModel } from "@/pages/admin/Rules/RulesAdminViewModel";
import { OrgaosAdminViewModel } from "@/pages/admin/Orgaos/OrgaosAdminViewModel";
import { UnidadesAdminViewModel } from "@/pages/admin/Unidades/UnidadesAdminViewModel";
import { PermissoesAdminViewModel } from "@/pages/admin/Permissoes/PermissoesAdminViewModel";
import { GruposAdminViewModel } from "@/pages/admin/Grupos/GruposAdminViewModel";
import { GrupoPermissoesViewModel } from "@/pages/admin/GrupoPermissoes/GrupoPermissoesViewModel";
import { HomeViewModel } from "@/pages/reports/Home/HomeViewModel";

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginViewModel />
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
        element: <HomeViewModel />
      },
      {
        path: "reports/:reportInternalId",
        element: <ReportViewViewModel />
      },
      {
        path: "admin/reports",
        element: <ReportsAdminViewModel />
      },
      {
        path: "admin/reports/:reportId/dimensions",
        element: <DimensionsAdminViewModel />
      },
      {
        path: "admin/reports/:reportId/policies",
        element: <PoliciesAdminViewModel />
      },
      {
        path: "admin/policies/:policyId/rules",
        element: <RulesAdminViewModel />
      },
      {
        path: "admin/orgaos",
        element: <OrgaosAdminViewModel />
      },
      {
        path: "admin/unidades",
        element: <UnidadesAdminViewModel />
      },
      {
        path: "admin/permissoes",
        element: <PermissoesAdminViewModel />
      },
      {
        path: "admin/grupos",
        element: <GruposAdminViewModel />
      },
      {
        path: "admin/grupos/:grupoId/permissoes",
        element: <GrupoPermissoesViewModel />
      }
    ]
  }
];
