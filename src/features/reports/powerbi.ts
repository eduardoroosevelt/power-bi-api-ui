type PowerBiModule = typeof import("powerbi-client");

let cachedModule: PowerBiModule | null = null;
let cachedService: PowerBiModule["service"]["Service"] | null = null;

interface EmbedConfig {
  embedUrl: string;
  accessToken: string;
  reportId: string | number;
}

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
  container: HTMLDivElement,
  config: EmbedConfig
) => {
  const module = await loadPowerBi();
  const powerbiService = getServiceInstance(module);
  const embedConfig: PowerBiModule["service"]["IEmbedConfiguration"] = {
    type: "report",
    id: String(config.reportId),
    embedUrl: config.embedUrl,
    accessToken: config.accessToken,
    tokenType: module.models.TokenType.Embed,
    settings: {
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: true }
      }
    }
  };

  powerbiService.reset(container);
  const report = powerbiService.embed(container, embedConfig) as PowerBiModule["Report"];
  return report;
};
