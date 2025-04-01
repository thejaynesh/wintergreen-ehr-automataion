import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  FileText,
  UserPlus,
  Users,
  History,
  Loader,
} from "lucide-react";

const NavigationPage = () => {
  const navigationItems = [
    {
      title: "Home",
      description: "Return to the main dashboard and system overview.",
      icon: <Home className="text-xl" />,
      path: "/",
    },
    {
      title: "EHR Form",
      description: "Configure and set up your Electronic Health Record system.",
      icon: <FileText className="text-xl" />,
      path: "/ehr-form",
    },
    {
      title: "Client Form",
      description: "Add new healthcare providers to the system.",
      icon: <UserPlus className="text-xl" />,
      path: "/client-form",
    },
    {
      title: "Client List",
      description: "View and manage all healthcare providers in the system.",
      icon: <Users className="text-xl" />,
      path: "/client-list",
    },
    {
      title: "Data History",
      description: "Track and review data fetching operations in the system.",
      icon: <History className="text-xl" />,
      path: "/data-history",
    },
    {
      title: "Loading Demo",
      description: "View the loading screen demonstration.",
      icon: <Loader className="text-xl" />,
      path: "/loading",
    },
  ];

  return (
    <div>
      {/* Header Section */}
      <div className="bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">
            System Navigation
          </h1>
          <p className="text-lg">
            Navigate to different sections of the EHR system.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item, index) => (
            <Link key={index} href={item.path}>
              <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <div className="bg-primary-600 h-2"></div>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-neutral-600">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationPage;
