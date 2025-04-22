import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Mail, Instagram, Linkedin } from "lucide-react";

export default function About() {
  const socialLinks = {
    instagram: "https://www.instagram.com/elevatify_app?igsh=MTRhZmcxaXBocTkxNg%3D%3D&utm_source=qr",
    linkedin: "https://www.linkedin.com/in/elevatify-app-5a6b59360?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">About Elevatify</h1>

            <div className="grid gap-8">
              {/* Mission Statement */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  Elevatify is a platform designed to bring together talented individuals and innovative project ideas. 
                  We believe in the power of collaboration and aim to create an environment where creativity thrives 
                  and meaningful connections are made.
                </p>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Project Creation</h3>
                    <p className="text-gray-600">
                      Create and manage your project ideas with ease. Share your vision and find the perfect team to bring it to life.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Team Building</h3>
                    <p className="text-gray-600">
                      Connect with talented individuals across different domains. Build diverse teams that complement each other's skills.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Collaboration Tools</h3>
                    <p className="text-gray-600">
                      Access tools designed to make collaboration seamless. From project tracking to team communication.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Project Discovery</h3>
                    <p className="text-gray-600">
                      Explore innovative projects and find opportunities that match your interests and expertise.
                    </p>
                  </div>
                </div>
              </div>

              {/* Team */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
                <p className="text-gray-600 mb-6">
                  We're a passionate team of developers, designers, and innovators committed to creating 
                  the best platform for project collaboration.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open(socialLinks.instagram, '_blank')}
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open(socialLinks.linkedin, '_blank')}
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 