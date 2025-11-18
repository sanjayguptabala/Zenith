import React, { useState, useMemo } from 'react';

const ArticleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const VideoIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const WebsiteIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" /></svg>;
const SearchIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


const resources = [
    { id: 1, title: 'Understanding the Stress Response', description: 'An article explaining the fight-or-flight response and how it affects your body.', category: 'Stress Management', type: 'Article', url: '#'},
    { id: 2, title: '10-Minute Guided Meditation for Anxiety', description: 'A calming video to help you find your center when you feel overwhelmed.', category: 'Anxiety Relief', type: 'Video', url: '#'},
    { id: 3, title: 'The Pomodoro Technique for Studying', description: 'Learn how to manage your study time effectively to reduce burnout and improve focus.', category: 'Study Tips', type: 'Article', url: '#'},
    { id: 4, title: 'Deep Breathing Exercises for Calm', description: 'A guided video demonstrating several breathing techniques to calm your nervous system.', category: 'Mindfulness', type: 'Video', url: '#'},
    { id: 5, title: 'Active Minds', description: 'A national organization supporting mental health awareness and education for students.', category: 'External Support', type: 'Website', url: '#'},
    { id: 6, title: 'How to Practice Mindfulness', description: 'A comprehensive guide to incorporating mindfulness into your daily routine.', category: 'Mindfulness', type: 'Article', url: '#'},
    { id: 7, title: 'Coping with Exam Anxiety', description: 'Practical tips and strategies for managing stress before and during exams.', category: 'Anxiety Relief', type: 'Article', url: '#'},
    { id: 8, title: 'The JED Foundation', description: 'An organization providing resources and support for teens and young adults.', category: 'External Support', type: 'Website', url: '#'},
];

const categories = ['All', 'Stress Management', 'Anxiety Relief', 'Mindfulness', 'Study Tips', 'External Support'];

const ResourceCard: React.FC<{ resource: typeof resources[0] }> = ({ resource }) => {
    const iconMap = {
        'Article': <ArticleIcon />,
        'Video': <VideoIcon />,
        'Website': <WebsiteIcon />,
    };

    return (
        <div className="bg-card dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center mb-3">
                <span className="text-primary mr-3">{iconMap[resource.type as keyof typeof iconMap]}</span>
                <span className="text-xs font-semibold uppercase text-primary tracking-wider">{resource.category}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex-grow">{resource.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{resource.description}</p>
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-block text-center bg-primary/10 text-primary font-bold py-2 px-4 rounded-lg hover:bg-primary hover:text-white transition-colors">
                Learn More
            </a>
        </div>
    );
};

const Resources: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredResources = useMemo(() => 
        resources.filter(resource => {
            const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
            const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || resource.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        }), [searchTerm, selectedCategory]);

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Resource Library</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Explore articles, tools, and support to help you on your wellness journey.
                </p>
            </header>

            <div className="mb-8 sticky top-20 bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 z-40">
                <div className="relative max-w-lg mb-4">
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                </div>
                <div className="flex flex-wrap justify-start gap-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                                selectedCategory === category 
                                ? 'bg-primary text-white' 
                                : 'bg-card dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <main>
                {filteredResources.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredResources.map(resource => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">No Resources Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filters.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Resources;