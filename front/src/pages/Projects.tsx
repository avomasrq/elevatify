import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Project, getProjects, deleteProject } from "../services/projectService";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState<Record<string, boolean>>({});
  const [isUserRequesting, setIsUserRequesting] = useState<Record<string, boolean>>({});

  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId: string) => {
    setDeletingId(projectId);
    try {
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper to fetch user profile from localStorage
  const getUserProfile = (userId: string) => {
    const data = localStorage.getItem(`userSettings_${userId}`);
    return data ? JSON.parse(data) : null;
  };

  // Add request to join logic (copied from Categories)
  const handleRequestToJoin = async (projectId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to request to join a project",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsRequesting(prev => ({ ...prev, [projectId]: true }));
      // Update localStorage
      const projects = JSON.parse(localStorage.getItem("elevatify_global_projects") || "[]");
      const updatedProjects = projects.map((p: any) =>
        p.id === projectId && !p.pendingRequests.includes(user.id) && !p.members.includes(user.id)
          ? { ...p, pendingRequests: [...p.pendingRequests, user.id] }
          : p
      );
      localStorage.setItem("elevatify_global_projects", JSON.stringify(updatedProjects));
      // Trigger a custom event to notify Requests page in the same tab
      window.dispatchEvent(new Event("elevatify_requests_updated"));
      // Refresh project list from storage
      setProjects(updatedProjects);
      toast({
        title: "Request Sent",
        description: "Your request to join the project has been sent to the owner",
      });
    } catch (error) {
      console.error('Error requesting to join:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(prev => ({ ...prev, [projectId]: false }));
    }
  };

  // General request to join handler for a user (CV owner)
  const handleRequestToUser = async (userId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to request to join a project",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsUserRequesting(prev => ({ ...prev, [userId]: true }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Request Sent",
        description: `Your request to join has been sent to the owner of this CV.`,
      });
      // Here you could add logic to actually notify the user (e.g., update a requests array, call an API, etc.)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUserRequesting(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Get unique categories from projects, filter out empty/undefined/whitespace
  const categories = Array.from(
    new Set(
      projects
        .map(p => p.category)
        .filter(cat => typeof cat === 'string' && cat.trim() !== "")
    )
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">All Projects</h1>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center text-gray-600 bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-xl font-medium mb-2">No projects found</h3>
                <p className="mb-4">Start by creating your first project!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {project.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    {/* CV Preview Section */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">Team Members' CVs</h4>
                      <TooltipProvider>
                        <div className="flex flex-wrap gap-2">
                          {project.members && project.members.length > 0 ? (
                            project.members.slice(0, 2).map((memberId) => {
                              const profile = getUserProfile(memberId);
                              return (
                                <Tooltip key={memberId}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className="w-44"
                                      onClick={() => navigate(`/profile/${memberId}`)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <Card className="p-2 hover:shadow-lg transition-shadow">
                                        <div className="font-bold text-xs mb-1">{profile?.displayName || `User ${memberId}`}</div>
                                        <div className="text-xs text-gray-600 mb-1">{profile?.specialization || 'N/A'}</div>
                                        <div className="text-xs text-gray-600 mb-1">{profile?.region || 'N/A'}</div>
                                        <div className="text-xs text-gray-600 mb-1 line-clamp-2">{profile?.bio || 'No bio.'}</div>
                                        {profile?.githubUsername && (
                                          <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs mr-1" onClick={e => e.stopPropagation()}>GitHub</a>
                                        )}
                                        {profile?.linkedinUrl && (
                                          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs" onClick={e => e.stopPropagation()}>LinkedIn</a>
                                        )}
                                      </Card>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs">
                                    <div className="text-xs">
                                      <div className="font-bold mb-1">{profile?.displayName || `User ${memberId}`}</div>
                                      <div>Specialization: {profile?.specialization || 'N/A'}</div>
                                      <div>Region: {profile?.region || 'N/A'}</div>
                                      <div>Bio: {profile?.bio || 'No bio.'}</div>
                                      {profile?.githubUsername && (
                                        <div><a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">GitHub</a></div>
                                      )}
                                      {profile?.linkedinUrl && (
                                        <div><a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">LinkedIn</a></div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })
                          ) : (
                            <span className="text-xs text-gray-500">No members yet</span>
                          )}
                          {project.members && project.members.length > 2 && (
                            <span className="text-xs text-gray-500">+{project.members.length - 2} more</span>
                          )}
                        </div>
                      </TooltipProvider>
                    </div>
                    {/* General Request to Join button for the project owner */}
                    {user && user.id !== project.ownerId && (
                      <Button
                        className="mb-4"
                        size="sm"
                        variant="outline"
                        onClick={e => {
                          e.preventDefault();
                          handleRequestToJoin(project.id, e);
                        }}
                        disabled={isRequesting[project.id] || 
                                (project.pendingRequests && project.pendingRequests.includes(user.id)) ||
                                (project.members && project.members.includes(user.id))}
                      >
                        {isRequesting[project.id] ? 'Requesting...' : 
                         (project.pendingRequests && project.pendingRequests.includes(user.id)) ? 'Request Pending' :
                         (project.members && project.members.includes(user.id)) ? 'Already a Member' : 
                         'Request to Join'}
                      </Button>
                    )}
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Team: {project.teamSize} members</span>
                      <span>{project.timeframe}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-500">
                          Category: {project.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          Role: {project.ownerId === user?.id ? 'Owner' : 'Member'}
                        </span>
                      </div>
                      {project.ownerId === user?.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this project? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(project.id)}
                              >
                                {deletingId === project.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Delete"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
