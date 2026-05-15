import Stripe from "stripe";

const frontendUrl = process.env.FRONTEND_URL?.trim() || "http://localhost:8080";
const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;
const stripeLiveModeRequired = process.env.STRIPE_LIVE_MODE_REQUIRED === "true";

const youtubeApiKey = process.env.YOUTUBE_API_KEY?.trim();
const youtubeChannelId = process.env.YOUTUBE_CHANNEL_ID?.trim() || "UCPGf8ENeO4j7Wglu-i4PDWg";
const youtubeChannelUrl = (
  process.env.YOUTUBE_CHANNEL_URL?.trim() || "https://www.youtube.com/@universalchristianfaithmin8602"
).replace(/\/+$/, "");
const youtubeLiveUrl = `${youtubeChannelUrl}/live`;
const youtubeLatestServiceVideoId = process.env.YOUTUBE_LATEST_SERVICE_VIDEO_ID?.trim() || "_m546XuYrag";
const youtubeCacheTtlMs = Number(process.env.YOUTUBE_CACHE_TTL_MS || 1000 * 60 * 30);

let youtubeCache = {
  expiresAt: 0,
  value: null,
};

export const getStripeMode = () => {
  if (!stripeSecret) return "missing";
  if (stripeSecret.startsWith("sk_test") || stripeSecret.startsWith("rk_test")) return "test";
  if (stripeSecret.startsWith("sk_live") || stripeSecret.startsWith("rk_live")) return "live";
  return "unknown";
};

export const getServerStatus = () => ({
  stripe: getStripeMode(),
  stripeLiveModeRequired,
  youtube: youtubeApiKey ? "api" : "fallback",
});

const createCheckoutReturnUrl = (paymentState) => {
  const url = new URL(frontendUrl);
  url.searchParams.set("payment", paymentState);
  return url.toString();
};

const withCheckoutSessionId = (urlValue) => {
  const url = new URL(urlValue);

  if (!url.searchParams.has("session_id")) {
    url.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
  }

  return url.toString();
};

export const createCheckoutSession = async (body = {}) => {
  if (!stripe) {
    return {
      status: 503,
      body: { error: "Online checkout is not configured on the server yet." },
    };
  }

  if (stripeLiveModeRequired && getStripeMode() !== "live") {
    return {
      status: 503,
      body: { error: "Live Stripe checkout is required, but the server is not using a live key." },
    };
  }

  const {
    amount,
    currency = "eur",
    checkoutMethod = "ideal",
    description,
    donorName = "Anonymous",
    givingType = "donation",
    locale = "auto",
  } = body;

  if (!amount || Number(amount) <= 0) {
    return { status: 400, body: { error: "Invalid amount" } };
  }

  const normalizedGivingType = String(givingType);
  const normalizedCheckoutMethod =
    checkoutMethod === "card" || checkoutMethod === "ideal" ? checkoutMethod : "ideal";
  const itemName =
    normalizedGivingType.charAt(0).toUpperCase() + normalizedGivingType.slice(1).toLowerCase();

  const metadata = {
    checkoutMethod: normalizedCheckoutMethod,
    donorName: String(donorName).slice(0, 100),
    givingType: normalizedGivingType.slice(0, 50),
  };
  const successUrl = withCheckoutSessionId(body.success_url || createCheckoutReturnUrl("success"));

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    cancel_url: body.cancel_url || createCheckoutReturnUrl("cancelled"),
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: `UCFM ${itemName}`,
            description: description || "Universal Christian Faith Ministry giving",
          },
          unit_amount: Math.round(Number(amount) * 100),
        },
        quantity: 1,
      },
    ],
    locale: locale === "nl" || locale === "en" ? locale : "auto",
    metadata,
    mode: "payment",
    payment_method_types: [normalizedCheckoutMethod],
    payment_intent_data: {
      description: description || "UCFM Giving",
      metadata,
    },
    submit_type: "donate",
    success_url: successUrl,
  });

  if (!session.url) {
    return { status: 500, body: { error: "Stripe did not return a checkout URL" } };
  }

  return { status: 200, body: { url: session.url } };
};

export const getCheckoutSessionStatus = async (sessionId) => {
  if (!stripe) {
    return {
      status: 503,
      body: { error: "Online checkout is not configured on the server yet." },
    };
  }

  if (!sessionId) {
    return { status: 400, body: { error: "Missing session_id" } };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const metadata = session.metadata ?? {};
  const verified = session.status === "complete" && session.payment_status === "paid";

  return {
    status: 200,
    body: {
      amountTotal: session.amount_total,
      currency: session.currency,
      donorName: metadata.donorName ?? "Anonymous",
      givingType: metadata.givingType ?? "donation",
      paymentStatus: session.payment_status,
      sessionStatus: session.status,
      verified,
    },
  };
};

const createServiceMediaFallback = (source = "fallback") => ({
  channelUrl: youtubeChannelUrl,
  checkedAt: new Date().toISOString(),
  latestEmbedUrl: `https://www.youtube.com/embed/${youtubeLatestServiceVideoId}?rel=0`,
  latestServicePublishedAt: null,
  latestServiceTitle: null,
  latestWatchUrl: `https://www.youtube.com/watch?v=${youtubeLatestServiceVideoId}`,
  liveEmbedUrl: `https://www.youtube.com/embed/live_stream?channel=${youtubeChannelId}`,
  liveNow: false,
  liveTitle: null,
  liveUrl: youtubeLiveUrl,
  source,
});

const fetchYouTubeJson = async (path, params) => {
  if (!youtubeApiKey) {
    throw new Error("YOUTUBE_API_KEY is not configured.");
  }

  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  url.searchParams.set("key", youtubeApiKey);

  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube API request failed (${response.status}): ${body.slice(0, 200)}`);
  }

  return response.json();
};

const decodeXmlText = (value = "") =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");

const fetchLatestYouTubeRssItem = async () => {
  const response = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(youtubeChannelId)}`
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`YouTube RSS request failed (${response.status}): ${body.slice(0, 200)}`);
  }

  const xml = await response.text();
  const entry = xml.match(/<entry>[\s\S]*?<\/entry>/)?.[0];
  if (!entry) return null;

  const videoId = entry.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/)?.[1]?.trim();
  if (!videoId) return null;

  return {
    publishedAt: entry.match(/<published>([\s\S]*?)<\/published>/)?.[1]?.trim() ?? null,
    title: decodeXmlText(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? ""),
    videoId,
  };
};

const fetchServiceSearch = async (eventType) => {
  const data = await fetchYouTubeJson("search", {
    part: "snippet",
    channelId: youtubeChannelId,
    eventType,
    maxResults: 1,
    order: "date",
    type: "video",
  });

  return data.items?.[0] || null;
};

export const getServiceMedia = async () => {
  if (youtubeCache.value && Date.now() < youtubeCache.expiresAt) {
    return youtubeCache.value;
  }

  if (!youtubeApiKey) {
    try {
      const latestItem = await fetchLatestYouTubeRssItem();

      if (latestItem) {
        const media = {
          ...createServiceMediaFallback("youtube_rss"),
          latestEmbedUrl: `https://www.youtube.com/embed/${latestItem.videoId}?rel=0`,
          latestServicePublishedAt: latestItem.publishedAt,
          latestServiceTitle: latestItem.title || null,
          latestWatchUrl: `https://www.youtube.com/watch?v=${latestItem.videoId}`,
        };

        youtubeCache = {
          expiresAt: Date.now() + youtubeCacheTtlMs,
          value: media,
        };

        return media;
      }
    } catch (error) {
      console.error("Unable to refresh YouTube RSS service media:", error);
    }

    const fallback = createServiceMediaFallback();
    youtubeCache = {
      expiresAt: Date.now() + Math.min(youtubeCacheTtlMs, 1000 * 60 * 5),
      value: fallback,
    };

    return fallback;
  }

  try {
    const [liveItem, completedItem] = await Promise.all([
      fetchServiceSearch("live"),
      fetchServiceSearch("completed"),
    ]);

    const media = {
      ...createServiceMediaFallback("youtube_api"),
      liveNow: Boolean(liveItem?.id?.videoId),
      liveTitle: liveItem?.snippet?.title ?? null,
      latestServicePublishedAt: completedItem?.snippet?.publishedAt ?? null,
      latestServiceTitle: completedItem?.snippet?.title ?? null,
    };

    if (liveItem?.id?.videoId) {
      media.liveEmbedUrl = `https://www.youtube.com/embed/${liveItem.id.videoId}`;
    }

    if (completedItem?.id?.videoId) {
      media.latestEmbedUrl = `https://www.youtube.com/embed/${completedItem.id.videoId}?rel=0`;
      media.latestWatchUrl = `https://www.youtube.com/watch?v=${completedItem.id.videoId}`;
    }

    youtubeCache = {
      expiresAt: Date.now() + youtubeCacheTtlMs,
      value: media,
    };

    return media;
  } catch (error) {
    console.error("Unable to refresh YouTube service media:", error);

    const fallback = createServiceMediaFallback("youtube_api_error");
    youtubeCache = {
      expiresAt: Date.now() + Math.min(youtubeCacheTtlMs, 1000 * 60 * 5),
      value: fallback,
    };

    return fallback;
  }
};

export const sendJson = (res, status, body) => {
  res.status(status).json(body);
};
