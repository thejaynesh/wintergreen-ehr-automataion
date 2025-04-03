import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataFetchHistory, HealthcareProvider } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, Eye, Filter, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DataHistoryPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [historyData, setHistoryData] = useState<DataFetchHistory[]>([]);
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);

  // Fetch all data history
  const {
    data: fetchHistoryData,
    isLoading: historyLoading,
    isError: historyError,
    error: historyErrorMessage,
  } = useQuery<DataFetchHistory[]>({
    queryKey: ["/api/data-history"],
  });

  // Fetch all providers (to get provider names)
  const {
    data: providersData,
    isLoading: providersLoading,
    isError: providersError,
  } = useQuery<HealthcareProvider[]>({
    queryKey: ["/api/providers"],
  });

  useEffect(() => {
    if (fetchHistoryData) {
      setHistoryData(fetchHistoryData);
    }
    if (providersData) {
      setProviders(providersData);
    }
  }, [fetchHistoryData, providersData]);

  // Get provider name by providerId
  const getProviderName = (providerId: number): string => {
    const provider = providers.find((p) => p.id === providerId);
    return provider ? provider.name : "Unknown Provider";
  };

  // Get provider group ID by providerId
  const getProviderGroupId = (providerId: number): string => {
    const provider = providers.find((p) => p.id === providerId);
    return provider ? provider.groupId : "Unknown";
  };

  // Filter history based on search query
  const filteredHistory = historyData.filter((item) => {
    const searchTerm = searchQuery.toLowerCase();
    const providerName = getProviderName(item.providerId).toLowerCase();
    const groupId = getProviderGroupId(item.providerId).toLowerCase();
    const date = new Date(item.fetchDate).toLocaleString().toLowerCase();

    return (
      providerName.includes(searchTerm) ||
      groupId.includes(searchTerm) ||
      date.includes(searchTerm) ||
      item.s3Location.toLowerCase().includes(searchTerm)
    );
  });

  const isLoading = historyLoading || providersLoading;
  const isError = historyError || providersError;

  return (
    <div>
      {/* Header Section */}

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-96">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <Input
                type="text"
                placeholder="Search history..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem>Last 90 days</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Clear filters</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* History Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Healthcare Provider</TableHead>
                  <TableHead>Group ID</TableHead>
                  <TableHead>Fetch Date</TableHead>
                  <TableHead>S3 Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading fetch history...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-red-500"
                    >
                      Error loading fetch history:{" "}
                      {historyErrorMessage?.message}
                    </TableCell>
                  </TableRow>
                ) : filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-neutral-500"
                    >
                      No fetch history records found matching your search
                      criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((item) => (
                    <TableRow key={item.id} className="hover:bg-neutral-50">
                      <TableCell className="font-medium">
                        {getProviderName(item.providerId)}
                      </TableCell>
                      <TableCell>
                        {getProviderGroupId(item.providerId)}
                      </TableCell>
                      <TableCell>
                        {new Date(item.fetchDate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="font-mono bg-neutral-100 p-1 rounded text-sm">
                          {item.s3Location}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-700">
                Showing <span>{filteredHistory.length}</span>{" "}
                {filteredHistory.length === 1 ? "record" : "records"}
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <Button variant="outline" size="sm" disabled className="mr-3">
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataHistoryPage;
