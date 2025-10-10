"use client";
import * as React from "react";
import Image from "next/image";

export function LogoStrip({
  items = [],
  title = "Industries",
}: {
  items: { alt: string; src: string; width?: number; height?: number }[];
  title?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs uppercase tracking-wide text-slate-500 text-center">{title}</p>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center">
        {items.map((it, i) => (
          <div key={i} className="flex items-center justify-center opacity-70 hover:opacity-100 transition">
            <Image
              src={it.src}
              alt={it.alt}
              width={it.width ?? 120}
              height={it.height ?? 36}
              className="object-contain grayscale"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
