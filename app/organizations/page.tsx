"use client";

import { useState } from "react";
import Link from "next/link";
import { Building, Check, ChevronsUpDown, Plus, Search } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { Textarea } from "../../components/ui/textarea";
// import { OrganizationTable } from "../../components/organization-table";
import { cn } from "../../lib/utils";
import { useSearch } from "../utils/useSearch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

const dafs = [
  { label: "Family Legacy Fund", value: "family-legacy" },
  { label: "Education Initiative", value: "education-initiative" },
  { label: "Environmental Fund", value: "environmental-fund" },
];

export default function OrganizationsPage() {
  const [open, setOpen] = useState(false);
  const [selectedDaf, setSelectedDaf] = useState<string | null>(null);
  const [addOrgDialogOpen, setAddOrgDialogOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    submitSearch,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSearch();

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Search, manage, and add charitable organizations to your DAFs.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={addOrgDialogOpen} onOpenChange={setAddOrgDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Organization</DialogTitle>
                <DialogDescription>
                  Add a new charitable organization to your DAF.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input id="org-name" placeholder="e.g., Red Cross" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ein">EIN (Tax ID)</Label>
                  <Input id="ein" placeholder="XX-XXXXXXX" />
                </div>
                <div className="grid gap-2">
                  <Label>Select DAF</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between"
                      >
                        {selectedDaf
                          ? dafs.find((daf) => daf.value === selectedDaf)?.label
                          : "Select DAF..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search DAFs..." />
                        <CommandList>
                          <CommandEmpty>No DAF found.</CommandEmpty>
                          <CommandGroup>
                            {dafs.map((daf) => (
                              <CommandItem
                                key={daf.value}
                                value={daf.value}
                                onSelect={(currentValue) => {
                                  setSelectedDaf(
                                    currentValue === selectedDaf
                                      ? null
                                      : currentValue
                                  );
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedDaf === daf.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {daf.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this organization..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAddOrgDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setAddOrgDialogOpen(false)}>
                  Add Organization
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            onBlur={submitSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
            placeholder="Search organizations..."
            className="w-full pl-8 bg-background"
          />
        </div>
      </div>

      <Tabs defaultValue="table" className="mb-8">
        <TabsContent value="table" className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>EIN</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : !data?.pages[0]?.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No organizations found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.pages.map((page) =>
                    page.map((org) => (
                      <TableRow key={org.ein ?? org.id}>
                        <TableCell>
                          {org.logo ? (
                            <img
                              src={org.logo}
                              alt={org.name}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <Building className="h-8 w-8 p-1.5 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {org.name}
                        </TableCell>
                        <TableCell>{org.ein}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {org.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm">
                            Add to DAF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="cards" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <OrganizationCard
              name="Red Cross"
              category="Disaster Relief"
              ein="53-0196605"
              location="Washington, DC"
              supported={true}
            />
            <OrganizationCard
              name="Doctors Without Borders"
              category="Healthcare"
              ein="13-3433452"
              location="New York, NY"
              supported={true}
            />
            <OrganizationCard
              name="World Wildlife Fund"
              category="Environmental"
              ein="52-1693387"
              location="Washington, DC"
              supported={true}
            />
            <OrganizationCard
              name="UNICEF"
              category="Children's Welfare"
              ein="13-1760110"
              location="New York, NY"
              supported={false}
            />
            <OrganizationCard
              name="Habitat for Humanity"
              category="Housing"
              ein="91-1914868"
              location="Atlanta, GA"
              supported={true}
            />
            <OrganizationCard
              name="American Cancer Society"
              category="Healthcare"
              ein="13-1788491"
              location="Atlanta, GA"
              supported={false}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}

function OrganizationCard({
  name,
  category,
  ein,
  location,
  supported,
}: {
  name: string;
  category: string;
  ein: string;
  location: string;
  supported: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Building className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm text-muted-foreground">EIN</span>
            <span className="font-medium">{ein}</span>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm text-muted-foreground">Location</span>
            <span className="font-medium">{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="font-medium">
              {supported ? (
                <span className="text-green-600 flex items-center">
                  <Check className="mr-1 h-4 w-4" /> Supported
                </span>
              ) : (
                "Not Supported"
              )}
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link
                href={`/organizations/${name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                View Details
              </Link>
            </Button>
            <Button variant="secondary" size="sm" className="w-full">
              {supported ? "Donate" : "Add to DAF"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
