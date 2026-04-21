# CMX UI Contract

The CMX UI is a **state-driven execution surface** built on top of CMX commands and events.

---

## Contract Rules

### UI Reads
- Derived state from event projections
- Materialized views built from AsyncAPI streams

### UI Writes
- OpenAPI commands only
- All writes are asynchronous

### UI Never
- Mutates Systems of Record
- Polls REST for completion
- Infers state from HTTP status codes

---

## Parity Requirement

All UI state rendered by CMX **must be reconstructible by a third-party system**
using only:
- OpenAPI
- AsyncAPI
