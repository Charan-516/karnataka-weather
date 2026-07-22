"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, X } from "lucide-react";
import type { Place } from "@/lib/places";

interface PlaceComboboxProps {
  places: Place[];
  district: string;
  onSelect: (place: Place) => void;
  onClose?: () => void;
}

export default function PlaceCombobox({
  places,
  district,
  onSelect,
  onClose,
}: PlaceComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = places.filter(
    (p) =>
      p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      p.type.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleOpen = useCallback(() => {
    setOpen(true);
    setSearchValue("");
    setHighlightedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const handleSelect = useCallback(
    (place: Place) => {
      setSelectedPlace(place);
      setOpen(false);
      onSelect(place);
    },
    [onSelect]
  );

  // Scroll active item into view when highlighted via keyboard
  useEffect(() => {
    if (!open || !listRef.current) return;
    const itemEl = listRef.current.children[highlightedIndex] as HTMLElement;
    if (itemEl) {
      itemEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedIndex, open]);

  // Click outside listener
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClose]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        handleOpen();
      }
      return;
    }

    if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filtered.length > 0 ? (prev + 1) % filtered.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlightedIndex]) {
        handleSelect(filtered[highlightedIndex]);
      }
    }
  };

  const getPlaceIcon = (type: string) => {
    const t = type.toLowerCase();
    if (
      t.includes("park") ||
      t.includes("nature") ||
      t.includes("garden") ||
      t.includes("forest")
    ) {
      return "🌿";
    }
    if (
      t.includes("monument") ||
      t.includes("temple") ||
      t.includes("fort") ||
      t.includes("heritage") ||
      t.includes("attraction")
    ) {
      return "🏛";
    }
    if (
      t.includes("beach") ||
      t.includes("water") ||
      t.includes("lake") ||
      t.includes("river") ||
      t.includes("falls")
    ) {
      return "🌊";
    }
    return "📍";
  };

  const listContainerVariants = {
    hidden: { opacity: 0, y: -6, scaleY: 0.97 },
    visible: {
      opacity: 1,
      y: 6,
      scaleY: 1,
      transition: {
        duration: 0.22,
        ease: [0.16, 1, 0.3, 1] as const,
        staggerChildren: 0.035,
        delayChildren: 0.01,
      },
    },
    exit: {
      opacity: 0,
      y: -6,
      scaleY: 0.97,
      transition: { duration: 0.15, ease: "easeIn" as const },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Input bar */}
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          style={{
            width: "100%",
            padding: "16px 20px",
            paddingRight: 48,
            borderRadius: 16,
            border: open
              ? "1.5px solid rgba(180, 100, 60, 0.5)"
              : "1.5px solid rgba(180, 100, 60, 0.25)",
            background: "rgba(252, 246, 237, 0.95)",
            backdropFilter: "blur(12px)",
            fontFamily: "Montserrat, sans-serif",
            fontSize: 16,
            color: "#3d1f0a",
            outline: "none",
            cursor: open ? "text" : "pointer",
            transition: "all 0.25s ease",
            boxShadow: open
              ? "0 8px 32px rgba(180, 100, 60, 0.16)"
              : "0 4px 16px rgba(180, 80, 20, 0.06)",
          }}
          placeholder={
            selectedPlace
              ? selectedPlace.name
              : `Select a place in ${district}...`
          }
          value={open ? searchValue : selectedPlace?.name || ""}
          onChange={(e) => {
            if (!open) handleOpen();
                    setSearchValue(e.target.value);
                    setHighlightedIndex(0);
          }}
          onFocus={() => {
            if (!open) handleOpen();
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={() => (open ? handleClose() : handleOpen())}
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#8b6914",
            opacity: 0.7,
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.2s ease",
          }}
          aria-label={open ? "Close dropdown" : "Open dropdown"}
        >
          {open ? <X size={20} /> : <ChevronsUpDown size={20} />}
        </button>
      </div>

      {/* Animated Dropdown Card */}
      <AnimatePresence>
        {open && (
          <motion.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 100,
              borderRadius: 16,
              border: "1px solid rgba(180, 100, 60, 0.18)",
              background: "#fcf6ed",
              boxShadow: "0 16px 48px rgba(60, 30, 10, 0.14)",
              overflow: "hidden",
              maxHeight: 340,
              transformOrigin: "top center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Search metadata status bar */}
            {searchValue && (
              <div
                style={{
                  padding: "10px 18px",
                  fontFamily: "Space Mono, monospace",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "#8b6914",
                  opacity: 0.7,
                  borderBottom: "1px solid rgba(180, 100, 60, 0.1)",
                  background: "rgba(245, 237, 225, 0.5)",
                }}
              >
                {filtered.length} place{filtered.length !== 1 ? "s" : ""} found
              </div>
            )}

            {/* Scrollable list container */}
            <div
              ref={listRef}
              style={{
                maxHeight: 320,
                overflowY: "auto",
                padding: "8px 10px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: "24px 16px",
                    textAlign: "center",
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: 14,
                    color: "#8b6914",
                    opacity: 0.7,
                  }}
                >
                  No places found matching &quot;{searchValue}&quot;
                </div>
              ) : (
                filtered.map((place, idx) => {
                  const isHighlighted = idx === highlightedIndex;
                  return (
                    <motion.div
                      key={place.name}
                      variants={itemVariants}
                      onClick={() => handleSelect(place)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        background: isHighlighted
                          ? "rgba(245, 237, 225, 0.95)"
                          : "#ffffff",
                        borderRadius: 12,
                        border: isHighlighted
                          ? "1px solid rgba(180, 100, 60, 0.25)"
                          : "1px solid rgba(180, 100, 60, 0.08)",
                        boxShadow: isHighlighted
                          ? "0 4px 14px rgba(60, 30, 10, 0.08)"
                          : "0 2px 6px rgba(60, 30, 10, 0.04)",
                        transform: isHighlighted ? "scale(1.01)" : "scale(1)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {/* Place type icon badge */}
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: isHighlighted ? "#ebdcc9" : "#f5ede1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "Space Mono, monospace",
                          fontSize: 14,
                          color: "#8b6914",
                          flexShrink: 0,
                          transition: "background 0.15s ease",
                        }}
                      >
                        {getPlaceIcon(place.type)}
                      </div>

                      {/* Text content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "Playfair Display, serif",
                            fontSize: 15,
                            fontWeight: 500,
                            color: "#3d1f0a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {place.name}
                        </div>
                        <div
                          style={{
                            fontFamily: "Space Mono, monospace",
                            fontSize: 11,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#8b6914",
                            opacity: 0.6,
                            marginTop: 2,
                          }}
                        >
                          {place.type}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


