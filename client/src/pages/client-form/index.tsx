import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertHealthcareProviderSchema,
  providerTypeEnum,
  providerStatusEnum,
  type EhrSystem,
} from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { v4 as uuidv4 } from "uuid";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Extended schema with validation
const formSchema = insertHealthcareProviderSchema.extend({
  providerName: z.string().min(2, "Healthcare provider name is required"),
  providerType: providerTypeEnum,
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  ehrGroupId: z.string().optional().nullable(),
  ehrTenantId: z.string().optional().nullable(),
  // secretsManagerArn removed
  notes: z.string().optional().nullable(),
  status: providerStatusEnum.optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to handle form field null values
const normalizeValue = (value: string | null | undefined): string => {
  return value === null ? "" : value || "";
};

const ClientFormPage = () => {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [showFetchDialog, setShowFetchDialog] = useState(false);
  const [savedProviderId, setSavedProviderId] = useState<string | null>(null);

  // Fetch EHR systems for dropdown
  const { data: ehrSystems = [] } = useQuery<EhrSystem[]>({
    queryKey: ["/api/ehr-systems"],
  });

  const defaultValues: Partial<FormValues> = {
    id: uuidv4(), // Generate a UUID for the new provider
    providerName: "",
    providerType: "Clinic",
    contactEmail: "",
    contactPhone: "",
    address: "",
    ehrId: undefined,
    ehrTenantId: "",
    ehrGroupId: "",
    // secretsManagerArn removed
    status: "Pending",
    notes: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/providers", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Healthcare provider has been added successfully.",
      });

      // Save the provider ID and show the fetch dialog
      setSavedProviderId(data.id);
      setShowFetchDialog(true);

      // Reset the form
      form.reset(defaultValues);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add healthcare provider: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    submitMutation.mutate(values);
  };

  const handleFetchData = () => {
    // Close the dialog
    setShowFetchDialog(false);

    // Navigate to the loading page with provider ID
    if (savedProviderId) {
      navigate(`/loading?providerId=${savedProviderId}`);
    } else {
      navigate("/loading");
    }
  };

  const handleSkipFetch = () => {
    // Just close the dialog
    setShowFetchDialog(false);
  };

  return (
    <div>
      {/* Header Section */}
      {/* <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">
            Add New Healthcare Client
          </h1>
          <p className="text-lg">
            Register a new healthcare provider to connect with the EHR system.
          </p>
        </div>
      </div> */}

      {/* Fetch Data Dialog */}
      <Dialog open={showFetchDialog} onOpenChange={setShowFetchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fetch Provider Data</DialogTitle>
            <DialogDescription>
              The healthcare provider has been added successfully. Would you
              like to fetch their data now?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleSkipFetch}>
              Skip
            </Button>
            <Button onClick={handleFetchData}>Fetch Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">
                    Client Information
                  </h2>
                  <p className="text-neutral-600">
                    Basic information about the healthcare provider.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="providerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Healthcare Provider Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter healthcare provider name"
                            {...field}
                            value={normalizeValue(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="providerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || "Clinic"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Hospital">Hospital</SelectItem>
                            <SelectItem value="Clinic">Clinic</SelectItem>
                            <SelectItem value="Private Practice">
                              Private Practice
                            </SelectItem>
                            <SelectItem value="SpecialistCenter">
                              Specialist Center
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 mb-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Contact Details
                  </h3>
                  <p className="text-neutral-600">
                    Primary contact information for this healthcare provider.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@provider.com"
                            {...field}
                            value={normalizeValue(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. 5551234567"
                            {...field}
                            value={normalizeValue(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter complete address"
                            {...field}
                            value={normalizeValue(field.value)}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 mb-6">
                  <h3 className="text-xl font-semibold mb-2">
                    EHR Integration
                  </h3>
                  <p className="text-neutral-600">
                    Details for connecting to the EHR system.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ehrId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EHR System</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select EHR system" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ehrSystems.map((system) => (
                              <SelectItem key={system.id} value={system.id}>
                                {system.systemName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The EHR system used by this provider
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ehrTenantId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EHR Tenant ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter tenant ID for multi-tenant EHR"
                            {...field}
                            value={normalizeValue(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ehrGroupId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>EHR Group ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter group ID for data fetching"
                            {...field}
                            value={normalizeValue(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
{/* AWS Secrets Manager ARN field removed */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || "Pending"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional notes about this provider"
                            {...field}
                            value={normalizeValue(field.value)}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <p className="text-sm text-neutral-500">* Required fields</p>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset(defaultValues)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitMutation.isPending}>
                      {submitMutation.isPending ? "Saving..." : "Save Client"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientFormPage;
