"use client";
import { useQuery } from "@tanstack/react-query";
import { get_invoices } from "@/api/invoices";
const Page = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["invoices"],
    queryFn: get_invoices,
  });

  return (
    <div>
      <h1 className="text-lg font-bold">فاکتورها</h1>

      {data && (
        <div className="mt-10 border">
          {data.map((invoice) => (
            <div key={invoice.id}>
              <h1>{invoice.description}</h1>
              <img src={`/api/r2/${invoice.photo} `} alt="" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
