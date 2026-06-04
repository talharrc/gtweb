import { createContext, useContext, useState, ReactNode } from 'react';
import { GTProject } from '../types';

interface ProjectContextValue {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  selectedProject: GTProject | null;
  setSelectedProject: (p: GTProject | null) => void;
}

const ProjectContext = createContext<ProjectContextValue>({
  selectedProjectId: null,
  setSelectedProjectId: () => {},
  selectedProject: null,
  setSelectedProject: () => {},
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<GTProject | null>(null);

  return (
    <ProjectContext.Provider value={{
      selectedProjectId,
      setSelectedProjectId,
      selectedProject,
      setSelectedProject,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export const useProject = () => useContext(ProjectContext);
