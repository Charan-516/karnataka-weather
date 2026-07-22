"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import WeatherPortal from "@/components/portals/WeatherPortal";
import { AuthManager } from "@/lib/auth";
import { getPlacesForDistrict } from "@/lib/places";
import { OutlineButton } from "@/components/ui/button";

function PortalContent() {
  const router = useRouter();
  const params = useSearchParams();
  const city = params.get("city") || "Karnataka";

  const places = getPlacesForDistrict(city);

  useEffect(() => {
    AuthManager.current().then((u) => {
      if (!u) router.replace("/");
    });
  }, [router]);

  const portals = [
    {
      type: "district" as const,
      title: "Continue with District",
      subtitle: `Full report for ${city}`,
      description:
        "Get a comprehensive district-wide weather report covering all areas, places, and insights.",
      onClick: () =>
        router.push(`/intelligence?city=${encodeURIComponent(city)}`),
    },
    {
      type: "place" as const,
      title: "Select a Specific Place",
      subtitle: `${places.length} places available`,
      description:
        "Pick a specific location within the district for a focused weather intelligence report.",
      onClick: () =>
        router.push(`/intelligence/select?city=${encodeURIComponent(city)}`),
    },
  ];

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse 120% 100% at 30% 20%, #f5f0e8 0%, #eee6d6 50%, #e8dcc8 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: "center", marginBottom: 48 }}
      >
        <p
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: 15,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#2a1a0a",
            marginBottom: 12,
            opacity: 0.6,
          }}
        >
          Weather Intelligence — {city}
        </p>
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 300,
            color: "#3d1f0a",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Beyond the Fold
        </h1>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 15,
            fontWeight: 300,
            color: "#3a2a1a",
            lineHeight: 1.6,
            maxWidth: 480,
            margin: "16px auto 0",
            opacity: 0.7,
          }}
        >
          Choose how you want to explore the intelligence for this district
        </p>
      </motion.div>

      {/* Portal Cards */}
      <motion.div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 32,
        }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {portals.map((portal) => (
          <motion.div
            key={portal.type + portal.title}
            variants={{
              hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <WeatherPortal {...portal} />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom actions */}
      <motion.div
        style={{ marginTop: 56 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <OutlineButton
          onClick={() =>
            router.push(`/portal?city=${encodeURIComponent(city)}`)
          }
        >
          ← BACK TO CHOICES
        </OutlineButton>
      </motion.div>
    </div>
  );
}

export default function IntelligencePortalPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f0e8",
            fontFamily: "Space Mono, monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "#2a1508",
          }}
        >
          Loading...
        </div>
      }
    >
      <PortalContent />
    </Suspense>
  );
}
