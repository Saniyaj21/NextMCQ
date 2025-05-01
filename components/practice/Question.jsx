import Image from 'next/image';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';

export default function Question({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  verification,
  onAnswerSelect,
  onVerify,
  onNext,
  onSubmit,
  isLastQuestion
}) {
  const hasSelectedAnswer = selectedAnswer !== undefined;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Question Number and Info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Question {currentIndex + 1} of {totalQuestions}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-sm font-medium ${
              question.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
            {!verification && (
              <span className="text-sm text-gray-500">
                • Answer correctly to earn 5 coins and XP
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="text-gray-900 text-lg mb-6">
          {question.text}
          {question.image && (
            <img
              src={question.image.url}
              alt="Question"
              className="mt-4 max-w-full rounded-lg"
            />
          )}
        </div>
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(question.id, index)}
              disabled={verification}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                verification
                  ? index === question.correctOption
                    ? 'border-green-500 bg-green-50'
                    : index === selectedAnswer
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 opacity-50'
                  : selectedAnswer === index
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  verification
                    ? index === question.correctOption
                      ? 'border-green-500 bg-green-500'
                      : index === selectedAnswer
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                    : selectedAnswer === index
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                }`}>
                  {(verification && index === question.correctOption) && (
                    <FiCheckCircle className="w-4 h-4 text-white" />
                  )}
                  {(verification && index === selectedAnswer && !verification.isCorrect) && (
                    <FiXCircle className="w-4 h-4 text-white" />
                  )}
                  {(!verification && selectedAnswer === index) && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-gray-900">{option.text}</span>
                  {option.image && (
                    <img
                      src={option.image.url}
                      alt={`Option ${index + 1}`}
                      className="mt-2 max-w-full rounded-lg"
                    />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation - shown after verification */}
      {verification && (
        <div className={`mt-6 p-4 rounded-lg ${
          verification.isCorrect ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-start gap-3">
            {verification.isCorrect ? (
              <>
                <FiCheckCircle className="w-6 h-6 text-green-500 mt-0.5" />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-green-800">Correct!</h3>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 rounded text-sm">
                      <GiTwoCoins className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-yellow-700">+5</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 rounded text-sm">
                      <Image
                        src="/icons/xpicon.png"
                        alt="XP"
                        width={16}
                        height={16}
                        className="opacity-90"
                      />
                      <span className="font-medium text-blue-700">+5</span>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{question.explanation}</p>
                </div>
              </>
            ) : (
              <>
                <FiXCircle className="w-6 h-6 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800 mb-2">Incorrect</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{question.explanation}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-end items-center gap-4 mt-8 pt-6 border-t border-gray-200">
        {!verification && hasSelectedAnswer && (
          <button
            onClick={() => onVerify(question.id)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check Answer
          </button>
        )}
        {verification && (
          isLastQuestion ? (
            <button
              onClick={onSubmit}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next Question
            </button>
          )
        )}
      </div>
    </div>
  );
} 