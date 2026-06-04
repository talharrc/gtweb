import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Zap, BarChart2, Bell, ClipboardList, FileText, Users } from 'lucide-react';
import HubLayout, { NavItem } from '../shared/HubLayout';
import RoleGuard from '../shared/RoleGuard';
import { ProjectProvider, useProject } from '../../context/ProjectContext';
import { useProjects } from '../../hooks/useProjects';
import ActionCenter from './ActionCenter';
import ProjectOverview from './ProjectOverview';
import UpdatesFeed from './UpdatesFeed';
import RequirementsForms from './RequirementsForms';
import DocumentVault from './DocumentVault';
import TeamContacts from './TeamContacts';

const navItems: NavItem[] = [
  { label: 'Action Center', path: 'actions', icon: <Zap className="w-4 h-4" /> },
  { label: 'Project Overview', path: 'overview', icon: <BarChart2 className="w-4 h-4" /> },
  { label: 'Updates', path: 'updates', icon: <Bell className="w-4 h-4" /> },
  { label: 'Forms', path: 'forms', icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Documents', path: 'documents', icon: <FileText className="w-4 h-4" /> },
  { label: 'Team & Contacts', path: 'team', icon: <Users className="w-4 h-4" /> },
];

function ClientHubInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects } = useProjects();
  const { setSelectedProject, setSelectedProjectId } = useProject();

  const activeSection = location.pathname.split('/hub/client/')[1]?.split('/')[0] ?? 'actions';

  // Auto-select first project
  useEffect(() => {
    if (projects.length > 0 && !useProject['selectedProject']) {
      setSelectedProject(projects[0]);
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);

  return (
    <HubLayout
      title="Client Hub"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={(s) => navigate(`/hub/client/${s}`)}
    >
      <Routes>
        <Route index element={<ActionCenter />} />
        <Route path="actions" element={<ActionCenter />} />
        <Route path="overview" element={<ProjectOverview />} />
        <Route path="updates" element={<UpdatesFeed />} />
        <Route path="forms" element={<RequirementsForms />} />
        <Route path="documents" element={<DocumentVault />} />
        <Route path="team" element={<TeamContacts />} />
      </Routes>
    </HubLayout>
  );
}

export default function ClientHubView(props?: any) {
  return (
    <RoleGuard allowedRoles={['client', 'admin']}>
      <ProjectProvider>
        <ClientHubInner />
      </ProjectProvider>
    </RoleGuard>
  );
}
