import { Router, type Request as ExpressRequest, type Response as ExpressResponse } from "express";

const router = Router();

// ── Saudi plate parser ────────────────────────────────────────────────────────
// Saudi plates are "أ ب ج 1234" (3 Arabic letters + up to 4 digits).
// We also accept the Latin equivalent ("ABC 1234") and mixed forms.
interface ParsedPlate {
  letters: string;  // e.g. "أبج" or "ABC"
  numbers: string;  // e.g. "1234"
  raw: string;
}

const ARABIC_TO_LATIN: Record<string, string> = {
  "أ": "A", "ب": "B", "ح": "J", "د": "D", "ر": "R", "س": "S",
  "ص": "X", "ط": "T", "ع": "E", "ق": "G", "ك": "K", "ل": "L",
  "م": "M", "ن": "N", "هـ": "H", "ه": "H", "و": "U", "ى": "V",
};

function parseSaudiPlate(raw: string): ParsedPlate | null {
  const clean = raw.replace(/[\s\-_]/g, "");
  // Extract Arabic letters
  const arabicLetters = clean.replace(/[^أ-ي]/g, "");
  // Extract digits
  const digits = clean.replace(/\D/g, "");
  // Extract Latin letters
  const latinLetters = clean.replace(/[^A-Za-z]/g, "").toUpperCase();

  const letters = arabicLetters || latinLetters;
  if (!letters || !digits) return null;
  return { letters, numbers: digits, raw };
}

// ── Elm Yakeen API ────────────────────────────────────────────────────────────
// Requires ELM_API_KEY secret (set via Replit Secrets).
// Endpoint: https://api.elm.sa/elm/id/yakeen4trafic/1.0.0/GetVehicleInfoByPlateInfo
// Docs: https://api.elm.sa/
async function queryElmYakeen(
  plate: ParsedPlate,
  apiKey: string,
  appId: string,
): Promise<Record<string, unknown> | null> {
  // Convert Arabic letters to their English plate equivalent for Elm API
  const latinLetters = plate.letters
    .split("")
    .map((c) => ARABIC_TO_LATIN[c] ?? c)
    .join("");

  const body = {
    plateText: latinLetters,
    plateNumber: parseInt(plate.numbers, 10),
    referenceNumber: `MASHWAR-${Date.now()}`,
  };

  try {
    const res: any = await fetch(
      "https://api.elm.sa/elm/id/yakeen4trafic/1.0.0/GetVehicleInfoByPlateInfo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "x-api-key": apiKey,
          "x-app-id": appId,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!res.ok) return null;

    const raw: unknown = await res.json().catch(() => null);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;

    const json = raw as Record<string, unknown>;

    // Normalise Elm response into a flat readable object
    const data = (json["vehicleInfo"] ?? json["data"] ?? json) as Record<string, unknown>;
    return {
      نوع_المركبة: data["vehicleMakerNameAr"] ?? data["makeNameAr"] ?? data["vehicleType"],
      الشركة_المصنّعة: data["vehicleMakerNameEn"] ?? data["makeNameEn"],
      الموديل: data["vehicleModelNameAr"] ?? data["modelNameAr"] ?? data["model"],
      سنة_الصنع: data["modelYear"] ?? data["year"],
      اللون: data["colorNameAr"] ?? data["color"],
      رقم_الهيكل: data["chassisNumber"] ?? data["vin"],
      حالة_الترخيص: data["licenseStatusAr"] ?? data["plateStatusAr"] ?? data["licenseStatus"],
      انتهاء_الترخيص: data["licenseExpiryDate"] ?? data["registrationExpiryDate"],
      نوع_الملكية: data["ownerTypeAr"] ?? data["ownerType"],
      رقم_اللوحة: `${plate.letters} ${plate.numbers}`,
    };
  } catch {
    return null;
  }
}

// ── MOI Traffic fallback ──────────────────────────────────────────────────────
async function queryMoi(cleanPlate: string): Promise<Record<string, unknown> | null> {
  try {
    const res: any = await fetch(
      `https://traffic.moi.gov.sa/wps/portal/traffic/services/inquiries/vehicleInquiry?plateNumber=${encodeURIComponent(cleanPlate)}`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; MashwarAdmin/1.0)",
        },
        signal: AbortSignal.timeout(8_000),
      },
    ).catch(() => null);

    if (!res?.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("json")) return null;

    const raw: unknown = await res.json().catch(() => null);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const json = raw as Record<string, unknown>;

    const payload = json["data"] ?? json["vehicle"] ?? json["result"] ?? json;
    if (!payload || typeof payload !== "object") return null;
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ── Route ─────────────────────────────────────────────────────────────────────
router.get("/plate-lookup", async (req: ExpressRequest, res: ExpressResponse) => {
  const plate = (req.query["plate"] as string | undefined)?.trim();
  if (!plate) {
    res.status(400).json({ success: false, message: "رقم اللوحة مطلوب" });
    return;
  }

  const cleanPlate = plate.replace(/[\s\-]/g, "");
  const parsed = parseSaudiPlate(plate);

  // Inquiry links always included as a fallback
  const inquiryLinks = [
    {
      label: "بوابة أبشر – استعلام المركبة",
      url: `https://absher.sa/wps/portal/individuals/static/inquiry/VehicleInquiry?plateNumber=${encodeURIComponent(cleanPlate)}`,
    },
    {
      label: "وزارة الداخلية – خدمات المرور",
      url: "https://www.moi.gov.sa/wps/portal/Home/govServices/Traffic",
    },
  ];

  try {
    // ── Attempt 1: Elm Yakeen (if API key configured) ──────────────────────
    const elmApiKey = process.env["ELM_API_KEY"];
    const elmAppId = process.env["ELM_APP_ID"] ?? "mashwar";

    if (elmApiKey && parsed) {
      const elmData = await queryElmYakeen(parsed, elmApiKey, elmAppId);
      if (elmData) {
        res.json({ success: true, source: "elm_yakeen", data: elmData });
        return;
      }
    }

    // ── Attempt 2: MOI Traffic ─────────────────────────────────────────────
    const moiData = await queryMoi(cleanPlate);
    if (moiData) {
      res.json({ success: true, source: "moi", data: moiData });
      return;
    }

    // ── No live data ───────────────────────────────────────────────────────
    const noKeyMsg = !elmApiKey
      ? " (يلزم تفعيل مفتاح Elm API لجلب البيانات الكاملة)"
      : "";
    res.json({
      success: false,
      message: `خدمة الاستعلام غير متاحة حالياً${noKeyMsg}. يمكنك الاستعلام مباشرة من بوابة المرور السعودية.`,
      needs_api_key: !elmApiKey,
      inquiry_links: inquiryLinks,
    });
  } catch {
    res.json({
      success: false,
      message: "تعذّر الاتصال بخدمة الاستعلام. يرجى المحاولة لاحقاً.",
      inquiry_links: inquiryLinks,
    });
  }
});

export default router;
