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
import {
  Search,
  Download,
  Eye,
  Filter,
  ChevronDown
} from "lucide-react";
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
    const provider = providers.find(p => p.id === providerId);
    return provider ? provider.name : "Unknown Provider";
  };

  // Get provider group ID by providerId
  const getProviderGroupId = (providerId: number): string => {
    const provider = providers.find(p => p.id === providerId);
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

  // Handle download
  const handleDownload = (s3Location: string) => {
    toast({
      title: "Download Started",
      description: `Downloading data from: ${s3Location}`,
    });
    // In a real app, this would initiate a download from the S3 location
  };

  // Handle view details
  const handleViewDetails = (id: number) => {
    toast({
      title: "View Details",
      description: `Viewing details for fetch history ID: ${id}`,
    });
    // In a real app, this would open a detailed view or redirect to a details page
  };

  // Handle export
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Exporting data fetch history to CSV...",
    });
    // In a real app, this would generate and download a CSV file
  };

  const isLoading = historyLoading || providersLoading;
  const isError = historyError || providersError;

  return (
    <div>
      {/* Header Section */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">
            Data Fetching History
          </h1>
          <p className="text-lg">
            Track and review all data fetching operations performed within the system.
          </p>
        </div>
      </div>

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
                <DropdownMenuItem>
                  Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Last 30 days
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Last 90 days
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Clear filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
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
                  <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell colSpan={5} className="text-center py-4 text-red-500">
                      Error loading fetch history: {historyErrorMessage?.message}
                    </TableCell>
                  </TableRow>
                ) : filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-neutral-500">
                      No fetch history records found matching your search criteria.
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
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(item.s3Location)}
                          title="Download data"
                        >
                          <Download className="h-4 w-4 text-primary-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(item.id)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4 text-primary-600" />
                        </Button>
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
                Showing{" "}
                <span>{filteredHistory.length}</span>{" "}
                {filteredHistory.length === 1 ? "record" : "records"}
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="mr-3"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
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
