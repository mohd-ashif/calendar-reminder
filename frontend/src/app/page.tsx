'use client';

import { Button } from '@/components/common/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card';
import { PageContainer } from '@/components/layout/PageContainer';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, CheckCircle2, PhoneCall } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { loginWithGoogle, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  return (
    <PageContainer className="flex flex-col items-center justify-center">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Calendar className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4">
          Never Miss a <span className="text-primary">Google Event</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Get automated voice call reminders for your important calendar meetings and events.
          Simple, reliable, and keeps you on schedule.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
        <Card className="border-none shadow-md bg-white">
          <CardHeader>
            <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
              <Calendar className="text-blue-600" />
            </div>
            <CardTitle>Google Integration</CardTitle>
            <CardDescription>
              Connect your Google Calendar and let us monitor your upcoming events automatically.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-md bg-white">
          <CardHeader>
            <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
              <PhoneCall className="text-green-600" />
            </div>
            <CardTitle>Voice Alerts</CardTitle>
            <CardDescription>
              Receive a Twilio voice call reminder before your event starts so you're always ready.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="max-w-md w-full shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Get Started</CardTitle>
          <CardDescription>
            {isAuthenticated
              ? "You're already logged in. Go to your dashboard to manage settings."
              : "Sign in with your Google account to sync your calendar."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          {isAuthenticated ? (
            <Button size="lg" className="w-full" onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full"
              onClick={loginWithGoogle}
              isLoading={loading}
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Login with Google
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="mt-12 flex items-center space-x-8 text-slate-400">
        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
          <span>Secure OAuth</span>
        </div>
        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
          <span>Twilio Powered</span>
        </div>
        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
          <span>Next.js 15 Ready</span>
        </div>
      </div>
    </PageContainer>
  );
}
