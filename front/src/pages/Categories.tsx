import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, useSignIn } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { storeProjects, getProjects } from '../services/projectService';

interface Category {
  name: string;
  count: number;
  icon?: string;
  description?: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  ownerId: string;
  members: string[];
  pendingRequests: string[];
}

const calculateCategoryAnalytics = (projects: Project[]) => {
  // Calculate project counts by category
  const categoryCounts = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total members per category
  const categoryMembers = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + project.members.length;
    return acc;
  }, {} as Record<string, number>);

  // Calculate pending requests per category
  const categoryRequests = projects.reduce((acc, project) => {
    acc[project.category] = (acc[project.category] || 0) + project.pendingRequests.length;
    return acc;
  }, {} as Record<string, number>);

  return {
    counts: categoryCounts,
    members: categoryMembers,
    requests: categoryRequests
  };
};

// Helper to fetch user profile from localStorage
const getUserProfile = (userId: string) => {
  const data = localStorage.getItem(`userSettings_${userId}`);
  return data ? JSON.parse(data) : null;
};

export default function Categories() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const { signIn, isLoaded } = useSignIn();
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState<Record<string, boolean>>({});

  // Initialize categories with empty counts
  useEffect(() => {
    const initialCategories: Category[] = [
      { name: "Web Development", count: 0, description: "Frontend, backend, and full-stack web projects" },
      { name: "Mobile Development", count: 0, description: "iOS, Android, and cross-platform mobile apps" },
      { name: "UI/UX Design", count: 0, description: "User interface and experience design projects" },
      { name: "DevOps", count: 0, description: "Infrastructure and deployment automation" },
      { name: "Data Science", count: 0, description: "Data analysis and machine learning projects" },
      { name: "Cybersecurity", count: 0, description: "Security audits and implementation" },
      { name: "Game Development", count: 0, description: "Desktop and mobile game projects" },
      { name: "Blockchain", count: 0, description: "Web3 and cryptocurrency projects" },
      { name: "Other", count: 0, description: "Miscellaneous tech projects" },
    ];
    setCategories(initialCategories);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch all projects from storage, not mock data
        const allProjects = await getProjects();
        setProjects(allProjects);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Update categories whenever projects change
  useEffect(() => {
    if (projects.length === 0) return;

    const categoryCounts = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryMembers = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + project.members.length;
      return acc;
    }, {} as Record<string, number>);

    const categoryRequests = projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + project.pendingRequests.length;
      return acc;
    }, {} as Record<string, number>);

    setCategories(prevCategories => 
      prevCategories.map(category => ({
        ...category,
        count: categoryCounts[category.name] || 0,
        description: category.name === "Other" 
          ? "Miscellaneous tech projects"
          : `${category.description?.split('(')[0].trim()} (${categoryMembers[category.name] || 0} members, ${categoryRequests[category.name] || 0} pending requests)`
      }))
    );
  }, [projects]);

  useEffect(() => {
    const category = searchParams.get('category');
    setSelectedCategory(category);
  }, [searchParams]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category.toLowerCase());
    navigate(`/categories?category=${encodeURIComponent(category.toLowerCase())}`);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleRequestToJoin = async (projectId: string, e?: React.MouseEvent) => {
    // Prevent navigation when clicking the request button
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
      // Remove simulated API call delay
      // await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Request Sent",
        description: "Your request to join the project has been sent to the owner",
      });

      // Update the project's pending requests
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId
            ? { ...project, pendingRequests: [...project.pendingRequests, user.id] }
            : project
        )
      );
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

  const filteredProjects = selectedCategory 
    ? projects.filter(project => project.category.toLowerCase() === selectedCategory.toLowerCase())
    : projects;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Project Categories</h1>
                  <p className="text-gray-600 mt-1">
                    {selectedCategory 
                      ? `Showing ${filteredProjects.length} projects in ${selectedCategory}`
                      : "Browse projects by category or create a new one"}
                  </p>
                </div>
                <Button 
                  className="bg-elevatify-600 hover:bg-elevatify-700"
                  onClick={() => navigate("/create-project")}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create Project
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="p-4 border border-gray-100 rounded-lg">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))
                ) : (
                  // Actual categories
                  categories.map((category) => (
                    <div 
                      key={category.name}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedCategory?.toLowerCase() === category.name.toLowerCase()
                          ? 'border-elevatify-600 bg-elevatify-50'
                          : 'border-gray-100 hover:border-elevatify-200 hover:shadow-md'
                      }`}
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        </div>
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-elevatify-100 text-elevatify-700 text-sm font-medium">
                          {category.count}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedCategory && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects in {selectedCategory}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="block group p-4 border border-gray-100 rounded-lg hover:border-elevatify-200 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-elevatify-500 focus:ring-offset-2"
                      >
                        <div className="flex flex-col h-full">
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-elevatify-600 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {project.description}
                            </p>
                          </div>
                          {/* CV Preview Section */}
                          <div className="mt-2">
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">Team Members' CVs</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.members.slice(0, 2).map((memberId) => {
                                const profile = getUserProfile(memberId);
                                return (
                                  <Card key={memberId} className="p-2 w-44">
                                    <div className="font-bold text-xs mb-1">{profile?.displayName || `User ${memberId}`}</div>
                                    <div className="text-xs text-gray-600 mb-1">{profile?.specialization || 'N/A'}</div>
                                    <div className="text-xs text-gray-600 mb-1">{profile?.region || 'N/A'}</div>
                                    <div className="text-xs text-gray-600 mb-1 line-clamp-2">{profile?.bio || 'No bio.'}</div>
                                    {profile?.githubUsername && (
                                      <a href={`https://github.com/${profile.githubUsername}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs mr-1">GitHub</a>
                                    )}
                                    {profile?.linkedinUrl && (
                                      <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">LinkedIn</a>
                                    )}
                                  </Card>
                                );
                              })}
                              {project.members.length > 2 && (
                                <span className="text-xs text-gray-500">+{project.members.length - 2} more</span>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              {project.members.length} members
                            </div>
                            {user && user.id !== project.ownerId && !project.members.includes(user.id) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRequestToJoin(project.id);
                                }}
                                disabled={isRequesting[project.id] || project.pendingRequests.includes(user.id)}
                                className="ml-auto"
                              >
                                {isRequesting[project.id] ? (
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}