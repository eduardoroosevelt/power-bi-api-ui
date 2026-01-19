import { apiClient } from "@/shared/api/axios";
import {
  CreateGrupoRequest,
  CreateOrgaoRequest,
  CreateDimensionRequest,
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

export const adminService = {
  async listReports() {
    const { data } = await apiClient.get<PowerBiReport[]>("/api/admin/reports");
    return data;
  },
  async createReport(payload: CreateReportRequest) {
    const { data } = await apiClient.post<PowerBiReport>("/api/admin/reports", payload);
    return data;
  },
  async addDimension(reportId: number, payload: CreateDimensionRequest) {
    const { data } = await apiClient.post<ReportDimension>(
      `/api/admin/reports/${reportId}/dimensions`,
      payload
    );
    return data;
  },
  async addPolicy(reportId: number, payload: CreatePolicyRequest) {
    const { data } = await apiClient.post<ReportAccessPolicy>(
      `/api/admin/reports/${reportId}/policies`,
      payload
    );
    return data;
  },
  async addRule(policyId: number, payload: CreateRuleRequest) {
    const { data } = await apiClient.post<ReportAccessPolicyRule>(
      `/api/admin/policies/${policyId}/rules`,
      payload
    );
    return data;
  },
  async addRuleValue(ruleId: number, payload: CreateRuleValueRequest) {
    const { data } = await apiClient.post<ReportAccessPolicyRuleValue>(
      `/api/admin/rules/${ruleId}/values`,
      payload
    );
    return data;
  },
  async listOrgaos() {
    const { data } = await apiClient.get<Orgao[]>(`/api/admin/orgaos`);
    return data;
  },
  async createOrgao(payload: CreateOrgaoRequest) {
    const { data } = await apiClient.post<Orgao>(`/api/admin/orgaos`, payload);
    return data;
  },
  async updateOrgao(id: number, payload: UpdateOrgaoRequest) {
    const { data } = await apiClient.put<Orgao>(`/api/admin/orgaos/${id}`, payload);
    return data;
  },
  async deleteOrgao(id: number) {
    await apiClient.delete(`/api/admin/orgaos/${id}`);
  },
  async listUnidades() {
    const { data } = await apiClient.get<Unidade[]>(`/api/admin/unidades`);
    return data;
  },
  async createUnidade(payload: CreateUnidadeRequest) {
    const { data } = await apiClient.post<Unidade>(`/api/admin/unidades`, payload);
    return data;
  },
  async updateUnidade(id: number, payload: UpdateUnidadeRequest) {
    const { data } = await apiClient.put<Unidade>(`/api/admin/unidades/${id}`, payload);
    return data;
  },
  async deleteUnidade(id: number) {
    await apiClient.delete(`/api/admin/unidades/${id}`);
  },
  async listPermissoes() {
    const { data } = await apiClient.get<Permissao[]>(`/api/admin/permissoes`);
    return data;
  },
  async createPermissao(payload: CreatePermissaoRequest) {
    const { data } = await apiClient.post<Permissao>(`/api/admin/permissoes`, payload);
    return data;
  },
  async updatePermissao(id: number, payload: UpdatePermissaoRequest) {
    const { data } = await apiClient.put<Permissao>(`/api/admin/permissoes/${id}`, payload);
    return data;
  },
  async deletePermissao(id: number) {
    await apiClient.delete(`/api/admin/permissoes/${id}`);
  },
  async listGrupos() {
    const { data } = await apiClient.get<Grupo[]>(`/api/admin/grupos`);
    return data;
  },
  async createGrupo(payload: CreateGrupoRequest) {
    const { data } = await apiClient.post<Grupo>(`/api/admin/grupos`, payload);
    return data;
  },
  async updateGrupo(id: number, payload: UpdateGrupoRequest) {
    const { data } = await apiClient.put<Grupo>(`/api/admin/grupos/${id}`, payload);
    return data;
  },
  async deleteGrupo(id: number) {
    await apiClient.delete(`/api/admin/grupos/${id}`);
  },
  async listGrupoPermissoes(grupoId: number) {
    const { data } = await apiClient.get<Permissao[]>(
      `/api/admin/grupos/${grupoId}/permissoes`
    );
    return data;
  },
  async addGrupoPermissao(grupoId: number, payload: GrupoPermissaoRequest) {
    const { data } = await apiClient.post<Permissao[]>(
      `/api/admin/grupos/${grupoId}/permissoes`,
      payload
    );
    return data;
  },
  async removeGrupoPermissao(grupoId: number, permissaoId: number) {
    const { data } = await apiClient.delete<Permissao[]>(
      `/api/admin/grupos/${grupoId}/permissoes/${permissaoId}`
    );
    return data;
  }
};
