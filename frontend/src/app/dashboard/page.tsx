'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { Phone, CheckCircle, AlertCircle, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
    const { user, loading, error, success, logs, updatePhone, fetchLogs, clearStatus } = useUser();
    const { loginWithGoogle, handleLogout } = useAuth();
    const logsRef = React.useRef<HTMLDivElement | null>(null);
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    React.useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    // When logs update, scroll container to top for better UX
    React.useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [logs.length]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber) return;
        await updatePhone(phoneNumber);
    };

    return (
        <ProtectedRoute>
            <PageContainer>
                <div className="max-w-4xl mx-auto space-y-8">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                            <p className="text-slate-500">Welcome back, {user?.name || user?.email}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-sm font-medium flex items-center",
                                    user?.googleId ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-800'
                                )}>
                                    <span className={cn("w-2 h-2 rounded-full mr-2", user?.googleId ? 'bg-green-500' : 'bg-amber-600')} />
                                    {user?.googleId ? 'Google Connected' : 'Not Connected'}
                                </div>

                                <div className={cn(
                                    "px-3 py-1 rounded-full text-sm font-medium flex items-center",
                                    user?.phoneNumber ? 'bg-green-50 text-green-800' : 'bg-slate-100 text-slate-600'
                                )}>
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    {user?.phoneNumber ? 'Phone set' : 'Phone missing'}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {!user?.googleId && (
                                    <Button variant="secondary" size="sm" onClick={loginWithGoogle}>
                                        Connect Google
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => setIsLogoutModalOpen(true)}>
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </header>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Phone className="h-5 w-5 mr-2 text-primary" />
                                        Phone Configuration
                                    </CardTitle>
                                    <CardDescription>
                                        Enter the full phone number where you want to receive calls.
                                        <strong>Must include country code</strong> (e.g., +91 for India).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-medium leading-none">
                                                Phone Number (Full International Format)
                                            </label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+91 98957 75745"
                                                value={phoneNumber}
                                                onChange={(e) => {
                                                    setPhoneNumber(e.target.value);
                                                    if (success || error) clearStatus();
                                                }}
                                                className="max-w-md"
                                            />
                                        </div>

                                        {success && (
                                            <div className="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-md animate-in fade-in">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Phone number updated successfully! We'll use this for your reminders.
                                            </div>
                                        )}

                                        {error && (
                                            <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md animate-in fade-in">
                                                <AlertCircle className="h-4 w-4 mr-2" />
                                                {error}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-4">
                                            <Button
                                                type="submit"
                                                isLoading={loading}
                                                disabled={!phoneNumber || (phoneNumber === user?.phoneNumber)}
                                            >
                                                Save Configuration
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                                        Monitoring Status
                                    </CardTitle>
                                    <CardDescription>
                                        Your Google Calendar is being monitored for upcoming events.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="bg-slate-50 p-4 border-b flex justify-between items-center text-sm font-medium text-slate-500">
                                            <span>Recent Activity</span>
                                                        <Button variant="ghost" size="sm" onClick={fetchLogs} className="h-7 text-xs">
                                                Refresh
                                            </Button>
                                        </div>
                                                    <div ref={logsRef} className="divide-y max-h-80 overflow-auto">
                                            {logs.length > 0 ? (
                                                logs.map((log) => (
                                                    <div key={log._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={cn(
                                                                "p-2 rounded-full",
                                                                log.callStatus === 'completed' ? "bg-green-100 text-green-600" :
                                                                    log.callStatus === 'failed' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                                                            )}>
                                                                {log.callStatus === 'completed' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">Call Attempt</p>
                                                                <p className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={cn(
                                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                                                log.callStatus === 'completed' ? "bg-green-100 text-green-800" :
                                                                    log.callStatus === 'failed' ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                                                            )}>
                                                                {log.callStatus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-slate-500 italic">
                                                    <Clock className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                                                    No recent events triggered. We'll call you when your next meeting starts.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-8">
                            <Card className="bg-primary text-primary-foreground shadow-lg border-none transform transition-transform hover:scale-[1.02]">
                                <CardHeader>
                                    <CardTitle className="text-xl">User Profile</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-xs opacity-70 uppercase font-bold tracking-wider">Email</p>
                                        <p className="font-medium truncate">{user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs opacity-70 uppercase font-bold tracking-wider">Account ID</p>
                                        <p className="font-mono text-xs truncate">{user?.id}</p>
                                    </div>
                                    <div className="pt-4 border-t border-white/20">
                                        <p className="text-xs opacity-70 italic">
                                            Connected via Google OAuth 2.0
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex items-center gap-2">
                                {user?.googleId ? (
                                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                                        Service Active
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                                            Not Connected
                                        </div>
                                        <Button variant="secondary" size="sm" onClick={loginWithGoogle}>
                                            Connect Google
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border bg-amber-50 border-amber-200 p-4 text-amber-800 text-sm">
                                <div className="flex font-bold mb-1 items-center">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    Important Note
                                </div>
                                Ensure your phone number is correct. If you don't answer, we'll try to leave a voicemail with the event details.
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="Sign Out"
                confirmText="Sign Out"
                onConfirm={() => {
                    handleLogout();
                    setIsLogoutModalOpen(false);
                }}
                variant="destructive"
            >
                <p className="text-slate-600">
                    Are you sure you want to sign out? You will need to log in again to manage your calendar reminders.
                </p>
            </Modal>
        </ProtectedRoute>
    );
}
