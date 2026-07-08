// Central API client for Meshwar backend
// Use HTTPS by default; override with VITE_MESHWAR_API_URL if needed
export const API_BASE = (import.meta.env.VITE_MESHWAR_API_URL as string | undefined)
  ?? "https://meshwarsv2.meshwars.net";

export const getImageUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

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

// ── Auth ──────────────────────────────────────────────────
export const adminLogin = (data: { email: string; password: string }) =>
  request<{ data: { token: string } }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      fcm_token: "web-admin-token",
      device: "android",
    }),
  });

export const adminLogout = () =>
  request("/api/admin/logout", { method: "POST" });

// ── Profile ───────────────────────────────────────────────
export const getAdminProfile = () =>
  request<{ data: AdminProfile }>("/api/admin/profile");

export const editAdminProfile = (data: Partial<AdminProfile>) =>
  request("/api/admin/edit_profile", { method: "POST", body: JSON.stringify(data) });

export const editAdminProfileWithAvatar = (data: Partial<AdminProfile> & { avatarFile?: File }) => {
  if (!data.avatarFile) return editAdminProfile(data);
  const fd = new FormData();
  if (data.name) fd.append("name", data.name);
  if (data.email) fd.append("email", data.email);
  if (data.phone) fd.append("phone", data.phone);
  fd.append("avatar", data.avatarFile);
  return multipartRequest("/api/admin/edit_profile", fd);
};

export const changeAdminPassword = (data: { old_password: string; password: string; password_confirmation: string }) =>
  request("/api/admin/change_password", { method: "POST", body: JSON.stringify(data) });

// ── Settings ──────────────────────────────────────────────
export const getTerms = () =>
  request<{ data: { description: string } }>("/api/admin/term");
export const editTerms = (description: string) =>
  request("/api/admin/edit_terms", { method: "PUT", body: JSON.stringify({ description }) });

export const getMaxDistance = () =>
  request<{ data: { inside_max_km: number | string } }>("/api/admin/setting/max-distance-cars");
export const updateMaxDistance = (inside_max_km: number) =>
  request("/api/admin/setting/max-distance-cars", {
    method: "PUT", body: JSON.stringify({ inside_max_km }),
  });

// ── Cities ────────────────────────────────────────────────
export const getCities = () => request<{ data: City[] }>("/api/cities");
export const addCity = (data: { name: string; name_en?: string }) =>
  request("/api/admin/cities/store", { method: "POST", body: JSON.stringify(data) });
export const editCity = (data: City) =>
  request("/api/admin/cities/update", { method: "PUT", body: JSON.stringify(data) });
export const deleteCity = (uuid: string) =>
  request(`/api/admin/cities/destroy?uuid=${uuid}`, { method: "DELETE" });

// ── Users ─────────────────────────────────────────────────
export const getUsers = async (params = "") => {
  const res = await request<{ data: User[] }>(`/api/admin/users${params ? `?${params}` : ""}`);
  res.data = (res.data || []).map(u => ({
    ...u,
    avatar: u.image || u.avatar,
    phone: u.mobile_without_prefix || u.mobile || u.phone
  }));
  return res;
};
export const blockUser = (data: { uuid: string; status: "active" | "blocked" }) =>
  request("/api/admin/users/block", { method: "POST", body: JSON.stringify(data) });
export const deleteUser = (uuid: string) =>
  request(`/api/admin/users/destroy?uuid=${uuid}`, { method: "DELETE" });

// ── Drivers ───────────────────────────────────────────────
export const getDrivers = async (params = "") => {
  const res = await request<{ data: Driver[] }>(`/api/admin/drivers${params ? `?${params}` : ""}`);
  res.data = (res.data || []).map(d => ({
    ...d,
    avatar: d.image || d.avatar,
    phone: d.mobile_without_prefix || d.mobile || d.phone,
    dob: d.date_of_birth || d.dob,
    national_id: d.identity_image1 || d.national_id,
    driving_license: d.license_image1 || d.driving_license,
    car_license: d.license_image2 || d.car_license,
    face_image: d.image || d.face_image,
    truck_type: d.car_name || d.truck_type
  }));
  return res;
};
export const showDriver = async (uuid: string) => {
  const res = await request<{ data: Driver }>(`/api/admin/drivers/show?uuid=${uuid}`);
  if (res.data) {
    const d = res.data;
    res.data = {
      ...d,
      avatar: d.image || d.avatar,
      phone: d.mobile_without_prefix || d.mobile || d.phone,
      dob: d.date_of_birth || d.dob,
      national_id: d.identity_image1 || d.national_id,
      driving_license: d.license_image1 || d.driving_license,
      car_license: d.license_image2 || d.car_license,
      face_image: d.image || d.face_image,
      truck_type: d.car_name || d.truck_type
    };
  }
  return res;
};
export const acceptDriver = (data: { uuid: string; status: "accepted" | "rejected"; reason?: string }) =>
  request("/api/admin/drivers/accept", { method: "POST", body: JSON.stringify(data) });
export const sendDriverNotification = (data: { title: string; body: string; uuid?: string }) =>
  request("/api/admin/drivers/send_notification", { method: "POST", body: JSON.stringify(data) });

// ── Car Types ─────────────────────────────────────────────
export const getCarTypes = () => request<{ data: CarType[] }>("/api/admin/car_types");

export const addCarType = (data: Partial<CarType> & { iconFile?: File }) => {
  if (!data.iconFile) {
    const { iconFile: _, ...rest } = data;
    return request("/api/admin/car_types/store", { method: "POST", body: JSON.stringify(rest) });
  }
  const fd = new FormData();
  if (data.name) fd.append("name", data.name);
  if (data.name_en) fd.append("name_en", data.name_en);
  if (data.base_price != null) fd.append("base_price", String(data.base_price));
  if (data.price_per_km != null) fd.append("price_per_km", String(data.price_per_km));
  if (data.min_price != null) fd.append("min_price", String(data.min_price));
  if (data.max_weight != null) fd.append("max_weight", String(data.max_weight));
  if (data.description) fd.append("description", data.description);
  fd.append("icon", data.iconFile);
  return multipartRequest("/api/admin/car_types/store", fd);
};

export const editCarType = (data: Partial<CarType> & { iconFile?: File }) => {
  if (!data.iconFile) {
    const { iconFile: _, ...rest } = data;
    return request("/api/admin/car_types/update", { method: "PUT", body: JSON.stringify(rest) });
  }
  const fd = new FormData();
  if (data.uuid) fd.append("uuid", data.uuid);
  if (data.name) fd.append("name", data.name);
  if (data.name_en) fd.append("name_en", data.name_en);
  if (data.base_price != null) fd.append("base_price", String(data.base_price));
  if (data.price_per_km != null) fd.append("price_per_km", String(data.price_per_km));
  if (data.min_price != null) fd.append("min_price", String(data.min_price));
  if (data.max_weight != null) fd.append("max_weight", String(data.max_weight));
  if (data.description) fd.append("description", data.description);
  fd.append("icon", data.iconFile);
  fd.append("_method", "PUT");
  return multipartRequest("/api/admin/car_types/update", fd);
};

export const deleteCarType = (uuid: string) =>
  request(`/api/admin/car_types/destroy?uuid=${uuid}`, { method: "DELETE" });

// ── Introductions ─────────────────────────────────────────
export const getIntroductions = (type?: number) =>
  request<{ data: Introduction[] }>(`/api/introductions${type != null ? `?type=${type}` : ""}`);

export const addIntroduction = (data: FormData) =>
  multipartRequest("/api/admin/introductions/store", data);
export const editIntroduction = (data: FormData) =>
  multipartRequest("/api/admin/introductions/update", data);
export const deleteIntroduction = (uuid: string) =>
  request(`/api/admin/introductions/destroy?uuid=${uuid}`, { method: "DELETE" });

// ── Helpers ───────────────────────────────────────────────
function resolvePlaceType(val: unknown): "inside" | "outside" {
  if (val === "outside" || val === 2 || val === "2") return "outside";
  return "inside";
}

function resolveCarTypeUuid(rule: Record<string, unknown>): string {
  // Try common field names for the car-type UUID
  return (
    (rule.car_type_uuid as string) ||
    ((rule.car_type as Record<string, unknown>)?.uuid as string) ||
    (rule.type_uuid as string) ||
    (rule.carTypeUuid as string) ||
    ""
  );
}

function normalizeCarPrices(data: Record<string, unknown>): CarPrices {
  // Try every possible key name the API might use
  const cp =
    data.carPrices ??
    data.car_prices ??
    data.prices ??
    data.car_type_prices ??
    null;

  if (!cp) return { inside: [], outside: [] };

  // Already grouped: { inside: [...], outside: [...] }
  if (!Array.isArray(cp) && typeof cp === "object" && cp !== null) {
    const grouped = cp as Record<string, unknown>;
    if (grouped.inside != null || grouped.outside != null) {
      return {
        inside: (grouped.inside as CarPrices["inside"]) || [],
        outside: (grouped.outside as CarPrices["outside"]) || [],
      };
    }
  }

  // Flat array — group by place_type then car_type_uuid
  const flat: Record<string, unknown>[] = Array.isArray(cp) ? cp : [];

  const result: CarPrices = { inside: [], outside: [] };
  for (const rule of flat) {
    const pt = resolvePlaceType(rule.place_type);
    const typeUuid = resolveCarTypeUuid(rule);
    if (!typeUuid) continue; // skip unparseable rules

    let group = result[pt].find((g) => g.car_type_uuid === typeUuid);
    if (!group) {
      group = { car_type_uuid: typeUuid, prices: [] };
      result[pt].push(group);
    }
    group.prices.push(rule as unknown as CarPriceRule);
  }
  return result;
}

// ── Cars ──────────────────────────────────────────────────
export const getCars = async () => {
  return request<{ data: Car[] }>("/api/admin/cars");
};
export const showCar = async (uuid: string) => {
  const raw = await request<{ data: Record<string, unknown> }>(`/api/admin/cars/show?uuid=${uuid}`);
  const carPrices = normalizeCarPrices(raw.data ?? {});
  return {
    ...raw,
    data: { ...(raw.data as unknown as Car), carPrices },
  } as { data: Car };
};
export const addCar = (data: FormData) =>
  multipartRequest("/api/admin/cars/store", data);
export const editCar = (data: FormData) => {
  data.set("_method", "PUT");
  return multipartRequest("/api/admin/cars/edit", data);
};
export const deleteCar = (uuid: string) =>
  request("/api/admin/cars/destroy", { method: "DELETE", body: JSON.stringify({ uuid }) });

// ── Orders ────────────────────────────────────────────────
export const getOrders = (params?: { type?: number; driver_uuid?: string; user_uuid?: string }) => {
  const query = new URLSearchParams();
  if (params?.type) query.append("type", params.type.toString());
  if (params?.driver_uuid) query.append("driver_uuid", params.driver_uuid);
  if (params?.user_uuid) query.append("user_uuid", params.user_uuid);
  const q = query.toString();
  return request<{ data: Order[] }>(`/api/admin/orders${q ? `?${q}` : ""}`);
};
export const showOrder = (uuid: string) =>
  request<{ data: Order }>(`/api/admin/orders/show?uuid=${uuid}`);
export const driverPayment = (data: { uuid: string; amount: number }) =>
  request("/api/admin/orders/payment", { method: "POST", body: JSON.stringify(data) });

// ── Balance ───────────────────────────────────────────────
export const getBalance = () =>
  request<{ data: BalanceData }>("/api/admin/balance");

// ── Messages ──────────────────────────────────────────────
export const getMessageUsers = async (type: "user" | "driver" = "user", name = "") => {
  const res = await request<{ data: MsgUser[] }>(`/api/admin/messages/users?type=${type}${name ? `&name=${name}` : ""}`);
  res.data = (res.data || []).map(u => ({
    ...u,
    avatar: u.image || u.avatar,
    phone: u.mobile_without_prefix || u.mobile || (u as any).phone
  }));
  return res;
};
export const getMessages = async (user_uuid: string) => {
  const res = await request<{ data: any[] }>(`/api/admin/messages?user_uuid=${user_uuid}`);
  res.data = (res.data || []).map((m: any, i: number) => {
    if (m.content_type === 'date') {
      return {
        uuid: `date-${m.created_at}-${i}`,
        message: m.created_at,
        is_admin: false,
        created_at: m.created_at,
        content_type: 'date'
      };
    }
    return {
      uuid: m.uuid,
      message: m.content,
      is_admin: m.from_me,
      created_at: m.created_time || m.created_at,
      content_type: m.content_type
    };
  });
  return res as unknown as { data: import('./meshwarApi').Message[] };
};
export const sendMessage = (data: { user_uuid: string; message: string; type?: string }) =>
  request("/api/admin/messages/send", { method: "POST", body: JSON.stringify({ user_uuid: data.user_uuid, body: data.message, msg_type: data.type || "text" }) });

// ── Types ─────────────────────────────────────────────────
export interface AdminProfile {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  image?: string;
}
export interface City {
  uuid: string;
  name: string;
  name_en?: string;
  created_at?: string;
}
export interface User {
  uuid: string;
  name: string;
  phone: string;
  mobile?: string;
  mobile_without_prefix?: string;
  email?: string;
  status?: string;
  avatar?: string;
  image?: string;
  trips_count?: number;
  rating?: number;
  created_at?: string;
  device?: string;
  os_version?: string;
}
export interface Driver {
  uuid: string;
  name: string;
  phone: string;
  mobile?: string;
  mobile_without_prefix?: string;
  email?: string;
  status?: string;
  is_verified?: boolean;
  is_accepted?: boolean;
  is_active?: boolean;
  rating?: number;
  trips_count?: number;
  balance?: number;
  avatar?: string;
  image?: string;
  created_at?: string;
  city?: City;
  car?: Car;
  national_id?: string;
  driving_license?: string;
  car_license?: string;
  identity_image1?: string;
  identity_image2?: string;
  license_image1?: string;
  license_image2?: string;
  face_image?: string;
  dob?: string;
  date_of_birth?: string;
  age?: number;
  device?: string;
  os_version?: string;
  truck_type?: string;
  car_name?: string;
}
export interface CarType {
  uuid: string;
  name: string;
  name_en?: string;
  icon?: string;
  iconFile?: File;
  iconPreview?: string;
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
export interface CarPriceRule {
  id?: number;
  uuid?: string;
  car_uuid?: string;
  car_type_uuid: string;
  place_type: "inside" | "outside";
  distance_scale: "bigger" | "less_or_equal" | string;
  max_distance: string | number;
  name?: string;
  price: string | number;
  commission: string | number;
}
export interface CarPrices {
  inside: { car_type_uuid: string; prices: CarPriceRule[] }[];
  outside: { car_type_uuid: string; prices: CarPriceRule[] }[];
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
  image?: string;
  is_active?: boolean;
  carPrices?: CarPrices;
}
export interface Order {
  uuid: string;
  status?: string;
  type?: number;
  price?: number;
  distance?: number;
  from_address?: string;
  to_address?: string;
  user?: User;
  driver?: Driver;
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
  image?: string;
  last_message?: string;
  unread_count?: number;
}
export interface Message {
  uuid: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  content_type?: string;
}
