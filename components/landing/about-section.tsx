"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, ArrowUpRight } from "lucide-react";

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-24 lg:py-32 border-t border-foreground/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            About
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — Bio */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-sm font-mono text-muted-foreground mb-4">
              漱溟
            </p>

            <h2
              className="text-3xl lg:text-5xl font-display tracking-tight mb-6 leading-[1.1]"
            >
              Agent Engineer.
              <br />
              <span className="text-muted-foreground">
                Systems that work,
                <br />
                while you sleep.
              </span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              I design and build AI agent workflows — from orchestration logic to
              production deployment. No hype, just autonomous systems that deliver.
            </p>
          </div>

          {/* Right — Contact */}
          <div
            className={`transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="text-sm font-mono text-muted-foreground mb-6">
              Get in touch
            </h3>

            <div className="space-y-4">
              <a
                href="mailto:2139902263@qq.com"
                className="group flex items-center gap-3 text-lg text-foreground hover:text-muted-foreground transition-colors"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full border border-foreground/10 group-hover:border-foreground/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <span>2139902263@qq.com</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>

              <a
                href="tel:+8615379244666"
                className="group flex items-center gap-3 text-lg text-foreground hover:text-muted-foreground transition-colors"
              >
                <span className="flex items-center justify-center w-10 h-10 rounded-full border border-foreground/10 group-hover:border-foreground/20 transition-colors">
                  <Phone className="w-4 h-4" />
                </span>
                <span>+86 153 7924 4666</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
