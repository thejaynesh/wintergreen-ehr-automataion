import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect } from "react";
import {
  insertEhrSystemSchema,
  EhrSystem,
  HealthcareProvider,
} from "@shared/schema";
import { useParams, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

// Extended schema with validation
const formSchema = insertEhrSystemSchema.extend({
  systemName: z
    .string()
    .min(2, "EHR system name must be at least 2 characters"),
  systemVersion: z.string().nullable().optional(),
  apiEndpoint: z.string().url("Please enter a valid URL").nullable().optional(),
  documentationLink: z.string().url("Please enter a valid URL").nullable().optional(),
  authUrl: z.string().url("Please enter a valid URL").nullable().optional(),
  conUrl: z.string().url("Please enter a valid URL").nullable().optional(),
  bulkfhirUrl: z.string().url("Please enter a valid URL").nullable().optional(),
  additionalNotes: z.string().nullable().optional(),
  // Always set isSupported to true for new records
  isSupported: z.literal(true).default(true),
}).transform(data => ({
  ...data,
  // Ensure isSupported is always true for new records
  isSupported: true,
}));

type FormValues = z.infer<typeof formSchema>;

// Helper function to handle form field null values
const normalizeValue = (value: string | null | undefined): string => {
  return value === null ? "" : value || "";
};

const EhrFormPage = () => {
  const { toast } = useToast();
  const params = useParams();
  const ehrId = params?.id;
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  // Fetch existing EHR if we're editing
  const { data: existingEhr, isLoading } = useQuery<EhrSystem>({
    queryKey: ["/api/ehr-systems", ehrId],
    enabled: !!ehrId,
  });

  // Fetch providers for the dropdown
  const { data: providers = [] } = useQuery<HealthcareProvider[]>({
    queryKey: ["/api/providers"],
  });

  const defaultValues: Partial<FormValues> = {
    id: ehrId || undefined,
    systemName: "",
    systemVersion: "",
    apiEndpoint: "",
    documentationLink: "",
    authUrl: "",
    conUrl: "",
    bulkfhirUrl: "",
    // dataFormat, authorizationType, clientId, clientSecret removed
    additionalNotes: "",
    // isSupported removed from form (will be set to true by default)
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Update the form when existing EHR data is loaded
  useEffect(() => {
    if (ehrId && existingEhr) {
      // Map the database object to the form object, ensuring required fields are not null
      const formData = {
        id: existingEhr.id,
        systemName: existingEhr.systemName || "",
        systemVersion: existingEhr.systemVersion || "",
        apiEndpoint: existingEhr.apiEndpoint || "",
        documentationLink: existingEhr.documentationLink || "",
        authUrl: existingEhr.authUrl || "",
        conUrl: existingEhr.conUrl || "",
        bulkfhirUrl: existingEhr.bulkfhirUrl || "",
        additionalNotes: existingEhr.additionalNotes || "",
        // Set hidden default value for isSupported (but not shown in form)
        isSupported: true,
      };

      form.reset(formData);
    }
  }, [ehrId, existingEhr, form]);

  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Generate a UUID if this is a new EHR system
      if (!data.id) {
        data.id = uuidv4();
      }
      const response = await apiRequest("POST", "/api/ehr-systems", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "EHR system configuration has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ehr-systems"] });
      navigate("/ehr-list");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save EHR system: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest(
        "PATCH",
        `/api/ehr-systems/${data.id}`,
        data,
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "EHR system has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ehr-systems"] });
      navigate("/ehr-list");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update EHR system: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form submitted with values:", values);
    
    // Check for validation errors
    console.log("Form errors:", form.formState.errors);
    
    if (ehrId) {
      console.log("Updating existing EHR system with ID:", ehrId);
      updateMutation.mutate(values);
    } else {
      console.log("Creating new EHR system");
      createMutation.mutate(values);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      {/* Header Section */}
      {/* <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">
            {ehrId ? "Edit" : "Add"} EHR System
          </h1>
          <p className="text-lg">
            {ehrId 
              ? "Update your EHR system integration details" 
              : "Configure a new EHR system to enable secure data exchange"
            }
          </p>
        </div>
      </div> */}

      {/* Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                EHR System Information
              </h2>
              <p className="text-neutral-600">
                Please provide details about the Electronic Health Record
                system.
              </p>
            </div>

            {isLoading && ehrId ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="systemName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter EHR system name"
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
                      name="apiEndpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Endpoint</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://api.example.com/v1"
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
                      name="documentationLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Documentation Link</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://docs.example.com"
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
                      name="authUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Authorization URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://api.example.com/auth"
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
                      name="conUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Connection URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://api.example.com/connect"
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
                      name="bulkfhirUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bulk FHIR URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://api.example.com/fhir/bulk"
                              {...field}
                              value={normalizeValue(field.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* DataFormat, isSupported, clientId, clientSecret fields removed as requested */}

                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter description for this EHR system"
                              rows={4}
                              {...field}
                              value={normalizeValue(field.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <p className="text-sm text-neutral-500">
                      * Required fields
                    </p>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/ehr-list")}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : ehrId ? "Update" : "Save"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-600 mt-2">
              Common questions about EHR system integration
            </p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="item-1"
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <AccordionTrigger className="text-lg font-semibold">
                  What is an API endpoint?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 pt-2">
                  An API endpoint is a specific URL that accepts API requests.
                  It's where your EHR system receives and processes data
                  exchange requests.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-2"
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <AccordionTrigger className="text-lg font-semibold">
                  How is my data secured during transmission?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 pt-2">
                  All data is transmitted using TLS/SSL encryption. Your
                  authentication credentials ensure that only authorized systems
                  can access your data.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-3"
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <AccordionTrigger className="text-lg font-semibold">
                  What data formats are supported?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 pt-2">
                  We support various healthcare data standards including JSON,
                  XML, HL7, and FHIR to ensure compatibility with your existing
                  systems.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-4"
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <AccordionTrigger className="text-lg font-semibold">
                  Can I update my EHR configuration later?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 pt-2">
                  Yes, you can update your configuration at any time by
                  returning to the EHR List page and clicking the Edit button.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EhrFormPage;
