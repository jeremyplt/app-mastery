"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  Database,
  Bot,
  CreditCard,
  BarChart3,
  Bug,
  Target,
  Megaphone,
  Play,
} from "lucide-react";

const tools = [
  { name: "Expo (React Native)", description: "Framework pour iOS & Android", icon: Smartphone },
  { name: "Supabase", description: "Base de donnees, auth & backend", icon: Database },
  { name: "Claude Code", description: "Agent IA pour coder", icon: Bot },
  { name: "RevenueCat", description: "Gestion des abonnements", icon: CreditCard },
  { name: "Posthog", description: "Analytics & comportement", icon: BarChart3 },
  { name: "Sentry", description: "Monitoring des erreurs", icon: Bug },
  { name: "Tenjin", description: "Attribution marketing", icon: Target },
  { name: "Meta Ads", description: "Publicite Facebook & Instagram", icon: Megaphone },
  { name: "TikTok Ads", description: "Publicite TikTok", icon: Play },
];

export default function TechStack() {
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Les Outils que tu Vas Maitriser
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              className="card p-5 flex items-start gap-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <tool.icon
                className="text-[var(--muted-fg)] shrink-0 mt-0.5"
                size={22}
              />
              <div>
                <h3 className="font-semibold text-sm">{tool.name}</h3>
                <p className="text-[var(--muted-fg)] text-sm mt-0.5">
                  {tool.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
