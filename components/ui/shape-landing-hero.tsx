"use client";

import { motion, Variants } from "framer-motion";
import { Award, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroPartnerBadge } from "./HeroPartnerBadge";
import { SapGoldPartnerBadge } from "@/components/ui/SapGoldPartnerBadge";
import { TrustStrip } from "./TrustStrip";
import { getDictionary } from "@/content/dictionary";
import type { HomeDictionary } from "@/content/dictionary";


function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

/**
 * The homepage hero.
 *
 * Phase H1 made its copy content-driven. `hero` still defaults to the ENGLISH dictionary;
 * `trust` no longer does, because it is forwarded to StatPills and an optional locale-bearing
 * prop is precisely how English trust copy ended up on Serbian pages. Callers name it.
 *
 * NOTE: before H1 the `title1`/`title2`/`badge` props were declared but IGNORED — the h1
 * text was hardcoded in the JSX below and the badge is a logo image, not text. Those dead
 * props are gone; the two h1 halves are separate strings because they carry different
 * gradients, and Serbian needs both halves independently translatable.
 */
function HeroGeometric({
    hero = getDictionary("en").home.hero,
    trust,
}: {
    hero?: HomeDictionary["hero"];
    trust: HomeDictionary["trust"];
}) {
    const fadeUpVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#00144a] pt-20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-blue-600/[0.06] blur-3xl" />

            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-blue-400/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-blue-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-blue-600/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-blue-300/[0.15]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-blue-700/[0.15]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-4 md:mb-12 mt-2 md:mt-4 lg:mt-6"
                    >
                        <HeroPartnerBadge logoAlt={hero.logoAlt} />

                        {/*
                          The SAP Gold Partner credential, as part of the BRAND stack rather
                          than the proof row.

                          It used to sit inside the first trust pill, in the same system as
                          "30+ consultants" and "30+ clients" - which flattened the difference
                          between a certification and a count. Here it reads the way it should:
                          Infinus, then who Infinus is certified by, then the headline.

                          Deliberately no pill, border or card, and no caption: the artwork
                          already sets the words, so `alt` carries the credential and nothing
                          repeats it visually. Sized well below the Infinus mark above it and
                          well below the headline under it, so it stays secondary to both.
                        */}
                        <div className="mt-2.5 flex justify-center sm:mt-4">
                            <SapGoldPartnerBadge
                                alt="SAP Gold Partner"
                                /* Stepped down at the smallest widths for the same reason the
                                   Infinus mark above it is: every pixel here pushes the proof
                                   row further past a 568px first screen. */
                                className="h-auto w-[62px] sm:w-[78px] md:w-[88px]"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-center font-light leading-tight tracking-tight text-[34px] sm:text-[42px] md:text-[56px] lg:text-[64px] xl:text-[72px] mb-4 md:mb-8">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                                {hero.titleLine1}
                            </span>
                            <br className="hidden lg:block" />
                            <span className="lg:inline bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white/90 to-blue-400">
                                {" "}{hero.titleLine2}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* mb tightened at the smallest widths: the CTA below now competes
                            for first-screen height at 320x568. */}
                        <p className="mx-auto text-center text-slate-300 text-base md:text-lg lg:text-xl max-w-none lg:max-w-4xl md:whitespace-nowrap lg:whitespace-nowrap mb-6 md:mb-8 px-4">
                            {hero.lede}
                        </p>
                    </motion.div>

                    {/* The first-screen CTA. Its destination is locale-owned copy, so this
                        component never has to work out which language it is rendering in. */}
                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-center"
                    >
                        {/*
                          A flat white surface, not a lit one.

                          Two things were making it read as a floating luminous object: the
                          Button default variant's `shadow-card`, and a white inset ring on a
                          white background, which adds no edge but does soften it outward.
                          `shadow-none` drops the first; the ring is now a navy hairline, which
                          actually defines the edge against #00144a instead of blurring it.

                          What is left is the site's ordinary button language: flat ground,
                          navy text, a defined hover, and a white focus ring on a navy offset
                          so keyboard focus is unmistakable on this background.
                        */}
                        <Button
                            asChild
                            size="lg"
                            className="bg-white px-9 text-[15px] font-semibold text-[#00144a] shadow-none ring-1 ring-[#00144a]/15 transition-colors hover:bg-slate-100 hover:text-[#00144a] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00144a] md:px-10"
                        >
                            <Link href={hero.ctaHref}>{hero.ctaLabel}</Link>
                        </Button>
                    </motion.div>

                    {/* Two matched proof points, and nothing else.

                        The SAP credential moved up into the brand stack under the Infinus
                        mark, so this row is no longer one certification wearing the same pill
                        as two counts. `goldPartner={false}` is set HERE and nowhere else -
                        every other page that renders this row has no SAP artwork near it and
                        keeps the pill. */}
                    <motion.div
                        custom={4}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <TrustStrip trust={trust} goldPartner={false} />
                    </motion.div>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-[#00144a] via-transparent to-[#00144a]/80 pointer-events-none" />
        </div>
    );
}

export { HeroGeometric }
