import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata faixa salarial: 9000-13000 → "R$ 9.000 — 13.000" */
export function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
  if (min && max) return `R$ ${fmt(min)} — ${fmt(max)}`;
  if (min) return `R$ ${fmt(min)}+`;
  return `Até R$ ${fmt(max!)}`;
}

/** Data relativa em pt-BR: "há 2 dias" */
export function timeAgo(iso: string, now = Date.now()): string {
  const diff = now - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ontem";
  if (days < 30) return `há ${days} dias`;
  const months = Math.floor(days / 30);
  return months === 1 ? "há 1 mês" : `há ${months} meses`;
}

/** "Hoje" | "Ontem" | "12/08/2025" */
export function formatRelativeDate(ts: number, now = Date.now()): string {
  const d = new Date(ts);
  const today = new Date(now);
  const isSameDay = d.toDateString() === today.toDateString();
  if (isSameDay) return "Hoje";
  const yesterday = new Date(now - 86400000);
  if (d.toDateString() === yesterday.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR");
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-ZÀ-Ú]$/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Cria um currículo vazio (criação do zero) */
export function emptyResume(name: string, personalName = "") {
  return {
    id: `resume-${Date.now()}`,
    name,
    isBase: true,
    updatedAt: Date.now(),
    personal: {
      name: personalName,
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },
    summary: "",
    experiences: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    projects: [],
  };
}

export const uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Substitui o item no índice mantendo a ordem */
export function replaceAt<T>(arr: T[], index: number, value: T): T[] {
  const copy = [...arr];
  copy[index] = value;
  return copy;
}

