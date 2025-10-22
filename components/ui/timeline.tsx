"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

function TimelineItem({ item }: { item: TimelineEntry }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: itemProgress } = useScroll({
    target: itemRef,
    offset: ["start 80%", "end 20%"],
  });

  // Transformacije za animacije
  const itemOpacity = useTransform(itemProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
  const itemY = useTransform(itemProgress, [0, 0.2], [24, 0]);
  const dotScale = useTransform(itemProgress, [0, 0.2, 0.8, 1], [0.9, 1.15, 1.15, 0.9]);
  const dotOpacity = useTransform(itemProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <div
      ref={itemRef}
      className="flex justify-start pt-10 md:pt-28 md:gap-10"
    >
      {/* Sticky title on desktop */}
      <div className="sticky z-40 top-32 self-start max-w-xs lg:max-w-sm md:w-full">
        <div className="relative pl-14 md:pl-16">
          {/* Node */}
          <motion.div
            className="h-10 w-10 rounded-full bg-background absolute left-2 md:left-2 top-0 flex items-center justify-center"
            style={{ scale: dotScale }}
          >
            <motion.div
              className="h-3.5 w-3.5 rounded-full border"
              style={{
                opacity: dotOpacity,
                backgroundColor: "hsl(var(--primary))",
                borderColor: "hsl(var(--primary))",
              }}
            />
          </motion.div>
          <motion.h3
            className="hidden md:block text-xl md:text-3xl font-semibold transition-colors"
            style={{ opacity: itemOpacity }}
          >
            {item.title}
          </motion.h3>
        </div>
      </div>

      {/* Content */}
      <div className="relative pl-14 pr-4 md:pl-4 w-full">
        <h3 className="md:hidden block text-xl font-semibold mb-3">
          {item.title}
        </h3>
        <motion.div
          className="text-foreground text-base md:text-lg leading-relaxed"
          style={{ opacity: itemOpacity, y: itemY }}
        >
          {item.content}
        </motion.div>
      </div>
    </div>
  );
}

export function Timeline({
  data,
  heading = "SAP Cloud ERP + Business AI",
  description = "",
  className,
  id,
}: {
  data: TimelineEntry[];
  heading?: string;
  description?: string;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section
      ref={containerRef}
      id={id}
      className={clsx("w-full bg-background font-sans md:px-6", className)}
    >
      <div className="max-w-6xl mx-auto py-12 md:py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
          {heading}
        </h2>
        {!!description && (
          <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-prose">
            {description}
          </p>
        )}
      </div>

      <div ref={ref} className="relative max-w-6xl mx-auto pb-10 md:pb-20">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} />
        ))}

        {/* Vertical progress line */}
        <div
          style={{ height: height + "px" }}
          className="absolute md:left-6 left-6 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-primary via-primary/60 to-transparent rounded-full"
          />
        </div>
      </div>
    </section>
  );
}