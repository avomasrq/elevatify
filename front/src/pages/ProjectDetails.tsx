import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser as useClerkUser, useUser as useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Mail, Github, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  cv?: string;
}

// Helper to fetch user profile from localStorage only
const getUserProfile = (userId: string) => {
  const data = localStorage.getItem(`userSettings_${userId}`);
  return data ? JSON.parse(data) : null;
};

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded: userLoaded } = useClerkUser();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [cv, setCv] = useState("");
  const [isEditingCv, setIsEditingCv] = useState(false);

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

  // Load CV from localStorage if exists
  useEffect(() => {
    if (!project) return;
    const savedCv = localStorage.getItem(`project_cv_${project.id}`);
    if (savedCv) setCv(savedCv);
    else setCv(project.cv || "");
  }, [project]);

  // Save CV to localStorage
  const handleSaveCv = () => {
    if (!project) return;
    localStorage.setItem(`project_cv_${project.id}`, cv);
    setIsEditingCv(false);
    toast({
      title: "Project CV Saved",
      description: "The full project description has been updated.",
    });
  };

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

                {/* Team CVs Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Team Members' CVs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.members.map((memberId) => {
                      const profile = getUserProfile(memberId);
                      return (
                        <Card key={memberId} className="p-4">
                          <h3 className="font-bold text-lg mb-1">{profile?.displayName || `User ${memberId}`}</h3>
                          <p className="text-sm text-gray-600 mb-1">Specialization: {profile?.specialization || 'N/A'}</p>
                          <p className="text-sm text-gray-600 mb-1">Region: {profile?.region || 'N/A'}</p>
                          <p className="text-sm text-gray-600 mb-2">Bio: {profile?.bio || 'No bio provided.'}</p>
                          {profile?.githubUsername && (
                            <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mr-2">GitHub</a>
                          )}
                          {profile?.linkedinUrl && (
                            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn</a>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Pending Requests' CVs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.pendingRequests.map((requestId) => {
                      const profile = getUserProfile(requestId);
                      const alreadyRequested = project.pendingRequests.includes(user?.id || "");
                      const alreadyMember = project.members.includes(user?.id || "");
                      return (
                        <Card key={requestId} className="p-4">
                          <h3 className="font-bold text-lg mb-1">{profile?.displayName || `User ${requestId}`}</h3>
                          <p className="text-sm text-gray-600 mb-1">Specialization: {profile?.specialization || 'N/A'}</p>
                          <p className="text-sm text-gray-600 mb-1">Region: {profile?.region || 'N/A'}</p>
                          <p className="text-sm text-gray-600 mb-2">Bio: {profile?.bio || 'No bio provided.'}</p>
                          {profile?.githubUsername && (
                            <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mr-2">GitHub</a>
                          )}
                          {profile?.linkedinUrl && (
                            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn</a>
                          )}
                          {/* Show request button if not already requested or member and not viewing own CV */}
                          {user && user.id !== requestId && !alreadyRequested && !alreadyMember && (
                            <Button className="mt-2" onClick={handleRequestToJoin} disabled={isRequesting}>
                              {isRequesting ? 'Requesting...' : 'Request to Join'}
                            </Button>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Project CV / Full Description */}
                <div>
                  <h2 className="text-xl font-bold text-purple-800 mb-2">Project CV / Full Description</h2>
                  {isEditingCv ? (
                    <div>
                      <textarea
                        className="w-full min-h-[120px] border rounded-lg p-2 text-gray-800 mb-2"
                        value={cv}
                        onChange={e => setCv(e.target.value)}
                        placeholder="Write a detailed description of your project, goals, technologies, achievements, etc."
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleSaveCv} className="bg-purple-600 hover:bg-purple-700 text-white">Save</Button>
                        <Button variant="outline" onClick={() => setIsEditingCv(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 whitespace-pre-line mb-2">{cv || "No description yet."}</p>
                      {user?.id === project.ownerId && (
                        <Button variant="outline" onClick={() => setIsEditingCv(true)} className="mb-2">Edit Description</Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 border-t pt-6">
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

                {/* Show pending join requests if user is owner */}
                {user && project.ownerId === user.id && project.pendingRequests.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Pending Join Requests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.pendingRequests.map((requestId) => {
                        const profile = getUserProfile(requestId);
                        return (
                          <Card key={requestId} className="p-4">
                            <h3 className="font-bold text-lg mb-1">{profile?.displayName || `User ${requestId}`}</h3>
                            <p className="text-sm text-gray-600 mb-1">Specialization: {profile?.specialization || 'N/A'}</p>
                            <p className="text-sm text-gray-600 mb-1">Region: {profile?.region || 'N/A'}</p>
                            <p className="text-sm text-gray-600 mb-2">Bio: {profile?.bio || 'No bio provided.'}</p>
                            {profile?.githubUsername && (
                              <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mr-2">GitHub</a>
                            )}
                            {profile?.linkedinUrl && (
                              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn</a>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 