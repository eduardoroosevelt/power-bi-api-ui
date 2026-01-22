import { apiClient } from "@/shared/api/axios";
import { CreateUnidadeRequest, Unidade, UpdateUnidadeRequest } from "@/shared/types/swagger";

export const adminUnidadeService = {
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
  }
};
