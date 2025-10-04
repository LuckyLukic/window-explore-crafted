import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, uploadBackgroundImage } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const SiteSettingsManager = () => {
  const queryClient = useQueryClient();
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.35);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  const { data: settings, isLoading } = useQuery({
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

  const updateMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (!settings?.id) throw new Error("No settings found");
      
      const { error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', settings.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({ title: "Settings updated successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error updating settings", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const handleDesktopUpload = async () => {
    if (!desktopFile) return;
    setUploadingDesktop(true);
    try {
      const url = await uploadBackgroundImage(desktopFile);
      await updateMutation.mutateAsync({ bg_desktop_url: url });
      setDesktopFile(null);
    } catch (error: any) {
      toast({ 
        title: "Upload failed", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setUploadingDesktop(false);
    }
  };

  const handleMobileUpload = async () => {
    if (!mobileFile) return;
    setUploadingMobile(true);
    try {
      const url = await uploadBackgroundImage(mobileFile);
      await updateMutation.mutateAsync({ bg_mobile_url: url });
      setMobileFile(null);
    } catch (error: any) {
      toast({ 
        title: "Upload failed", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setUploadingMobile(false);
    }
  };

  const handleOverlayUpdate = async () => {
    await updateMutation.mutateAsync({ overlay_opacity: overlayOpacity });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Global Background Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Desktop Background */}
          <div className="space-y-2">
            <Label>Desktop Background</Label>
            {settings?.bg_desktop_url && (
              <div className="mb-2">
                <img 
                  src={settings.bg_desktop_url} 
                  alt="Desktop background preview" 
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setDesktopFile(e.target.files?.[0] || null)}
              />
              <Button 
                onClick={handleDesktopUpload} 
                disabled={!desktopFile || uploadingDesktop}
              >
                {uploadingDesktop ? <Loader2 className="animate-spin" /> : "Upload"}
              </Button>
            </div>
          </div>

          {/* Mobile Background */}
          <div className="space-y-2">
            <Label>Mobile Background</Label>
            {settings?.bg_mobile_url && (
              <div className="mb-2">
                <img 
                  src={settings.bg_mobile_url} 
                  alt="Mobile background preview" 
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setMobileFile(e.target.files?.[0] || null)}
              />
              <Button 
                onClick={handleMobileUpload} 
                disabled={!mobileFile || uploadingMobile}
              >
                {uploadingMobile ? <Loader2 className="animate-spin" /> : "Upload"}
              </Button>
            </div>
          </div>

          {/* Overlay Opacity */}
          <div className="space-y-2">
            <Label>Overlay Opacity (0-1)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              />
              <Button onClick={handleOverlayUpdate}>Update</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Current: {settings?.overlay_opacity ?? 0.35}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsManager;
