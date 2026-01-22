import { service, factories, models, IEmbedConfiguration, Embed } from "powerbi-client";
import { IComponentEmbedConfiguration } from "service";
type PowerBiModule = typeof import("powerbi-client");

interface EmbedConfigFilter {
  schema: string;
  target: {
    table: string;
    column: string;
  };
  operator: "In" | "NotIn" | "All";
  values: (string | number | boolean)[];
  filterType: models.FilterType;
}
interface EmbedConfig {
  embedUrl: string;
  accessToken: string;
  reportId: string | number;
  filters?: EmbedConfigFilter[];
}
const powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);

export const embedPowerBiReport = async (
  container: HTMLElement,
  config: EmbedConfig
) => {

  const embedConfig: IComponentEmbedConfiguration = {
    type: "report",
    tokenType: models.TokenType.Embed,
    accessToken: config.accessToken,
    embedUrl: config.embedUrl,
    pageName: "ReportSection1",
    permissions: models.Permissions.All,
    filters: config.filters,
    // [{
    //   $schema: "http://powerbi.com/product/schema#basic",
    //   target: {
    //     table: "DADOS_ADIANTAMENTO",
    //     column: "IDORGAO"
    //   },
    //   operator: "In",
    //   values: [16, 25, 19],
    //   filterType: models.FilterType.Basic,
    //   displaySettings: {
    //     isHiddenInViewMode: true,
    //     isLockedInViewMode: true
    //   },

    // }],
    settings: {
      layoutType: models.LayoutType.Custom,      // opcional, mas ajuda
      customLayout: { displayOption: models.DisplayOption.FitToWidth },
      panes: {
        filters: { visible: false, },
        pageNavigation: { visible: false },

      }
    }
  };
  console.log("Embedding report with config:", embedConfig);
  powerbi.reset(container);
  const report: Embed = powerbi.embed(container, embedConfig);
  return report;
};
