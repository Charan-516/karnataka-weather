"use client";

import { useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { AuthManager } from "@/lib/auth";
import { getPlacesForDistrict, type Place } from "@/lib/places";
import PlaceCombobox from "@/components/ui/combobox";
import { OutlineButton } from "@/components/ui/button";

function SelectContent() {
  const router = useRouter();
  const params = useSearchParams();
  const city = params.get("city") || "Karnataka";

  const places = getPlacesForDistrict(city);

  useEffect(() => {
    AuthManager.current().then((u) => {
      if (!u) router.replace("/");
    });
  }, [router]);

  const handleSelect = useCallback(
    (place: Place) => {
      router.push(
        `/intelligence?city=${encodeURIComponent(city)}&place=${encodeURIComponent(place.name)}&lat=${place.lat}&lng=${place.lng}`
      );
    },
    [router, city]
  );

  const handleBack = useCallback(() => {
    router.push(`/intelligence/portal?city=${encodeURIComponent(city)}`);
  }, [router, city]);

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
          Select a Place — {city}
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
          Choose a Location
        </h1>
        <p
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 14,
            fontWeight: 300,
            color: "#3a2a1a",
            lineHeight: 1.6,
            maxWidth: 400,
            margin: "12px auto 0",
            opacity: 0.7,
          }}
        >
          Search and select a specific place in {city} to get a focused weather
          intelligence report
        </p>
      </motion.div>

      {places.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}
        >
          <PlaceCombobox
            places={places}
            district={city}
            onSelect={handleSelect}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: 15,
              color: "#3a2a1a",
              opacity: 0.6,
            }}
          >
            No places available for {city}
          </p>
          <OutlineButton onClick={handleBack} style={{ marginTop: 20 }}>
            ← BACK
          </OutlineButton>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={{ marginTop: 48 }}
      >
        <OutlineButton onClick={handleBack}>
          ← BACK TO CHOICES
        </OutlineButton>
      </motion.div>
    </div>
  );
}

export default function IntelligenceSelectPage() {
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
      <SelectContent />
    </Suspense>
  );
}
