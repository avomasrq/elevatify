import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { 
  Users, 
  Lightbulb, 
  MessageSquare, 
  UserCircle 
} from "lucide-react";

export default function Welcome() {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Find a team",
      description: "Connect with like-minded teenagers who share your passion and vision."
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Project system",
      description: "Create and manage projects, assign tasks, and track progress together."
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Conversation system",
      description: "Communicate effectively with team members through real-time messaging."
    },
    {
      icon: <UserCircle size={24} />,
      title: "Customize your profile",
      description: "Showcase your skills, interests, and achievements to find the perfect team."
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white to-elevatify-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-24 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-elevatify-600">Elevatify</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Connect with like-minded teenagers, form teams, and work together on meaningful projects. 
              Elevate your ideas and turn them into reality with collaborative teamwork.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                asChild
                className="text-md px-8 py-6 bg-elevatify-600 hover:bg-elevatify-700"
              >
                <Link to="/sign-up">Get Started</Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="text-md px-8 py-6 border-elevatify-600 text-elevatify-600 hover:bg-elevatify-50"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <img 
              src="public/uploads/firstpic.png" 
              alt="Students collaborating" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>

        {/* How it works section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How can we help <span className="text-elevatify-600">your journey</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Elevatify provides all the tools you need to collaborate effectively with other teenagers and bring your projects to life.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Process flow diagram */}
        <section className="py-16 bg-gradient-to-br from-elevatify-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <img 
                  src="public/uploads/secondpic.png" 
                  alt="Project flow"  
                  className="max-w-full h-auto rounded-lg shadow-lg" 
                />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Simple Steps to <span className="text-elevatify-600">Success</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-elevatify-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Sign up for an account</h3>
                      <p className="text-gray-600">Create your profile and showcase your skills and interests.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-elevatify-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Click "Categories" to browse teams</h3>
                      <p className="text-gray-600">Explore different categories and find projects that interest you.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-elevatify-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Click "Projects" and join a team</h3>
                      <p className="text-gray-600">Apply to join existing projects or create your own and invite others.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-elevatify-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                      4
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Start collaborating!</h3>
                      <p className="text-gray-600">Use our tools to communicate, manage tasks, and track progress.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold mb-2 text-elevatify-900">How to form a team?</h3>
                  <p className="text-gray-600">You can either create your own project and invite others to join your team, or browse existing projects and apply to join teams that interest you.</p>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold mb-2 text-elevatify-900">How to create a project?</h3>
                  <p className="text-gray-600">Click on the "Create" button in the navigation bar, fill in your project details, set goals, and specify the skills you're looking for in team members.</p>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold mb-2 text-elevatify-900">How to manage your team?</h3>
                  <p className="text-gray-600">As a team leader, you can assign roles, track progress, communicate through our messaging system, and manage project tasks through our collaborative tools.</p>
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <Button 
                asChild
                className="bg-elevatify-600 hover:bg-elevatify-700"
              >
                <Link to="/sign-up">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <footer className="bg-gray-50 py-10 border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2025 Elevatify. All rights reserved.
        </div>
      </footer>
    </>
  );
}
