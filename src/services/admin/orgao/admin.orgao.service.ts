import { apiClient } from "@/shared/api/axios";
import { CreateOrgaoRequest, Orgao, UpdateOrgaoRequest } from "@/shared/types/swagger";

export const adminOrgaoService = {
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
  }
};
