## Added APIs for Practice and Results Pages

### 1. `/api/tests/public/[testId]` (GET)
- Returns public test details, questions (without correct answers), leaderboard, and previous attempts for the current user.
- Used by `/practice/[testId]` page to load all test data, leaderboard, and user history.

### 2. `/api/attempts` (POST)
- Submits a user's answers for a test attempt.
- Calculates score, rewards, and leaderboard position.
- Returns the new attemptId and summary.
- Used by `/practice/[testId]` page on test submission to record attempt and redirect to results.

### 3. `/api/attempts/[attemptId]` (GET)
- Returns attempt summary, per-question review, rewards, and leaderboard position for a specific attempt.
- Used by `/results/[attemptId]` page to display the user's results and review answers.

### UI Integration
- `/practice/[testId]` now fetches real test data and submits attempts using the above APIs.
- `/results/[attemptId]` loads real attempt and test data using the above APIs. 