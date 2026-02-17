"use client";

import { ColumnDef } from "@tanstack/react-table";

export const AllCompanyColumn: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Company Name",
    cell: ({ row }) => {
      return <div>{row.getValue("name") || "N/A"}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div>{row.getValue("email") || "N/A"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <div>{row.getValue("status") || "Active"}</div>;
    },
  },
];