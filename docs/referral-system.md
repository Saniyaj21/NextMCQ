# Referral System Implementation

## Overview
This document outlines the implementation approach for the referral system in our MCQ learning platform. The system allows existing users to invite new users through shareable links, tracks these referrals, and rewards both parties when certain conditions are met.

## Referral Link Generation & Processing

1. **Generate Shareable Referral Links**:
   - Each user gets a unique referral code stored in their user profile
   - Users can access their referral link from their dashboard/profile page
   - Format: `mcq-app.com/invite/[user-referral-code]`
   - Example: `mcq-app.com/invite/ABC123XYZ`

2. **Invite Page Implementation**:
   - Create a special `/invite/[referralCode]` route
   - This page captures the referral code from the URL
   - Store the referral code in browser storage (localStorage/cookies)
   - Automatically redirect to the sign-in page with a welcome message

3. **Sign-in Flow**:
   - After successful Clerk authentication, check if there's a stored referral code
   - If found, keep this code for the onboarding process
   - Maintain this code through the authentication process

4. **Onboarding with Referral**:
   - During onboarding, automatically apply the stored referral code
   - Show a message like "You were invited by [referrer name]" if possible
   - Complete user registration with this referral relationship
   - Create entries in both User and Referral collections

## Database Operations

1. **On New User Registration with Referral**:
   - Create a new User document for the invited user
   - Set the `referredBy` field to the referrer's user ID
   - Create a new Referral document with:
     - `referrerId`: ID of the user who shared the link
     - `referredId`: ID of the newly registered user
     - `status`: "pending"
     - `rewardGiven`: false

2. **Milestone Achievement & Rewards**:
   - When the referred user completes a milestone (e.g., first test):
     - Update the Referral document status to "completed"
     - Award XP points to both users
     - Set `rewardGiven` to true
   - Implement this check after relevant user actions

## User Interface Elements

1. **Referral Dashboard for Users**:
   - Section showing personal referral link with copy button
   - Statistics about successful referrals and rewards earned
   - List of people they've referred and their status

2. **Referral Landing Page**:
   - Attractive page that promotes the platform benefits
   - Clear call-to-action for new users
   - Visual indication that they were invited by a friend

## Sample User Flow

1. User A gets their unique link from dashboard: `mcq-app.com/invite/ABC123XYZ`
2. User A shares this link with User B
3. User B clicks the link, landing on a welcome page that stores the code
4. User B is redirected to sign-in and authenticates with Clerk
5. After authentication, User B is directed to onboarding
6. The onboarding form already includes the referral connection
7. Once User B completes registration, the referral is recorded in the database
8. After User B completes their first test, both users receive XP rewards

## Technical Considerations

- Use secure storage methods for referral codes
- Implement validation to prevent self-referrals
- Add rate limiting to prevent abuse of the referral system
- Create a background job or trigger to process rewards
- Ensure referral data persists through authentication flows 