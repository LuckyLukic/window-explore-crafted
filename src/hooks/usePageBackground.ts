import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLocation } from "react-router-dom";

interface BackgroundResult {
  desktopUrl: string | null;
  mobileUrl: string | null;
  overlay: number;
}

// Match path pattern with wildcard support
function matchesPattern(path: string, pattern: string): boolean {
  if (pattern === path) return true;
  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -2);
    return path.startsWith(prefix);
  }
  return false;
}

// Pick background based on screen width
export function pickBgForWidth(
  desktopUrl: string | null,
  mobileUrl: string | null,
  width: number
): string | null {
  if (width < 768 && mobileUrl) return mobileUrl;
  return desktopUrl || mobileUrl;
}

export function usePageBackground(
  entityData?: {
    bg_desktop_url?: string | null;
    bg_mobile_url?: string | null;
    overlay_opacity?: number | null;
    category?: {
      bg_desktop_url?: string | null;
      bg_mobile_url?: string | null;
      overlay_opacity?: number | null;
    };
  }
): BackgroundResult {
  const location = useLocation();

  // Fetch route-level overrides
  const { data: pageBackgrounds } = useQuery({
    queryKey: ['page_backgrounds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_backgrounds')
        .select('*')
        .eq('active', true)
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch site settings
  const { data: siteSettings } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  // Determine background with precedence
  const getBackground = (): BackgroundResult => {
    const defaultResult: BackgroundResult = {
      desktopUrl: null,
      mobileUrl: null,
      overlay: 0.35
    };

    // 1. Route mapping override (highest priority)
    if (pageBackgrounds) {
      const matchingBg = pageBackgrounds.find(bg => 
        matchesPattern(location.pathname, bg.path_pattern)
      );
      
      if (matchingBg) {
        return {
          desktopUrl: matchingBg.bg_desktop_url,
          mobileUrl: matchingBg.bg_mobile_url,
          overlay: matchingBg.overlay_opacity ?? 0.35
        };
      }
    }

    // 2. Entity-level backgrounds
    if (entityData) {
      // Check if entity has its own background
      if (entityData.bg_desktop_url || entityData.bg_mobile_url) {
        return {
          desktopUrl: entityData.bg_desktop_url || null,
          mobileUrl: entityData.bg_mobile_url || null,
          overlay: entityData.overlay_opacity ?? 0.35
        };
      }

      // Fallback to category background (for products)
      if (entityData.category?.bg_desktop_url || entityData.category?.bg_mobile_url) {
        return {
          desktopUrl: entityData.category.bg_desktop_url || null,
          mobileUrl: entityData.category.bg_mobile_url || null,
          overlay: entityData.category.overlay_opacity ?? 0.35
        };
      }
    }

    // 3. Site settings (lowest priority)
    if (siteSettings) {
      return {
        desktopUrl: siteSettings.bg_desktop_url || null,
        mobileUrl: siteSettings.bg_mobile_url || null,
        overlay: siteSettings.overlay_opacity ?? 0.35
      };
    }

    return defaultResult;
  };

  return getBackground();
}
