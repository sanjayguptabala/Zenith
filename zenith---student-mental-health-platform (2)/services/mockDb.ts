import type { User, Admin, RegistrationData, SurveySubmission, DashboardStats, NewSurveyData } from '../types';

export interface Credentials {
    email: string;
    password?: string;
}

// =================================================================
// SIMULATED DATABASE
// =================================================================

const defaultUsers: User[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.edu', studentId: '112233', joinDate: '2023-09-01', totalSurveys: 32, passwordHash: 'password123' },
    { id: '2', name: 'Bob Williams', email: 'bob@example.edu', studentId: '445566', joinDate: '2023-09-05', totalSurveys: 12, passwordHash: 'password123' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.edu', studentId: '778899', joinDate: '2023-10-11', totalSurveys: 8, passwordHash: 'password123' },
];

const defaultAdmins: Admin[] = [
    { id: 'admin1', email: 'admin@zenith.com', role: 'admin', passwordHash: 'adminpass' }
];

const initializeDb = () => {
    try {
        const storedUsers = localStorage.getItem('zenith_users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        } else {
            localStorage.setItem('zenith_users', JSON.stringify(defaultUsers));
            return defaultUsers;
        }
    } catch (error) {
        console.error("Could not initialize user DB from localStorage", error);
        return defaultUsers;
    }
};

let users: User[] = initializeDb();
const admins: Admin[] = defaultAdmins;
let surveySubmissions: SurveySubmission[] = [];

const generateMockSurveys = () => {
    // Only generate if empty to avoid duplication on hot reloads
    if (surveySubmissions.length > 0) return;

    const userId = '1'; // For Alice Johnson
    const today = new Date();
    for (let i = 0; i < 45; i++) { // Generate data for the past 45 days
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Skip some days to make it more realistic
        if (Math.random() > 0.3) {
            const stressScore = Math.floor(Math.random() * 70) + 15; // Score between 15 and 85
            let category: 'Low' | 'Moderate' | 'High' | 'Severe';
            if (stressScore <= 25) category = 'Low';
            else if (stressScore <= 50) category = 'Moderate';
            else if (stressScore <= 75) category = 'High';
            else category = 'Severe';

            surveySubmissions.push({
                userId,
                date: date.toISOString(),
                responses: [], // Mock responses are not needed for this feature
                stressScore,
                category,
            });
        }
    }
    // Sort by date descending (most recent first)
    surveySubmissions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

generateMockSurveys();


const saveUsersToDb = () => {
    try {
        localStorage.setItem('zenith_users', JSON.stringify(users));
    } catch (error) {
        console.error("Could not save users to localStorage", error);
    }
};


// =================================================================
// AUTHENTICATION FUNCTIONS
// =================================================================

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const loginUser = async (credentials: Credentials): Promise<{ success: boolean; message: string; data: User | null }> => {
    await delay(500);
    const user = users.find(u => u.email === credentials.email && u.passwordHash === credentials.password);
    if (user) {
        return { success: true, message: 'Login successful.', data: user };
    }
    return { success: false, message: 'Invalid email or password.', data: null };
};

export const loginAdmin = async (credentials: Credentials): Promise<{ success: boolean; message: string; data: Admin | null }> => {
    await delay(500);
    const admin = admins.find(a => a.email === credentials.email && a.passwordHash === credentials.password);
    if (admin) {
        return { success: true, message: 'Admin login successful.', data: admin };
    }
    return { success: false, message: 'Invalid admin credentials.', data: null };
};

export const registerUser = async (data: RegistrationData): Promise<{ success: boolean, message: string }> => {
    await delay(700);
    if (users.some(u => u.email === data.email)) {
        return { success: false, message: 'An account with this email already exists.' };
    }
    if (users.some(u => u.studentId === data.studentId)) {
        return { success: false, message: 'An account with this student ID already exists.' };
    }

    const newUser: User = {
        id: (users.length + 1).toString(),
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        passwordHash: data.password, 
        joinDate: new Date().toISOString().split('T')[0],
        totalSurveys: 0,
    };

    users.push(newUser);
    saveUsersToDb();

    return { success: true, message: 'Registration successful!' };
};

export const findOrCreateGoogleUser = async (): Promise<User> => {
    await delay(600);
    const googleEmail = 'gloria@example.edu';
    let user = users.find(u => u.email === googleEmail);

    if (!user) {
        const newUser: User = {
            id: (users.length + 1).toString(),
            name: 'Gloria Estefan',
            email: googleEmail,
            studentId: '998877',
            passwordHash: '', 
            joinDate: new Date().toISOString().split('T')[0],
            totalSurveys: 0,
        };
        users.push(newUser);
        saveUsersToDb();
        user = newUser;
    }

    return user;
};

export const findOrCreateGoogleAdmin = async (): Promise<Admin> => {
    await delay(600);
    const googleAdminEmail = 'admin.gloria@example.edu';
    let admin = admins.find(a => a.email === googleAdminEmail);

    if (!admin) {
        const newAdmin: Admin = {
            id: `admin${admins.length + 1}`,
            email: googleAdminEmail,
            role: 'admin',
            passwordHash: '', // No password for Google sign-in
        };
        admins.push(newAdmin);
        // Note: Admin DB is not persisted to localStorage in this mock, so this is session-only.
        admin = newAdmin;
    }

    return admin;
};

export const sendPasswordResetEmail = async (email: string): Promise<{ success: boolean, message: string }> => {
    await delay(500);
    const userExists = users.some(u => u.email === email);
    if (userExists) {
        console.log(`Password reset email "sent" to ${email}.`);
    } else {
        console.log(`Password reset requested for non-existent email: ${email}. No email sent.`);
    }
    return { success: true, message: 'If an account with that email exists, a password reset link has been sent.'};
};

export const resetPasswordWithToken = async (token: string, password: string): Promise<{ success: boolean; message: string }> => {
    await delay(600);
    if (token === 'invalid-token' || !token) {
        return { success: false, message: 'Password reset token is invalid or has expired.' };
    }
    console.log(`Password has been reset with token ${token}`);
    return { success: true, message: 'Password has been successfully reset.' };
};


export const updateUser = async (userId: string, data: Partial<User>): Promise<User> => {
    await delay(400);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error("User not found and could not be updated.");
    }
    users[userIndex] = { ...users[userIndex], ...data };
    saveUsersToDb();
    return users[userIndex];
};

// =================================================================
// EMAIL FUNCTIONS
// =================================================================

export const sendDailyReminderEmail = async (name: string, email: string): Promise<{ success: boolean; message: string }> => {
    await delay(800);
    console.log(`--- MOCK EMAIL ---`);
    console.log(`To: ${email}`);
    console.log(`Subject: Daily Mental Health Check-in Reminder`);
    console.log(`Hi ${name},`);
    console.log(`This is your test daily check-in reminder.`);
    console.log(`--- END MOCK EMAIL ---`);
    return { success: true, message: 'Test reminder email sent successfully!' };
};


// =================================================================
// DATA RETRIEVAL FUNCTIONS
// =================================================================

export const getPlatformStats = async () => {
    await delay(300);
    return {
        totalUsers: users.length,
        surveysCompleted: 158,
        averageScore: 58,
        activeToday: 42,
    };
};

export const getAllUsers = async (): Promise<User[]> => {
    await delay(300);
    return [...users];
};

export const getSurveyHistory = async (userId: string): Promise<SurveySubmission[]> => {
    await delay(600);
    return surveySubmissions.filter(s => s.userId === userId);
};

export const submitSurvey = async (submissionData: NewSurveyData, userId: string): Promise<SurveySubmission> => {
    await delay(600);
    const today = new Date().toISOString().split('T')[0];

    const hasSubmittedToday = surveySubmissions.some(
        s => s.userId === userId && new Date(s.date).toISOString().split('T')[0] === today
    );

    if (hasSubmittedToday) {
        throw new Error("You have already submitted a survey today.");
    }
    
    const newSubmission: SurveySubmission = {
        ...submissionData,
        userId,
        date: new Date().toISOString(),
    };
    
    surveySubmissions.unshift(newSubmission); // Add to beginning

    // Update user's total survey count
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].totalSurveys++;
        saveUsersToDb();
    }

    return newSubmission;
};

export const getDashboardStats = async (userId: string): Promise<DashboardStats> => {
    await delay(500);
    const userSurveys = surveySubmissions
        .filter(s => s.userId === userId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (userSurveys.length === 0) {
        return { todayStressScore: null, todayCategory: null, totalSurveys: 0, averageScore: 0, trend: 0 };
    }

    const today = new Date();
    const latestSurveyForToday = userSurveys.find(s => new Date(s.date).toDateString() === today.toDateString());

    const totalSurveys = userSurveys.length;
    const averageScore = Math.round(userSurveys.reduce((acc, s) => acc + s.stressScore, 0) / totalSurveys);

    // Trend calculation: Compare the average of the last 7 days of surveys vs the previous 7 days
    const last7DaysSurveys = userSurveys.slice(0, 7);
    const prev7DaysSurveys = userSurveys.slice(7, 14);

    const last7Avg = last7DaysSurveys.length > 0 ? last7DaysSurveys.reduce((acc, s) => acc + s.stressScore, 0) / last7DaysSurveys.length : 0;
    const prev7Avg = prev7DaysSurveys.length > 0 ? prev7DaysSurveys.reduce((acc, s) => acc + s.stressScore, 0) / prev7DaysSurveys.length : 0;
    
    let trend = 0;
    if (prev7Avg > 0 && last7Avg > 0) {
        // We calculate (new - old) / old. A negative trend is an improvement (lower stress).
        trend = Math.round(((last7Avg - prev7Avg) / prev7Avg) * 100);
    }

    return {
        todayStressScore: latestSurveyForToday?.stressScore ?? null,
        todayCategory: latestSurveyForToday?.category ?? 'No survey yet',
        totalSurveys,
        averageScore,
        trend
    };
};