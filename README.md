# Power BI API UI

Frontend administrativo em React + Vite para integrar com a API Power BI descrita no Swagger/OpenAPI.

## ✅ Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (estado global)
- Axios (HTTP client)
- React Hook Form + Zod
- React Router DOM
- Power BI JavaScript SDK (`powerbi-client`)

## 🚀 Como rodar

```bash
npm install
npm run dev
```

## ⚙️ Configuração de ambiente

Crie um arquivo `.env` com a base URL da API:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

Veja o exemplo em `.env.example`.

## 🔐 Fluxo de login

1. Acesse `/login`.
2. Informe usuário e senha.
3. O token JWT (`accessToken`) é salvo no `localStorage`.
4. O Axios injeta automaticamente o header `Authorization: Bearer <token>`.
5. Erros 401/403 limpam o token e redirecionam para `/login`.

## 📂 Menu dinâmico

Após autenticar, o menu é carregado de `/api/me/menu` e renderiza níveis recursivos.
Itens `POWERBI_REPORT` sem rota recebem o padrão `/reports/:resourceId`.

## 📊 Visualizar relatório

- Rota: `/reports/:reportInternalId`
- Chamada: `POST /api/reports/{id}/embed`
- A resposta contém `embedUrl` + `accessToken`.

Se houver conflito com `powerbi-client`, substitua a implementação em `src/features/reports/powerbi.ts` por um wrapper local.

## 🛠️ Administração

Rotas administrativas básicas:

- `/admin/reports` - listar/criar reports
- `/admin/reports/:reportId/dimensions` - listar/criar dimensões
- `/admin/reports/:reportId/policies` - criar políticas
- `/admin/policies/:policyId/rules` - criar regras/valores
- `/admin/orgaos` - listar/criar/editar/remover órgãos
- `/admin/unidades` - listar/criar/editar/remover unidades
- `/admin/permissoes` - listar/criar/editar/remover permissões
- `/admin/grupos` - listar/criar/editar/remover grupos
- `/admin/grupos/:grupoId/permissoes` - gerenciar permissões de grupos

## 📄 Swagger / OpenAPI

Os tipos e serviços foram gerados com base no Swagger fornecido em `swagger.json`:

- `src/shared/types/swagger/index.ts`
- `src/shared/api/axios.ts`
- `src/features/**/` (services e páginas)
