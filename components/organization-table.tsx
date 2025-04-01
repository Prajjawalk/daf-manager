"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Building,
  Check,
  MoreHorizontal,
  Star,
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

const organizations = [
  {
    id: "1",
    name: "Red Cross",
    category: "Disaster Relief",
    ein: "53-0196605",
    location: "Washington, DC",
    supported: true,
    favorite: true,
  },
  {
    id: "2",
    name: "Doctors Without Borders",
    category: "Healthcare",
    ein: "13-3433452",
    location: "New York, NY",
    supported: true,
    favorite: false,
  },
  {
    id: "3",
    name: "World Wildlife Fund",
    category: "Environmental",
    ein: "52-1693387",
    location: "Washington, DC",
    supported: true,
    favorite: true,
  },
  {
    id: "4",
    name: "UNICEF",
    category: "Children's Welfare",
    ein: "13-1760110",
    location: "New York, NY",
    supported: false,
    favorite: false,
  },
  {
    id: "5",
    name: "Habitat for Humanity",
    category: "Housing",
    ein: "91-1914868",
    location: "Atlanta, GA",
    supported: true,
    favorite: false,
  },
  {
    id: "6",
    name: "American Cancer Society",
    category: "Healthcare",
    ein: "13-1788491",
    location: "Atlanta, GA",
    supported: false,
    favorite: false,
  },
];

export function OrganizationTable() {
  const [sorting, setSorting] = useState<{
    column: string;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedOrgs = [...organizations].sort((a, b) => {
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
                onClick={() => handleSort("category")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Category
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>EIN</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Favorite</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrgs.map((org) => (
            <TableRow key={org.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  {org.name}
                </div>
              </TableCell>
              <TableCell>{org.category}</TableCell>
              <TableCell>{org.ein}</TableCell>
              <TableCell>{org.location}</TableCell>
              <TableCell>
                {org.supported ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                  >
                    <Check className="mr-1 h-3 w-3" /> Supported
                  </Badge>
                ) : (
                  <Badge variant="outline">Not Supported</Badge>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className={
                    org.favorite ? "text-yellow-500" : "text-muted-foreground"
                  }
                >
                  <Star className="h-4 w-4" />
                  <span className="sr-only">Favorite</span>
                </Button>
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
                      <Link href={`/organizations/${org.id}`}>
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    {org.supported ? (
                      <DropdownMenuItem>Make Donation</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>Add to DAF</DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      {org.favorite
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                    </DropdownMenuItem>
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
