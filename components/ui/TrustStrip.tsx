"use client";

import { motion } from "framer-motion";
import { StatPills } from "./StatPills";
import type { HomeDictionary } from "@/content/dictionary";

export function TrustStrip({ trust }: { trust?: HomeDictionary["trust"] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      viewport={{ once: true, amount: 0.2 }}
      className="flex justify-center mt-8"
    >
      <StatPills variant="dark" trust={trust} />
    </motion.div>
  );
}
