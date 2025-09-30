"use client";
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

const Page = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: get_invoices,
  });

  return (
    <div>
      <h1 className="text-lg font-bold">فاکتورها</h1>

      <Table className="border mt-8">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>ردیف</TableHead>
            <TableHead>عکس</TableHead>
            <TableHead>توضیحات</TableHead>
            <TableHead>تاریخ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <MockSkeleton />
          ) : (
            data?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Image
                    className="rounded-lg w-auto h-auto"
                    src={`/api/r2/${String(item.photo).trim()}`}
                    width={52}
                    height={52}
                    alt={item.description}
                  />
                </TableCell>
                <TableCell className="max-w-10 truncate">
                  {item.description}
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
