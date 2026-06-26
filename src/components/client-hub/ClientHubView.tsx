import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Zap, BarChart2, Bell, ClipboardList, FileText, Users, MessageSquare } from 'lucide-react';
import HubLayout, { NavItem } from '../shared/HubLayout';
import MessagesSection from '../shared/MessagesSection';
import { ProjectProvider, useProject } from '../../context/ProjectContext';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../context/AuthContext';
import ActionCenter from './ActionCenter';
import ProjectOverview from './ProjectOverview';
import UpdatesFeed from './UpdatesFeed';
import RequirementsForms from './RequirementsForms';
import DocumentVault from './DocumentVault';
import TeamContacts from './TeamContacts';

const navItems: NavItem[] = [
  { label: 'Action Center',   path: 'actions',   icon: <Zap className="w-4 h-4" /> },
  { label: 'Project Overview', path: 'overview', icon: <BarChart2 className="w-4 h-4" /> },
  { label: 'Updates',         path: 'updates',   icon: <Bell className="w-4 h-4" /> },
  { label: 'Forms',           path: 'forms',     icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Documents',       path: 'documents', icon: <FileText className="w-4 h-4" /> },
  { label: 'Messages',        path: 'messages',  icon: <MessageSquare className="w-4 h-4" /> },
  { label: 'Team & Contacts', path: 'team',      icon: <Users className="w-4 h-4" /> },
];

function ClientHubInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects } = useProjects();
  const { projectId: authProjectId } = useAuth();
  const { setSelectedProject, setSelectedProjectId, selectedProjectId } = useProject();

  const activeSection = location.pathname.split('/hub/client/')[1]?.split('/')[0] ?? 'actions';

  useEffect(() => {
    if (projects.length === 0) return;
    const target = authProjectId
      ? (projects.find(p => p.id === authProjectId) ?? projects[0])
      : projects[0];
    setSelectedProject(target);
    setSelectedProjectId(target.id);
  }, [projects, authProjectId]);

  return (
    <HubLayout
      title="Client Hub"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={(s) => navigate(`/hub/client/${s}`)}
    >
      <Routes>
        <Route index element={<ActionCenter />} />
        <Route path="actions"   element={<ActionCenter />} />
        <Route path="overview"  element={<ProjectOverview />} />
        <Route path="updates"   element={<UpdatesFeed />} />
        <Route path="forms"     element={<RequirementsForms />} />
        <Route path="documents" element={<DocumentVault />} />
        <Route path="messages"  element={<MessagesSection projectId={selectedProjectId} />} />
        <Route path="team"      element={<TeamContacts />} />
      </Routes>
    </HubLayout>
  );
}

export default function ClientHubView() {
  return (
    <ProjectProvider>
      <ClientHubInner />
    </ProjectProvider>
  );
}
