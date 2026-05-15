export const siteConfig = {
  churchName: "Universal Christian Faith Ministry",
  contact: {
    phoneDisplay: "06 2281 3149",
    phoneHref: "0622813149",
    whatsappHref: "https://wa.me/31622813149",
    email: "universalchristianfaithministry@gmail.com",
    facebookName: "UCFM Amsterdam",
    facebookUrl: "https://www.facebook.com/ucfmAmsterdam",
  },
  giving: {
    accountName: "UNIVERSAL CHRISTIAN FAITH MINISTRY",
    ibanCompact: "NL77INGB0008207647",
    ibanDisplay: "NL77 INGB 0008 2076 47",
    primaryOnlineMethods: ["iDEAL", "Cards", "Apple Pay", "Google Pay"],
    backupMethods: ["SEPA bank transfer", "International bank transfer"],
  },
  media: {
    youtubeChannelId: "UCPGf8ENeO4j7Wglu-i4PDWg",
    youtubeChannelUrl: "https://www.youtube.com/@universalchristianfaithmin8602",
    youtubeLiveUrl: "https://www.youtube.com/@universalchristianfaithmin8602/live",
    latestServiceVideoId: "_m546XuYrag",
    latestServiceTitle: "NURTURING DIVINE DESTINIES || SENIOR PASTOR VALERIA KING || 10/05/2026.",
    uploadsPlaylistId: "UUPGf8ENeO4j7Wglu-i4PDWg",
  },
  services: {
    friday: {
      day: "Friday",
      name: "Friday Service",
      time: "20:00 - 22:00",
    },
    firstFriday: {
      day: "1st Friday",
      name: "Absolute Worship",
      time: "20:00 - 22:00",
    },
    thirdFriday: {
      day: "3rd Friday",
      name: "All Night Service",
      time: "23:20 - 05:00",
    },
    sunday: {
      day: "Sunday",
      name: "Victory Service",
      time: "14:30 - 17:30",
      shortTime: "14:30",
      timezoneLabel: "Amsterdam time",
    },
    location: "Hettenheuvelweg 18, 1101BN, Amsterdam",
  },
} as const;
