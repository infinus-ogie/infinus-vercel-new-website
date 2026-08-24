"use client";

import { motion } from "framer-motion";
import { StatPills } from "./StatPills";
import type { HomeDictionary } from "@/content/dictionary";

/**
 * The trust pills as a standalone strip. `trust` is required for the same reason it is
 * required on StatPills: an optional locale-bearing prop is how English copy ends up on a
 * Serbian page without anything failing.
 */
export function TrustStrip({
  trust,
  certificationMark = false,
}: {
  trust: HomeDictionary["trust"];
  /** Forwarded to StatPills. The homepage hero is the only caller that sets it. */
  certificationMark?: boolean;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      viewport={{ once: true, amount: 0.2 }}
      className="flex justify-center mt-5 md:mt-8"
    >
      <StatPills variant="dark" trust={trust} certificationMark={certificationMark} />
    </motion.div>
  );
}
