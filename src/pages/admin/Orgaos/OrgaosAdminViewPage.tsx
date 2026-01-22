import type { FormEventHandler } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Orgao } from "@/shared/types/swagger";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/shared/components/ui/table";
import { Loading } from "@/shared/components/Loading";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";

export type OrgaoForm = {
  nome: string;
  codigo: string;
};

export interface OrgaosAdminViewProps {
  orgaos: Orgao[];
  loading: boolean;
  open: boolean;
  editing: Orgao | null;
  confirm: Orgao | null;
  onOpenChange: (open: boolean) => void;
  onEdit: (orgao: Orgao) => void;
  onDeleteRequest: (orgao: Orgao) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  register: UseFormRegister<OrgaoForm>;
  errors: FieldErrors<OrgaoForm>;
  isSubmitting: boolean;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const OrgaosAdminViewPage = ({
  orgaos,
  loading,
  open,
  editing,
  confirm,
  onOpenChange,
  onEdit,
  onDeleteRequest,
  onConfirmDelete,
  onCancelDelete,
  register,
  errors,
  isSubmitting,
  onSubmit
}: OrgaosAdminViewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Órgãos</CardTitle>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button>Novo órgão</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar órgão" : "Criar órgão"}</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input {...register("nome")} defaultValue={editing?.nome} />
                {errors.nome ? <p className="text-xs text-destructive">{errors.nome.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Código</Label>
                <Input {...register("codigo")} defaultValue={editing?.codigo} />
                {errors.codigo ? (
                  <p className="text-xs text-destructive">{errors.codigo.message}</p>
                ) : null}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? <Loading label="Carregando órgãos" /> : null}
        {!loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orgaos.map((orgao) => (
                <TableRow key={orgao.id ?? orgao.codigo}>
                  <TableCell>{orgao.id}</TableCell>
                  <TableCell>{orgao.nome}</TableCell>
                  <TableCell>{orgao.codigo}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(orgao)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteRequest(orgao)}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </CardContent>

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Remover órgão"
        description="Tem certeza que deseja remover este órgão?"
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </Card>
  );
};
