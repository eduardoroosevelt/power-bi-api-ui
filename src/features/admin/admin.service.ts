import {
  addDimensionAction,
  addGrupoPermissaoAction,
  addRuleAction,
  addRuleValueAction,
  createGrupoAction,
  createOrgaoAction,
  createPermissaoAction,
  createPolicyAction,
  createReportAction,
  createUnidadeAction,
  deleteGrupoAction,
  deleteOrgaoAction,
  deletePermissaoAction,
  deleteUnidadeAction,
  listGrupoPermissoesAction,
  listGruposAction,
  listOrgaosAction,
  listPermissoesAction,
  listReportsAction,
  listUnidadesAction,
  removeGrupoPermissaoAction,
  updateGrupoAction,
  updateOrgaoAction,
  updatePermissaoAction,
  updateUnidadeAction
} from "@/app/actions/admin";
import { withAuthHandling } from "@/shared/api/client";
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
  GrupoPermissaoRequest,
  UpdateGrupoRequest,
  UpdateOrgaoRequest,
  UpdatePermissaoRequest,
  UpdateUnidadeRequest
} from "@/shared/types/swagger";

export const adminService = {
  async listReports() {
    return withAuthHandling(() => listReportsAction());
  },
  async createReport(payload: CreateReportRequest) {
    return withAuthHandling(() => createReportAction(payload));
  },
  async addDimension(reportId: number, payload: CreateDimensionRequest) {
    return withAuthHandling(() => addDimensionAction(reportId, payload));
  },
  async createPolicy(reportId: number, payload: CreatePolicyRequest) {
    return withAuthHandling(() => createPolicyAction(reportId, payload));
  },
  async addRule(policyId: number, payload: CreateRuleRequest) {
    return withAuthHandling(() => addRuleAction(policyId, payload));
  },
  async addRuleValue(ruleId: number, payload: CreateRuleValueRequest) {
    return withAuthHandling(() => addRuleValueAction(ruleId, payload));
  },
  async listOrgaos() {
    return withAuthHandling(() => listOrgaosAction());
  },
  async createOrgao(payload: CreateOrgaoRequest) {
    return withAuthHandling(() => createOrgaoAction(payload));
  },
  async updateOrgao(id: number, payload: UpdateOrgaoRequest) {
    return withAuthHandling(() => updateOrgaoAction(id, payload));
  },
  async deleteOrgao(id: number) {
    return withAuthHandling(() => deleteOrgaoAction(id));
  },
  async listUnidades() {
    return withAuthHandling(() => listUnidadesAction());
  },
  async createUnidade(payload: CreateUnidadeRequest) {
    return withAuthHandling(() => createUnidadeAction(payload));
  },
  async updateUnidade(id: number, payload: UpdateUnidadeRequest) {
    return withAuthHandling(() => updateUnidadeAction(id, payload));
  },
  async deleteUnidade(id: number) {
    return withAuthHandling(() => deleteUnidadeAction(id));
  },
  async listPermissoes() {
    return withAuthHandling(() => listPermissoesAction());
  },
  async createPermissao(payload: CreatePermissaoRequest) {
    return withAuthHandling(() => createPermissaoAction(payload));
  },
  async updatePermissao(id: number, payload: UpdatePermissaoRequest) {
    return withAuthHandling(() => updatePermissaoAction(id, payload));
  },
  async deletePermissao(id: number) {
    return withAuthHandling(() => deletePermissaoAction(id));
  },
  async listGrupos() {
    return withAuthHandling(() => listGruposAction());
  },
  async createGrupo(payload: CreateGrupoRequest) {
    return withAuthHandling(() => createGrupoAction(payload));
  },
  async updateGrupo(id: number, payload: UpdateGrupoRequest) {
    return withAuthHandling(() => updateGrupoAction(id, payload));
  },
  async deleteGrupo(id: number) {
    return withAuthHandling(() => deleteGrupoAction(id));
  },
  async listGrupoPermissoes(grupoId: number) {
    return withAuthHandling(() => listGrupoPermissoesAction(grupoId));
  },
  async addGrupoPermissao(grupoId: number, payload: GrupoPermissaoRequest) {
    return withAuthHandling(() => addGrupoPermissaoAction(grupoId, payload));
  },
  async removeGrupoPermissao(grupoId: number, permissaoId: number) {
    return withAuthHandling(() => removeGrupoPermissaoAction(grupoId, permissaoId));
  }
};
