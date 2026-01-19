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

  //const module = await loadPowerBi();
  //console.log("Power BI module loaded:", module);
  // const powerbiService = getServiceInstance(module);
  //console.log("Power BI service instance:", powerbiService);


  const embedConfig: IComponentEmbedConfiguration = {
    type: "report",
    tokenType: models.TokenType.Embed,
    accessToken: config.accessToken,
    embedUrl: config.embedUrl,
    // id: String(config.reportId),
    settings: {
      layoutType: models.LayoutType.Custom,      // opcional, mas ajuda
      customLayout: { displayOption: models.DisplayOption.FitToWidth },
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: false },

      }
    }
  };

  powerbi.reset(container);
  const report = powerbi.embed(container, embedConfig) as PowerBiModule["Report"];
  return report;
};
