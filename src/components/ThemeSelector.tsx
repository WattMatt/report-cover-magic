import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Palette, Upload, X } from "lucide-react";
import { useTheme, COLOR_THEMES } from "@/contexts/ThemeContext";

const ThemeSelector = () => {
  const {
    primaryLineColor,
    setPrimaryLineColor,
    accentLineColor,
    setAccentLineColor,
    applyTheme,
    customLogo,
    setCustomLogo,
  } = useTheme();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setCustomLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Global Theme
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          These colors apply to all page types
        </p>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Company Logo
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />
        {customLogo ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-16 bg-muted rounded-md overflow-hidden flex items-center justify-center border border-border">
              <img
                src={customLogo}
                alt="Custom logo"
                className="h-full w-full object-contain"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveLogo}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <Upload className="h-4 w-4" />
            Upload logo
          </Button>
        )}
      </div>

      {/* Theme Presets */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Color Presets
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_THEMES.map((theme) => (
            <button
              key={theme.name}
              type="button"
              onClick={() => applyTheme(theme)}
              className={`relative p-2 rounded-lg border transition-all hover:scale-105 ${
                primaryLineColor === theme.primary && accentLineColor === theme.accent
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex gap-1 mb-1 justify-center">
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
              <span className="text-xs text-muted-foreground block truncate">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Color Inputs */}
      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground">
          Custom Colors
        </Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={primaryLineColor}
              onChange={(e) => setPrimaryLineColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-border"
            />
            <Input
              value={primaryLineColor}
              onChange={(e) => setPrimaryLineColor(e.target.value)}
              className="bg-card border-border font-mono text-xs uppercase flex-1"
              placeholder="#1565C0"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accentLineColor}
              onChange={(e) => setAccentLineColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-border"
            />
            <Input
              value={accentLineColor}
              onChange={(e) => setAccentLineColor(e.target.value)}
              className="bg-card border-border font-mono text-xs uppercase flex-1"
              placeholder="#D4A853"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
