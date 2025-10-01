import { TInvoiceSchema } from "@/components/dashboard/invoices/add-invoice";
import { api } from "@/lib/api";
import { TInvoice } from "@/types/invoices";

export const get_invoices = (): Promise<TInvoice[]> => api("/api/invoices");

export const add_invoice = (data: TInvoiceSchema): Promise<TInvoice> => {
  return api("/api/invoices", {
    method: "POST",
    body: data,
  });
};
