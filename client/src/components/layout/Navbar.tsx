import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const routes = [
    { path: "/", label: "Home" },
    { path: "/ehr-form", label: "EHR Form" },
    { path: "/ehr-list", label: "EHR List" },
    { path: "/client-form", label: "Client Form" },
    { path: "/client-list", label: "Client List" },
    { path: "/data-history", label: "Data History" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary text-xl font-bold">
                Winter<span className="text-secondary-600">green</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location === route.path
                      ? "border-primary text-neutral-900"
                      : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                  }`}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Sign-in button removed as requested */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                onClick={closeMobileMenu}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location === route.path
                    ? "bg-primary-50 border-primary text-primary-700"
                    : "border-transparent text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </div>
          {/* Mobile sign-in button removed as requested */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
