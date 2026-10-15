import "./globals.css";
import PwaRegistration from "./pwa-registration.jsx";

export const metadata = {
  title: "Setu Nova AI | Local roots. Wider markets.",
  description:
    "A bilingual marketplace for rural producers, buyers and village communities.",
  applicationName: "Setu Nova AI",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Setu Nova",
    statusBarStyle: "default",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#183b2b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <PwaRegistration />
      </body>
    </html>
  );
}
