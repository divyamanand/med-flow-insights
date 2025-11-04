import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ColumnDef<T> = {
  id: string;
  header: ReactNode;
  className?: string;
  // Provide either accessor (returns ReactNode) or cell (receives row model)
  accessor?: (row: T) => ReactNode;
  cell?: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: (row: T, index?: number) => string | number;
  empty?: ReactNode;
  className?: string;
  dense?: boolean; // compact row height
  striped?: boolean; // alternating row background
  hoverable?: boolean; // row hover effect
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  empty,
  className,
  dense,
  striped = true,
  hoverable = true,
}: DataTableProps<T>) {
  const css = {
    table: cn("w-full", className),
    thead: "",
    th: "text-muted-foreground",
    row: cn(
      "transition-colors",
      dense ? "h-10" : "h-12",
      hoverable && "hover:bg-muted/50",
    ),
    cell: "align-middle",
  };

  const renderCell = (col: ColumnDef<T>, row: T) => {
    if (col.cell) return col.cell(row);
    if (col.accessor) return col.accessor(row);
    return null;
  };

  return (
    <div className="rounded-md border animate-in fade-in-50 duration-300">
      <Table className={css.table}>
        <TableHeader className={css.thead}>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.id} className={cn(css.th, col.className)}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                {empty}
              </TableCell>
            </TableRow>
          )}
          {data.map((row, index) => (
            <TableRow
              key={rowKey(row, index)}
              className={cn(
                css.row,
                striped && index % 2 === 1 && "bg-muted/20",
              )}
            >
              {columns.map((col) => (
                <TableCell key={col.id} className={cn(css.cell, col.className)}>
                  {renderCell(col, row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
