import { api } from "@/lib/api";
import { TInvoice } from "@/types/invoices";

export const get_invoices = (): Promise<TInvoice[]> => api("/api/invoices");
