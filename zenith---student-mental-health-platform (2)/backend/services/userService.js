// This is a mock service to simulate fetching users from a database.
// In a real application, this would query your MongoDB database.

const mockUsers = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.edu' },
    { id: '2', name: 'Bob Williams', email: 'bob@example.edu' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.edu' },
];

/**
 * Fetches all users who should receive a reminder.
 * In a real app, this would filter out users who have already completed their survey today
 * or have opted out of notifications.
 * @returns {Promise<Array<{id: string, name: string, email: string}>>}
 */
export const getUsersForDailyReminder = async () => {
    console.log('Fetching users for daily reminder...');
    // Simulate async database call
    await new Promise(resolve => setTimeout(resolve, 200)); 
    console.log(`Found ${mockUsers.length} users to remind.`);
    return mockUsers;
};
