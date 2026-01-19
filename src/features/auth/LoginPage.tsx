import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/auth.store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { env } from "@/shared/utils/env";

export const LoginPage = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const authUrl = useMemo(() => {
    const params = new URLSearchParams({
      client_id: env.oauthClientId,
      response_type: "token"
    });
    return `${env.oauthAuthorizeUrl}?${params.toString()}`;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    if (accessToken) {
      setToken(accessToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success("Login realizado com sucesso");
      navigate("/");
    }
  }, [navigate, setToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Autentique-se usando OAuth2 para acessar o portal de relatórios Power BI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" type="button" onClick={() => (window.location.href = authUrl)}>
            Entrar com OAuth2
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
