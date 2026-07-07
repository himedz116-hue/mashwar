---
name: Meshwar API client
description: Real backend integration details for meshwarsv2.meshwars.net admin API
---

## Rule
All admin API calls go through `artifacts/mashwar/src/lib/meshwarApi.ts`. Use the shared `request()` helper for JSON endpoints and `multipartRequest()` for file uploads — never raw `fetch()` with `.then(r => r.json())` without checking `r.ok`.

**Why:** Bypassing the helpers means non-2xx responses appear as success, causing silent data corruption in UI flows.

## How to apply
- JSON endpoints: `request<T>(path, options)` — auto-attaches Bearer token, throws `ApiError` on non-2xx
- File uploads: `multipartRequest(path, formData)` — same error contract, no Content-Type header (browser sets it for FormData)
- API base: `VITE_MESHWAR_API_URL` env var, defaults to `https://meshwarsv2.meshwars.net`
- Token storage: `localStorage` key `meshwar_admin_token` (use `getAdminToken`/`setAdminToken`/`clearAdminToken`)
