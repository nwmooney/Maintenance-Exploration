export type Environment = "dev" | "test" | "prod";

export type FlowCategory =
  | "defect"
  | "pm"
  | "invoice"
  | "unknown";

export type FallbackTelemetryEvent = {
  name: "cmx.a2ui.fallback.used";
  timestamp: string;
  environment: Environment;
  bundleVersion: string;
  eventType: string;
  eventSource?: string;
  flowCategory: FlowCategory;
  assetIdHash?: string;
};
