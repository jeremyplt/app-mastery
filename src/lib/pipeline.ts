import { getAdminClient } from "@/lib/supabase";

// Pipeline de vente dans le point du jour du lundi : leads et RDV des 7
// derniers jours, comparés à la moyenne des 4 semaines d'avant. Les leads
// viennent de YouTube et suivent les sorties de vidéos : une semaine creuse
// se voit ici avant de se voir dans les ventes, trois semaines plus tard.

const DAY = 86_400_000;
const WEEKS_COMPARED = 4;
// En dessous de 60 % de la moyenne, la semaine est signalée comme creuse.
const LOW_RATIO = 0.6;

export type PipelineLead = { created_at: string; call_booked_at: string | null };

export type PipelineStats = {
  leads: number;
  leadsAvg: number;
  rdv: number;
  rdvAvg: number;
  lowLeads: boolean;
  lowRdv: boolean;
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function pipelineStats(rows: PipelineLead[], now: Date): PipelineStats {
  const end = now.getTime();
  const weekStart = end - 7 * DAY;
  const pastStart = weekStart - WEEKS_COMPARED * 7 * DAY;
  const inWeek = (iso: string | null) => !!iso && Date.parse(iso) > weekStart && Date.parse(iso) <= end;
  const inPast = (iso: string | null) => !!iso && Date.parse(iso) > pastStart && Date.parse(iso) <= weekStart;

  const leads = rows.filter((r) => inWeek(r.created_at)).length;
  const rdv = rows.filter((r) => inWeek(r.call_booked_at)).length;
  const leadsAvg = round1(rows.filter((r) => inPast(r.created_at)).length / WEEKS_COMPARED);
  const rdvAvg = round1(rows.filter((r) => inPast(r.call_booked_at)).length / WEEKS_COMPARED);
  return {
    leads,
    leadsAvg,
    rdv,
    rdvAvg,
    lowLeads: leadsAvg >= 5 && leads < leadsAvg * LOW_RATIO,
    lowRdv: rdvAvg >= 2 && rdv < rdvAvg * LOW_RATIO,
  };
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n > 1 ? "s" : ""}`;
}

function avg(n: number): string {
  return String(n).replace(".", ",");
}

// Lignes HTML du point du jour (même style que les autres sections).
export function pipelineLines(s: PipelineStats): string[] {
  const lines = [
    `${s.leads} ${s.leads > 1 ? "nouveaux leads" : "nouveau lead"} sur les 7 derniers jours, pour ${avg(s.leadsAvg)} par semaine en moyenne sur les 4 semaines d'avant.`,
    `${plural(s.rdv, "RDV de vente posé")} sur les 7 derniers jours, pour ${avg(s.rdvAvg)} par semaine en moyenne.`,
  ];
  if (s.lowLeads || s.lowRdv) {
    lines.push(
      "<b>Semaine creuse :</b> les leads suivent les sorties de vidéos. Une vidéo avec son propre cadeau cette semaine, ou un email aux leads qui n'ont pas encore réservé, remplit le pipeline des trois prochaines semaines.",
    );
  }
  return lines;
}

export async function loadPipeline(now: Date): Promise<PipelineStats> {
  const since = new Date(now.getTime() - (WEEKS_COMPARED + 1) * 7 * DAY).toISOString();
  const { data, error } = await getAdminClient()
    .from("crm_leads")
    .select("created_at, call_booked_at")
    .or(`created_at.gte.${since},call_booked_at.gte.${since}`);
  if (error) throw new Error(`Pipeline : ${error.message}`);
  return pipelineStats((data ?? []) as PipelineLead[], now);
}
