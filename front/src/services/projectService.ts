interface ProjectStats {
  activeProjects: number;
  teamMembers: number;
  completedProjects: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  teamSize: number;
  timeframe: string;
  category: string;
  status: "open" | "in-progress" | "completed";
  createdBy: string;
  ownerId: string;
  createdAt: Date;
  members: string[];
  pendingRequests: string[];
}

// For development, we'll store projects in localStorage
const PROJECTS_STORAGE_KEY = "elevatify_global_projects";

const MOCK_PROJECTS: Project[] = [
  {id: "1", title: "E-commerce Website", category: "Web Development", description: "Full-stack e-commerce platform", teamSize: 4, timeframe: "3 months", status: "open", createdBy: "user1", ownerId: "user1", createdAt: new Date(), members: ["user2", "user3"], pendingRequests: []},
  {id: "2", title: "Mobile Banking App", category: "Mobile Development", description: "iOS and Android banking application", teamSize: 3, timeframe: "2 months", status: "open", createdBy: "user2", ownerId: "user2", createdAt: new Date(), members: ["user1"], pendingRequests: []},
  // ... add the rest of your mock projects here ...
];

const getStoredProjects = (): Project[] => {
  const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (stored) return JSON.parse(stored).map((project: any) => ({
    ...project,
    createdAt: new Date(project.createdAt)
  }));
  // Only load mock data if not initialized
  if (!localStorage.getItem('elevatify_initialized')) {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(MOCK_PROJECTS));
    localStorage.setItem('elevatify_initialized', 'true');
    return MOCK_PROJECTS;
  }
  return [];
};

export const storeProjects = (projects: Project[]) => {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
};

export const getProjectStats = async (userId: string): Promise<ProjectStats> => {
  const projects = getStoredProjects();
  // Include projects where the user is a member, not just the creator
  const userProjects = projects.filter(p => p.members.includes(userId));
  return {
    activeProjects: userProjects.filter(p => p.status === "open" || p.status === "in-progress").length,
    teamMembers: userProjects.reduce((acc, p) => acc + p.teamSize, 0),
    completedProjects: userProjects.filter(p => p.status === "completed").length
  };
};

export const getProjects = async (
  search?: string,
  category?: string,
  status?: "open" | "in-progress" | "completed"
): Promise<Project[]> => {
  let projects = getStoredProjects();

  if (search) {
    const searchLower = search.toLowerCase();
    projects = projects.filter(
      p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );
  }

  if (category) {
    projects = projects.filter(p => p.category === category);
  }

  if (status) {
    projects = projects.filter(p => p.status === status);
  }

  return projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const createProject = async (
  data: Omit<Project, "id" | "createdAt" | "status" | "ownerId">
): Promise<Project> => {
  const projects = getStoredProjects();
  
  const newProject: Project = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    status: "open",
    ownerId: data.createdBy,
    members: [data.createdBy],
    pendingRequests: []
  };

  projects.push(newProject);
  storeProjects(projects);
  return newProject;
};

export const updateProject = async (
  id: string,
  data: Partial<Project>
): Promise<Project> => {
  const projects = getStoredProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) {
    throw new Error("Project not found");
  }

  const updatedProject = {
    ...projects[index],
    ...data
  };

  projects[index] = updatedProject;
  storeProjects(projects);
  return updatedProject;
};

export const deleteProject = async (id: string): Promise<void> => {
  const projects = getStoredProjects();
  const filtered = projects.filter(p => p.id !== id);
  storeProjects(filtered);
};