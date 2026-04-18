import LandingPage from '@/components/landing/LandingPage';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const code = params?.code || null;

  if (code) {
    return <OnboardingFlow referralCode={code} />;
  }

  return <LandingPage />;
}
