import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HealthcareProvider } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, RefreshCw, Edit, Trash2, User, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ClientListPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null,
  );

  // Fetch all providers
  const { data, isLoading, isError, error } = useQuery<HealthcareProvider[]>({
    queryKey: ["/api/providers"],
  });

  useEffect(() => {
    if (data) {
      setProviders(data);
    }
  }, [data]);

  // Filter providers based on search query
  const filteredProviders = providers.filter((provider) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      provider.providerName.toLowerCase().includes(searchTerm) ||
      (provider.ehrGroupId && provider.ehrGroupId.toLowerCase().includes(searchTerm)) ||
      provider.contactEmail.toLowerCase().includes(searchTerm) ||
      provider.contactPhone.includes(searchTerm)
    );
  });

  // Delete provider mutation
  const deleteProviderMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/providers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/providers"] });
      toast({
        title: "Success",
        description: "Healthcare provider has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete healthcare provider: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    setSelectedProviderId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProviderId) {
      deleteProviderMutation.mutate(selectedProviderId);
    }
  };

  // Refresh provider data
  const refreshProviderMutation = useMutation({
    mutationFn: async () => {
      // This would be a more specialized endpoint in a real app
      await queryClient.invalidateQueries({ queryKey: ["/api/providers"] });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Client data has been refreshed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to refresh data: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleRefresh = (id: string) => {
    refreshProviderMutation.mutate();
  };

  return (
    <div>
      {/* Header Section */}
      {/* <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">
            Healthcare Provider Clients
          </h1>
          <p className="text-lg">
            View and manage all registered healthcare providers in the system.
          </p>
        </div>
      </div> */}

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
                placeholder="Search clients..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Button asChild>
              <Link href="/client-form">
                <Plus className="mr-2 h-4 w-4" /> Add New Client
              </Link>
            </Button>
          </div>
        </div>

        {/* Client Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Healthcare Provider</TableHead>
                  <TableHead>Group ID</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading clients...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-red-500"
                    >
                      Error loading clients: {error?.message}
                    </TableCell>
                  </TableRow>
                ) : filteredProviders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-neutral-500"
                    >
                      No clients found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProviders.map((provider) => (
                    <TableRow key={provider.id} className="hover:bg-neutral-50">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3">
                            <span>{provider.providerName.charAt(0)}</span>
                          </div>
                          <div className="font-medium">{provider.providerName}</div>
                        </div>
                      </TableCell>
                      <TableCell>{provider.ehrGroupId || '-'}</TableCell>
                      <TableCell>{provider.contactEmail}</TableCell>
                      <TableCell>{provider.contactPhone}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRefresh(provider.id)}
                          title="Refresh client data"
                        >
                          <RefreshCw className="h-4 w-4 text-primary-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Edit client"
                        >
                          <Link href={`/client-form?id=${provider.id}`}>
                            <Edit className="h-4 w-4 text-primary-600" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(provider.id)}
                          title="Delete client"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
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
                Showing <span>{filteredProviders.length}</span>{" "}
                {filteredProviders.length === 1 ? "client" : "clients"}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this healthcare provider? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteProviderMutation.isPending}
            >
              {deleteProviderMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientListPage;
