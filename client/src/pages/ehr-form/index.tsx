import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { insertEhrSystemSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

// Extended schema with validation
const formSchema = insertEhrSystemSchema.extend({
  systemName: z.string().min(2, "System name must be at least 2 characters"),
  apiEndpoint: z.string().url("Please enter a valid URL"),
  authorizationType: z.enum(["oauth2", "apikey", "basic", "jwt"], {
    required_error: "Please select an authorization type",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Helper function to handle form field null values
const normalizeValue = (value: string | null | undefined): string => {
  return value === null ? "" : value || "";
};

// Helper for Select fields to ensure they always have a valid value
const normalizeSelectValue = (value: string | null | undefined): string => {
  if (value === null || value === undefined) return "";
  return value;
};

const EhrFormPage = () => {
  const { toast } = useToast();
  
  const defaultValues: Partial<FormValues> = {
    systemName: "",
    systemVersion: "",
    apiEndpoint: "",
    dataFormat: "",
    authorizationType: undefined,
    clientId: "",
    clientSecret: "",
    additionalNotes: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("POST", "/api/ehr-systems", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "EHR system configuration has been saved successfully.",
      });
      form.reset(defaultValues);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save EHR system: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    submitMutation.mutate(values);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">
            Electronic Health Record System Configuration
          </h1>
          <p className="text-lg">
            Configure your EHR system integration details to enable secure data exchange.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">EHR System Information</h2>
              <p className="text-neutral-600">
                Please provide details about your Electronic Health Record system.
              </p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="systemName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter system name" 
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
                    name="systemVersion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Version</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. 2.1.0" 
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
                        <FormLabel>API Endpoint URL *</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="dataFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Format</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={normalizeSelectValue(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                            <SelectItem value="hl7">HL7</SelectItem>
                            <SelectItem value="fhir">FHIR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 mb-6">
                  <h3 className="text-xl font-semibold mb-2">Authentication Details</h3>
                  <p className="text-neutral-600">
                    Specify how your EHR system authenticates API requests.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="authorizationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authorization Type *</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={normalizeSelectValue(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select authorization type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                            <SelectItem value="apikey">API Key</SelectItem>
                            <SelectItem value="basic">Basic Authentication</SelectItem>
                            <SelectItem value="jwt">JWT Token</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter client ID" 
                            {...field}
                            value={normalizeValue(field.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional configuration details or notes"
                          rows={4}
                          {...field}
                          value={normalizeValue(field.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      {submitMutation.isPending ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            <p className="text-neutral-600 mt-2">Common questions about EHR system integration</p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white p-4 rounded-lg shadow-sm">
                <AccordionTrigger className="text-lg font-semibold">
                  What is an API endpoint?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 pt-2">
                  An API endpoint is a specific URL that accepts API requests. It's where your EHR system receives and processes data exchange requests.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white p-4 rounded-lg shadow-sm">
                <AccordionTrigger className="text-lg font-semibold">
                  How is my data secured during transmission?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 pt-2">
                  All data is transmitted using TLS/SSL encryption. Your authentication credentials ensure that only authorized systems can access your data.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white p-4 rounded-lg shadow-sm">
                <AccordionTrigger className="text-lg font-semibold">
                  What data formats are supported?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 pt-2">
                  We support various healthcare data standards including JSON, XML, HL7, and FHIR to ensure compatibility with your existing systems.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white p-4 rounded-lg shadow-sm">
                <AccordionTrigger className="text-lg font-semibold">
                  Can I update my EHR configuration later?
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 pt-2">
                  Yes, you can update your configuration at any time through your account settings or by contacting our support team.
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
