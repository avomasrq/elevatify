import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Mail, Github, Linkedin } from "lucide-react";

interface ProjectDetails {
  id: string;
  title: string;
  category: string;
  description: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  githubUrl?: string;
  linkedinUrl?: string;
  members: string[];
  pendingRequests: string[];
  requirements: string[];
  timeline: string;
  status: "Open" | "In Progress" | "Completed";
}

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded: userLoaded } = useUser();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // Simulate API call to fetch project details
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock project data
        const mockProject: ProjectDetails = {
          id: projectId || "",
          title: "E-commerce Website",
          category: "Web Development",
          description: "A full-stack e-commerce platform with modern features including real-time inventory management, AI-powered product recommendations, and integrated payment processing. The project aims to create a scalable and user-friendly shopping experience.",
          ownerId: "user1",
          ownerName: "John Doe",
          ownerEmail: "john.doe@example.com",
          githubUrl: "https://github.com/johndoe",
          linkedinUrl: "https://linkedin.com/in/johndoe",
          members: ["user2", "user3"],
          pendingRequests: ["user4"],
          requirements: [
            "Experience with React and Node.js",
            "Familiarity with e-commerce platforms",
            "Understanding of payment gateway integration",
            "Knowledge of database design"
          ],
          timeline: "3 months",
          status: "Open"
        };

        setProject(mockProject);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching project details:', error);
        toast({
          title: "Error",
          description: "Failed to load project details.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleRequestToJoin = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to request to join a project",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRequesting(true);
      // Simulate API call to request to join
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Request Sent",
        description: "Your request to join the project has been sent to the owner",
      });

      // Update local state
      setProject(prev => prev ? {
        ...prev,
        pendingRequests: [...prev.pendingRequests, user.id]
      } : null);
    } catch (error) {
      console.error('Error requesting to join:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleContact = (type: 'email' | 'github' | 'linkedin') => {
    if (!project) return;

    switch (type) {
      case 'email':
        window.location.href = `mailto:${project.ownerEmail}`;
        break;
      case 'github':
        if (project.githubUrl) {
          window.open(project.githubUrl, '_blank');
        }
        break;
      case 'linkedin':
        if (project.linkedinUrl) {
          window.open(project.linkedinUrl, '_blank');
        }
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-6">
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <Loader2 className="h-8 w-8 animate-spin text-elevatify-600" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Project not found</h2>
              <p className="mt-2 text-gray-600">The project you're looking for doesn't exist.</p>
              <Button
                onClick={() => navigate("/projects")}
                className="mt-4 bg-elevatify-600 hover:bg-elevatify-700"
              >
                Back to Projects
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-elevatify-100 text-elevatify-800">
                      {project.category}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                  <p className="mt-2 text-gray-600">{project.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                    {project.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
                  <p className="mt-2 text-gray-600">Estimated duration: {project.timeline}</p>
                </div>

                {/* Team */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Team</h2>
                  <div className="mt-2">
                    <p className="text-gray-600">Project Owner: {project.ownerName}</p>
                    <p className="text-gray-600">Team Members: {project.members.length}</p>
                    <p className="text-gray-600">Pending Requests: {project.pendingRequests.length}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 border-t pt-6">
                  {user && user.id !== project.ownerId && !project.members.includes(user.id) && (
                    <Button
                      className="w-full sm:w-auto bg-elevatify-600 hover:bg-elevatify-700"
                      disabled={isRequesting || project.pendingRequests.includes(user.id)}
                      onClick={handleRequestToJoin}
                    >
                      {isRequesting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Requesting...
                        </>
                      ) : project.pendingRequests.includes(user.id) ? (
                        "Request Pending"
                      ) : (
                        "Request to Join"
                      )}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => handleContact('email')}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Owner
                  </Button>

                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => handleContact('github')}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub Profile
                    </Button>
                  )}

                  {project.linkedinUrl && (
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => handleContact('linkedin')}
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 