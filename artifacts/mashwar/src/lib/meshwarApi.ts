// Central API client for Meshwar backend
// Use HTTPS by default; override with VITE_MESHWAR_API_URL if needed
const API_BASE = (import.meta.env.VITE_MESHWAR_API_URL as string | undefined)
  ?? "https://meshwarsv2.meshwars.net";

export const getAdminToken = () => localStorage.getItem("meshwar_admin_token") ?? "";
export const setAdminToken = (t: string) => localStorage.setItem("meshwar_admin_token", t);
export const clearAdminToken = () => localStorage.removeItem("meshwar_admin_token");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(json?.message ?? `خطأ ${res.status}`, res.status);
  }
  return json as T;
}

// ── Auth ──────────────────────────────────────────────────
export const adminLogin = (data: { phone?: string; email?: string; password: string }) =>
  request<{ token: string; data?: unknown }>("/api/admin/login", {
    method: "POST", body: JSON.stringify(data),
  });

export const adminLogout = () =>
  request("/api/admin/logout", { method: "POST" });

// ── Profile ───────────────────────────────────────────────
export const getAdminProfile = () =>
  request<{ data: AdminProfile }>("/api/admin/profile");

export const editAdminProfile = (data: Partial<AdminProfile>) =>
  request("/api/admin/edit_profile", { method: "POST", body: JSON.stringify(data) });

export const changeAdminPassword = (data: { old_password: string; password: string; password_confirmation: string }) =>
  request("/api/admin/change_password", { method: "POST", body: JSON.stringify(data) });

// ── Settings ──────────────────────────────────────────────
export const getTerms = () => request<{ data: { terms: string } }>("/api/admin/term");
export const editTerms = (terms: string) =>
  request("/api/admin/edit_terms", { method: "PUT", body: JSON.stringify({ terms }) });

export const getMaxDistance = () =>
  request<{ data: { max_distance: number } }>("/api/admin/setting/max-distance-cars");
export const updateMaxDistance = (max_distance: number) =>
  request("/api/admin/setting/max-distance-cars", {
    method: "PUT", body: JSON.stringify({ max_distance }),
  });

// ── Cities ────────────────────────────────────────────────
export const getCities = () => request<{ data: City[] }>("/api/cities");
export const addCity = (data: { name: string; name_en?: string }) =>
  request("/api/admin/cities/store", { method: "POST", body: JSON.stringify(data) });
export const editCity = (data: City) =>
  request("/api/admin/cities/update", { method: "PUT", body: JSON.stringify(data) });
export const deleteCity = (uuid: string) =>
  request(`/api/admin/cities/destroy?uuid=${uuid}`, { method: "DELETE" });

// ── Drivers ───────────────────────────────────────────────
export const getDrivers = (params = "") =>
  request<{ data: Driver[] }>(`/api/admin/drivers${params ? `?${params}` : ""}`);
export const showDriver = (uuid: string) =>
  request<{ data: Driver }>(`/api/admin/drivers/show?uuid=${uuid}`);
export const acceptDriver = (data: { uuid: string; status: "accepted" | "rejected"; reason?: string }) =>
  request("/api/admin/drivers/accept", { method: "POST", body: JSON.stringify(data) });
export const sendDriverNotification = (data: { title: string; body: string; uuid?: string }) =>
  request("/api/admin/drivers/send_notification", { method: "POST", body: JSON.stringify(data) });

// ── Car Types ─────────────────────────────────────────────
export const getCarTypes = () => request<{ data: CarType[] }>("/api/admin/car_types");
export const addCarType = (data: Partial<CarType>) =>
  request("/api/admin/car_types/store", { method: "POST", body: JSON.stringify(data) });
export const editCarType = (data: Partial<CarType>) =>
  request("/api/admin/car_types/update", { method: "PUT", body: JSON.stringify(data) });
export const deleteCarType = (uuid: string) =>
  request(`/api/admin/car_types/destroy?uuid=${uuid}`, { method: "DELETE" });

// ── Introductions ─────────────────────────────────────────
export const getIntroductions = (type?: number) =>
  request<{ data: Introduction[] }>(`/api/introductions${type != null ? `?type=${type}` : ""}`);
async function multipartRequest(path: string, body: FormData): Promise<unknown> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAdminToken()}`, Accept: "application/json" },
    body,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(json?.message ?? `خطأ ${res.status}`, res.status);
  return json;
}

export const addIntroduction = (data: FormData) =>
  multipartRequest("/api/admin/introductions/store", data);
export const editIntroduction = (data: FormData) =>
  multipartRequest("/api/admin/introductions/update", data);
export const deleteIntroduction = (uuid: string) =>
  request(`/api/admin/introductions/destroy?uuid=${uuid}`, { method: "DELETE" });

// ── Cars ──────────────────────────────────────────────────
export const getCars = () => request<{ data: Car[] }>("/api/admin/cars");
export const showCar = (uuid: string) =>
  request<{ data: Car }>(`/api/admin/cars/show?uuid=${uuid}`);
export const addCar = (data: Partial<Car>) =>
  request("/api/admin/cars/store", { method: "POST", body: JSON.stringify(data) });
export const editCar = (data: Partial<Car>) =>
  request("/api/admin/cars/edit", { method: "POST", body: JSON.stringify(data) });
export const deleteCar = (uuid: string) =>
  request("/api/admin/cars/destroy", { method: "DELETE", body: JSON.stringify({ uuid }) });

// ── Orders ────────────────────────────────────────────────
// type: 1=pending, 2=active, 3=completed, 4=cancelled
export const getOrders = (type?: number) =>
  request<{ data: Order[] }>(`/api/admin/orders${type != null ? `?type=${type}` : ""}`);
export const showOrder = (uuid: string) =>
  request<{ data: Order }>(`/api/admin/orders/show?uuid=${uuid}`);
export const driverPayment = (data: { uuid: string; amount: number }) =>
  request("/api/admin/orders/payment", { method: "POST", body: JSON.stringify(data) });

// ── Balance ───────────────────────────────────────────────
export const getBalance = () =>
  request<{ data: BalanceData }>("/api/admin/balance");

// ── Messages ──────────────────────────────────────────────
export const getMessageUsers = (type: "user" | "driver" = "user", name = "") =>
  request<{ data: MsgUser[] }>(`/api/admin/messages/users?type=${type}${name ? `&name=${name}` : ""}`);
export const getMessages = (user_uuid: string) =>
  request<{ data: Message[] }>(`/api/admin/messages?user_uuid=${user_uuid}`);
export const sendMessage = (data: { user_uuid: string; message: string }) =>
  request("/api/admin/messages/send", { method: "POST", body: JSON.stringify(data) });

// ── Types ─────────────────────────────────────────────────
export interface AdminProfile {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}
export interface City {
  uuid: string;
  name: string;
  name_en?: string;
  created_at?: string;
}
export interface Driver {
  uuid: string;
  name: string;
  phone: string;
  email?: string;
  status?: string;
  is_verified?: boolean;
  is_active?: boolean;
  rating?: number;
  trips_count?: number;
  balance?: number;
  avatar?: string;
  created_at?: string;
  city?: City;
  car?: Car;
  national_id?: string;
  driving_license?: string;
  car_license?: string;
}
export interface CarType {
  uuid: string;
  name: string;
  name_en?: string;
  icon?: string;
  base_price?: number;
  price_per_km?: number;
  min_price?: number;
  max_weight?: number;
  description?: string;
  created_at?: string;
}
export interface Introduction {
  uuid: string;
  title: string;
  description?: string;
  image?: string;
  type?: number;
  sort?: number;
}
export interface Car {
  uuid: string;
  name: string;
  plate_number?: string;
  model?: string;
  year?: number;
  color?: string;
  driver?: Driver;
  car_type?: CarType;
  created_at?: string;
}
export interface Order {
  uuid: string;
  status?: string;
  type?: number;
  price?: number;
  distance?: number;
  from_address?: string;
  to_address?: string;
  user?: { name: string; phone: string };
  driver?: { name: string; phone: string };
  car_type?: CarType;
  created_at?: string;
  payment_method?: string;
  note?: string;
}
export interface BalanceData {
  total_revenue?: number;
  total_drivers_balance?: number;
  total_orders?: number;
  pending_payments?: number;
  drivers?: Array<{ uuid: string; name: string; balance: number; phone: string }>;
}
export interface MsgUser {
  uuid: string;
  name: string;
  phone: string;
  avatar?: string;
  last_message?: string;
  unread_count?: number;
}
export interface Message {
  uuid: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}
