import React from 'react';

const Hero = () => {
    return (
        <section id="hero" className="relative h-screen flex items-center justify-center text-center text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80"
                    alt="Church Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 animate-fade-in-up">
                <p className="text-lg md:text-xl font-medium tracking-widest mb-4 opacity-90">
                    FORT LANGLEY
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-primary leading-tight">
                    보내심을 받은<br className="md:hidden" /> 생명의소리교회
                </h1>
                <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto opacity-90">
                    Church of the Sent
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <a href="#worship" className="px-8 py-3 bg-secondary hover:bg-blue-600 text-white rounded-full transition-all font-semibold">
                        예배 안내
                    </a>
                    <a href="#location" className="px-8 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white rounded-full transition-all font-semibold">
                        오시는 길
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
