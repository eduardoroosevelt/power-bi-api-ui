import { apiClient } from "@/shared/api/axios";
import { CreateGrupoRequest, Grupo, UpdateGrupoRequest } from "@/shared/types/swagger";

export const adminGrupoService = {
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
  }
};
