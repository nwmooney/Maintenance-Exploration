# CMX Connect — REST → Event Mapping Appendix

This appendix defines how CMX Connect command APIs (OpenAPI) translate into domain events (AsyncAPI).

## Core Principles

- REST = intent (“please do X”)
- Events = facts (“X happened”)
- REST calls never directly mutate Systems of Record
- All state changes are observable via events
- One command may emit multiple events over time

## 1. Defects & Inspections

**POST /defects**  
Intent: Report a defect or inspection finding  
Primary events emitted:
- cmx.defect.reported.v1 ✅ (always)
- cmx.defect.classified.v1 (if triage agent categorizes)
- cmx.inspection.requiresRepair.v1 (if repair is required)

Notes:
- This endpoint is idempotent (recommended via Idempotency-Key)
- Classification and repair determination are asynchronous

## 2. Documents & Uploads

**POST /documents**  
Intent: Register a document (invoice, photo, inspection, estimate)  
Primary events emitted:
- cmx.document.uploaded.v1

Secondary events (async):
- cmx.document.classified.v1
- cmx.document.extractionCompleted.v1 (if extractable)

**POST /documents/{documentId}/complete**  
Intent: Signal upload completion  
Primary events emitted:
- cmx.document.readyForProcessing.v1

Notes:
- Enables OCR / AI extraction pipelines
- Keeps binary upload decoupled from processing

## 3. Invoices

**POST /invoices**  
Intent: Submit an invoice for processing  
Primary events emitted:
- cmx.invoice.detected.v1

Secondary events (depending on outcome):
- cmx.invoice.extracted.v1
- cmx.invoice.matchedToWorkOrder.v1
- cmx.invoice.validationFailed.v1 ⚠️
- cmx.invoice.posted.v1

Downstream SoR events:
- cmx.sor.financePostRequested.v1
- cmx.sor.financePostSucceeded.v1
- cmx.sor.maximoUpdateRequested.v1

Notes:
- Validation failures always raise:
  - cmx.exception.raised.v1

## 4. Work Orders

**POST /work-orders/drafts**  
Intent: Draft a work order from defects/faults/PMs  
Primary events emitted:
- cmx.workOrder.drafted.v1

Secondary events:
- cmx.policy.approvalRequired.v1 (if gated)

**POST /work-orders/{workOrderId}/approve**  
Intent: Approve or reject a gated action  
Events emitted:
- cmx.policy.approved.v1 or
- cmx.policy.rejected.v1

Follow-on events (if approved):
- cmx.workOrder.created.v1

**POST /work-orders/{workOrderId}/assign**  
Intent: Assign work to technician / vendor / team  
Events emitted:
- cmx.workOrder.assigned.v1

**POST /work-orders/{workOrderId}/bundle**  
Intent: Bundle multiple work items into one visit  
Events emitted:
- cmx.workOrder.bundled.v1

**POST /work-orders/{workOrderId}/complete**  
Intent: Mark work complete and submit completion details  
Primary events emitted:
- cmx.workOrder.completed.v1

Secondary events:
- cmx.warranty.candidateIdentified.v1
- cmx.claim.candidateIdentified.v1

## 5. Warranty & Claims

**POST /warranty/submissions**  
Intent: Submit warranty artifacts  
Events emitted:
- cmx.warranty.submitted.v1
- cmx.claim.statusUpdated.v1

**POST /claims/submissions**  
Intent: Submit claim / subrogation package  
Events emitted:
- cmx.claim.submitted.v1
- cmx.claim.statusUpdated.v1

## 6. Exceptions & Policy Resolution

**POST /exceptions/{exceptionId}/resolve**  
Intent: Resolve a raised exception  
Events emitted:
- cmx.exception.resolved.v1

Possible follow-on events:
- cmx.workOrder.created.v1
- cmx.invoice.posted.v1
- cmx.policy.approved.v1

## 7. Command Tracking

**GET /commands/{commandId}**  
Intent: Query command execution state  
Maps to events:  
Reads derived state from:
- cmx.*.v1 domain events
- cmx.sor.*.v1 outcome events

No new events emitted

## 8. Summary Table (Quick Reference)

| REST Command | Primary Event | Possible Secondary Events |
|--------------|---------------|---------------------------|
| POST /defects | cmx.defect.reported.v1 | classified, requiresRepair |
| POST /documents | cmx.document.uploaded.v1 | classified, extracted |
| POST /invoices | cmx.invoice.detected.v1 | extracted, posted, failed |
| POST /work-orders/drafts | cmx.workOrder.drafted.v1 | approvalRequired |
| POST /work-orders/{id}/approve | cmx.policy.approved.v1 | workOrder.created |
| POST /work-orders/{id}/complete | cmx.workOrder.completed.v1 | warrantyCandidate |
| POST /warranty/submissions | cmx.warranty.submitted.v1 | claim.statusUpdated |
| POST /exceptions/{id}/resolve | cmx.exception.resolved.v1 | workflow resumed |