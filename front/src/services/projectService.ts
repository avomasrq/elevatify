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
  createdAt: Date;
}

// For development, we'll store projects in localStorage
const PROJECTS_STORAGE_KEY = "elevatify_projects";

const getStoredProjects = (): Project[] => {
  const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (!stored) return [];
  const projects = JSON.parse(stored);
  // Convert string dates back to Date objects
  return projects.map((project: any) => ({
    ...project,
    createdAt: new Date(project.createdAt)
  }));
};

const storeProjects = (projects: Project[]) => {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
};

export const getProjectStats = async (userId: string): Promise<ProjectStats> => {
  const projects = getStoredProjects();
  const userProjects = projects.filter(p => p.createdBy === userId);
  
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
  data: Omit<Project, "id" | "createdAt" | "status">
): Promise<Project> => {
  const projects = getStoredProjects();
  
  const newProject: Project = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    status: "open"
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