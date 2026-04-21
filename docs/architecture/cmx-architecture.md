
CMX One Architecture (Execution + Enterprise + Open Integration)
This diagram represents Connected Maintenance 360 (CMX) as a system of execution that sits between real‑world signals and enterprise systems, while exposing an open integration layer (CMX Connect) for partners and future CMXs.


AI‑First Architecture Principle

CMX uses AI as a system of action, not a system of answers.

Agents are mapped to specific layers of the architecture and have clearly scoped autonomy. This avoids “chat‑only AI” and ensures every agent produces operational outcomes.
High‑Level Architecture Layers (AI‑Mapped)
1) Signal & Input Layer (Where Work Starts)
AI Agents at this layer: Signal Intake Agents
Primary responsibilities:

Normalize raw inputs into structured events
Reduce human data capture
Prevent noisy or duplicate inputs
Agents:

Driver Defect Intake Agent – structures DVIRs, breakdowns, and free‑text notes
Vendor Status Capture Agent – voice/email agent to capture vendor status updates
Document Understanding Agent – parses scanned docs/images/invoices into structured data (supports invoice processing)


2) CMX Execution Layer (The Product)
AI Agents at this layer: Execution Agents
Agents:

Maintenance Triage Agent – proposes required work + urgency (uses repair history + signals)
Work Order Builder Agent – drafts/updates WOs; bundles items into a single visit
Technician Assist Agent – guided diagnostics + past similar repair insights
Invoice Reconciliation Agent – matches invoice → WO; validates costs before posting (vendor invoice processing)
Warranty & Claims Agent – identifies warranty/subrogation candidates; prepares submissions


3) CMX Platform Services
AI Agents at this layer: Control & Policy Agents
Purpose:

Keep autonomy safe, auditable, reversible
Agents:

Policy Guardrail Agent – enforces thresholds, approvals, safety rules
Exception Detection Agent – escalates edge cases (e.g., duplicate invoice, missing required values)
Observability & Learning Agent – tracks decisions, outcomes, and feedback loops
This aligns to the enterprise practice of sharply defining AI roles and controlling access through security/governance.



4) Enterprise Systems of Record
AI Role here: Non‑authoritative
Agents do not mutate records of truth directly. Instead they prepare structured updates and submit through governed services (e.g., Maximo WO updates, finance posting recommendations).



5) CMX Connect (Open Integration Layer)
AI Agents at this layer: Federated / External Agents
Agents:

Integration Mediation Agent – translates external schemas ↔ CMX canonical models
CMX aligns to a broader “APIs / MCP / Kafka exposure + governance & security” direction already discussed in internal roadmap materials.


Visual Diagram
graph TD

A[Drivers & Technicians] -->|Defects / Voice| B[Signal Intake Agents]
C[Telematics & IoT] -->|Fault Events| B
D[Vendors / Docs] -->|Invoices / Status| B

B --> E[CMX Execution Layer]

E --> F[Triage Agent]
E --> G[Work Order Builder Agent]
E --> H[Technician Assist Agent]
E --> I[Invoice Reconciliation Agent]
E --> J[Warranty & Claims Agent]

E --> K[Platform Control & Policy Agents]

K --> L[Systems of Record
(Maximo, Finance, Docs)]

E --> M[CMX Connect APIs]
M --> N[Partner / External Agents]


Agent Autonomy Model (Important)


Agent Type	Can Act Automatically	Requires Approval	Fully Read‑Only
Signal Intake	✅	❌	❌
Execution Agents	✅ (bounded)	✅ (thresholds)	❌
Policy/Control	❌	❌	✅
Enterprise SoR	❌	✅	✅
External Agents	✅ (contracted)	✅	❌


CMX Event Model (Canonical)
This is the event taxonomy that turns the architecture into an executable system. Events are immutable facts that describe what happened; commands are requests that ask for something to happen.
The model intentionally supports:

Connected execution (defects/faults → actions)
Invoice + document automation (scan/upload → extraction → posting)
Warranty/claims/subrogation workflows
Enterprise guardrails (clear roles + governed access)


1) Event Envelope (Recommended Standard)
All events share the same envelope so tooling, observability, and security are consistent.
{
  "eventId": "uuid",
  "eventType": "cmx.workOrder.created.v1",
  "occurredAt": "2026-04-20T12:45:00Z",
  "source": {
    "system": "cmx",
    "component": "work-order-builder-agent",
    "tenant": "jbh",
    "environment": "nonprod"
  },
  "correlation": {
    "correlationId": "uuid",
    "traceId": "string",
    "causationId": "uuid"
  },
  "subject": {
    "assetId": "string",
    "workOrderId": "string",
    "invoiceId": "string"
  },
  "security": {
    "sec360Context": "string",
    "dataClassification": "internal"
  },
  "payload": { }
}

Notes (recommended):

correlationId ties every event in a workflow thread together.
causationId points to the upstream event that triggered this event.


2) Canonical Entities (What events reference)
These are the core entities CMX cares about (recommended list).

Asset (tractor/trailer/equipment)
Defect / Inspection (DVIR + technician findings)
Fault (telematics/diagnostic signal)
Work Order (parent/child jobs)
Invoice / Document (scan/upload + extracted values)
Warranty / Claim (warranty eligibility, claim submission)
Part / Inventory (optional early; becomes important as CMX matures)
This aligns to internal maintenance initiatives like work order transfer, spreadsheet upload, scan/upload documents, and invoice automation.
3) Event Catalogue (v1)
A) Defects & Inspections

- `cmx.defect.reported.v1` (user reports defect)
- `cmx.defect.classified.v1` (agent output)
- `cmx.defect.resolved.v1`
- `cmx.inspection.submitted.v1`
- `cmx.inspection.requiresRepair.v1`B) Telematics / Faults
- `cmx.fault.detected.v1`
- `cmx.fault.enriched.v1` (adds meaning/context)
- `cmx.fault.suppressed.v1` (false positive/noise control)
C) Work Orders (Core Execution)
- `cmx.workOrder.drafted.v1` (agent drafted, not yet approved)
- `cmx.workOrder.created.v1`
- `cmx.workOrder.updated.v1`
- `cmx.workOrder.bundled.v1` (repairs consolidated into one visit)
- `cmx.workOrder.assigned.v1`
- `cmx.workOrder.inProgress.v1`
- `cmx.workOrder.completed.v1`
- `cmx.workOrder.closed.v1`
- `cmx.workOrder.transferRequested.v1` (supports "WO transfer" initiatives)
D) Documents & Invoices
- `cmx.document.uploaded.v1` (scan/upload via tablet aligns to roadmap)
- `cmx.document.classified.v1`
- `cmx.invoice.detected.v1`
- `cmx.invoice.extracted.v1`
- `cmx.invoice.matchedToWorkOrder.v1`
- `cmx.invoice.validationFailed.v1` (missing ref invoice, duplicate, etc.)
- `cmx.invoice.posted.v1`E) Warranty / Claims / Subrogation
- `cmx.warranty.candidateIdentified.v1`
- `cmx.warranty.submissionPrepared.v1`
- `cmx.warranty.submitted.v1`
- `cmx.claim.candidateIdentified.v1` (claims/subrogation)
- `cmx.claim.submitted.v1`
- `cmx.claim.statusUpdated.v1`F) Guardrails & Exceptions
- `cmx.policy.approvalRequired.v1`
- `cmx.policy.approved.v1`
- `cmx.policy.rejected.v1`
- `cmx.exception.raised.v1` (routes to humans)
- `cmx.exception.resolved.v1`G) Systems of Record Sync (Non‑authoritative)
- `cmx.sor.maximoUpdateRequested.v1` (CMX asks governed service to update Maximo)
- `cmx.sor.maximoUpdateSucceeded.v1`
- `cmx.sor.maximoUpdateFailed.v1`
- `cmx.sor.financePostRequested.v1`
- `cmx.sor.financePostSucceeded.v1`
- `cmx.sor.financePostFailed.v1`
