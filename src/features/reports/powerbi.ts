import { service, factories, models, IEmbedConfiguration } from "powerbi-client";
import { IComponentEmbedConfiguration } from "service";
type PowerBiModule = typeof import("powerbi-client");

let cachedModule: PowerBiModule | null = null;
let cachedService: PowerBiModule["service"]["Service"] | null = null;

interface EmbedConfig {
  embedUrl: string;
  accessToken: string;
  reportId: string | number;
}
const powerbi = new service.Service(factories.hpmFactory, factories.wpmpFactory, factories.routerFactory);
const loadPowerBi = async () => {
  if (!cachedModule) {
    cachedModule = await import("powerbi-client");
  }
  return cachedModule;
};

const getServiceInstance = (module: PowerBiModule) => {
  if (!cachedService) {
    cachedService = new module.service.Service(
      module.service.factories.hpmFactory,
      module.service.factories.wpmpFactory,
      module.service.factories.routerFactory
    );
  }
  return cachedService;
};

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
    permissions: models.Permissions.Create,
    filters: [{
      $schema: "http://powerbi.com/product/schema#basic",
      target: {
        table: "DADOS_ADIANTAMENTO",
        column: "IDORGAO"
      },
      operator: "In",
      values: [19],
      filterType: models.FilterType.Basic
    }],
    settings: {
      layoutType: models.LayoutType.Custom,      // opcional, mas ajuda
      customLayout: { displayOption: models.DisplayOption.FitToWidth },
      panes: {
        filters: { visible: false, },

        pageNavigation: { visible: false },

      }
    }
  };

  powerbi.reset(container);
  const report = powerbi.embed(container, embedConfig) as PowerBiModule["Report"];
  return report;
};
