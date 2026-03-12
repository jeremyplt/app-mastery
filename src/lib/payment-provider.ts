import { getAdminClient } from "./supabase";

export type PaymentProvider = "stripe" | "lemonsqueezy" | "gumroad";

const VALID_PROVIDERS: PaymentProvider[] = ["stripe", "lemonsqueezy", "gumroad"];

export function isValidProvider(value: string): value is PaymentProvider {
  return VALID_PROVIDERS.includes(value as PaymentProvider);
}

export async function getActiveProvider(): Promise<PaymentProvider> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "payment_provider")
    .single();

  if (error || !data) {
    console.error("Failed to fetch payment provider, defaulting to lemonsqueezy:", error);
    return "lemonsqueezy";
  }

  const active = data.value?.active;
  return isValidProvider(active) ? active : "lemonsqueezy";
}

export async function setActiveProvider(provider: PaymentProvider): Promise<void> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ value: { active: provider }, updated_at: new Date().toISOString() })
    .eq("key", "payment_provider");

  if (error) {
    throw new Error(`Erreur lors de la mise à jour du provider: ${error.message}`);
  }
}

export const PROVIDER_LABELS: Record<PaymentProvider, string> = {
  stripe: "Stripe",
  lemonsqueezy: "Lemon Squeezy",
  gumroad: "Gumroad",
};
