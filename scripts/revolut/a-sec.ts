// Rejoue à sec le webhook Revolut sur de vraies transactions, en LECTURE SEULE :
// GET chez Revolut, SELECT des élèves dans Supabase, puis tout le traitement
// avec une table en mémoire. Rien n'est coché, aucune alerte ne part.
//   npx tsx scripts/revolut/a-sec.ts <id de transaction> [...]
//   npx tsx scripts/revolut/a-sec.ts --derniers 20
// Variables : REVOLUT_API_KEY, REVOLUT_SIGNING_KEY (PEM en base64),
// NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from "@supabase/supabase-js";
import { loadStudents } from "@/lib/facturation/crm";
import { fetchTransaction, revolutGet } from "@/lib/revolut/client";
import { handleEvent, type Outcome, type RevolutStore, type StoredTransaction } from "@/lib/revolut/webhook";
import type { RevolutTransaction } from "@/lib/revolut/types";

const args = process.argv.slice(2);
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

function memoryStore(): RevolutStore {
  const rows = new Map<string, StoredTransaction>();
  return {
    get: async (id) => rows.get(id) ?? null,
    save: async (tx) => void rows.set(tx.id, { ...(rows.get(tx.id) ?? { match_status: null, student_id: null, schedule_position: null, alerts: {} }), id: tx.id, state: tx.state }),
    touch: async () => undefined,
    claim: async (id) => {
      const r = rows.get(id);
      if (!r || r.match_status) return false;
      r.match_status = "processing";
      return true;
    },
    release: async (id) => void ((rows.get(id) as StoredTransaction).match_status = null),
    finish: async (id, o: Outcome) => void Object.assign(rows.get(id) as StoredTransaction, o),
    noteAlerts: async () => undefined,
  };
}

async function main() {
  // La liste donne déjà les transactions complètes : un seul appel (Revolut limite le débit).
  const list = args[0] === "--derniers" ? await revolutGet<RevolutTransaction[]>("/api/1.0/transactions", `count=${Number(args[1] ?? 20)}`) : null;
  const students = await loadStudents(db);
  for (const id of list ? list.map((t) => t.id) : args) {
    const tx = list?.find((t) => t.id === id) ?? (await fetchTransaction(id));
    const leg = tx.legs?.[0];
    console.log(`\n${tx.completed_at ?? tx.created_at} ${tx.type} ${tx.state} ${leg?.amount} ${leg?.currency} « ${tx.reference ?? ""} » ${leg?.description ?? ""}`);
    const { result } = await handleEvent(
      { event: "TransactionCreated", data: tx },
      {
        store: memoryStore(),
        fetchTransaction,
        loadStudents: async () => structuredClone(students),
        markPaid: async (studentId, position, date) => {
          const s = students.find((x) => x.id === studentId);
          console.log(`  COCHERAIT : ${s?.name} échéance ${position}/${s?.schedule.length}, payée le ${date}`);
          return true;
        },
        alert: async (a) => console.log(`  ALERTERAIT : ${a.title}\n    ${a.lines.join("\n    ")}`),
        now: () => new Date(),
      },
    );
    console.log(`  => ${result}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
