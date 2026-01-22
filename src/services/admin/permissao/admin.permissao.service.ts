import { apiClient } from "@/shared/api/axios";
import { CreatePermissaoRequest, Permissao, UpdatePermissaoRequest } from "@/shared/types/swagger";

export const adminPermissaoService = {
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
  }
};
