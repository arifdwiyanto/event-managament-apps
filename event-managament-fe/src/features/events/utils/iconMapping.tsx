import React from "react";
import * as SolidIcons from "@heroicons/react/24/solid";
import * as OutlineIcons from "@heroicons/react/24/outline";

export const CategoryIcon: React.FC<{
  iconName?: string | null;
  className?: string;
  outline?: boolean;
  style?: React.CSSProperties;
}> = ({ iconName, className = "w-4 h-4", outline = false, style }) => {
  const IconSet = outline ? OutlineIcons : SolidIcons;

  // 1. Handle specific known cases that aren't direct Heroicon PascalCase names
  const lowerName = iconName?.toLowerCase();
  
  if (lowerName === "all") {
    return <IconSet.GlobeAltIcon className={className} />;
  }
  
  if (lowerName === "grid_view" || !iconName) {
    return <IconSet.Squares2X2Icon className={className} />;
  }

  // 2. Try to resolve as Heroicon name
  // This handles: "SparklesIcon", "sparkles-icon", "sparkles"
  let componentName = iconName;
  
  // Normalize to PascalCase if it's not already
  if (!componentName.endsWith("Icon")) {
    componentName =
      iconName
        .split(/[-_ ]+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("") + "Icon";
  }

  const ResolvedIcon = IconSet[componentName as keyof typeof IconSet];

  if (ResolvedIcon) {
    return <ResolvedIcon className={className} />;
  }

  // 3. Final Fallback
  return <IconSet.FaceSmileIcon className={className} />;
};
