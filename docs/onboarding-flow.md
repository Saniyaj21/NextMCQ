# User Onboarding Flow

## Overview
This document outlines the implementation approach for the user onboarding flow in our MCQ learning platform. The system directs users to the appropriate pages based on their registration status after authentication with Clerk.

## Authentication & Redirection Flow

1. **Initial Authentication with Clerk**:
   - Users authenticate through Clerk (sign in or sign up)
   - Clerk handles the authentication process and creates a session

2. **Post-Authentication Check**:
   - After successful authentication, check if the user exists in our database
   - Query the MongoDB User collection using the Clerk user's email

3. **Conditional Redirection**:
   - If user exists in our database → redirect to homepage (/)
   - If user doesn't exist → redirect to onboarding page (/onboard)

4. **Protected Routes**:
   - The `/onboard` route is protected (not public), accessible only after authentication
   - All application routes except public landing pages are protected by Clerk auth

## Technical Implementation

1. **Middleware/Layout Component**:
   - Create a middleware function or layout component that runs after Clerk authentication
   - This component checks the database for user existence
   - Implement redirection logic based on the result

2. **Code Implementation Strategy**:
   ```jsx
   // Conceptual implementation in a root layout or middleware
   async function checkUserAndRedirect(clerkUser, currentPath) {
     // Check if user exists in our database
     const dbUser = await getUserByEmail(clerkUser.emailAddress);
     
     // If no user found and not already on onboarding page
     if (!dbUser && currentPath !== '/onboard') {
       return redirect('/onboard');
     }
     
     // If user found but on onboarding page
     if (dbUser && currentPath === '/onboard') {
       return redirect('/');
     }
     
     // Otherwise, continue normal flow
     return null;
   }
   ```

## Onboarding Page Implementation

1. **Data Collection**:
   - Form to collect additional user information:
     - Full name
     - Role selection (student/teacher)
     - Profile picture upload (optional)
     - Referral code (if applicable - auto-filled if from referral link)

2. **User Creation Process**:
   - On form submission, create a new user in MongoDB
   - Link the MongoDB user to the Clerk user via email and/or Clerk user ID
   - If referred, create the referral relationship in the database

3. **Post-Registration Actions**:
   - After successful registration, redirect user to homepage
   - Show a welcome message or onboarding tutorial
   - For referred users, acknowledge the referral was successful

## Edge Cases & Considerations

1. **Session Management**:
   - Handle cases where users sign out and sign back in
   - Ensure proper session persistence across page navigation

2. **Error Handling**:
   - Handle database connectivity issues gracefully
   - Provide clear error messages if onboarding fails

3. **Profile Updates**:
   - Allow users to update their profile information later
   - Keep Clerk and our database information in sync

4. **Verification Process**:
   - Consider email verification steps if required
   - Integrate with Clerk's verification flow if needed

5. **Data Caching**:
   - Cache user existence check to minimize database queries
   - Clear cache appropriately on sign-out or session changes

This approach ensures a seamless user experience from authentication to full registration in our system, with proper handling of the referral program integration. 