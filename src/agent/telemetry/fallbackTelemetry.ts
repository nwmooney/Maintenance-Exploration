import { emitTelemetry } from "./emitter";
import { detectEnvironment, hashId, inferFlowCategory } from "./utils";
import { FallbackTelemetryEvent } from "./types";

export function recordFallbackUsage(input: {
  bundleVersion: string;
  eventType: string;
  eventSource?: string;
  assetId?: string;
}): void {
  const telemetry: FallbackTelemetryEvent = {
    name: "cmx.a2ui.fallback.used",
    timestamp: new Date().toISOString(),
    environment: detectEnvironment(),
    bundleVersion: input.bundleVersion,
    eventType: input.eventType,
    eventSource: input.eventSource,
    flowCategory: inferFlowCategory(input.eventType),
    assetIdHash: hashId(input.assetId)
  };

  emitTelemetry(telemetry);
}
