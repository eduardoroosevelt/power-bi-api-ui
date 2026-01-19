import { lazy, ReactElement, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import { MenuItemDto } from "@/shared/types/swagger";
import { Loading } from "@/shared/components/Loading";

const LoginPage = lazy(() =>
  import("@/features/auth/LoginPage").then((module) => ({ default: module.LoginPage }))
);
const AppLayout = lazy(() =>
  import("@/app/layout/AppLayout").then((module) => ({ default: module.AppLayout }))
);
const ProtectedRoute = lazy(() =>
  import("@/app/layout/ProtectedRoute").then((module) => ({ default: module.ProtectedRoute }))
);
const ReportViewPage = lazy(() =>
  import("@/features/reports/ReportViewPage").then((module) => ({ default: module.ReportViewPage }))
);
const ReportsAdminPage = lazy(() =>
  import("@/features/admin/pages/ReportsAdminPage").then((module) => ({ default: module.ReportsAdminPage }))
);
const DimensionsAdminPage = lazy(() =>
  import("@/features/admin/pages/DimensionsAdminPage").then((module) => ({ default: module.DimensionsAdminPage }))
);
const PoliciesAdminPage = lazy(() =>
  import("@/features/admin/pages/PoliciesAdminPage").then((module) => ({ default: module.PoliciesAdminPage }))
);
const RulesAdminPage = lazy(() =>
  import("@/features/admin/pages/RulesAdminPage").then((module) => ({ default: module.RulesAdminPage }))
);
const OrgaosAdminPage = lazy(() =>
  import("@/features/admin/pages/OrgaosAdminPage").then((module) => ({ default: module.OrgaosAdminPage }))
);
const UnidadesAdminPage = lazy(() =>
  import("@/features/admin/pages/UnidadesAdminPage").then((module) => ({ default: module.UnidadesAdminPage }))
);
const PermissoesAdminPage = lazy(() =>
  import("@/features/admin/pages/PermissoesAdminPage").then((module) => ({ default: module.PermissoesAdminPage }))
);
const GruposAdminPage = lazy(() =>
  import("@/features/admin/pages/GruposAdminPage").then((module) => ({ default: module.GruposAdminPage }))
);
const GrupoPermissoesPage = lazy(() =>
  import("@/features/admin/pages/GrupoPermissoesPage").then((module) => ({ default: module.GrupoPermissoesPage }))
);
const HomePage = lazy(() =>
  import("@/features/reports/HomePage").then((module) => ({ default: module.HomePage }))
);

const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<Loading label="Carregando página" />}>{element}</Suspense>
);

const normalizeRoute = (route: string) => (route.startsWith("/") ? route : `/${route}`);

const extractAllowedRoutes = (items: MenuItemDto[]) => {
  const allowedRoutes = new Set<string>();
  let hasReportAccess = false;

  const walk = (menuItems: MenuItemDto[]) => {
    menuItems.forEach((item) => {
      if (item.resourceType === "EXTERNAL_LINK") {
        return;
      }
      if (item.route) {
        const normalizedRoute = normalizeRoute(item.route);
        allowedRoutes.add(normalizedRoute);
        if (normalizedRoute.startsWith("/reports/")) {
          hasReportAccess = true;
        }
      }
      if (item.resourceType === "POWERBI_REPORT") {
        hasReportAccess = true;
      }
      if (item.children?.length) {
        walk(item.children);
      }
    });
  };

  walk(items);

  return { allowedRoutes, hasReportAccess };
};

export const createRoutes = (menuTree: MenuItemDto[]): RouteObject[] => {
  const { allowedRoutes, hasReportAccess } = extractAllowedRoutes(menuTree);
  const hasAdminReportsAccess = allowedRoutes.has("/admin/reports");
  const hasGruposAccess = allowedRoutes.has("/admin/grupos");

  const children: RouteObject[] = [
    {
      index: true,
      element: withSuspense(<HomePage />)
    }
  ];

  if (hasReportAccess) {
    children.push({
      path: "reports/:reportInternalId",
      element: withSuspense(<ReportViewPage />)
    });
  }

  if (hasAdminReportsAccess) {
    children.push(
      {
        path: "admin/reports",
        element: withSuspense(<ReportsAdminPage />)
      },
      {
        path: "admin/reports/:reportId/dimensions",
        element: withSuspense(<DimensionsAdminPage />)
      },
      {
        path: "admin/reports/:reportId/policies",
        element: withSuspense(<PoliciesAdminPage />)
      },
      {
        path: "admin/policies/:policyId/rules",
        element: withSuspense(<RulesAdminPage />)
      }
    );
  }

  if (allowedRoutes.has("/admin/orgaos")) {
    children.push({
      path: "admin/orgaos",
      element: withSuspense(<OrgaosAdminPage />)
    });
  }

  if (allowedRoutes.has("/admin/unidades")) {
    children.push({
      path: "admin/unidades",
      element: withSuspense(<UnidadesAdminPage />)
    });
  }

  if (allowedRoutes.has("/admin/permissoes")) {
    children.push({
      path: "admin/permissoes",
      element: withSuspense(<PermissoesAdminPage />)
    });
  }

  if (hasGruposAccess) {
    children.push(
      {
        path: "admin/grupos",
        element: withSuspense(<GruposAdminPage />)
      },
      {
        path: "admin/grupos/:grupoId/permissoes",
        element: withSuspense(<GrupoPermissoesPage />)
      }
    );
  }

  return [
    {
      path: "/login",
      element: withSuspense(<LoginPage />)
    },
    {
      path: "/",
      element: withSuspense(
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children
    }
  ];
};
