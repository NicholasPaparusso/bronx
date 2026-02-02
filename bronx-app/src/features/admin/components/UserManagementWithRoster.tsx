import { useEffect } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';

export function UserManagementWithRoster() {
    const { users, fetchUsers, updateUserRole, isLoading, error } = useAdminStore();

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleRole = async (id: string, currentRole: string) => {
        if (currentRole === 'guest') return; // Guests cannot be promoted directly here (logic choice)

        const newRole = currentRole === 'admin' ? 'socio' : 'admin';
        await updateUserRole(id, newRole);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-thin tracking-tighter uppercase text-white/50">Elite Roster</h1>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-xs">
                    SYSTEM_ERROR: {error}
                </div>
            )}

            <div className="border border-white/10 rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 uppercase tracking-wider text-xs text-neutral-500">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="p-10 text-center font-mono animate-pulse text-xs uppercase tracking-widest text-neutral-500">
                                    Scanning Database...
                                </td>
                            </tr>
                        ) : users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium text-white">{user.full_name || 'N/A'}</td>
                                <td className="p-4 text-neutral-400 font-mono">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-[10px] uppercase tracking-widest border ${user.role === 'admin' ? 'border-orange-500 text-orange-500' :
                                        user.role === 'socio' ? 'border-blue-500 text-blue-500' :
                                            'border-neutral-500 text-neutral-500'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    {user.role !== 'guest' && (
                                        <button
                                            onClick={() => handleToggleRole(user.id, user.role)}
                                            className="text-xs text-white/50 hover:text-white underline decoration-white/30 underline-offset-4"
                                        >
                                            {user.role === 'admin' ? 'Demote to Socio' : 'Promote to Admin'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
