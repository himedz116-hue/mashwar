---
name: Admin panel structure
description: 16-section admin dashboard layout and section-to-file mapping
---

## Rule
The admin panel (`artifacts/mashwar/src/pages/Admin.tsx`) uses grouped sidebar navigation with 16 sections across 6 groups. Login now calls the real API (`POST /api/admin/login`) instead of a hardcoded password.

**Why:** Previous implementation used `sessionStorage` + hardcoded `"mashwar2024"` — bypassable in devtools.

## Section files (artifacts/mashwar/src/pages/admin/)
- Overview.tsx — dashboard KPIs + charts (Supabase page_views + mock data)
- UsersSection.tsx — user/driver list via messages API
- DriversManagement.tsx — full drivers list with detail modal
- DriversKYC.tsx — pending verification queue + accept/reject
- OrdersManagement.tsx — tabbed orders by status, detail modal + payment
- FinanceBalance.tsx — balance overview + driver payments
- CarTypesManagement.tsx — CRUD car types with pricing
- CarsManagement.tsx — CRUD cars
- CitiesManagement.tsx — CRUD cities
- IntroductionsManagement.tsx — CRUD intro slides with image upload
- MessagesCenter.tsx — full chat UI (select user → conversation)
- NotificationsCenter.tsx — send push notifications (all or by UUID)
- AppSettings.tsx — terms & max-distance settings
- AdminProfile.tsx — profile edit + password change
- Support.tsx — existing component (kept)
- Marketing.tsx — existing component (kept)
