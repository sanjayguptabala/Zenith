export interface SurveyResponse {
  question: string;
  answer: number; // 1-5
}

export interface NewSurveyData {
  responses: SurveyResponse[];
  stressScore: number;
  category: 'Low' | 'Moderate' | 'High' | 'Severe';
}

export interface SurveySubmission extends NewSurveyData {
  userId: string;
  date: string;
}

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export interface User {
    id: string;
    name: string;
    email: string;
    studentId: string;
    joinDate: string;
    totalSurveys: number;
    passwordHash: string;
}

export interface Admin {
    id: string;
    email: string;
    role: 'admin';
    passwordHash: string;
}

export interface RegistrationData {
    name: string;
    email: string;
    studentId: string;
    password: string;
}

export interface DashboardStats {
    todayStressScore: number | null;
    todayCategory: string | null;
    totalSurveys: number;
    averageScore: number;
    trend: number; // Percentage change
}

export interface ToastNotification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}