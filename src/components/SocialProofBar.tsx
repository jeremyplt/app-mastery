"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 500, suffix: "+", label: "eleves" },
  { value: 14, suffix: "", label: "modules" },
  { value: 90, suffix: "+", label: "lecons" },
  { value: 4.9, suffix: "/5", label: "satisfaction", decimals: 1 },
];

function AnimatedNumber({
  target,
  suffix,
  decimals = 0,
  inView,
}: {
  target: number;
  suffix: string;
  decimals?: number;
  inView: boolean;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1600;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [inView, target]);

  const display =
    decimals > 0 ? current.toFixed(decimals) : Math.round(current);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export default function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="relative z-1 w-full border-y border-[var(--border)] py-8 md:py-10"
    >
      <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`flex flex-col items-center text-center gap-1 py-2 ${
              i < stats.length - 1 ? "md:border-r md:border-[var(--border)]" : ""
            }`}
          >
            <span className="text-2xl font-bold text-[var(--fg)]">
              <AnimatedNumber
                target={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
                inView={isInView}
              />
            </span>
            <span className="text-sm text-[var(--muted-fg)]">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
