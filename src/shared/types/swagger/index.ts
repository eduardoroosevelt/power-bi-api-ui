export interface EmbedResponse {
  reportInternalId?: number;
  embedUrl?: string;
  accessToken?: string;
  expiresAt?: string;
  principal?: string;
  reportKey?: string;
}

export interface UpdateUnidadeRequest {
  orgaoId: number;
  nome: string;
  codigo: string;
}

export interface Orgao {
  id?: number;
  nome?: string;
  codigo?: string;
}

export interface Unidade {
  id?: number;
  orgao?: Orgao;
  nome?: string;
  codigo?: string;
}

export interface UpdatePermissaoRequest {
  code: string;
  descricao?: string;
}

export interface Permissao {
  id?: number;
  code?: string;
  descricao?: string;
}

export interface UpdateOrgaoRequest {
  nome: string;
  codigo: string;
}

export interface UpdateGrupoRequest {
  nome: string;
  descricao?: string;
}

export interface Grupo {
  id?: number;
  nome?: string;
  descricao?: string;
  permissoes?: Permissao[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
}

export interface CreateRuleValueRequest {
  value: string;
}

export interface CreateUnidadeRequest {
  orgaoId: number;
  nome: string;
  codigo: string;
}

export interface PowerBiReport {
  id?: number;
  nome?: string;
  workspaceId?: string;
  reportId?: string;
  datasetId?: string;
  ativo?: boolean;
}

export type SubjectType = "USER" | "GROUP";
export type PolicyEffect = "ALLOW_ALL" | "ALLOW_LIST";
export type RuleOperator = "IN";
export type RuleValuesMode = "STATIC" | "FROM_USER_ATTRIBUTE";
export type DimensionValueType = "STRING" | "INT" | "UUID";

export interface ReportAccessPolicy {
  id?: number;
  report?: PowerBiReport;
  subjectType?: SubjectType;
  subjectId?: number;
  effect?: PolicyEffect;
  priority?: number;
  active?: boolean;
}

export interface ReportAccessPolicyRule {
  id?: number;
  policy?: ReportAccessPolicy;
  dimensionKey?: string;
  operator?: RuleOperator;
  valuesMode?: RuleValuesMode;
  userAttribute?: string;
  active?: boolean;
}

export interface ReportAccessPolicyRuleValue {
  rule?: ReportAccessPolicyRule;
  ruleValue?: string;
}

export interface CreateReportRequest {
  nome: string;
  workspaceId: string;
  reportId: string;
  datasetId: string;
  ativo: boolean;
}

export interface CreatePolicyRequest {
  subjectType: SubjectType;
  subjectId: number;
  effect: PolicyEffect;
  priority?: number;
  active: boolean;
}

export interface CreateDimensionRequest {
  dimensionKey: string;
  dimensionLabel: string;
  valueType: DimensionValueType;
  active: boolean;
}

export interface ReportDimension {
  id?: number;
  report?: PowerBiReport;
  dimensionKey?: string;
  dimensionLabel?: string;
  valueType?: DimensionValueType;
  active?: boolean;
}

export interface CreateRuleRequest {
  dimensionKey: string;
  operator: RuleOperator;
  valuesMode: RuleValuesMode;
  userAttribute?: string;
  allowAll?: boolean;
  active: boolean;
  values?: string[];
}

export interface CreatePermissaoRequest {
  code: string;
  descricao?: string;
}

export interface CreateOrgaoRequest {
  nome: string;
  codigo: string;
}

export interface CreateGrupoRequest {
  nome: string;
  descricao?: string;
}

export interface GrupoPermissaoRequest {
  permissaoId: number;
}

export interface ReportDetailDto {
  id?: number;
  nome?: string;
  workspaceId?: string;
  reportId?: string;
  datasetId?: string;
  ativo?: boolean;
  dimensions?: ReportDimensionDto[];
}

export interface ReportDimensionDto {
  id?: number;
  dimensionKey?: string;
  dimensionLabel?: string;
  valueType?: DimensionValueType;
  active?: boolean;
}

export type MenuResourceType = "PAGE" | "POWERBI_REPORT" | "EXTERNAL_LINK";

export interface MenuItemDto {
  id?: number;
  label?: string;
  route?: string;
  icon?: string;
  ordem?: number;
  resourceType?: MenuResourceType;
  resourceId?: number;
  children?: MenuItemDto[];
}
