import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

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

export default MockSkeleton;
