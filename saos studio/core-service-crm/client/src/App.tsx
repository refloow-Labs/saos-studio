import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import Pipeline from './pages/Pipeline';
import PromptBuilder from './pages/PromptBuilder';
import NewLead from './pages/NewLead';

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/new" element={<NewLead />} />
          <Route path="/leads/:id" element={<LeadDetail />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/prompts" element={<PromptBuilder />} />
        </Routes>
      </main>
    </div>
  );
}
