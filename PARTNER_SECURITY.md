# CMX A2UI Partner Security Guidelines

This document defines **mandatory security requirements** for any external partner
integrating with **CMX (Maintenance)** using the **A2UI Runtime Bundle**.

This document complements:
- `PARTNER_README.md`
- `PARTNER_CONFORMANCE_CHECKLIST.md`

Compliance is required for **production access**.

---

## 1. Trust Model

### CMX Responsibilities
- Defines all UI structure via A2UI
- Enforces authorization and business rules
- Executes all side‑effecting actions
- Owns system of record

### Partner Responsibilities
- Renders UI **only as described**
- Executes actions **only via CMX APIs**
- Never generates or mutates UI structure
- Treats all A2UI payloads as **untrusted data**

---

## 2. Runtime Bundle Integrity

✅ Partners must consume the runtime bundle **as‑published**:
