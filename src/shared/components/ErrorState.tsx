import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";

export const ErrorState = ({
  title = "Erro",
  description = "Não foi possível carregar os dados."
}: {
  title?: string;
  description?: string;
}) => (
  <Alert variant="destructive">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
  </Alert>
);
