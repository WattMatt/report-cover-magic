import { useEffect, useCallback } from "react";

interface ShortcutHandlers {
  onReset?: () => void;
  onDownload?: () => void;
  onSave?: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd key
      const isModifierPressed = event.ctrlKey || event.metaKey;
      
      if (!isModifierPressed) return;

      switch (event.key.toLowerCase()) {
        case "r":
          if (handlers.onReset) {
            event.preventDefault();
            handlers.onReset();
          }
          break;
        case "d":
          if (handlers.onDownload) {
            event.preventDefault();
            handlers.onDownload();
          }
          break;
        case "s":
          if (handlers.onSave) {
            event.preventDefault();
            handlers.onSave();
          }
          break;
      }
    },
    [handlers]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};
