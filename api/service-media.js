import { getServiceMedia, sendJson } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const media = await getServiceMedia();
  return sendJson(res, 200, media);
}
