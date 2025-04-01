"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Textarea } from "../../components/ui/textarea";

export default function NewDafPage() {
  const {
    mutate: createDaf,
    isIdle,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationKey: ["Create DAF"],
    mutationFn: async (formData: FormData) => {
      const rawFormObject = Object.fromEntries(formData.entries());

      const cleanedForm = {
        name: rawFormObject["name"],
        description: rawFormObject["description"],
        fundAdvisor: {
          firstName: rawFormObject["fundAdvisor.firstName"],
          lastName: rawFormObject["fundAdvisor.lastName"],
          email: rawFormObject["fundAdvisor.email"],
          address: {
            line1: rawFormObject["fundAdvisor.address.line1"],
            line2: rawFormObject["fundAdvisor.address.line2"],
            city: rawFormObject["fundAdvisor.address.city"],
            state: rawFormObject["fundAdvisor.address.state"],
            zip: rawFormObject["fundAdvisor.address.zip"],
            country: rawFormObject["fundAdvisor.address.country"],
          },
        },
      };

      const response = await fetch(`/api/create-daf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedForm),
        credentials: "include",
      });

      return response.json();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createDaf(new FormData(e.currentTarget));
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/my-dafs">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New DAF</h1>
          <p className="text-muted-foreground">
            Set up a new Donor Advised Fund to manage your charitable giving.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form id="create-daf-form" onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>DAF Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 mt-5">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Fund Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g., Family Legacy Fund"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fundAdvisor.firstName">First Name</Label>
                  <Input
                    id="fundAdvisor.firstName"
                    name="fundAdvisor.firstName"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fundAdvisor.lastName">Last Name</Label>
                  <Input
                    id="fundAdvisor.lastName"
                    name="fundAdvisor.lastName"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fundAdvisor.email">Email</Label>
                <Input
                  type="email"
                  id="fundAdvisor.email"
                  name="fundAdvisor.email"
                  required
                />
              </div>

              <div className="grid gap-4">
                <Label>Address</Label>
                <div className="grid gap-2">
                  <Input
                    placeholder="Address Line 1"
                    id="fundAdvisor.address.line1"
                    name="fundAdvisor.address.line1"
                    required
                  />
                  <Input
                    placeholder="Address Line 2 (Optional)"
                    id="fundAdvisor.address.line2"
                    name="fundAdvisor.address.line2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Input
                      placeholder="City"
                      id="fundAdvisor.address.city"
                      name="fundAdvisor.address.city"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      placeholder="State"
                      id="fundAdvisor.address.state"
                      name="fundAdvisor.address.state"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Input
                      placeholder="ZIP Code"
                      id="fundAdvisor.address.zip"
                      name="fundAdvisor.address.zip"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Input
                      placeholder="Country"
                      id="fundAdvisor.address.country"
                      name="fundAdvisor.address.country"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Please use ISO 3166-1 alpha-3 country code (e.g., USA,
                      GBR, CAN)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-5">
            <Button variant="outline" asChild>
              <Link href="/my-dafs">Cancel</Link>
            </Button>
            {isIdle || isError ? (
              <Button type="submit">
                {isIdle && "Create DAF"}
                {isError && "Error Creating DAF, Try Again"}
              </Button>
            ) : (
              <span>
                {isPending && "Creating DAF..."}
                {isSuccess && "DAF Created!"}
              </span>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
