// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { DestinationWheel } from '../widgets/DestinationWheel';
// import { OnboardingPage } from './OnboardingPage';

// type HomePageProps = {
//   onboarded: boolean;
//   hasDestination: boolean;
//   // Optional: you can add more props for different redirect scenarios
//   redirectTo?: string;
//   shouldRedirect?: boolean;
// };

// export const HomePage = ({
//   onboarded,
//   hasDestination,
//   redirectTo,
//   shouldRedirect,
// }: HomePageProps) => {
//   const navigate = useNavigate();

//   // Handle redirects based on your logic
//   useEffect(() => {
//     if (shouldRedirect && redirectTo) {
//       navigate(redirectTo, { replace: true });
//     }
//     // Add any other redirect logic here based on your needs
//     // For example:
//     // if (hasDestination && someOtherCondition) {
//     //   navigate('/dashboard', { replace: true });
//     // }
//   }, [shouldRedirect, redirectTo, navigate]);

//   if (!onboarded) {
//     return <OnboardingPage />;
//   }
//   if (!hasDestination) {
//     return <DestinationWheel />;
//   }

//   // Default case - you might want to redirect or show something else
//   return null;
// };
