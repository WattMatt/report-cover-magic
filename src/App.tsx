import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import MainLayout from "@/layouts/MainLayout";
import CoverPage from "./pages/CoverPage";
import TableOfContentsPage from "./pages/TableOfContentsPage";
import ExecutiveSummaryPage from "./pages/ExecutiveSummaryPage";
import SectionDividerPage from "./pages/SectionDividerPage";
import DocumentHistoryPage from "./pages/DocumentHistoryPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<CoverPage />} />
              <Route path="/table-of-contents" element={<TableOfContentsPage />} />
              <Route path="/executive-summary" element={<ExecutiveSummaryPage />} />
              <Route path="/section-divider" element={<SectionDividerPage />} />
              <Route path="/document-history" element={<DocumentHistoryPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
