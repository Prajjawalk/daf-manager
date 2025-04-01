"use client";
import Link from "next/link";
import { CreditCard, Plus, Search } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { DonationModal } from "../../components/DonationModal";
import { GrantBox } from "../../components/GrantBox";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Daf } from "../utils/endaoment-types";

const allDafsQueryOptions = queryOptions({
  queryKey: ["All DAFs"],
  queryFn: async (): Promise<Daf[]> => {
    const response = await fetch(`/api/get-dafs`, { credentials: "include" });
    const list = await response.json();

    if (!Array.isArray(list)) {
      throw new Error("Invalid response");
    }

    return list;
  },
});

export default function MyDafsPage() {
  const allDafsResponse = useQuery(allDafsQueryOptions);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [seectedDaf, setSelectedDaf] = useState("");
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [dafName, setDafname] = useState("");

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My DAFs</h1>
          <p className="text-muted-foreground">
            Manage your Donor Advised Funds and track your giving.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/new-daf">
              <Plus className="mr-2 h-4 w-4" /> Create New DAF
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search DAFs..."
            className="w-full pl-8 bg-background"
          />
        </div>
      </div>

      <Tabs defaultValue="cards" className="mb-8">
        <TabsContent value="cards" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allDafsResponse.data?.map((daf: Daf) => (
              <DafDetailCard
                key={daf.id}
                id={daf.id}
                name={daf.name}
                balance={`$${daf.usdcBalance}`}
                description={daf.description}
                setShowDonationModal={setShowDonationModal}
                setSelectedDaf={setSelectedDaf}
                setShowGrantModal={setShowGrantModal}
                setDafname={setDafname}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      {showDonationModal && (
        <DonationModal
          isOpen={showDonationModal}
          onClose={() => setShowDonationModal(false)}
          fundId={seectedDaf}
        />
      )}
      {showGrantModal && (
        <GrantBox
          daf={seectedDaf}
          dafName={dafName}
          onClose={() => setShowGrantModal(false)}
        />
      )}
    </div>
  );
}

function DafDetailCard({
  id,
  name,
  balance,
  description,
  setShowDonationModal,
  setSelectedDaf,
  setShowGrantModal,
  setDafname,
}: {
  id: string;
  name: string;
  balance: string;
  description: string;
  setShowDonationModal: Dispatch<SetStateAction<boolean>>;
  setSelectedDaf: Dispatch<SetStateAction<string>>;
  setShowGrantModal: Dispatch<SetStateAction<boolean>>;
  setDafname: Dispatch<SetStateAction<string>>;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm text-muted-foreground">
              Current Balance
            </span>
            <span className="font-medium">{balance}</span>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                setShowGrantModal(true);
                setDafname(name);
              }}
            >
              Grant
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                setShowDonationModal(true);
                setSelectedDaf(id);
              }}
            >
              Donate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
