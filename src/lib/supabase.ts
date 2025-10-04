import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Helper function to upload image to storage
export async function uploadImage(file: File, path: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// Helper to delete image from storage
export async function deleteImage(url: string): Promise<void> {
  const path = url.split('/storage/v1/object/public/media/')[1];
  if (path) {
    await supabase.storage.from('media').remove([path]);
  }
}

// Helper to upload background image to storage
export async function uploadBackgroundImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `backgrounds/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
