# Next.js MCQ Project

## Project Overview
This is a Next.js-based web application that appears to be a Multiple Choice Question (MCQ) platform with authentication, user management, and dashboard functionality. The project uses modern web technologies and follows a well-structured architecture.

## Technology Stack
- Framework: Next.js 15.3.1 (App Router)
- Authentication: Clerk (@clerk/nextjs ^4.29.9)
- Database: MongoDB with Mongoose (^8.13.2)
- Styling: Tailwind CSS (^4)
- HTTP Client: Axios (^1.9.0)
- Icons: React Icons (^5.5.0)
- React: ^18.2.0
- Development: Using Turbopack for faster development experience

## Features

### User System
- Authentication with Clerk
- User profiles with XP and coins
- Progress tracking
- Referral system

### MCQ System
- Create and manage tests
- Add multiple choice questions
- Track progress and scores
- Different difficulty levels

### Reward System
Users can earn XP points and coins by participating in various activities:

1. Creating Content:
   - Creating a question: +10 XP and +15 coins
   
The XP points contribute to the user's level progression, while coins can be used for various features within the platform.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB instance running
- Clerk account for authentication

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   MONGODB_URI=your_mongodb_uri
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
