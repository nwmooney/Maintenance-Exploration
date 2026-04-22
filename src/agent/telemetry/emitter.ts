import { FallbackTelemetryEvent } from "./types";

export function emitTelemetry(event: FallbackTelemetryEvent): void {
  /**
   * Replace this with:
   * - App Insights
   * - OpenTelemetry
   * - Splunk
   * - Datadog
   */
  console.log("[TELEMETRY]", JSON.stringify(event));
}
