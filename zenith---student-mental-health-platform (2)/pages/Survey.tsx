import React, { useState } from 'react';
import { SURVEY_QUESTIONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { submitSurvey } from '../services/mockDb';
import type { SurveyResponse, NewSurveyData } from '../types';

const Survey: React.FC = () => {
  const [answers, setAnswers] = useState<number[]>(Array(SURVEY_QUESTIONS.length).fill(0));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const handleAnswerChange = (questionIndex: number, answer: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !('id' in user)) {
        addNotification('You must be logged in to submit a survey.', 'error');
        return;
    }
    
    setIsLoading(true);

    let totalScore = 0;
    const surveyResponses: SurveyResponse[] = SURVEY_QUESTIONS.map((question, index) => {
      const answer = answers[index];
      let questionScore = 0;
      if (question.reverseScored) {
        questionScore = { 1: 100, 2: 75, 3: 50, 4: 25, 5: 0 }[answer] || 0;
      } else {
        questionScore = { 1: 0, 2: 25, 3: 50, 4: 75, 5: 100 }[answer] || 0;
      }
      totalScore += questionScore;
      return { question: question.text, answer };
    });

    const finalScore = Math.round(totalScore / SURVEY_QUESTIONS.length);
    let finalCategory: 'Low' | 'Moderate' | 'High' | 'Severe';

    if (finalScore <= 25) finalCategory = 'Low';
    else if (finalScore <= 50) finalCategory = 'Moderate';
    else if (finalScore <= 75) finalCategory = 'High';
    else finalCategory = 'Severe';

    const surveyData: NewSurveyData = {
        responses: surveyResponses,
        stressScore: finalScore,
        category: finalCategory,
    };

    try {
        await submitSurvey(surveyData, user.id);
        
        setScore(finalScore);
        setCategory(finalCategory);
        addNotification('Survey submitted successfully!', 'success');
        setShowResult(true);

    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        addNotification(message, 'error');
    } finally {
        setIsLoading(false);
    }
  };
  
  const allAnswered = answers.every(answer => answer > 0);

  if (showResult) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="bg-card dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md mx-auto transition-colors duration-300">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Survey Complete!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Your Stress Score is:</p>
                <p className="text-7xl font-extrabold text-primary mb-2">{score}</p>
                <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">{category} Stress</p>
                <button 
                    onClick={() => {
                        setShowResult(false);
                        setAnswers(Array(SURVEY_QUESTIONS.length).fill(0));
                        setCurrentQuestionIndex(0);
                    }}
                    className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Take Again
                </button>
            </div>
        </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / SURVEY_QUESTIONS.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <header className="mb-8 text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Daily Check-in</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Take a moment to reflect on your well-being.</p>
      </header>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s' }}></div>
      </div>

      <div className="bg-card dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors duration-300">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
            ({currentQuestionIndex + 1}/{SURVEY_QUESTIONS.length}) {SURVEY_QUESTIONS[currentQuestionIndex].text}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4 px-2">
            <span>Strongly Disagree</span>
            <span>Strongly Agree</span>
        </div>
        <div className="flex justify-between items-center space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="flex flex-col items-center cursor-pointer">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={value}
                checked={answers[currentQuestionIndex] === value}
                onChange={() => handleAnswerChange(currentQuestionIndex, value)}
                className="sr-only"
              />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                answers[currentQuestionIndex] === value 
                ? 'bg-primary text-white border-primary' 
                : 'bg-gray-100 border-gray-300 hover:border-primary dark:bg-gray-700 dark:border-gray-600 dark:hover:border-primary'
              }`}>
                {value}
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button 
            onClick={handleBack} 
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
        >
            Back
        </button>
        {currentQuestionIndex < SURVEY_QUESTIONS.length - 1 ? (
            <button 
                onClick={handleNext}
                disabled={answers[currentQuestionIndex] === 0}
                className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
        ) : (
             <button 
                onClick={handleSubmit}
                disabled={!allAnswered || isLoading}
                className="px-6 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Submitting...' : 'Submit'}
            </button>
        )}
      </div>
    </div>
  );
};

export default Survey;