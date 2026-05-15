import { createCheckoutSession, sendJson } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const result = await createCheckoutSession(req.body);
    return sendJson(res, result.status, result.body);
  } catch (error) {
    console.error("Stripe error:", error);

    return sendJson(res, 500, {
      error: "Online payment is temporarily unavailable. Please use bank transfer or try again later.",
    });
  }
}
