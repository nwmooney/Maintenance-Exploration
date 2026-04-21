# CMX Architecture Index

This directory contains the **canonical architecture documentation** for **Connected Maintenance 360 (CMX)**.

The goal of this set is to:
- Provide a **shared mental model** across product, engineering, security, and partners
- Separate **conceptual architecture** from **execution details**
- Make CMX’s **API‑first, event‑driven design** explicit and enforceable

If you are new to the system, **read the files in numerical order**.

---

## How to Read This Architecture

CMX architecture is intentionally expressed across **multiple focused views** rather than one overloaded diagram.

Each view answers a specific question.

| # | File | Primary Question Answered | Audience |
|---|-----|---------------------------|----------|
| 01 | `01-system-view.mmd` | *What is CMX and where does it sit?* | Execs, Architects |
| 02 | `02-agent-view.mmd` | *Who (human or AI) does the work?* | Product, Engineering |
| 03 | `03-event-flow-view.mmd` | *What happens over time?* | Engineering |
| 04 | `04-integration-view.mmd` | *Who integrates with CMX?* | Platform, Security |
| 05 | `05-integration-contracts.mmd` | *When do I use APIs vs Events?* | Partners, API Teams |
| 06 | `06-rest-to-event-mapping.md` | *Exactly what does each command do?* | Engineering |
| 07 | `07-architecture-index.md` | *How do these pieces fit together?* | Everyone |

---

## Architectural Principles (Non‑Negotiable)

CMX follows these principles throughout the system:

### 1. CMX is a **System of Execution**
CMX owns:
- Workflow orchestration
- AI‑assisted decisioning
- Operational speed

CMX does **not** own:
- Long‑term financial or asset records
- Authoritative enterprise state

---

### 2. APIs Express **Intent**, Events Express **Facts**

- **REST APIs (OpenAPI)**  
  Used to express *commands*:
  > “Please create a defect.”

- **Events (AsyncAPI)**  
  Used to publish *facts*:
  > “A defect was reported.”

This separation prevents tight coupling and enables safe scaling.

---

### 3. Systems of Record Are Updated **Indirectly**
Enterprise systems (e.g., Maximo, Finance) are:
- Updated via **governed services**
- Triggered by events
- Never synchronously mutated by external callers

---

### 4. AI Is a **System of Action**, Not Chat
AI agents:
- Operate inside bounded workflows
- Produce observable outcomes
- Are subject to policy, approval, and audit

AI never bypasses governance.

---

## How the Specs Fit Together

CMX publishes **two formal integration contracts**:

### OpenAPI — Commands (Intent)
Location: