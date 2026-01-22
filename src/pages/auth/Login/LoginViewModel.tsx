import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { getErrorMessage } from "@/shared/api/errors";
import { LoginForm, LoginViewPage } from "./LoginViewPage";

const loginSchema = z.object({
  username: z.string().min(1, "Informe o usuário"),
  password: z.string().min(1, "Informe a senha")
});

export const LoginViewModel = () => {
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
    <LoginViewPage
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};
