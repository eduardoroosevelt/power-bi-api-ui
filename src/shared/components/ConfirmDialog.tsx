import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  onConfirm,
  onCancel
}: ConfirmDialogProps) => (
  <Dialog open={open} onOpenChange={(value) => !value && onCancel()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onConfirm}>Confirmar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
