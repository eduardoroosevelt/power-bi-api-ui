import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { getErrorMessage } from "@/shared/api/errors";

const loginSchema = z.object({
  username: z.string().min(1, "Informe o usuário"),
  password: z.string().min(1, "Informe a senha")
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await authService.login(data);
      login(response);
      toast.success("Login realizado com sucesso");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Falha ao autenticar"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Acesse o portal de relatórios Power BI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input id="username" placeholder="Digite seu usuário" {...register("username")} />
              {errors.username ? (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                {...register("password")}
              />
              {errors.password ? (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              ) : null}
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
