"use client";

import React, { useMemo, useEffect, useState, useCallback } from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

export type AnimationPhase =
  | "idle"
  | "forming_column"
  | "resetting"
  | "complete";

type InternalAnimatedListItemProps = {
  children: React.ReactNode;
  className?: string;
  index: number;
  listLength: number;
  stackGap: number;
  columnGap: number;
  scaleFactor: number;
  animationPhase: AnimationPhase;
  onFormationComplete?: () => void;
  formationDuration: number;
  resetSpringStiffness: number;
  resetSpringDamping: number;
};

function InternalAnimatedListItem({
  children,
  className,
  index,
  listLength,
  animationPhase,
  onFormationComplete,
  stackGap = 8,
  columnGap = 60,
  scaleFactor = 0.08,
  formationDuration = 0.8,
  resetSpringStiffness = 120,
  resetSpringDamping = 20,
}: InternalAnimatedListItemProps) {
  const isLastItem = index === listLength - 1;

  const itemVariants = {
    initial: {
      scale: 1 + index * scaleFactor,
      y: index * stackGap,
      opacity: 1,
    },
    column: {
      scale: 1,
      y: index * columnGap,
      opacity: 1,
    },
  };

  const target =
    animationPhase === "idle" || animationPhase === "resetting"
      ? "initial"
      : "column";

  const getTransition = (): Transition => {
    if (animationPhase === "resetting") {
      return {
        type: "spring" as const,
        stiffness: resetSpringStiffness,
        damping: resetSpringDamping,
      } as Transition;
    }
    return { duration: formationDuration, ease: [0.22, 1, 0.36, 1] } as Transition;
  };

  const handleAnimationComplete = (definition: string) => {
    if (
      isLastItem &&
      definition === "column" &&
      animationPhase === "forming_column"
    ) {
      onFormationComplete?.();
    }
  };

  return (
    <motion.div
      key={index}
      className={cn("flex items-center justify-center absolute inset-x-0", className)}
      variants={itemVariants}
      initial="initial"
      animate={target}
      transition={getTransition()}
      onAnimationComplete={handleAnimationComplete}
    >
      {children}
    </motion.div>
  );
}

export type AnimatedListProps = {
  children: React.ReactNode;
  className?: string;
  stackGap?: number;
  columnGap?: number;
  scaleFactor?: number;
  formationDuration?: number;
  animationPhase?: AnimationPhase;
  onPhaseChange?: (phase: AnimationPhase) => void;
  onResetComplete?: () => void;
};

export function AnimatedList({
  children,
  className,
  stackGap = 8,
  columnGap = 60,
  scaleFactor = 0.08,
  formationDuration = 0.8,
  animationPhase: externalPhase,
  onPhaseChange,
  onResetComplete,
}: AnimatedListProps) {
  const [internalPhase, setInternalPhase] = useState<AnimationPhase>("idle");
  const childrenArray = useMemo(
    () => React.Children.toArray(children),
    [children]
  );
  const listLength = childrenArray.length;
  const idleDuration = 1200;

  const phase = externalPhase ?? internalPhase;
  const updatePhase = useCallback(
    (newPhase: AnimationPhase) => {
      if (onPhaseChange) onPhaseChange(newPhase);
      else setInternalPhase(newPhase);
    },
    [onPhaseChange]
  );

  useEffect(() => {
    if (phase !== "idle") return;
    const timer = setTimeout(() => {
      updatePhase("forming_column");
    }, idleDuration);
    return () => clearTimeout(timer);
  }, [phase, updatePhase, idleDuration]);

  const handleFormationComplete = useCallback(() => {
    if (phase === "forming_column") updatePhase("complete");
  }, [phase, updatePhase]);

  useEffect(() => {
    if (phase !== "resetting") return;
    const timer = setTimeout(() => {
      onResetComplete?.();
    }, 800);
    return () => clearTimeout(timer);
  }, [phase, onResetComplete]);

  if (listLength === 0) return null;

  return (
    <div className={cn("relative w-full h-full", className)}>
      {childrenArray.map((child, index) => (
        <InternalAnimatedListItem
          key={index}
          index={index}
          listLength={listLength}
          animationPhase={phase}
          onFormationComplete={
            index === listLength - 1 ? handleFormationComplete : undefined
          }
          stackGap={stackGap}
          columnGap={columnGap}
          scaleFactor={scaleFactor}
          formationDuration={formationDuration}
          resetSpringStiffness={120}
          resetSpringDamping={20}
        >
          {child}
        </InternalAnimatedListItem>
      ))}
    </div>
  );
}
