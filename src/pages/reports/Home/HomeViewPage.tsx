import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const HomeViewPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-vindo</CardTitle>
        <CardDescription>
          Selecione um relatório no menu lateral ou acesse as áreas administrativas.
        </CardDescription>
      </CardHeader>

      {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: 1200 }}>
        <div style={{ marginBottom: 10 }}>
          Test the captcha feature below
        </div>
        <div style={{ marginBottom: 10 }}>
          <button>Click Me</button>
        </div>
        <div>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_SITE_KEY}
            onChange={() => undefined} />
        </div>
      </div> */}
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium">Relatórios Power BI</p>
            <p className="text-xs text-muted-foreground">
              Visualize relatórios incorporados com controle de acesso.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium">Administração</p>
            <p className="text-xs text-muted-foreground">
              Gerencie reports, dimensões, políticas e regras.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium">Menu Dinâmico</p>
            <p className="text-xs text-muted-foreground">
              Itens conforme permissões da API.
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium">Cadastros</p>
            <p className="text-xs text-muted-foreground">
              Organize órgãos, unidades, grupos e permissões.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
