'use client';

import { ThemeProvider } from '@/components/kitone/theme-provider';
import { InstitutionProvider, useInstitution } from '@/components/kitone/institution-store';
import { KitoneShell } from '@/components/kitone/shell';
import { OnboardingWizard } from '@/components/kitone/onboarding/onboarding-wizard';
import { GraduationCap } from 'lucide-react';

function AppRouter() {
  const { data, loading } = useInstitution();

  // Show a loading splash while fetching from MySQL
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg animate-pulse">
            <GraduationCap className="h-7 w-7" />
          </div>
          <p className="text-sm text-muted-foreground">Loading Kitone Edu…</p>
        </div>
      </div>
    );
  }

  // Not set up → onboarding
  if (!data.setupComplete || !data.info) {
    return <OnboardingWizard />;
  }

  // Ready → dashboard
  return <KitoneShell />;
}

export default function Home() {
  return (
    <ThemeProvider>
      <InstitutionProvider>
        <AppRouter />
      </InstitutionProvider>
    </ThemeProvider>
  );
}