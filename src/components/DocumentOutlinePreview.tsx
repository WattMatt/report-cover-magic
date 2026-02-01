import { motion } from "framer-motion";
import { FileText, BookOpen, FileSpreadsheet, Layers, History, ChevronRight } from "lucide-react";
import { PageConfig, PageType } from "@/utils/generateMultiPageDocument";

interface PageItem {
  id: string;
  config: PageConfig;
}

interface DocumentOutlinePreviewProps {
  pages: PageItem[];
  primaryLineColor: string;
  accentLineColor: string;
}

const PAGE_TYPE_INFO: Record<PageType, { label: string; icon: typeof FileText; description: string }> = {
  cover: { label: "Cover Page", icon: FileText, description: "Title & project info" },
  toc: { label: "Table of Contents", icon: BookOpen, description: "Document navigation" },
  executive: { label: "Executive Summary", icon: FileSpreadsheet, description: "Key findings" },
  section: { label: "Section Divider", icon: Layers, description: "Section header" },
  history: { label: "Document History", icon: History, description: "Revision tracking" },
};

const getPageTitle = (config: PageConfig): string => {
  switch (config.type) {
    case "cover":
      return config.projectName || "Cover Page";
    case "toc":
      return config.documentTitle || "Table of Contents";
    case "executive":
      return config.title || "Executive Summary";
    case "section":
      return config.sectionTitle || "Section Divider";
    case "history":
      return config.title || "Document History";
    default:
      return "Untitled";
  }
};

export const DocumentOutlinePreview = ({
  pages,
  primaryLineColor,
  accentLineColor,
}: DocumentOutlinePreviewProps) => {
  if (pages.length === 0) return null;

  // Calculate estimated page count (each page type = 1 page)
  const totalPages = pages.length;

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: `${primaryLineColor}15` }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" style={{ color: primaryLineColor }} />
          <span className="font-semibold text-sm">Document Outline</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {totalPages} page{totalPages !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Outline List */}
      <div className="divide-y divide-border">
        {pages.map((item, index) => {
          const info = PAGE_TYPE_INFO[item.config.type];
          const Icon = info.icon;
          const pageNumber = index + 1;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors"
            >
              {/* Page Number */}
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: primaryLineColor }}
              >
                {pageNumber}
              </div>

              {/* Icon */}
              <Icon
                className="h-4 w-4 flex-shrink-0"
                style={{ color: accentLineColor }}
              />

              {/* Title & Type */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {getPageTitle(item.config)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {info.label}
                </div>
              </div>

              {/* Page indicator */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                <span>p.{pageNumber}</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div
        className="px-4 py-3 border-t"
        style={{ borderTopColor: `${accentLineColor}30` }}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {/* Page type breakdown */}
            {Object.entries(
              pages.reduce((acc, p) => {
                acc[p.config.type] = (acc[p.config.type] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([type, count]) => {
              const info = PAGE_TYPE_INFO[type as PageType];
              const Icon = info.icon;
              return (
                <div key={type} className="flex items-center gap-1 text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  <span>{count}</span>
                </div>
              );
            })}
          </div>
          <div
            className="font-medium"
            style={{ color: primaryLineColor }}
          >
            Total: {totalPages} page{totalPages !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentOutlinePreview;
