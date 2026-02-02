import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface UserProfile {
    id: string;
    email: string;
    role: 'admin' | 'socio' | 'guest';
    full_name: string | null;
    created_at: string;
}

interface AdminState {
    users: UserProfile[];
    isLoading: boolean;
    error: string | null;

    fetchUsers: () => Promise<void>;
    updateUserRole: (userId: string, newRole: 'admin' | 'socio' | 'guest') => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            set({ users: data as UserProfile[], isLoading: false });
        } catch (err: any) {
            console.error('Error fetching users:', err);
            set({ error: err.message, isLoading: false });
        }
    },

    updateUserRole: async (userId, newRole) => {
        // Optimistic update
        set((state) => ({
            users: state.users.map(u => u.id === userId ? { ...u, role: newRole } : u)
        }));

        try {
            const { error } = await supabase
                .from('users')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;
        } catch (err: any) {
            console.error('Error updating role:', err);
            // Revert on error could be implemented here, but for now just setting error
            set({ error: err.message });
            // Re-fetch to ensure sync
            get().fetchUsers();
        }
    }
}));
