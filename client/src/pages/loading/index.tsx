import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const [_, navigate] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  
  // Parse provider ID from URL query parameters
  const params = new URLSearchParams(search);
  const providerId = parseInt(params.get("providerId") || "1");
  
  // For demonstration purposes, we'll create a simulated S3 location
  const generateS3Location = () => {
    const timestamp = new Date().getTime();
    return `s3://ehr-data-bucket/${timestamp}-provider-data.json`;
  };
  
  // Mutation to create a data fetch history record
  const createHistoryMutation = useMutation({
    mutationFn: async (providerId: number) => {
      const data = {
        providerId,
        s3Location: generateS3Location(),
        status: "completed"
      };
      const response = await apiRequest("POST", "/api/data-history", data);
      return response.json();
    },
    onSuccess: () => {
      // Show success toast
      toast({
        title: "Success",
        description: "Data fetched successfully!",
      });
      
      // Navigate to data history page after a short delay
      setTimeout(() => {
        navigate("/data-history");
      }, 500);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to record data fetch: ${error.message}`,
        variant: "destructive",
      });
      
      // Still navigate to data history
      setTimeout(() => {
        navigate("/data-history");
      }, 1000);
    }
  });

  useEffect(() => {
    // Simulate data fetching with progress updates
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(timer);
          
          // When progress is complete, create data fetch history entry using the provided ID
          createHistoryMutation.mutate(providerId);
          
          return 100;
        }
        return newProgress;
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, [providerId, createHistoryMutation]);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-primary-600 mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold text-neutral-800 mb-2">Processing Your Request</h2>
        <p className="text-neutral-600 mb-4">Please wait while we fetch the data...</p>
        <div className="w-64 mx-auto mb-4">
          <Progress value={progress} className="h-2" />
        </div>
        <p className="text-sm text-neutral-500">{progress}% Complete</p>
      </div>
    </div>
  );
};

export default LoadingPage;
