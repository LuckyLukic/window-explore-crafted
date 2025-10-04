import { useEffect, useState } from "react";
import { pickBgForWidth } from "@/hooks/usePageBackground";

interface HeroBackgroundProps {
  desktopUrl?: string | null;
  mobileUrl?: string | null;
  overlay?: number;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const HeroBackground = ({
  desktopUrl,
  mobileUrl,
  overlay = 0.35,
  title,
  subtitle,
  children
}: HeroBackgroundProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bgUrl = pickBgForWidth(desktopUrl, mobileUrl, windowWidth);

  return (
    <section className="relative min-h-[400px] flex items-center overflow-hidden">
      {/* Background Image or Fallback */}
      {bgUrl ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
      )}
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-background"
        style={{ opacity: overlay }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {title && (
          <h1 className="text-5xl md:text-6xl font-bold font-playfair text-foreground mb-4">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export default HeroBackground;
