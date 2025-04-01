import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  BarChart, 
  CheckCircle, 
  Shield, 
  Lightbulb, 
  UserPlus,
  Clock,
  PieChart,
  Lock, 
  DollarSign
} from "lucide-react";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-sans mb-4">Modern Electronic Health Record System</h1>
              <p className="text-lg mb-8">A comprehensive solution for healthcare providers to manage patient data, streamline workflows, and improve care coordination.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/ehr-form">
                  <Button size="lg" variant="default" className="bg-white text-primary-600 hover:bg-neutral-100">
                    Get Started
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="rounded-lg shadow-lg h-96 w-full bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-sans mb-4">Our Services</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">HealthRecord provides a comprehensive suite of tools to help healthcare providers manage patient data effectively and efficiently.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Electronic Health Records</h3>
                <p className="text-neutral-600">Securely store and manage patient medical records with our intuitive EHR system.</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mb-4">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Client Management</h3>
                <p className="text-neutral-600">Easily add, update, and track information for all healthcare providers in your network.</p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  <BarChart size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Data Analytics</h3>
                <p className="text-neutral-600">Track and analyze healthcare data to improve patient outcomes and operational efficiency.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-bold font-sans mb-4">Ready to transform your healthcare data management?</h2>
                <p className="text-neutral-600 mb-6">Join thousands of healthcare providers who trust HealthRecord for their EHR needs.</p>
                <Button variant="default" size="lg" asChild>
                  <Link href="/ehr-form">Learn More</Link>
                </Button>
              </CardContent>
              <div className="bg-gradient-to-br from-primary-500 to-secondary-600 p-8 md:p-12 text-white flex items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Benefits at a glance:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span>Secure data storage and management</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span>Streamlined workflows and processes</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span>Improved care coordination</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span>Comprehensive reporting capabilities</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-sans mb-4">What Our Clients Say</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">Hear from healthcare professionals who have transformed their practices with HealthRecord.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-neutral-600 mb-6">"HealthRecord has revolutionized how we manage patient data. The system is intuitive and has significantly reduced our administrative burden."</p>
                <div className="flex items-center">
                  <div>
                    <h4 className="font-semibold">Dr. Sarah Johnson</h4>
                    <p className="text-sm text-neutral-500">Family Practice, Boston Medical Center</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-neutral-600 mb-6">"The client management features have made it easy to coordinate care across our network of providers. Excellent system with great support."</p>
                <div className="flex items-center">
                  <div>
                    <h4 className="font-semibold">James Wilson</h4>
                    <p className="text-sm text-neutral-500">IT Director, Midwest Health Network</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1" fill="none" />
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" clipPath="inset(0 50% 0 0)" />
                    </svg>
                  </div>
                </div>
                <p className="text-neutral-600 mb-6">"Data analytics capabilities have helped us identify trends and improve patient outcomes. The system is an essential part of our practice now."</p>
                <div className="flex items-center">
                  <div>
                    <h4 className="font-semibold">Dr. Michael Chen</h4>
                    <p className="text-sm text-neutral-500">Medical Director, Pacific Care Associates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-sans mb-4">About HealthRecord</h2>
              <p className="text-neutral-600 mb-4">Founded in 2015, HealthRecord is dedicated to improving healthcare through innovative technology solutions.</p>
              <p className="text-neutral-600 mb-4">Our mission is to empower healthcare providers with tools that enhance patient care, streamline operations, and drive better health outcomes.</p>
              <p className="text-neutral-600 mb-4">With a team of healthcare and technology experts, we're committed to developing solutions that address the real-world challenges faced by medical professionals.</p>
            </div>
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">Our Core Values</h3>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                        <Shield className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">Security & Privacy</h4>
                      <p className="text-neutral-600">We prioritize protecting sensitive health information with the highest security standards.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">Innovation</h4>
                      <p className="text-neutral-600">We continuously evolve our solutions to address emerging healthcare challenges.</p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                        <UserPlus className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">Patient-Centered Care</h4>
                      <p className="text-neutral-600">All our tools are designed with the ultimate goal of improving patient care and outcomes.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-sans mb-4">Key Benefits</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">HealthRecord delivers tangible advantages for healthcare providers of all sizes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Time Savings</h3>
                <p className="text-neutral-600">Reduce administrative time by up to 30% with streamlined workflows and automation.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <PieChart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Improved Accuracy</h3>
                <p className="text-neutral-600">Minimize errors and improve data quality with built-in validation and verification.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Lock className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enhanced Security</h3>
                <p className="text-neutral-600">Keep patient data secure with advanced encryption and access controls.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <DollarSign className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cost Reduction</h3>
                <p className="text-neutral-600">Lower operational costs through improved efficiency and reduced paperwork.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
