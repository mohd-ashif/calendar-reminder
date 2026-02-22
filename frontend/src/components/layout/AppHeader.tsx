'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Calendar, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/common/Modal';

export const AppHeader = () => {
    const { user, isAuthenticated, handleLogout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Calendar className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl hidden sm:inline-block">EventReminder</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground mr-4">
                                    <UserIcon className="h-4 w-4" />
                                    <span className="hidden sm:inline">{user?.email}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setIsLogoutModalOpen(true)}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link href="/">
                                <Button size="sm">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

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
        </>
    );
};
