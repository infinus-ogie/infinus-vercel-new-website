"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function AboutDemo() {
    return (
        <section className="flex flex-col md:flex-row items-center justify-center gap-10 max-md:px-4">
            <div className="relative shadow-2xl shadow-primary/40 rounded-2xl overflow-hidden shrink-0">
                <Image 
                    className="max-w-md w-full object-cover rounded-2xl"
                    src="/sap-gold-partner-logo-about-us.webp"
                    alt="SAP Gold Partner Logo"
                    width={400}
                    height={300}
                />
            </div>
                <div className="text-lg text-slate-700 max-w-lg">
                    <h1 className="text-6xl font-bold tracking-tighter text-slate-900 mb-4">About Us.</h1>
                    <div className="w-24 h-[3px] rounded-full bg-gradient-to-r from-primary to-primary/60 mb-8"></div>
                    <p className="text-xl text-slate-700 mb-8">Infinus is SAP Gold Partner focused on SAP Business Suite solutions:</p>
                    <ul className="space-y-2 mb-8">
                        <li className="flex items-center text-slate-700">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            SAP Cloud ERP (Private and Public)
                        </li>
                        <li className="flex items-center text-slate-700">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            SAP Business Data Cloud
                        </li>
                        <li className="flex items-center text-slate-700">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            SAP Business AI
                        </li>
                        <li className="flex items-center text-slate-700">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            SAP Business Technology Platform
                        </li>
                    </ul>
                    <p className="text-xl text-slate-700 mb-4">Our experienced SAP consultants can bring high-quality expertise in various SAP solutions, business processes, technologies, market trends, and best practices to deliver best-in-class consulting services and solutions for your business.</p>
                    <p className="text-xl text-slate-700 mb-8">The vast majority of our team consists of senior SAP consultants with 10+ years of professional experience.</p>
                    <button className="flex items-center gap-2 hover:-translate-y-0.5 transition bg-gradient-to-r from-primary to-primary/80 py-3 px-8 rounded-full text-white">
                        <span>Contact us</span>
                        <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12.53 6.53a.75.75 0 0 0 0-1.06L7.757.697a.75.75 0 1 0-1.06 1.06L10.939 6l-4.242 4.243a.75.75 0 0 0 1.06 1.06zM0 6v.75h12v-1.5H0z"
                                fill="#fff" />
                        </svg>
                    </button>
                </div>
        </section>
    );
};