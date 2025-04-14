// App.tsx
import React from 'react';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/home";
import EhrFormPage from "@/pages/ehr-form";
import EhrListPage from "@/pages/ehr-list";
import ClientFormPage from "@/pages/client-form";
import ClientListPage from "@/pages/client-list";
import DataHistoryPage from "@/pages/data-history";
import LoadingPage from "@/pages/loading";
import NavigationPage from "@/pages/navigation";

// Import Amplify and configuration
import { Amplify } from 'aws-amplify';
import awsconfig from '../../shared/aws-exports';
import { withAuthenticator } from '@aws-amplify/ui-react';

// Configure Amplify with your AWS resources (Cognito, etc.)
Amplify.configure(awsconfig);

function Router(): JSX.Element {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/ehr-form" component={EhrFormPage} />
      <Route path="/ehr-form/:id" component={EhrFormPage} />
      <Route path="/ehr-list" component={EhrListPage} />
      <Route path="/client-form" component={ClientFormPage} />
      <Route path="/client-list" component={ClientListPage} />
      <Route path="/data-history" component={DataHistoryPage} />
      <Route path="/loading" component={LoadingPage} />
      <Route path="/navigation" component={NavigationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}


function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

// Wrap your App with withAuthenticator to enable Cognito authentication
export default withAuthenticator(App);
