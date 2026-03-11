"use client";

import { useState, useEffect } from "react";

// ============================================================
// CONFIGURATION : Change cette date pour la fermeture des portes
// ============================================================
export const LAUNCH_DEADLINE = new Date("2026-03-24T23:59:59+01:00"); // 24 mars 2026, 23h59 heure de Paris

export function useIsExpired() {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const check = () => setExpired(Date.now() >= LAUNCH_DEADLINE.getTime());
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  return expired;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = new Date().getTime();
  const diff = LAUNCH_DEADLINE.getTime() - now;

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl sm:text-5xl font-bold tracking-tight tabular-nums text-white">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/50 mt-1">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <span className="text-2xl sm:text-4xl font-bold text-white/30 self-start mt-1">
      :
    </span>
  );
}

export function CountdownTimerLarge() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        <TimeBlock value={0} label="Jours" />
        <Separator />
        <TimeBlock value={0} label="Heures" />
        <Separator />
        <TimeBlock value={0} label="Min" />
        <Separator />
        <TimeBlock value={0} label="Sec" />
      </div>
    );
  }

  const expired = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

  if (expired) {
    return (
      <p className="text-xl sm:text-2xl font-bold text-red-400">
        Les inscriptions sont fermées.
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      <TimeBlock value={time.days} label="Jours" />
      <Separator />
      <TimeBlock value={time.hours} label="Heures" />
      <Separator />
      <TimeBlock value={time.minutes} label="Min" />
      <Separator />
      <TimeBlock value={time.seconds} label="Sec" />
    </div>
  );
}

export function CountdownTimerCompact() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(getTimeLeft());
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  const expired = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;
  if (expired) return null;

  const parts = [];
  if (time.days > 0) parts.push(`${time.days}j`);
  parts.push(`${String(time.hours).padStart(2, "0")}h`);
  parts.push(`${String(time.minutes).padStart(2, "0")}m`);
  parts.push(`${String(time.seconds).padStart(2, "0")}s`);

  return (
    <span className="tabular-nums font-bold text-amber-400">
      {parts.join(" ")}
    </span>
  );
}
