import { models, service, Report } from "powerbi-client";

const powerbiService = new service.Service(
  service.factories.hpmFactory,
  service.factories.wpmpFactory,
  service.factories.routerFactory
);

interface EmbedConfig {
  embedUrl: string;
  accessToken: string;
  reportId: string | number;
}

export const embedPowerBiReport = (
  container: HTMLDivElement,
  config: EmbedConfig
) => {
  const embedConfig: service.IEmbedConfiguration = {
    type: "report",
    id: String(config.reportId),
    embedUrl: config.embedUrl,
    accessToken: config.accessToken,
    tokenType: models.TokenType.Embed,
    settings: {
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: true }
      }
    }
  };

  powerbiService.reset(container);
  const report = powerbiService.embed(container, embedConfig) as Report;
  return report;
};
