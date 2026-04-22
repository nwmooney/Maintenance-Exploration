import crypto from "crypto";
import { Environment, FlowCategory } from "./types";

export function detectEnvironment(): Environment {
  if (process.env.NODE_ENV === "production") return "prod";
  if (process.env.NODE_ENV === "test") return "test";
  return "dev";
}

export function hashId(value?: string): string | undefined {
  if (!value) return undefined;
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function inferFlowCategory(eventType: string): FlowCategory {
  if (eventType.startsWith("cmx.defect")) return "defect";
  if (eventType.startsWith("cmx.pm")) return "pm";
  if (eventType.startsWith("cmx.invoice")) return "invoice";
  return "unknown";
}
