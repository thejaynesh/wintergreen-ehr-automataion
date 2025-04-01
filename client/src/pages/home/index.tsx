import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw, ListFilter } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8">EHR System</h1>
        
        <div className="space-y-6">
          <p className="text-center text-neutral-600">
            Welcome to the Healthcare Electronic Health Record System
          </p>
          
          <div className="flex flex-col gap-4">
            <Button 
              className="flex items-center justify-center gap-2 py-6"
              asChild
            >
              <Link href="/client-form">
                <UserPlus className="mr-2 h-5 w-5" />
                Onboard Healthcare Provider
              </Link>
            </Button>
            
            <Button 
              className="flex items-center justify-center gap-2 py-6"
              variant="outline"
              asChild
            >
              <Link href="/client-list">
                <RefreshCw className="mr-2 h-5 w-5" />
                Refresh Data
              </Link>
            </Button>
            
            <Button 
              className="flex items-center justify-center gap-2 py-6"
              variant="secondary"
              asChild
            >
              <Link href="/ehr-list">
                <ListFilter className="mr-2 h-5 w-5" />
                Manage EHR Systems
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;