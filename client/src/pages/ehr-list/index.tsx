import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit, Trash2, Plus, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Badge
} from "@/components/ui/badge";

// EHR System interface
interface EhrSystem {
  id: string;
  systemName: string;
  apiEndpoint: string;
  description: string | null;
  documentationUrl: string | null;
  status: "Supported" | "Deprecated" | "Beta" | "Development";
}

// Sample data for demonstration
const sampleEhrSystems: EhrSystem[] = [
  {
    id: "1",
    systemName: "wdawdawweeeeeeeeeeeeeeeeee",
    apiEndpoint: "https://dowm/v1/s",
    description: null,
    documentationUrl: "https://dowm/v1/Documentation",
    status: "Supported"
  },
  {
    id: "2",
    systemName: "Epic EHR Connect",
    apiEndpoint: "https://api.epicehr.com/fhir/v4",
    description: "FHIR API connection for Epic EHR systems",
    documentationUrl: "https://dev.epicehr.com/docs",
    status: "Supported"
  },
  {
    id: "3",
    systemName: "Cerner Millennium API",
    apiEndpoint: "https://api.cerner.com/v1/millennium",
    description: "RESTful API for accessing Cerner Millennium EHR data",
    documentationUrl: "https://developer.cerner.com/api-reference",
    status: "Supported"
  }
];

const EhrListPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [ehrSystems, setEhrSystems] = useState<EhrSystem[]>(sampleEhrSystems);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);

  // Filter EHR systems based on search query
  const filteredSystems = ehrSystems.filter((system) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      system.systemName.toLowerCase().includes(searchTerm) ||
      system.apiEndpoint.toLowerCase().includes(searchTerm) ||
      (system.description && system.description.toLowerCase().includes(searchTerm))
    );
  });

  const handleDelete = (id: string) => {
    setSelectedSystemId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSystemId) {
      // For demo, just remove from local state
      setEhrSystems(ehrSystems.filter(s => s.id !== selectedSystemId));
      
      toast({
        title: "Success",
        description: "EHR System has been removed successfully.",
      });
      setDeleteDialogOpen(false);
    }
  };

  // Status badge renderer
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Supported":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Supported
        </Badge>;
      case "Deprecated":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          <XCircle className="h-3 w-3 mr-1" /> Deprecated
        </Badge>;
      case "Beta":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <AlertCircle className="h-3 w-3 mr-1" /> Beta
        </Badge>;
      case "Development":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
          <AlertCircle className="h-3 w-3 mr-1" /> Development
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

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
                placeholder="Search EHR systems..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Button asChild>
              <Link href="/ehr-form">
                <Plus className="mr-2 h-4 w-4" /> Add New EHR System
              </Link>
            </Button>
          </div>
        </div>

        {/* EHR Systems Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>System Name</TableHead>
                  <TableHead>API Endpoint</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Documentation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSystems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-neutral-500"
                    >
                      No EHR systems found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSystems.map((system) => (
                    <TableRow key={system.id} className="hover:bg-neutral-50">
                      <TableCell className="font-medium">{system.systemName}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-neutral-100 p-1 rounded">
                          {system.apiEndpoint}
                        </code>
                      </TableCell>
                      <TableCell>
                        {system.description || 
                          <span className="text-neutral-400 italic">No description provided</span>
                        }
                      </TableCell>
                      <TableCell>
                        {system.documentationUrl ? (
                          <a 
                            href={system.documentationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            Documentation
                          </a>
                        ) : (
                          <span className="text-neutral-400 italic">No documentation</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(system.status)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Edit EHR system"
                        >
                          <Link href={`/ehr-form?id=${system.id}`}>
                            <Edit className="h-4 w-4 text-primary-600" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(system.id)}
                          title="Delete EHR system"
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
                Showing <span>{filteredSystems.length}</span>{" "}
                {filteredSystems.length === 1 ? "system" : "systems"}
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
              Are you sure you want to delete this EHR system? This action cannot be undone 
              and may affect connected healthcare providers.
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
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EhrListPage;