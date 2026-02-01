import { motion } from "framer-motion";
import wmLogo from "@/assets/wm-logo.jpg";

interface CoverPagePreviewProps {
  reportTitle: string;
  projectName: string;
  projectSubtitle: string;
  projectLocation: string;
  clientName: string;
  documentNumber: string;
  revision: string;
  preparedBy: string;
  date: string;
  customLogo?: string | null;
  primaryLineColor: string;
  accentLineColor: string;
}

const CoverPagePreview = ({
  reportTitle,
  projectName,
  projectSubtitle,
  projectLocation,
  clientName,
  documentNumber,
  revision,
  preparedBy,
  date,
  customLogo,
  primaryLineColor,
  accentLineColor,
}: CoverPagePreviewProps) => {
  // Split title into lines (split on newline or after ~15-20 chars for display)
  const titleLines = reportTitle.split('\n').filter(line => line.trim());
  const logoSrc = customLogo || wmLogo;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-[595px] aspect-[1/1.414] bg-white shadow-2xl rounded-lg overflow-hidden"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cover-gradient-start/5 via-transparent to-cover-gradient-end/10" />
      
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: primaryLineColor }} />
      
      {/* Content */}
      <div className="relative h-full flex flex-col p-8 pt-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <motion.img
            key={logoSrc}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            src={logoSrc}
            alt="Company Logo"
            className="h-16 object-contain"
          />
        </div>
        
        {/* Primary decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="h-1 mb-6"
          style={{ backgroundColor: primaryLineColor }}
        />
        
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-3"
        >
          {titleLines.map((line, index) => (
            <h1 key={index} className="text-3xl md:text-4xl font-bold text-primary tracking-wide">
              {line.toUpperCase()}
            </h1>
          ))}
        </motion.div>
        
        {/* Accent line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center my-4"
        >
          <div className="w-48 h-0.5" style={{ backgroundColor: accentLineColor }} />
        </motion.div>
        
        {/* Project Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-1"
        >
          <h2 className="text-xl md:text-2xl font-bold text-foreground uppercase tracking-wider">
            {projectName}
          </h2>
          {projectSubtitle && (
            <p className="text-base text-accent italic font-medium mt-1">
              {projectSubtitle}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            {projectLocation}
          </p>
        </motion.div>
        
        {/* Spacer */}
        <div className="flex-1 min-h-6" />
        
        {/* Primary separator line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="h-0.5 mb-4"
          style={{ backgroundColor: primaryLineColor, opacity: 0.5 }}
        />
        
        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-1.5 text-sm"
        >
          <div className="flex">
            <span className="font-bold text-primary w-28">CLIENT:</span>
            <span className="text-foreground">{clientName}</span>
          </div>
          <div className="flex">
            <span className="font-bold text-primary w-28">DOCUMENT NO:</span>
            <span className="text-foreground">{documentNumber}</span>
          </div>
          <div className="flex">
            <span className="font-bold text-primary w-28">REVISION:</span>
            <span className="text-foreground">{revision}</span>
          </div>
          <div className="flex">
            <span className="font-bold text-primary w-28">PREPARED BY:</span>
            <span className="text-foreground">{preparedBy}</span>
          </div>
          <div className="flex">
            <span className="font-bold text-primary w-28">DATE:</span>
            <span className="text-foreground">{date}</span>
          </div>
        </motion.div>
        
        {/* Accent footer line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="h-1 mt-4"
          style={{ backgroundColor: accentLineColor }}
        />
        
        {/* Confidential footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-muted-foreground tracking-widest mt-2 uppercase font-medium"
        >
          Confidential
        </motion.p>
      </div>
      
      {/* Decorative corner accents */}
      <div className="absolute top-2 right-4 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: `${accentLineColor}80` }} />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: `${accentLineColor}80` }} />
    </motion.div>
  );
};

export default CoverPagePreview;
