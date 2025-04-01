import { useState } from "react";
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
    queryKey: ['/api/ehr-systems'],
  });

  // Filter the EHR systems based on the search term
  const filteredSystems = ehrSystems.filter((system) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      system.systemName.toLowerCase().includes(searchTermLower) ||
      (system.apiEndpoint && system.apiEndpoint.toLowerCase().includes(searchTermLower)) ||
      (system.dataFormat && system.dataFormat.toLowerCase().includes(searchTermLower))
    );
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch EHR systems. Please try again later.",
      variant: "destructive",
    });
  }

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

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>EHR System Configurations</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search systems..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="animate-pulse text-center">
                  <div className="h-6 bg-muted rounded w-48 mx-auto mb-2"></div>
                  <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
                </div>
              </div>
            ) : ehrSystems.length === 0 ? (
              <div className="text-center py-6">
                <h3 className="text-lg font-medium mb-2">No EHR systems found</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't configured any EHR systems yet.
                </p>
                <Button asChild>
                  <Link href="/ehr-form">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First System
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">System Name</TableHead>
                        <TableHead>API Endpoint</TableHead>
                        <TableHead>Data Format</TableHead>
                        <TableHead>Auth Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSystems.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No systems found matching your search criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSystems.map((system) => (
                          <TableRow key={system.id}>
                            <TableCell className="font-medium">
                              {system.systemName}
                              {system.systemVersion && (
                                <span className="ml-2 text-xs text-muted-foreground">
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
                                <span className="text-muted-foreground italic">
                                  Not specified
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {system.dataFormat ? (
                                <Badge variant="outline">
                                  {system.dataFormat.toUpperCase()}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground italic">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {system.authorizationType ? (
                                <Badge
                                  variant="secondary"
                                  className="capitalize"
                                >
                                  {system.authorizationType === "oauth2"
                                    ? "OAuth 2.0"
                                    : system.authorizationType === "apikey"
                                    ? "API Key"
                                    : system.authorizationType === "jwt"
                                    ? "JWT"
                                    : system.authorizationType}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground italic">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  asChild
                                >
                                  <Link href={`/ehr-docs/${system.id}`}>
                                    <FileText className="h-4 w-4 mr-1" />
                                    Docs
                                  </Link>
                                </Button>
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
                <div className="text-sm text-muted-foreground mt-4">
                  Showing {filteredSystems.length} of {ehrSystems.length} systems
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EhrListPage;