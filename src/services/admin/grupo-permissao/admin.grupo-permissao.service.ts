import { apiClient } from "@/shared/api/axios";
import { GrupoPermissaoRequest, Permissao } from "@/shared/types/swagger";

export const adminGrupoPermissaoService = {
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
