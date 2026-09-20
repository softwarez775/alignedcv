import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppStore } from "@/stores/useAppStore";
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import Jobs from "@/pages/Jobs";
import JobDetails from "@/pages/JobDetails";
import MyResume from "@/pages/MyResume";
import Resumes from "@/pages/Resumes";
import ResumeEditor from "@/pages/ResumeEditor";
import ATSAnalyzer from "@/pages/ATSAnalyzer";
import Applications from "@/pages/Applications";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";

/**
 * Acesso direto: sem login, sem cadastro.
 * AlignedCV → Onboarding (primeira vez) OU Dashboard (dados salvos).
 */
function Gate() {
  const onboarded = useAppStore((s) => s.onboarded);
  return onboarded ? (
    <Navigate to="/app" replace />
  ) : (
    <Navigate to="/onboarding" replace />
  );
}

/** Rota de conveniência: abre o diálogo de adaptação na página da vaga */
function AdaptRedirect() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/app/vagas/${jobId}?adaptar=1`, { replace: true });
  }, [jobId, navigate]);
  return null;
}

/** Rota de conveniência: visualização abre o editor em modo preview */
function ResumeView() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/app/curriculos/${resumeId}/editar?preview=1`, { replace: true });
  }, [resumeId, navigate]);
  return null;
}

export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/app" element={<Gate />} />
          <Route path="/app/*" element={<AppRoutes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors closeButton />
    </TooltipProvider>
  );
}

function AppRoutes() {
  const onboarded = useAppStore((s) => s.onboarded);
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="vagas" element={<Jobs />} />
        <Route path="vagas/:jobId" element={<JobDetails />} />
        <Route path="curriculo" element={<MyResume />} />
        <Route path="curriculo/adaptar/:jobId" element={<AdaptRedirect />} />
        <Route path="curriculos" element={<Resumes />} />
        <Route path="curriculos/:resumeId/editar" element={<ResumeEditor />} />
        <Route path="curriculos/:resumeId/visualizar" element={<ResumeView />} />
        <Route path="ats" element={<ATSAnalyzer />} />
        <Route path="candidaturas" element={<Applications />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="configuracoes" element={<Settings />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
    </Routes>
  );
}

