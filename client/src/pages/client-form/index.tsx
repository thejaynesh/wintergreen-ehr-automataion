import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHealthcareProviderSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
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
  name: z.string().min(2, "Healthcare provider name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to handle form field null values
const normalizeValue = (value: string | null | undefined): string => {
  return value === null ? "" : value || "";
};

// Helper for Select fields to ensure they always have a valid value
const normalizeSelectValue = (value: string | null | undefined): string => {
  if (value === null || value === undefined) return "USA";
  return value;
};

const ClientFormPage = () => {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [showFetchDialog, setShowFetchDialog] = useState(false);
  const [savedProviderId, setSavedProviderId] = useState<number | null>(null);
  
  const defaultValues: Partial<FormValues> = {
    name: "",
    groupId: "",
    contactName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
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
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">
            Add New Healthcare Client
          </h1>
          <p className="text-lg">
            Register a new healthcare provider to connect with the EHR system.
          </p>
        </div>
      </div>
      
      {/* Fetch Data Dialog */}
      <Dialog open={showFetchDialog} onOpenChange={setShowFetchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fetch Provider Data</DialogTitle>
            <DialogDescription>
              The healthcare provider has been added successfully. Would you like to fetch their data now?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleSkipFetch}>
              Skip
            </Button>
            <Button onClick={handleFetchData}>
              Fetch Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">Client Information</h2>
                  <p className="text-neutral-600">
                    Basic information about the healthcare provider.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
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
                    name="groupId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. MGH001" 
                            {...field}
                            value={normalizeValue(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 mb-6">
                  <h3 className="text-xl font-semibold mb-2">Contact Details</h3>
                  <p className="text-neutral-600">
                    Primary contact information for this healthcare provider.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter contact name" 
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
                    name="email"
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
                    name="phone"
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
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company/Organization</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter company or organization name" 
                            {...field} 
                            value={normalizeValue(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 mb-6">
                  <h3 className="text-xl font-semibold mb-2">Address Information</h3>
                  <p className="text-neutral-600">
                    Physical location of the healthcare provider.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter street address" 
                            {...field}
                            value={normalizeValue(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter city" 
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
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter state" 
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
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP/Postal Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter ZIP code" 
                            {...field}
                            value={normalizeValue(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={normalizeSelectValue(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USA">United States</SelectItem>
                            <SelectItem value="CAN">Canada</SelectItem>
                            <SelectItem value="MEX">Mexico</SelectItem>
                            <SelectItem value="GBR">United Kingdom</SelectItem>
                            <SelectItem value="AUS">Australia</SelectItem>
                          </SelectContent>
                        </Select>
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
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                    >
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
