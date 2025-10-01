"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { get_invoices } from "@/api/invoices";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Clipboard, PlusIcon } from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: get_invoices,
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">فاکتورها</h1>
        <Button>
          <PlusIcon className="w-4 h-4" />
          افزودن فاکتور
        </Button>
      </div>

      <Table className="border mt-8">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>ردیف</TableHead>
            <TableHead>عکس</TableHead>
            <TableHead>توضیحات</TableHead>
            <TableHead>تاریخ ایجاد</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <MockSkeleton />
          ) : (
            data?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="max-w-12">
                  <ImagePreview
                    image={`/api/r2/${String(item.photo).trim()}`}
                  />
                </TableCell>
                <TableCell className="max-w-10 truncate text-xs">
                  {item.description}
                </TableCell>
                <TableCell className="text-xs">
                  {new Date(item.createdAt).toLocaleString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    className="bg-amber-500 hover:bg-amber-600 cursor-pointer text-white"
                    // variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(
                          `https://rahabgostar.ir/api/r2/${String(
                            item.photo
                          ).trim()}`
                        )
                        .then(() => {
                          toast.success("لینک عکس مورد نظر در کلیپبورد کپی شد");
                        });
                    }}
                  >
                    <Clipboard />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;

const MockSkeleton = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton className="w-1/2 h-8 rounded-lg" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-1/2 h-8 rounded-lg" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-1/2 h-8 rounded-lg" />
      </TableCell>
      <TableCell>
        <Skeleton className="w-1/2 h-8 rounded-lg" />
      </TableCell>
    </TableRow>
  ));
};

const ImagePreview = ({ image }: { image: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Image
          className="rounded-lg w-auto h-auto"
          src={image}
          width={52}
          height={52}
          alt={image.split("/").pop() || "image"}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>مشاهده عکس</DialogTitle>
        </DialogHeader>
        <Image
          className="rounded-lg w-full h-auto"
          src={image}
          width={1080}
          height={1080}
          alt={image.split("/").pop() || "image"}
        />
      </DialogContent>
    </Dialog>
  );
};
