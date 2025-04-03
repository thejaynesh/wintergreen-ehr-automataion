import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { EhrSystem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Search, Plus } from "lucide-react";
import { Link } from "wouter";

const EhrListPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all EHR systems
  const { data: ehrSystems = [], isLoading, error } = useQuery<EhrSystem[]>({
    queryKey: ['/api/ehr-systems']
  });

  // Log success and handle errors
  useEffect(() => {
    if (ehrSystems.length > 0) {
      console.log("Fetched EHR systems:", ehrSystems);
    }
    if (error) {
      console.error("Error fetching EHR systems:", error);
      toast({
        title: "Error",
        description: "Failed to fetch EHR systems. Please try again later.",
        variant: "destructive",
      });
    }
  }, [ehrSystems, error, toast]);

  // Filter the EHR systems based on the search term
  const filteredSystems = ehrSystems.filter((system: EhrSystem) => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      system.systemName.toLowerCase().includes(searchTermLower) ||
      (system.apiEndpoint && system.apiEndpoint.toLowerCase().includes(searchTermLower)) ||
      (system.additionalNotes && system.additionalNotes.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <div>
      {/* Header Section */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">
                EHR Systems
              </h1>
              <p className="text-lg">
                View and manage all your EHR system configurations
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Button asChild size="lg" className="font-semibold">
                <Link href="/ehr-form">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New System
                </Link>
              </Button>
            </div>
          </div>
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
                placeholder="Search EHR systems..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Button asChild>
              <Link href="/ehr-form">
                <Plus className="mr-2 h-4 w-4" /> Add New System
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Loading EHR systems...
                    </TableCell>
                  </TableRow>
                ) : filteredSystems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-neutral-500">
                      No EHR systems found matching your search criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSystems.map((system: EhrSystem) => (
                    <TableRow key={system.id} className="hover:bg-neutral-50">
                      <TableCell className="font-medium">
                        {system.systemName}
                        {system.systemVersion && (
                          <span className="ml-2 text-xs text-neutral-500">
                            v{system.systemVersion}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {system.apiEndpoint ? (
                          <span className="truncate max-w-xs block">
                            {system.apiEndpoint}
                          </span>
                        ) : (
                          <span className="text-neutral-500 italic">
                            Not specified
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {system.additionalNotes ? (
                          <span className="line-clamp-2">
                            {system.additionalNotes}
                          </span>
                        ) : (
                          <span className="text-neutral-500 italic">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={system.isSupported ? "default" : "outline"}
                          className={system.isSupported ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                        >
                          {system.isSupported ? "Supported" : "Not Supported"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            asChild
                          >
                            <Link href={`/ehr-form/${system.id}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EhrListPage;