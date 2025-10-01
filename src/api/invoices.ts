import { TInvoiceSchema } from "@/components/dashboard/invoices/add-invoice";
import { api } from "@/lib/api";
import { TInvoice } from "@/types/invoices";

export const get_invoices = (): Promise<TInvoice[]> => api("/api/invoices");

export const add_invoice = (data: TInvoiceSchema): Promise<TInvoice> => {
  const formData = new FormData();
  formData.append("description", data.description ?? "");
  formData.append("image", data.image);

  return api("/api/invoices", {
    method: "POST",
    body: formData,
  });
};

export const get_image = (image: string): Promise<string> =>
  api(`/api/r2/${String(image).trim()}`);
