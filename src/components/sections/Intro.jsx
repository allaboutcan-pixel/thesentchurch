import React from 'react';

const Intro = () => {
    return (
        <section id="intro" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Vision Section */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Our Vision</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                        성서적 기독교로<br />문화적 기독교를 뚫고
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        우리는 화려함보다는 따뜻함을, 형식보다는 진심을 소중히 여깁니다.<br />
                        말씀이 삶이 되며, 가정이 회복되고, 다음 세대가 세워지는 꿈을 꿉니다.
                    </p>
                </div>

                {/* Pastor Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="md:order-last">
                        {/* Placeholder for Pastor's Image */}
                        <div className="w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Pastor Lee Nam-gyu"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">담임목사 이남규</h3>
                        <p className="text-gray-500 mb-6">Pastor Namgyu Lee</p>
                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p>
                                안녕하세요. 보내심을 받은 생명의소리교회에 오신 여러분을 환영합니다.
                            </p>
                            <p>
                                보내심을 받은 생명의소리 교회는 <strong className="text-blue-600">예수교대한성결교회 미주총회</strong> 소속으로,
                                이민 사회 속에서 성도님들의 삶의 자리가 곧 선교지임을 고백하며
                                함께 웃고 함께 우는 따뜻한 신앙 공동체입니다.
                            </p>
                            <p>
                                주님의 사랑 안에서 여러분의 가정이 평안하고,
                                삶의 모든 순간이 예배가 되기를 소망합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};

export default Intro;
