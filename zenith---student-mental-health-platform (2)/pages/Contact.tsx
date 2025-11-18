import React, { useState } from 'react';

// Icons for the page
const PhoneIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6 text-danger shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const ChatBubbleIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6 text-danger shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const BuildingOfficeIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6 text-primary shrink-0" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 12.75z" /></svg>;

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(res => setTimeout(res, 1000));
        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Contact & Support</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    We're here to help. Find emergency resources or send us a message.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {/* Emergency & Campus Resources */}
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-danger p-6 rounded-r-lg shadow-lg">
                        <h2 className="text-xl font-bold text-danger mb-4">Immediate Help</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">If you are in a crisis or any other person may be in danger, please use these resources.</p>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3">
                                <PhoneIcon /><span className="font-semibold text-gray-800 dark:text-gray-200">988 Suicide & Crisis Lifeline</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <ChatBubbleIcon /><span className="font-semibold text-gray-800 dark:text-gray-200">Crisis Text Line: Text HOME to 741741</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Campus Resources</h2>
                        <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                             <li className="flex items-center space-x-3">
                                <BuildingOfficeIcon /><span className="text-sm"><strong>Counseling Services:</strong><br/>(555) 123-4567</span>
                            </li>
                             <li className="flex items-center space-x-3">
                                <BuildingOfficeIcon /><span className="text-sm"><strong>Health Center:</strong><br/>(555) 765-4321</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-2 bg-card dark:bg-gray-800 p-8 rounded-lg shadow-lg">
                    {isSubmitted ? (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-secondary mb-2">Thank You!</h2>
                            <p className="text-gray-600 dark:text-gray-300">Your message has been sent. We'll get back to you soon.</p>
                            <button onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' })}} className="mt-6 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Send us a Message</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">For general inquiries or technical support.</p>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                        <input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                        <input type="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                                    <input type="text" id="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                                    <textarea id="message" rows={5} value={formData.message} onChange={handleChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"></textarea>
                                </div>
                                <button type="submit" disabled={isLoading} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                                    {isLoading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;