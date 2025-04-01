import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "../app/utils/useSearch"; // You'll need to create this hook
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { OrgListing } from "../app/utils/endaoment-types";

export const GrantBox = ({
  dafName,
  daf,
  onClose,
}: {
  dafName: string;
  daf: string; // Replace with your DAF type
  onClose: () => void;
}) => {
  const [selectedOrg, setSelectedOrg] = useState<OrgListing>();
  const queryClient = useQueryClient();

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

  const {
    mutate: grant,
    isIdle,
    isPending,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/grant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formData.get("amount"),
          fundId: daf,
          orgId: formData.get("orgId"),
          purpose: "General Grant",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit grant");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Daf Activity"] });
      onClose();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrg) return;
    grant(new FormData(e.currentTarget));
  };

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grant from {dafName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                {selectedOrg
                  ? "Granting to"
                  : "Search and Select an Org to grant to"}
              </label>

              {selectedOrg ? (
                <div>{selectedOrg.name}</div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onBlur={submitSearch}
                      placeholder="Search organizations..."
                    />
                    <Button type="button" onClick={submitSearch}>
                      Search
                    </Button>
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : (
                      data?.pages.map((page) =>
                        page.map((org) => (
                          <button
                            type="button"
                            key={org.ein ?? org.id}
                            onClick={() => setSelectedOrg(org)}
                            className="w-full text-left p-2 hover:bg-gray-100 rounded"
                          >
                            {org.name}
                          </button>
                        ))
                      )
                    )}

                    {hasNextPage && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage ? "Loading..." : "Load More"}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <input name="orgId" type="hidden" value={selectedOrg?.id ?? ""} />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Amount in dollars
              </label>
              <Input type="number" name="amount" required min="0" step="0.01" />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isSuccess}
            >
              {isIdle && "Grant"}
              {isPending && "Granting..."}
              {isSuccess && "Granted!"}
              {isError && "Error granting, try again"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
