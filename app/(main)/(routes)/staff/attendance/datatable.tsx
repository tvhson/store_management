"use client";

import { MyObjectCombobox } from "@/components/ui/my_combobox";
import { DataTableContent } from "@/components/ui/my_table_content";
import { BonusUnit, SalaryType } from "@/entities/SalarySetting";
import { Sex, Staff } from "@/entities/Staff";
import { formatID } from "@/utils";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";

export function DataTable({
  defaultData,
  staffList,
  onDataChange,
}: {
  defaultData?: Staff[];
  staffList: Staff[];
  onDataChange?: (data: Staff[]) => void;
}) {
  const [data, setData] = React.useState<Staff[]>(
    defaultData ? defaultData : []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      id: true,
      name: true,
      position: true,
    });
  const [rowSelection, setRowSelection] = React.useState({});
  const [filterInput, setFilterInput] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFilterInput,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filterInput,
    },
  });

  React.useEffect(() => {
    if (onDataChange) onDataChange(data);
  }, [data]);

  const handleComboboxValuesChange = (values: Array<object>) => {
    setData(values as Staff[]);
  };
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between py-2">
        <MyObjectCombobox
          placeholder="Find staff..."
          choices={staffList}
          defaultValues={data}
          className="w-64"
          propToShow={["name", "id", "avatar"]}
          onValuesChange={handleComboboxValuesChange}
        />
      </div>
      <DataTableContent
        columns={columns}
        data={data}
        table={table}
        hasPagination={false}
      />
    </div>
  );
}
