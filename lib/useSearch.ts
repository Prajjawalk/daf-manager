import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Organization {
  id: string;
  name: string;
  description: string;
  ein: string;
  logo?: string;
}

interface SearchResponse {
  organizations: Organization[];
  hasMore: boolean;
  nextCursor?: string;
}

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<SearchResponse, Error, SearchResponse, string[], string>({
      queryKey: ["organizations", debouncedTerm],
      queryFn: async ({ pageParam = "" }) => {
        const response = await fetch(
          `https://api.endaoment.com/v2/orgs/search?` +
            new URLSearchParams({
              searchTerm: debouncedTerm,
              cursor: pageParam,
            })
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      },
      getNextPageParam: (lastPage: SearchResponse) => lastPage.nextCursor,
      enabled: Boolean(debouncedTerm),
      initialPageParam: "",
    });

  const submitSearch = () => {
    setDebouncedTerm(searchTerm);
  };

  return {
    searchTerm,
    setSearchTerm,
    submitSearch,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  };
}
