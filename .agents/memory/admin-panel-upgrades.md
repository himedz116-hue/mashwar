---
name: Admin Panel Upgrades
description: Durable decisions and constraints for the Mashwar admin panel upgrade work.
---

# Admin Panel — Upgrade Decisions

## blockUser works for both users and drivers
The `/api/admin/users/block` endpoint accepts any account UUID — it is not restricted to "users" only. Pass `{ uuid: driver.uuid, status: "blocked" | "active" }` for drivers as well.

**Why:** Drivers and users share the same account model on the backend; there is no separate driver-block endpoint.

**How to apply:** Whenever blocking any account (user or driver), use `blockUser({ uuid, status })`.

## `_online` filter key convention
In DriversManagement, stats cards use canonical API filter keys (`accepted`, `pending`, `rejected`, `all`), but "online" drivers are detected via `d.is_active` (a boolean flag) not a `status` string. The special key `_online` is used as a sentinel in local filter state that maps to `d.is_active === true`.

**Why:** The API `status` field does not have an "online" value; presence is tracked by `is_active`.

**How to apply:** When filtering by `_online`, use `d.is_active` not `d.status === "_online"`.

## App store links & contact info are localStorage-only
There is no backend endpoint for storing Android/iOS store links or contact info. These are persisted to `localStorage` with keys `meshwar_app_links` and `meshwar_contact`. Parse with try/catch + spread defaults to protect against malformed values.

**Why:** API has no settings endpoint for these fields as of this upgrade.

**How to apply:** Always wrap `JSON.parse(localStorage.getItem(...))` in try/catch and spread over safe defaults.

## Privacy policy stored embedded in terms
The API has only one text field for legal content (`/api/admin/edit_terms` → `terms`). Privacy policy is stored by embedding it after a `\n---PRIVACY---\n` separator in the same field, then split on read.

**Why:** No separate privacy policy endpoint exists; this avoids adding a new API call.

**How to apply:** When reading terms, split on `\n---PRIVACY---\n` to extract both. When saving either, reconstruct and write the combined string.
