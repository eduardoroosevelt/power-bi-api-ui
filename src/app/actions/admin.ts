"use server";

import { apiRequest } from "@/app/actions/api";
import {
  CreateDimensionRequest,
  CreateGrupoRequest,
  CreateOrgaoRequest,
  CreatePermissaoRequest,
  CreatePolicyRequest,
  CreateReportRequest,
  CreateRuleRequest,
  CreateRuleValueRequest,
  CreateUnidadeRequest,
  Grupo,
  GrupoPermissaoRequest,
  Orgao,
  Permissao,
  PowerBiReport,
  ReportAccessPolicy,
  ReportAccessPolicyRule,
  ReportAccessPolicyRuleValue,
  ReportDimension,
  Unidade,
  UpdateGrupoRequest,
  UpdateOrgaoRequest,
  UpdatePermissaoRequest,
  UpdateUnidadeRequest
} from "@/shared/types/swagger";

export const listReportsAction = async () => apiRequest<PowerBiReport[]>("/api/admin/reports");

export const createReportAction = async (payload: CreateReportRequest) =>
  apiRequest<PowerBiReport, CreateReportRequest>("/api/admin/reports", {
    method: "POST",
    body: payload
  });

export const addDimensionAction = async (reportId: number, payload: CreateDimensionRequest) =>
  apiRequest<ReportDimension, CreateDimensionRequest>(`/api/admin/reports/${reportId}/dimensions`, {
    method: "POST",
    body: payload
  });

export const createPolicyAction = async (reportId: number, payload: CreatePolicyRequest) =>
  apiRequest<ReportAccessPolicy, CreatePolicyRequest>(
    `/api/admin/reports/${reportId}/policies`,
    { method: "POST", body: payload }
  );

export const addRuleAction = async (policyId: number, payload: CreateRuleRequest) =>
  apiRequest<ReportAccessPolicyRule, CreateRuleRequest>(`/api/admin/policies/${policyId}/rules`, {
    method: "POST",
    body: payload
  });

export const addRuleValueAction = async (ruleId: number, payload: CreateRuleValueRequest) =>
  apiRequest<ReportAccessPolicyRuleValue, CreateRuleValueRequest>(
    `/api/admin/rules/${ruleId}/values`,
    { method: "POST", body: payload }
  );

export const listOrgaosAction = async () => apiRequest<Orgao[]>("/api/admin/orgaos");

export const createOrgaoAction = async (payload: CreateOrgaoRequest) =>
  apiRequest<Orgao, CreateOrgaoRequest>("/api/admin/orgaos", { method: "POST", body: payload });

export const updateOrgaoAction = async (id: number, payload: UpdateOrgaoRequest) =>
  apiRequest<Orgao, UpdateOrgaoRequest>(`/api/admin/orgaos/${id}`, { method: "PUT", body: payload });

export const deleteOrgaoAction = async (id: number) =>
  apiRequest<void>(`/api/admin/orgaos/${id}`, { method: "DELETE" });

export const listUnidadesAction = async () => apiRequest<Unidade[]>("/api/admin/unidades");

export const createUnidadeAction = async (payload: CreateUnidadeRequest) =>
  apiRequest<Unidade, CreateUnidadeRequest>("/api/admin/unidades", { method: "POST", body: payload });

export const updateUnidadeAction = async (id: number, payload: UpdateUnidadeRequest) =>
  apiRequest<Unidade, UpdateUnidadeRequest>(`/api/admin/unidades/${id}`, { method: "PUT", body: payload });

export const deleteUnidadeAction = async (id: number) =>
  apiRequest<void>(`/api/admin/unidades/${id}`, { method: "DELETE" });

export const listPermissoesAction = async () => apiRequest<Permissao[]>("/api/admin/permissoes");

export const createPermissaoAction = async (payload: CreatePermissaoRequest) =>
  apiRequest<Permissao, CreatePermissaoRequest>("/api/admin/permissoes", {
    method: "POST",
    body: payload
  });

export const updatePermissaoAction = async (id: number, payload: UpdatePermissaoRequest) =>
  apiRequest<Permissao, UpdatePermissaoRequest>(`/api/admin/permissoes/${id}`, {
    method: "PUT",
    body: payload
  });

export const deletePermissaoAction = async (id: number) =>
  apiRequest<void>(`/api/admin/permissoes/${id}`, { method: "DELETE" });

export const listGruposAction = async () => apiRequest<Grupo[]>("/api/admin/grupos");

export const createGrupoAction = async (payload: CreateGrupoRequest) =>
  apiRequest<Grupo, CreateGrupoRequest>("/api/admin/grupos", { method: "POST", body: payload });

export const updateGrupoAction = async (id: number, payload: UpdateGrupoRequest) =>
  apiRequest<Grupo, UpdateGrupoRequest>(`/api/admin/grupos/${id}`, { method: "PUT", body: payload });

export const deleteGrupoAction = async (id: number) =>
  apiRequest<void>(`/api/admin/grupos/${id}`, { method: "DELETE" });

export const listGrupoPermissoesAction = async (grupoId: number) =>
  apiRequest<Permissao[]>(`/api/admin/grupos/${grupoId}/permissoes`);

export const addGrupoPermissaoAction = async (grupoId: number, payload: GrupoPermissaoRequest) =>
  apiRequest<Permissao[], GrupoPermissaoRequest>(`/api/admin/grupos/${grupoId}/permissoes`, {
    method: "POST",
    body: payload
  });

export const removeGrupoPermissaoAction = async (grupoId: number, permissaoId: number) =>
  apiRequest<Permissao[]>(`/api/admin/grupos/${grupoId}/permissoes/${permissaoId}`, {
    method: "DELETE"
  });
