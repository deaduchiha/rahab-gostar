"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TrashIcon, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { add_invoice } from "@/api/invoices";
import { toast } from "sonner";
import { useState } from "react";

const AddInvoice = () => {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const form = useForm<TInvoiceSchema>({
    resolver: zodResolver(invoiceSchema),
  });

  const { mutate } = useMutation({
    mutationFn: add_invoice,
  });

  const onSubmit = form.handleSubmit((values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("فاکتور با موفقیت اضافه شد");
        qc.invalidateQueries({ queryKey: ["invoices"] });
        form.reset();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4" />
          افزودن فاکتور
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>افزودن فاکتور</DialogTitle>
          <DialogDescription>
            فاکتوری جدید را افزوده و آن را به لیست فاکتورها اضافه کنید.
          </DialogDescription>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>توضیحات (اختیاری)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="توضیحات..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عکس فاکتور</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex relative items-center gap-2">
                          {field.value ? (
                            <div className="relative w-full group hover:bg-gray-50 transition-colors h-32">
                              <Image
                                src={URL.createObjectURL(field.value)}
                                width={1080}
                                height={1080}
                                alt="image"
                                className="rounded-lg w-full max-h-32 object-contain"
                              />

                              <div
                                onClick={() => field.onChange(null)}
                                className="absolute invisible group-hover:visible top-0 z-[9999999] left-0 w-full h-full bg-black/30 rounded-lg flex items-center justify-center"
                              >
                                <Button>
                                  <TrashIcon className="text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Label
                              htmlFor="image"
                              className="cursor-pointer h-32 w-full flex items-center justify-center border border-dashed rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              آپلود عکس
                              <Upload className="w-4 h-4" />
                            </Label>
                          )}
                        </div>

                        <Input
                          id="image"
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">افزودن فاکتور</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoice;

const invoiceSchema = z.object({
  description: z.string().optional(),
  image: z.instanceof(File, { message: "لطفا عکس را آپلود کنید" }),
});

export type TInvoiceSchema = z.infer<typeof invoiceSchema>;
