import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { Activity, Plus, Users, Clock, Zap, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProjectStats, getProjects, Project } from "@/services/projectService";

export default function Home() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeProjects: 0,
    teamMembers: 0,
    completedProjects: 0
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user) {
        try {
          const [projectStats, projects] = await Promise.all([
            getProjectStats(user.id),
            getProjects()
          ]);
          setStats(projectStats);
          setRecentProjects(projects.slice(0, 5)); // Get 5 most recent projects
        } catch (error) {
          console.error("Error loading dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadDashboardData();
  }, [user]);

  const getStatusColor = (status: Project["status"]) => {
    const colors = {
      open: "bg-green-100 text-green-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800"
    };
    return colors[status] || colors.open;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-gray-700 text-3xl font-medium">Welcome back, {user?.firstName || 'User'}!</h3>
              <Button
                onClick={() => navigate("/create-project")}
                className="bg-elevatify-600 hover:bg-elevatify-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Active Projects</p>
                    <h4 className="text-2xl font-semibold text-gray-700">{stats.activeProjects}</h4>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Completed Projects</p>
                    <h4 className="text-2xl font-semibold text-gray-700">{stats.completedProjects}</h4>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Team Members</p>
                    <h4 className="text-2xl font-semibold text-gray-700">{stats.teamMembers}</h4>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Pending Tasks</p>
                    <h4 className="text-2xl font-semibold text-gray-700">
                      {recentProjects.filter(p => p.status === "open").length}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
              <div className="px-6 py-4 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-700">Recent Projects</h4>
              </div>
              <div className="p-6">
                {recentProjects.length === 0 ? (
                  <p className="text-gray-500 text-center">No projects yet. Create your first project!</p>
                ) : (
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-800">{project.title}</h5>
                          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {project.teamSize} members
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {project.timeframe}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h4 className="text-lg font-semibold text-gray-700">Quick Actions</h4>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={() => navigate("/projects")}
                >
                  <Activity className="mr-2 h-4 w-4" />
                  View All Projects
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={() => navigate("/requests")}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Check Requests
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  onClick={() => navigate("/messages")}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  View Messages
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
