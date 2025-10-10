"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle, Zap, Palette, Puzzle, BookOpen, Package, Brain } from "lucide-react";

export default function About() {
    return (
        <div>
            <h1 className="text-3xl font-semibold text-center mx-auto text-slate-900">About Infinus</h1>
            <p className="text-sm text-slate-600 text-center mt-2 max-w-lg mx-auto">
                Your reliable SAP expertise partner - delivering high-quality SAP solutions with European focus and competitive pricing.
            </p>
            <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 px-8 md:px-0 pt-16">
                <div className="size-[520px] -top-80 left-1/2 -translate-x-1/2 rounded-full absolute blur-[300px] -z-10 bg-primary/10"></div>
                
                <div>
                    <div className="size-10 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                        <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-700">Lightning-Fast Implementation</h3>
                        <p className="text-sm text-slate-600">Rapid SAP implementations with minimal downtime and optimized performance.</p>
                    </div>
                </div>
                
                <div>
                    <div className="size-10 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                        <Palette className="w-6 h-6 text-primary" />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-700">Modern SAP Solutions</h3>
                        <p className="text-sm text-slate-600">Cutting-edge SAP Business Suite solutions including Cloud ERP and Business AI.</p>
                    </div>
                </div>
                
                <div>
                    <div className="size-10 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                        <Puzzle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-700">Seamless Integration</h3>
                        <p className="text-sm text-slate-600">Easy integration with existing systems and flexible engagement models.</p>
                    </div>
                </div>
                
                <div>
                    <div className="size-10 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                        <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-700">Comprehensive Documentation</h3>
                        <p className="text-sm text-slate-600">Clear documentation and training programs for smooth project delivery.</p>
                    </div>
                </div>
                
                <div>
                    <div className="size-10 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                        <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-700">Fully Customizable</h3>
                        <p className="text-sm text-slate-600">Tailored SAP solutions to match your business processes and requirements.</p>
                    </div>
                </div>
                
                <div>
                    <div className="size-10 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                        <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div className="mt-5 space-y-2">
                        <h3 className="text-base font-medium text-slate-700">Expert Knowledge</h3>
                        <p className="text-sm text-slate-600">Senior SAP consultants with 10+ years of professional experience.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
