---
name: Admin panel comprehensive upgrades
description: What was upgraded in the admin panel, which files use real API vs mock data, and multipart upload patterns.
---

# Admin Panel Comprehensive Upgrades

## Real API sections (all connected to meshwarsv2.meshwars.net)
- Overview.tsx — getBalance, getDrivers, getOrders
- UsersSection.tsx — getMessageUsers + getDrivers (dual real API)
- DriversManagement.tsx — getDrivers, showDriver, acceptDriver, sendDriverNotification
- DriversKYC.tsx — getDrivers, acceptDriver
- OrdersManagement.tsx — getOrders, showOrder, driverPayment
- FinancialManagement.tsx — getBalance + driverPayment (Admin.tsx uses this, NOT FinanceBalance)
- CarTypesManagement.tsx — getCarTypes + addCarType/editCarType with multipart icon upload
- CarsManagement.tsx — getCars, addCar, editCar, deleteCar
- CitiesManagement.tsx — getCities, addCity, editCity, deleteCity
- IntroductionsManagement.tsx — getIntroductions + multipart image upload (custom fetch, HTTPS)
- MessagesCenter.tsx — getMessageUsers, getMessages, sendMessage
- NotificationsCenter.tsx — sendDriverNotification, getDrivers
- AppSettings.tsx — getTerms, editTerms, getMaxDistance, updateMaxDistance
- AdminProfile.tsx — getAdminProfile, editAdminProfileWithAvatar (multipart), changeAdminPassword

## Mock/local-state sections (no backend API for these yet)
- Marketing.tsx — promo codes are local state only (no API endpoint)
- Support.tsx — tickets/reviews are local state only (no API endpoint)

## Multipart upload pattern
- meshwarApi.ts has `multipartRequest(path, FormData)` helper (POST only)
- For PUT endpoints: append `_method: PUT` to FormData (Laravel convention)
- Car type icon: supports both file upload and URL string via `iconFile` field on CarType
- Admin avatar: `editAdminProfileWithAvatar({ ...form, avatarFile: File })` 
- Introductions: custom fetch in IntroductionsManagement.tsx (uses API_BASE env var → HTTPS)

## Admin.tsx import note
- Uses `FinancialManagement` (not `FinanceBalance`) for the "finance" nav item after upgrade
- FinanceBalance.tsx still exists but is no longer in the nav

**Why:** FinancialManagement was rewritten to use real API + charts + driver payout modal.
**How to apply:** If adding new finance features, edit FinancialManagement.tsx not FinanceBalance.tsx.
