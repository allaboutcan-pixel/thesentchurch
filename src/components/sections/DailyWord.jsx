import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';

const DailyWord = () => {
    const [word, setWord] = useState({ text: '', reference: '' });

    useEffect(() => {
        const fetchData = async () => {
            const data = await dataService.getDailyWord();
            setWord(data);
        };
        fetchData();
    }, []);

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center transform -translate-y-10 md:-translate-y-24 z-20 relative">
                    <div className="bg-white p-10 md:p-14 rounded-2xl shadow-xl border-t-4 border-secondary">
                        <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">Today's Scripture</h3>
                        <blockquote className="font-serif text-2xl md:text-3xl font-medium text-gray-800 leading-relaxed mb-6">
                            "{word.text}"
                        </blockquote>
                        <cite className="text-gray-500 font-medium not-italic block mt-4">- {word.reference}</cite>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DailyWord;
