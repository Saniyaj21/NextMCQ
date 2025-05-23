---

## [2024-06-09] Enhancement: Test Practice API returns totalQuestions (updated)

- The API route `/api/tests/practice/[testId]` now includes a `totalQuestions` property inside the `test` object in its JSON response.
- `totalQuestions` is the count of questions associated with the given test (using `Question.countDocuments({ testId })`).
- Example response:
  ```json
  {
    "success": true,
    "test": {
      "_id": "...",
      "title": "...",
      // ...other test fields...
      "totalQuestions": 12
    }
  }
  ```

## [2024-06-09] Feature Update: Test Attempt Count
- The `attemptsCount` field in the Test model is now incremented by 1 each time a test is attempted.
- This is handled in the `/api/attempts/route.js` POST handler, immediately after a new Attempt is created.

## [2024-06-09] New API: Get Attempt Result
- Added GET `/api/attempts/[attemptId]` endpoint.
- Returns all data needed for the result page UI:
  - Test info: title, totalQuestions
  - Attempt details: score, maxScore, percentage, timeSpent, rewards (xp, coins), completedAt, leaderboardPosition (placeholder)
  - Question review: for each question, includes text, userAnswer, correctAnswer, options, and explanation
- Only the authenticated user who owns the attempt can access it.

## Recent Changes

### 2024-06-09
- The GET endpoint at `/api/tests/public` now only returns public tests that have at least 5 questions. This is enforced by filtering the tests after aggregating question counts in the API route implementation. 
- Updated the question component so that images for questions and options are only rendered if a valid image URL exists (prevents rendering empty or missing images). 