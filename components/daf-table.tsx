"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Building,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

const dafs = [
  {
    id: "1",
    name: "Family Legacy Fund",
    balance: "$25,432.50",
    created: "Jan 15, 2022",
    organizations: 5,
    ytdDonations: "$3,500.00",
    status: "Active",
  },
  {
    id: "2",
    name: "Education Initiative",
    balance: "$12,500.00",
    created: "Mar 10, 2022",
    organizations: 3,
    ytdDonations: "$7,500.00",
    status: "Active",
  },
  {
    id: "3",
    name: "Environmental Fund",
    balance: "$7,299.39",
    created: "Sep 22, 2022",
    organizations: 4,
    ytdDonations: "$1,234.00",
    status: "Active",
  },
];

export function DafTable() {
  const [sorting, setSorting] = useState<{
    column: string;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedDafs = [...dafs].sort((a, b) => {
    if (!sorting) return 0;

    const aValue = a[sorting.column as keyof typeof a];
    const bValue = b[sorting.column as keyof typeof b];

    if (sorting.direction === "asc") {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  const handleSort = (column: string) => {
    if (sorting && sorting.column === column) {
      setSorting({
        column,
        direction: sorting.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSorting({
        column,
        direction: "asc",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Name
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("balance")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Balance
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Organizations</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("ytdDonations")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                YTD Donations
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDafs.map((daf) => (
            <TableRow key={daf.id}>
              <TableCell className="font-medium">{daf.name}</TableCell>
              <TableCell>{daf.balance}</TableCell>
              <TableCell>{daf.created}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  {daf.organizations}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  {daf.ytdDonations}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                >
                  {daf.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/my-dafs/${daf.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/my-dafs/${daf.id}/donate`}>
                        Make Donation
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/my-dafs/${daf.id}/edit`}>Edit DAF</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/my-dafs/${daf.id}/add-organization`}>
                        Add Organization
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Download Statement</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
