import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveLeft, ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/data/case-studies";
import { notFound } from "next/navigation";

interface CaseStudyDetailPageProps {
  params: Promise<{ id: string }>;
}

const CaseStudyDetailPage = ({ params }: CaseStudyDetailPageProps) => {
  const { id } = use(params);
  const study = caseStudies.find((s) => s.id === id);

  if (!study) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/#case-studies"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium group"
          >
            <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Case Studies
          </Link>
          <div className="text-sm font-medium text-white/50">
            {study.title}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 md:px-12">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-20">
            <div className="flex flex-wrap gap-4 mb-8">
              {study.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-zinc-300"
                >
                  <span className="text-white font-bold">{metric.value}</span>{" "}
                  <span className="opacity-50">{metric.label}</span>
                </div>
              ))}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
              {study.title}
            </h1>
            <p className="text-2xl text-zinc-400 font-light leading-relaxed max-w-2xl">
              {study.subtitle}
            </p>
          </header>

          {/* Hero Image */}
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 mb-24 shadow-2xl shadow-indigo-500/10">
            <Image
              src={study.heroImage}
              alt={study.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

          {/* Content Sections */}
          <div className="space-y-24">
            {/* Overview */}
            <section className="prose prose-invert max-w-none">
              <p className="text-xl leading-relaxed text-zinc-300 selection:bg-indigo-500/30">
                {study.overview}
              </p>
            </section>

            {/* Detailed Sections */}
            {study.sections.map((section, idx) => (
              <section key={idx} className="relative border-l border-white/10 pl-8 md:pl-12 py-2">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-600" />

                <h2 className="text-3xl font-bold mb-10 text-white flex items-center gap-4">
                  {section.heading}
                </h2>

                <div className="space-y-12">
                  {section.subsections.map((sub, subIdx) => (
                    <div key={subIdx} className="group">
                      {sub.title && (
                        <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
                          {sub.title}
                        </h3>
                      )}

                      {sub.type === "text" && sub.content && (
                        <div className="space-y-4 text-zinc-400 leading-relaxed text-lg">
                          {sub.content.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>
                      )}

                      {sub.type === "list" && sub.list && (
                        <ul className="space-y-3">
                          {sub.list.map((item, i) => {
                            // Simple markdown-like bold parsing
                            const parts = item.split("**");
                            return (
                              <li key={i} className="flex items-start gap-3 text-zinc-400">
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                <span>
                                  {parts.map((part, pIdx) =>
                                    pIdx % 2 === 1 ? (
                                      <strong key={pIdx} className="text-white font-medium">
                                        {part}
                                      </strong>
                                    ) : (
                                      part
                                    )
                                  )}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {sub.type === "code" && sub.code && (
                        <div className="mt-4 rounded-xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-xl">
                          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                          </div>
                          <pre className="p-6 overflow-x-auto text-sm font-mono text-zinc-300 leading-relaxed">
                            <code>{sub.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-zinc-500">Interested in the full technical audit?</p>
            <a
              href="mailto:contact@example.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
            >
              Request Full Audit
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </article>
      </main>
    </div>
  );
};

export default CaseStudyDetailPage;
