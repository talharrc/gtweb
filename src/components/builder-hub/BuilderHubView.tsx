import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FolderOpen, CreditCard, Edit3, Send, BookOpen, FileText, BarChart2, MessageSquare } from 'lucide-react';
import HubLayout, { NavItem } from '../shared/HubLayout';
import MessagesSection from '../shared/MessagesSection';
import { ProjectProvider, useProject } from '../../context/ProjectContext';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../context/AuthContext';
import MyProjects from './MyProjects';
import PaymentDashboard from './PaymentDashboard';
import UpdatesSubmitter from './UpdatesSubmitter';
import RequestsBoard from './RequestsBoard';
import ResourceLibrary from './ResourceLibrary';
import AgreementsVault from './AgreementsVault';
import PerformanceView from './PerformanceView';

const navItems: NavItem[] = [
  { label: 'My Projects', path: 'projects',    icon: <FolderOpen className="w-4 h-4" /> },
  { label: 'Payments',    path: 'payments',    icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Post Update', path: 'updates',     icon: <Edit3 className="w-4 h-4" /> },
  { label: 'Requests',    path: 'requests',    icon: <Send className="w-4 h-4" /> },
  { label: 'Resources',   path: 'resources',   icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Agreements',  path: 'agreements',  icon: <FileText className="w-4 h-4" /> },
  { label: 'Messages',    path: 'messages',    icon: <MessageSquare className="w-4 h-4" /> },
  { label: 'Performance', path: 'performance', icon: <BarChart2 className="w-4 h-4" /> },
];

function BuilderHubInner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects } = useProjects();
  const { projectId: authProjectId } = useAuth();
  const { setSelectedProject, setSelectedProjectId, selectedProjectId } = useProject();

  const activeSection = location.pathname.split('/hub/builder/')[1]?.split('/')[0] ?? 'projects';

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
      title="Builder Hub"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={(s) => navigate(`/hub/builder/${s}`)}
    >
      <Routes>
        <Route index element={<MyProjects />} />
        <Route path="projects"    element={<MyProjects />} />
        <Route path="payments"    element={<PaymentDashboard />} />
        <Route path="updates"     element={<UpdatesSubmitter />} />
        <Route path="requests"    element={<RequestsBoard />} />
        <Route path="resources"   element={<ResourceLibrary />} />
        <Route path="agreements"  element={<AgreementsVault />} />
        <Route path="messages"    element={<MessagesSection projectId={selectedProjectId} />} />
        <Route path="performance" element={<PerformanceView />} />
      </Routes>
    </HubLayout>
  );
}

export default function BuilderHubView() {
  return (
    <ProjectProvider>
      <BuilderHubInner />
    </ProjectProvider>
  );
}
