import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface AdminWithEmail {
  user_id: string;
  email: string;
}

const AdminsManager = () => {
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient();

  const { data: admins, isLoading } = useQuery<AdminWithEmail[]>({
    queryKey: ['admins'],
    queryFn: async () => {
      // Get all admin user IDs
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('user_id');
      
      if (adminError) throw adminError;
      
      // Get user details from auth
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      // Match admins with user emails
      return adminData?.map(admin => {
        const user = users.find((u: User) => u.id === admin.user_id);
        return {
          user_id: admin.user_id,
          email: user?.email || 'Unknown'
        };
      }) || [];
    }
  });

  const addAdminMutation = useMutation({
    mutationFn: async (adminEmail: string) => {
      // Get all users from auth
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      const user = users.find((u: User) => u.email === adminEmail);
      
      if (!user) {
        throw new Error('User not found. They must sign up first.');
      }

      const { error: insertError } = await supabase
        .from('admins')
        .insert({ user_id: user.id });

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Admin added successfully');
      setEmail('');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const deleteAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admins'] });
      toast.success('Admin removed successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to remove admin: ' + error.message);
    }
  });

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    addAdminMutation.mutate(email.trim());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-playfair">Manage Admins</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAddAdmin} className="flex gap-2">
          <Input
            type="email"
            placeholder="Admin email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            disabled={addAdminMutation.isPending}
          >
            {addAdminMutation.isPending ? 'Adding...' : 'Add Admin'}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground">
          Note: The user must have signed up to the app before you can add them as an admin.
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading admins...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins?.map((admin) => (
                <TableRow key={admin.user_id}>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAdminMutation.mutate(admin.user_id)}
                      disabled={deleteAdminMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminsManager;
