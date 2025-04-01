"use client";
import { Building, CreditCard, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";

export function DafActivityTable() {
  // Query to fetch all DAFs
  const { data: dafs } = useQuery({
    queryKey: ["All DAFs"],
    queryFn: async () => {
      const response = await fetch(`/api/get-dafs`, { credentials: "include" });
      return response.json();
    },
  });

  // Query to fetch activities for all DAFs
  const { data: activities, isLoading } = useQuery({
    queryKey: ["DAF Activities", dafs],
    enabled: !!dafs,
    queryFn: async () => {
      // Fetch activities for each DAF
      const allActivities = await Promise.all(
        dafs.map(async (daf: { id: string }) => {
          const response = await fetch(`/api/daf-activity?fundId=${daf.id}`, {
            credentials: "include",
          });
          const data = await response.json();
          return data;
        })
      );
      // Flatten and sort activities by date
      return allActivities
        .flat()
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    },
  });

  if (isLoading) {
    return <div>Loading activities...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>DAF</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities?.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">
                {new Date(activity.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {activity.type === "Donation" ? (
                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  {activity.description}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                  {activity.daf}
                </div>
              </TableCell>
              <TableCell className="text-right">{activity.amount}</TableCell>
              <TableCell className="text-right">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                >
                  {activity.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
