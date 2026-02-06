"use client";

import React from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { useParams } from "next/navigation";

const CaseStudyDetailPage = () => {
    const params = useParams();
    const id = params?.id as string;

    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-24">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[#A1A1A1] hover:text-white transition-colors mb-12"
                >
                    <MoveLeft className="w-4 h-4" />
                    Back to Landing Page
                </Link>

                <h1 className="text-4xl md:text-6xl font-bold mb-8 capitalize">
                    {id?.replace(/-/g, " ")}
                </h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-xl text-[#A1A1A1] mb-8">
                        Detailed case study for <span className="text-white font-medium">{id}</span>. This page is currently a placeholder for the full case study content.
                    </p>

                    <div className="p-8 rounded-2xl bg-[#0F0F0F] border border-[#1F1F1F]">
                        <h2 className="text-2xl font-bold mb-4">Implementation Details</h2>
                        <p className="text-[#A1A1A1]">
                            The implementation of this project involved deep analysis and AI-driven optimizations.
                            Full technical report and methodology documentation are available upon request.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseStudyDetailPage;
