# Database Design with Mongoose

## Collections and Schema Design

### 1. User Collection
- `_id`: ObjectId (auto-generated)
- `name`: String
- `email`: String (unique, required)
- `password`: String (hashed)
- `role`: String (enum: ['student', 'teacher'])
- `profileImage`: Object:
  - `public_id`: String
  - `url`: String
- `referralCode`: String (unique)
- `referredBy`: ObjectId (ref: 'User')
- `xpPoints`: Number (default: 0)
- `streak`: Number (default: 0)
- `lastActive`: Date
- `createdAt`: Date

### 2. Test Collection
- `_id`: ObjectId
- `title`: String
- `subject`: String
- `chapter`: String
- `description`: String
- `creator`: ObjectId (ref: 'User')
- `timeLimit`: Number (minutes)
- `isPublic`: Boolean
- `inviteCode`: String (for private tests)
- `attemptsCount`: Number (default: 0)
- `rating`: Number (average rating)
- `createdAt`: Date

### 3. Question Collection
- `_id`: ObjectId
- `testId`: ObjectId (ref: 'Test')
- `text`: String
- `image`: Object (if included):
  - `public_id`: String
  - `url`: String
- `options`: Array of Objects:
  - `text`: String
  - `image`: Object (if included):
    - `public_id`: String
    - `url`: String
  - `isCorrect`: Boolean
- `explanation`: String
- `difficulty`: String (enum: ['easy', 'medium', 'hard'])
- `marks`: Number (default: 1)
- `createdAt`: Date

### 4. Attempt Collection
- `_id`: ObjectId
- `userId`: ObjectId (ref: 'User')
- `testId`: ObjectId (ref: 'Test')
- `score`: Number
- `maxScore`: Number
- `answers`: Array of Objects:
  - `questionId`: ObjectId (ref: 'Question')
  - `selectedOption`: Number (index of selected option)
  - `isCorrect`: Boolean
- `timeSpent`: Number (in seconds)
- `completedAt`: Date

### 5. Referral Collection
- `_id`: ObjectId
- `referrerId`: ObjectId (ref: 'User')
- `referredId`: ObjectId (ref: 'User')
- `status`: String (enum: ['pending', 'completed'])
- `rewardGiven`: Boolean
- `rewardAmount`: Number
- `createdAt`: Date

### 6. Badge Collection
- `_id`: ObjectId
- `name`: String
- `description`: String
- `image`: Object:
  - `public_id`: String
  - `url`: String
- `criteria`: Object (conditions to earn badge)
- `createdAt`: Date

### 7. UserBadge Collection
- `_id`: ObjectId
- `userId`: ObjectId (ref: 'User')
- `badgeId`: ObjectId (ref: 'Badge')
- `earnedAt`: Date

### 8. Leaderboard Collection (optional, can be generated dynamically)
- `_id`: ObjectId
- `type`: String (enum: ['global', 'subject', 'test'])
- `subject`: String (if type is 'subject')
- `testId`: ObjectId (if type is 'test')
- `data`: Array of Objects:
  - `userId`: ObjectId (ref: 'User')
  - `score`: Number
  - `position`: Number
- `updatedAt`: Date

## Key Relationships:
- Users create Tests
- Tests contain Questions
- Users make Attempts on Tests
- Users refer other Users through the Referral system
- Users earn Badges stored in UserBadge

## Indexes for Performance:
- User email and referralCode (unique)
- Test inviteCode
- Test creator + isPublic (for finding teacher's tests)
- Attempt userId + testId (for quickly finding user's attempts)

## Handling Images:
- Store Cloudinary image data in the database:
  - `public_id`: Cloudinary's public ID for the image (for management operations)
  - `url`: Full URL to access the image
- Use Cloudinary transformations for resizing/optimizing images on-the-fly
- Set up folders in Cloudinary for different image types (profile, questions, badges)
- Consider adding image dimensions and format metadata if needed for UI

## Referral Program Implementation:
- Each user gets a unique referralCode at signup
- When a new user signs up with a referral code, create a Referral document
- After the referred user completes certain milestones (like first test), mark the referral as completed
- Award XP points to both users based on your reward strategy
- Track referral metrics for potential leaderboards of top referrers 