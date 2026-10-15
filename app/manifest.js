export default function manifest() {
  return {
    name: "Setu Nova AI",
    short_name: "Setu Nova",
    description: "A bilingual marketplace for rural producers and buyers.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffefa",
    theme_color: "#183b2b",
    lang: "en-IN",
    icons: [
      {
        src: "/icons/setu-nova-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
      {
        src: "/icons/setu-nova-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  };
}
