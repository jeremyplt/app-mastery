// Transaction de l'API Business de Revolut (GET /api/1.0/transaction/{id}, et
// data de l'événement TransactionCreated des webhooks v2).

export type RevolutLeg = {
  leg_id?: string;
  account_id: string;
  amount: number;
  currency: string;
  description?: string;
  balance?: number;
};

export type RevolutTransaction = {
  id: string;
  type: string;
  state: string;
  request_id?: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  reference?: string;
  legs: RevolutLeg[];
};
