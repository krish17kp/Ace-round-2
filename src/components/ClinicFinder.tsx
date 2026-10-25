import React, { useState, useEffect } from "react";

// --- UI Components (Self-Contained) ---
const Card = ({ className, children }) => <div className={`border rounded-xl shadow-sm bg-white ${className}`}>{children}</div>;
const Button = ({ className, variant, size, children, ...props }) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none active:scale-95";
    const sizeClasses = { icon: "h-10 w-10", lg: "h-12 px-8 text-base", sm: "h-9 px-3", default: "h-10 px-4 py-2" };
    const variantClasses = {
        hero: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
        ghost: "hover:bg-gray-100 text-gray-600",
    };
    return <button {...props} className={`${baseClasses} ${sizeClasses[size] || sizeClasses.default} ${variantClasses[variant] || variantClasses.default} ${className}`}>{children}</button>;
};
const Input = (props) => <input {...props} className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${props.className}`} />;
const Badge = ({ className, children }) => <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>{children}</div>;
const Select = ({ className, children, ...props }) => <select {...props} className={`h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}>{children}</select>;

// --- SVG Icons ---
const ShieldCheck = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const User = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const HeartHandshake = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.94 0l.96-.96.96.96c.82.82 2.13.82 2.94 0v0a2.17 2.17 0 0 0 0-3.08L12 5Z"/></svg>;
const ClipboardHeart = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M14.5 10.5c.39-.39.39-1.01 0-1.4a1 1 0 0 0-1.4 0l-1.6 1.6-1.6-1.6a1 1 0 0 0-1.4 0c-.39.39-.39 1.01 0 1.4l3 3 .5-.5.5.5z"/></svg>;
const UserPlus = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>;
const Trash2 = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;

// --- Role Configuration ---
const ROLES = {
  Individual: { icon: User, color: "bg-gray-100 text-gray-800" },
  Mentor: { icon: HeartHandshake, color: "bg-green-100 text-green-800" },
  Counselor: { icon: ClipboardHeart, color: "bg-blue-100 text-blue-800" },
  Coordinator: { icon: ShieldCheck, color: "bg-indigo-100 text-indigo-800" },
};

// --- Mock Data ---
const initialUsers = [
    { id: 1, name: "Chaitanya Thakur", email: "chaitanya.t@example.com", role: "Coordinator", avatar: "https://avatar.iran.liara.run/public/boy?username=Chaitanya", lastActive: "Online" },
    { id: 2, name: "Krish Parekh", email: "krish.p@example.com", role: "Counselor", avatar: "https://avatar.iran.liara.run/public/boy?username=Krish", lastActive: "2 hours ago" },
    { id: 3, name: "Parth Magrulkar", email: "parth.m@example.com", role: "Mentor", avatar: "https://avatar.iran.liara.run/public/boy?username=Parth", lastActive: "Online" },
    { id: 4, name: "Ajinkya Hatle", email: "ajinkya.h@example.com", role: "Individual", avatar: "https://avatar.iran.liara.run/public/boy?username=Ajinkya", lastActive: "Yesterday" },
];

export const ClinicFinder = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("Individual");

    useEffect(() => {
        // Simulate fetching data on component mount
        setTimeout(() => {
            setUsers(initialUsers);
            setIsLoading(false);
        }, 800);
    }, []);

    const handleInviteUser = () => {
        if (!inviteEmail || !/\S+@\S+\.\S+/.test(inviteEmail)) {
            // A real app would have better validation feedback
            console.error("Invalid email provided");
            return;
        }
        const newUser = {
            id: Date.now(),
            name: inviteEmail.split('@')[0],
            email: inviteEmail,
            role: inviteRole,
            avatar: `https://avatar.iran.liara.run/public/boy?username=${inviteEmail}`,
            lastActive: "Pending Invite",
        };
        setUsers([newUser, ...users]);
        setInviteEmail("");
    };

    const handleRoleChange = (userId, newRole) => {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    };

    const handleRemoveUser = (userId) => {
        // In a real app, you would show a confirmation modal
        setUsers(users.filter(user => user.id !== userId));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
            {/* Header */}
            <Card className="p-6 text-center">
                <ShieldCheck className="h-12 w-12 mx-auto text-indigo-600 mb-4" />
                <h1 className="text-3xl font-bold">User Role Management</h1>
                <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
                    Manage permissions for individuals, mentors, counselors, and coordinators in your wellness platform.
                </p>
            </Card>

            {/* Invite & Search Section */}
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Invite New User</h2>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="new.user@example.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                             <Select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                                {Object.keys(ROLES).map(role => <option key={role} value={role}>{role}</option>)}
                            </Select>
                            <Button onClick={handleInviteUser} variant="hero" size="icon"><UserPlus className="h-5 w-5"/></Button>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Find a User</h2>
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </Card>
            
            {/* User List */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Platform Users ({filteredUsers.length})</h2>
                {isLoading ? (
                    <p className="text-center text-gray-500 py-8">Loading users...</p>
                ) : filteredUsers.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No users found matching your search.</p>
                ) : (
                    filteredUsers.map(user => {
                        const RoleIcon = ROLES[user.role].icon;
                        const roleColor = ROLES[user.role].color;
                        return (
                            <Card key={user.id} className="p-4 hover:shadow-lg transition-shadow duration-300 animate-fade-in">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={user.avatar}
                                            alt={user.name}
                                            className="h-12 w-12 rounded-full"
                                        />
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge className={`${roleColor} border-none`}>
                                            <RoleIcon className="h-4 w-4 mr-2" />
                                            {user.role}
                                        </Badge>
                                        <Select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                                            {Object.keys(ROLES).map(role => <option key={role} value={role}>{role}</option>)}
                                        </Select>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user.id)} className="text-red-500 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ClinicFinder;

