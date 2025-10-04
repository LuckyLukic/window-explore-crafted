import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, uploadBackgroundImage } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const PageBackgroundsManager = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    path_pattern: "",
    priority: 0,
    overlay_opacity: 0.35,
    active: true
  });
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: backgrounds, isLoading } = useQuery({
    queryKey: ['page_backgrounds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_backgrounds')
        .select('*')
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('page_backgrounds')
        .insert([data]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page_backgrounds'] });
      toast({ title: "Background created successfully" });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('page_backgrounds')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page_backgrounds'] });
      toast({ title: "Background updated successfully" });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('page_backgrounds')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page_backgrounds'] });
      toast({ title: "Background deleted successfully" });
    }
  });

  const resetForm = () => {
    setFormData({
      path_pattern: "",
      priority: 0,
      overlay_opacity: 0.35,
      active: true
    });
    setDesktopFile(null);
    setMobileFile(null);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (bg: any) => {
    setEditingId(bg.id);
    setFormData({
      path_pattern: bg.path_pattern,
      priority: bg.priority,
      overlay_opacity: bg.overlay_opacity,
      active: bg.active
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      let bgDesktopUrl = null;
      let bgMobileUrl = null;

      if (desktopFile) {
        bgDesktopUrl = await uploadBackgroundImage(desktopFile);
      }
      if (mobileFile) {
        bgMobileUrl = await uploadBackgroundImage(mobileFile);
      }

      const data = {
        ...formData,
        ...(bgDesktopUrl && { bg_desktop_url: bgDesktopUrl }),
        ...(bgMobileUrl && { bg_mobile_url: bgMobileUrl })
      };

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, updates: data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error: any) {
      toast({ 
        title: "Error saving background", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading backgrounds...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Page Backgrounds</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Background
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Add"} Page Background</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Path Pattern *</Label>
                <Input
                  value={formData.path_pattern}
                  onChange={(e) => setFormData({ ...formData, path_pattern: e.target.value })}
                  placeholder="e.g. /, /about, /c/*, /p/*"
                />
                <p className="text-xs text-muted-foreground">
                  Use /* for wildcard matching (e.g., /c/* matches all category pages)
                </p>
              </div>

              <div className="space-y-2">
                <Label>Desktop Background</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDesktopFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="space-y-2">
                <Label>Mobile Background</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMobileFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Overlay Opacity</Label>
                  <Input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={formData.overlay_opacity}
                    onChange={(e) => setFormData({ ...formData, overlay_opacity: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label>Active</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={uploading || !formData.path_pattern}>
                  {uploading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configured Backgrounds</CardTitle>
        </CardHeader>
        <CardContent>
          {!backgrounds?.length ? (
            <p className="text-muted-foreground text-center py-8">No page backgrounds configured yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pattern</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Overlay</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backgrounds.map((bg) => (
                  <TableRow key={bg.id}>
                    <TableCell className="font-mono">{bg.path_pattern}</TableCell>
                    <TableCell>{bg.priority}</TableCell>
                    <TableCell>{bg.overlay_opacity}</TableCell>
                    <TableCell>{bg.active ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(bg)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(bg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PageBackgroundsManager;
