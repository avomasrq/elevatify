import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Project, getProjects } from "../services/projectService";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function MyProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const fetchedProjects = await getProjects();
      // Filter projects to show both owned and member projects
      const myProjects = fetchedProjects.filter(p => 
        p.ownerId === user?.id || // Projects user owns
        (p.members && p.members.includes(user?.id)) // Projects user is a member of
      );
      setProjects(myProjects);
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
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-semibold text-gray-800">My Projects</h1>
              <Button variant="outline" onClick={fetchProjects}>Refresh</Button>
            </div>

            {loading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : projects.length === 0 ? (
              <div className="text-center text-gray-600 bg-white rounded-lg p-8 shadow-sm">
                <h3 className="text-xl font-medium mb-2">No projects found</h3>
                <p className="mb-4">You haven't created or joined any projects yet.</p>
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
                      <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {project.ownerId === user?.id ? 'Owner' : 'Member'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Team: {project.teamSize} members</span>
                      <span>{project.timeframe}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <span className="text-sm text-gray-500">
                        Category: {project.category}
                      </span>
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