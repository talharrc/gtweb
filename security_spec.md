# Security Specification & "Dirty Dozen" Hardening

This document outlines the security architecture constraints and the adversarial "Dirty Dozen" payloads designed to test our attribute-based access control (ABAC) rules.

## 1. Data Invariants

1. **Role Access Boundaries**: 
   - `visitor`: Can read self user profile, read blog/contents (if any), and register profile. Can NOT read/write any project, document, action-center-item, or administrative profile.
   - `client`: Can read/write self user profile. Can read project details if they are the designated partner (`clientEmail` matching request email). Can view and download associated documents and updates. Can write to `actions` (form response updates in the Action Center).
   - `builder`: Can read/write self user profile. Can view projects assigned to them. Can create/update updates for their assigned projects. Can view documents.
   - `admin`: Full unrestricted read/write access over all collections, including user profiles, projects, updates, actions, documents, and invitations.
2. **Invitation One-Shot Validation**:
   - Invitation documents map a token (document ID) to a specific email and role. When validated, it is flagged as `used = true`. Standard clients or builders can NOT create or update invitations—this is an admin-only capability.
3. **Identity Spoofing Block**:
   - Regular users cannot set `role: "admin"` on registration. Registering an admin role requires providing a verified admin passcode `'gtgonnarock'` or being the bootstrapped initial admin (`mail.galaxatech@gmail.com`).
4. **Temporal Consistency**:
   - `createdAt` is immutable. `updatedAt` (if present) must match the physical server timestamp `request.time`.

---

## 2. The "Dirty Dozen" Attack Payloads

### Payload A: Admin Privilege Escalation (Self-Assigned Admin Role)
- **Path**: `/users/attacker123`
- **Method**: `create` (Self-registration)
- **Payload**: `{ "uid": "attacker123", "email": "attacker@gmail.com", "role": "admin" }`
- **Rule Response**: `PERMISSION_DENIED` - Attempting to register as `'admin'` without providing the valid admin credential/passcode block.

### Payload B: Project Information Scraping (Client Bypassing Ownership)
- **Path**: `/projects/secretProject456`
- **Method**: `get`/`list` (Querying from user of client role)
- **Actor Email**: `otherclient@gmail.com`
- **Project Client Email**: `payingpartner@gmail.com`
- **Rule Response**: `PERMISSION_DENIED` - Client email does not match project partner email.

### Payload C: Self-Invitation Generation (Bypassing Admin Verification)
- **Path**: `/invitations/attackerToken789`
- **Method**: `create`
- **Payload**: `{ "id": "attackerToken789", "email": "attacker@gmail.com", "role": "client", "used": false, "createdAt": "2026-06-04T00:00:00Z" }`
- **Rule Response**: `PERMISSION_DENIED` - Creating invitations is restricted to admin-authenticated sessions.

### Payload D: Orphaned Project Update (Builder Injecting Logs to Other Projects)
- **Path**: `/projects/partnerProject999/updates/fakeUpdate001`
- **Method**: `create`
- **Actor UID**: `builderUID_333`
- **Project Assigned Builder**: `builderUID_777`
- **Payload**: `{ "id": "fakeUpdate001", "date": "2026-06-04", "summary": "Hacked log entry", "createdAt": "request.time" }`
- **Rule Response**: `PERMISSION_DENIED` - Builder is not the assigned developer for this project resource.

### Payload E: State Transition Theft (Visitor Spoofing Client Status)
- **Path**: `/projects/secretProject456`
- **Method**: `update`
- **Actor Role**: `visitor`
- **Payload**: `{ "state": "Completed" }`
- **Rule Response**: `PERMISSION_DENIED` - Visitors do not possess edit permissions on project resources.

### Payload F: Client Mutating Core Project Budget (Resource Value Poisoning)
- **Path**: `/projects/partnerProject999`
- **Method**: `update`
- **Actor Role**: `client`
- **Payload**: `{ "projectValue": 0 }`
- **Rule Response**: `PERMISSION_DENIED` - Budget and finances are protected system fields immutable to clients.

### Payload G: Shadow Field Registration (Injecting unvalidated properties on Profile)
- **Path**: `/users/attacker123`
- **Method**: `create`
- **Payload**: `{ "uid": "attacker123", "email": "attacker@gmail.com", "role": "visitor", "createdAt": "2026-06-04T01:00:00Z", "ghostProperty": "shadow_exploit" }`
- **Rule Response**: `PERMISSION_DENIED` - Keys must match exactly defined fields on registration.

### Payload H: Time Spoofing (Forged Registration Timestamps)
- **Path**: `/users/attacker123`
- **Method**: `create`
- **Payload**: `{ "uid": "attacker123", "email": "attacker@gmail.com", "role": "visitor", "createdAt": "2025-01-01T00:00:00Z" }`
- **Rule Response**: `PERMISSION_DENIED` - `createdAt` must match exact server-assigned `request.time`.

### Payload I: Document Deletion (Client sabotaging invoice files)
- **Path**: `/projects/partnerProject999/documents/invoice_123`
- **Method**: `delete`
- **Actor Role**: `client`
- **Rule Response**: `PERMISSION_DENIED` - Document deletion is strictly locked to admin nodes.

### Payload J: Action Item Injection (Direct Client Forgery of SOW requests)
- **Path**: `/projects/partnerProject999/actions/fakeAction001`
- **Method**: `create`
- **Actor Role**: `client`
- **Payload**: `{ "id": "fakeAction001", "title": "Free logo visual updates", "type": "form", "status": "pending", "createdAt": "request.time" }`
- **Rule Response**: `PERMISSION_DENIED` - Clients can only edit feedback fields (`responseContent`) inside assigned items, but cannot invent new action requirements.

### Payload K: Admin Role Modification (Privilege Hijack on Existing User Profile)
- **Path**: `/users/victimUser456`
- **Method**: `update`
- **Actor Role**: `client`
- **Payload**: `{ "role": "admin" }`
- **Rule Response**: `PERMISSION_DENIED` - RBAC user role field is immutable to non-admin roles during user profiles modification.

### Payload L: PII Blanket Read (Malicious Visitor listing other user details)
- **Path**: `/users`
- **Method**: `list`
- **Actor Role**: `visitor`
- **Rule Response**: `PERMISSION_DENIED` - Blanket reading user PII records is limited exclusively to admin profiles or self lookup constraints.

---

## 3. Test Runner Mock Definition

The security tests are represented by testing the access boundaries against physical role lookups. The tests simulate these 12 operations using credentials matched synchronously via Firestore assertions:

```typescript
import { assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
// Simulated execution runs verify:
// - Creating admin profile fails for visitor credentials -> assertFails;
// - Reading other client projects fails for unauthorized client -> assertFails;
// - Updating assigned tasks succeeds for valid assigned builder -> assertSucceeds;
```
