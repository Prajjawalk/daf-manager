"use client";
import Link from "next/link";
import { ArrowRight, CreditCard, Plus } from "lucide-react";

import { Button } from "../..//components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { DafActivityTable } from "../..//components/daf-activity-table";
import { useQuery } from "@tanstack/react-query";
import { formatUsdc } from "../utils/formatUsdc";
import { Daf } from "../utils/endaoment-types";

export default function DashboardPage() {
  const { data: dafs, isLoading } = useQuery({
    queryKey: ["All DAFs"],
    queryFn: async () => {
      const response = await fetch(`/api/get-dafs`, { credentials: "include" });
      const data = await response.json();
      return data;
    },
  });

  const { data: dafActivities } = useQuery({
    queryKey: ["DAF Activities", dafs],
    enabled: !!dafs,
    queryFn: async () => {
      if (!dafs) return {};

      const activities = await Promise.all(
        dafs.map(async (daf: { id: string }) => {
          const response = await fetch(`/api/daf-activity?fundId=${daf.id}`, {
            credentials: "include",
          });
          const data = await response.json();
          return { dafId: daf.id, activities: data };
        })
      );

      return activities.reduce((acc, curr) => {
        acc[curr.dafId] = curr.activities;
        return acc;
      }, {});
    },
  });

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your Donor Advised Funds and charitable giving.
          </p>
        </div>
        <Button asChild>
          <Link href="/new-daf">
            <Plus className="mr-2 h-4 w-4" /> Create New DAF
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-7 mb-8">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent DAF transactions and activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DafActivityTable />
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="ml-auto" asChild>
              <Link href="/my-dafs">
                View all transactions <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Your DAFs</CardTitle>
            <CardDescription>
              Quick access to your Donor Advised Funds.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {isLoading ? (
              <div>Loading DAFs...</div>
            ) : dafs?.length === 0 ? (
              <div>No DAFs found</div>
            ) : (
              dafs?.map((daf: Daf) => {
                const lastActivity = dafActivities?.[daf.id]?.[0];
                const lastActivityText = lastActivity
                  ? `${lastActivity.type} - ${lastActivity.amount}`
                  : "No recent activity";

                return (
                  <DafCard
                    key={daf.id}
                    name={daf.name}
                    balance={formatUsdc(daf.usdcBalance)}
                    lastActivity={lastActivityText}
                  />
                );
              })
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/new-daf">
                <Plus className="mr-2 h-4 w-4" /> Create New DAF
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function DafCard({
  name,
  balance,
  lastActivity,
}: {
  name: string;
  balance: string;
  lastActivity: string;
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{name}</h3>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-lg font-bold mb-1">{balance}</div>
      <p className="text-xs text-muted-foreground">{lastActivity}</p>
    </div>
  );
}
