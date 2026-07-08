import { Router } from "express";

const router = Router();

/**
 * GET /api/plate-lookup?plate=<plate_number>
 *
 * Attempts to retrieve vehicle information for a Saudi licence plate from
 * the publicly-accessible Saudi MOI / Elm data services.  We try several
 * known endpoints; the first one that returns a useful payload wins.
 * On any failure we return success:false with a human-readable message so
 * the frontend can degrade gracefully.
 */
router.get("/plate-lookup", async (req, res) => {
  const plate = (req.query["plate"] as string | undefined)?.trim();
  if (!plate) {
    res.status(400).json({ success: false, message: "رقم اللوحة مطلوب" });
    return;
  }

  // Strip spaces and dashes for the API call
  const cleanPlate = plate.replace(/[\s\-]/g, "");

  // Helper that parses response JSON as a loose record (or null on failure)
  const parseJson = async (response: Response): Promise<Record<string, unknown> | null> => {
    try {
      const raw: unknown = await response.json();
      if (raw !== null && typeof raw === "object" && !Array.isArray(raw)) {
        return raw as Record<string, unknown>;
      }
    } catch {
      // ignore parse errors
    }
    return null;
  };

  try {
    let vehicleData: Record<string, unknown> | null = null;

    // ── Attempt 1: Saudi MOI traffic inquiry ──────────────────────────────
    const moiUrl =
      `https://traffic.moi.gov.sa/wps/portal/traffic/services/inquiries/vehicleInquiry?plateNumber=${encodeURIComponent(cleanPlate)}`;

    const moiRes = await fetch(moiUrl, {
      headers: {
        "Accept": "application/json, text/html",
        "User-Agent": "Mozilla/5.0 (compatible; MashwarAdmin/1.0)",
      },
      signal: AbortSignal.timeout(8000),
    }).catch(() => null);

    if (moiRes?.ok) {
      const ct = moiRes.headers.get("content-type") ?? "";
      if (ct.includes("json")) {
        const json = await parseJson(moiRes);
        if (json) {
          const payload = json["data"] ?? json["vehicle"] ?? json["result"];
          if (payload !== undefined && payload !== null && typeof payload === "object") {
            vehicleData = payload as Record<string, unknown>;
          }
        }
      }
    }

    // ── Attempt 2: Elm vehicle inquiry service ────────────────────────────
    if (!vehicleData) {
      const elmUrl =
        `https://api.elm.sa/vehicle/v1/inquiry?plateNumber=${encodeURIComponent(cleanPlate)}`;
      const elmRes = await fetch(elmUrl, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; MashwarAdmin/1.0)",
        },
        signal: AbortSignal.timeout(8000),
      }).catch(() => null);

      if (elmRes?.ok) {
        const json = await parseJson(elmRes);
        if (json) {
          const payload = json["data"] ?? json["vehicle"];
          if (payload !== undefined && payload !== null && typeof payload === "object") {
            vehicleData = payload as Record<string, unknown>;
          }
        }
      }
    }

    if (vehicleData) {
      res.json({ success: true, data: vehicleData });
      return;
    }

    // ── No live data available ─────────────────────────────────────────────
    res.json({
      success: false,
      message: "خدمة الاستعلام غير متاحة حالياً. يمكنك الاستعلام مباشرة من بوابة المرور السعودية.",
      inquiry_links: [
        {
          label: "بوابة أبشر – استعلام المركبة",
          url: `https://absher.sa/wps/portal/individuals/static/inquiry/VehicleInquiry?plateNumber=${encodeURIComponent(cleanPlate)}`,
        },
        {
          label: "وزارة الداخلية – خدمات المرور",
          url: "https://www.moi.gov.sa/wps/portal/Home/govServices/Traffic",
        },
      ],
    });
  } catch {
    res.json({
      success: false,
      message: "تعذّر الاتصال بخدمة الاستعلام. يرجى المحاولة لاحقاً.",
      inquiry_links: [
        {
          label: "بوابة أبشر",
          url: "https://absher.sa",
        },
      ],
    });
  }
});

export default router;
