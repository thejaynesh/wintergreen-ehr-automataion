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
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

// Sample data for demonstration
const sampleProviders = [
  {
    id: "1",
    name: "Karleigh Mcdaniel",
    groupId: "VOLP-2024",
    providerName: "Karleigh Mcdaniel",
    ehrGroupId: "VOLP-2024"
  },
  {
    id: "2",
    name: "Northwest Health Partners",
    groupId: "NWHP-2024",
    providerName: "Northwest Health Partners",
    ehrGroupId: "NWHP-2024"
  },
  {
    id: "3",
    name: "Eastside Medical Group",
    groupId: "EMG-742",
    providerName: "Eastside Medical Group",
    ehrGroupId: "EMG-742"
  },
  {
    id: "4",
    name: "Valley Care Specialists",
    groupId: "VCS-2023-09",
    providerName: "Valley Care Specialists",
    ehrGroupId: "VCS-2023-09"
  }
];

const sampleHistoryData = [
  {
    id: "1",
    providerId: "1",
    fetchDate: "2025-03-15T09:32:47Z",
    s3Location: "s3://ehr-data-fetch/VOLP-2024/2025-03-15/records.json",
    recordCount: 128,
    status: "Completed"
  },
  {
    id: "2",
    providerId: "2",
    fetchDate: "2025-04-01T14:23:10Z",
    s3Location: "s3://ehr-data-fetch/NWHP-2024/2025-04-01/data-batch.json",
    recordCount: 347,
    status: "Completed"
  },
  {
    id: "3",
    providerId: "3",
    fetchDate: "2025-04-10T08:15:22Z",
    s3Location: "s3://ehr-data-fetch/EMG-742/2025-04-10/patient-records.json",
    recordCount: 95,
    status: "Completed"
  }
];

const timeFilterOptions = [
  { id: "7days", name: "Last 7 days" },
  { id: "30days", name: "Last 30 days" },
  { id: "90days", name: "Last 90 days" },
  { id: "all", name: "All time" }
];

const statusFilterOptions = [
  { id: "completed", name: "Completed" },
  { id: "failed", name: "Failed" },
  { id: "processing", name: "Processing" }
];

const DataHistoryPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [historyData, setHistoryData] = useState(sampleHistoryData);
  const [providers, setProviders] = useState(sampleProviders);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // Mock the query hooks for demo purposes
  // In a real app, these would be actual API calls
  const historyLoading = false;
  const historyError = false;
  const historyErrorMessage = null;
  const providersLoading = false;
  const providersError = false;

  // Initialize with sample data on component mount
  useEffect(() => {
    setHistoryData(sampleHistoryData);
  }, []);

  // Get provider name by providerId
  const getProviderName = (providerId: string): string => {
    const provider = providers.find((p) => p.id === providerId);
    return provider ? provider.name : "Unknown Provider";
  };

  // Get provider group ID by providerId
  const getProviderGroupId = (providerId: string): string => {
    const provider = providers.find((p) => p.id === providerId);
    return provider ? provider.groupId : "Unknown";
  };

  // Apply filters to history data
  const applyFilters = () => {
    let filtered = [...sampleHistoryData];
    
    // Apply time filter
    if (timeFilter !== "all") {
      const now = new Date();
      let cutoff = new Date();
      
      if (timeFilter === "7days") {
        cutoff.setDate(now.getDate() - 7);
      } else if (timeFilter === "30days") {
        cutoff.setDate(now.getDate() - 30);
      } else if (timeFilter === "90days") {
        cutoff.setDate(now.getDate() - 90);
      }
      
      filtered = filtered.filter(item => new Date(item.fetchDate) >= cutoff);
    }
    
    // Apply status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(item => statusFilter.includes(item.status.toLowerCase()));
    }
    
    setHistoryData(filtered);
  };

  // Apply filters when filter selections change
  useEffect(() => {
    applyFilters();
  }, [timeFilter, statusFilter]);

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

  // Demo function to handle download
  const handleDownload = (s3Location: string) => {
    toast({
      title: "Download Started",
      description: `Downloading data from ${s3Location}`,
    });
  };

  // Demo function to handle view data
  const handleViewData = (id: string) => {
    toast({
      title: "Viewing Data",
      description: `Opening data viewer for record ID: ${id}`,
    });
  };

  const clearFilters = () => {
    setTimeFilter("all");
    setStatusFilter([]);
    setHistoryData(sampleHistoryData);
  };

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Set loading and error states
  const isLoading = false;
  const isError = false;

  return (
    <div>
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
                <DropdownMenuLabel>Time Period</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {timeFilterOptions.map(option => (
                  <DropdownMenuItem 
                    key={option.id}
                    onClick={() => setTimeFilter(option.id)}
                    className={timeFilter === option.id ? "bg-primary-50 text-primary-600" : ""}
                  >
                    {option.name}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {statusFilterOptions.map(option => (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    checked={statusFilter.includes(option.id)}
                    onCheckedChange={() => toggleStatusFilter(option.id)}
                  >
                    {option.name}
                  </DropdownMenuCheckboxItem>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters}>
                  Clear filters
                </DropdownMenuItem>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
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
                        <div className="font-mono bg-neutral-100 p-1 rounded text-sm truncate max-w-sm">
                          {item.s3Location}
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewData(item.id)}
                          title="View data"
                        >
                          <Eye className="h-4 w-4 text-primary-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(item.s3Location)}
                          title="Download data"
                        >
                          <Download className="h-4 w-4 text-primary-600" />
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