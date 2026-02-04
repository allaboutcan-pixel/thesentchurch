import React, { useState, useEffect } from 'react';
import { FileText, PlayCircle } from 'lucide-react';
import { dataService } from '../../services/dataService';

const Media = () => {
    const [bulletins, setBulletins] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await dataService.getBulletins();
            setBulletins(data.slice(0, 3)); // Show latest 3
        };
        fetchData();
    }, []);

    return (
        <section id="media" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Media & News</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">교회 소식 및 미디어</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Bulletin Board */}
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="text-secondary" /> 주보 (Bulletin)
                            </h3>
                            <button className="text-sm text-secondary font-semibold hover:underline">
                                전체보기 &rarr;
                            </button>
                        </div>

                        {/* List */}
                        <div className="space-y-4">
                            {bulletins.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow">
                                    <div>
                                        <span className="text-xs font-bold text-primary bg-blue-100 px-2 py-1 rounded">{item.date}</span>
                                        <p className="font-medium mt-2 text-gray-800">{item.title}</p>
                                    </div>
                                    <FileText size={20} className="text-gray-400" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sermon Videos */}
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <PlayCircle className="text-red-500" /> 설교 말씀
                            </h3>
                            <a href="https://youtube.com/ChurchoftheSent" target="_blank" rel="noreferrer" className="text-sm text-secondary font-semibold hover:underline">
                                유튜브 채널 바로가기 &rarr;
                            </a>
                        </div>

                        {/* Featured Video (Mock) */}
                        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center group cursor-pointer relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1507692049790-de58293a469d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Sermon Thumbnail"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                            />
                            <PlayCircle size={60} className="text-white absolute z-10 opacity-90 group-hover:scale-110 transition-transform" />
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white font-bold">주가 일하시네 - 이남규 목사</p>
                                <p className="text-gray-300 text-sm">2026.01.26 주일예배</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Media;
