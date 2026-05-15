import { getCheckoutSessionStatus, sendJson } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const sessionId = String(req.query?.session_id ?? "").trim();
    const result = await getCheckoutSessionStatus(sessionId);
    return sendJson(res, result.status, result.body);
  } catch (error) {
    console.error("Stripe session verification error:", error);

    if (error?.type === "StripeInvalidRequestError") {
      return sendJson(res, 400, { error: "Invalid checkout session" });
    }

    return sendJson(res, 500, { error: "Failed to verify checkout session" });
  }
}
