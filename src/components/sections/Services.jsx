import React from 'react';
import { Clock, Users, Heart } from 'lucide-react';

const Services = () => {
    const [expandedSection, setExpandedSection] = React.useState(null);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const details = {
        tsc: (
            <div className="mt-4 pt-4 border-t border-yellow-200 text-sm text-gray-700 space-y-2 animate-fade-in">
                <p><strong>[교육 목표]</strong><br />하나님을 알고, 하나님을 사랑하며, 하나님을 닮아가는 어린이</p>
                <p><strong>[주요 활동]</strong><br />- <strong>통합 예배:</strong> 부모님과 함께 드리는 예배를 통해 경외감을 배웁니다.<br />- <strong>분반 공부:</strong> 연령별 맞춤 성경 공부로 말씀의 기초를 다집니다.<br />- <strong>절기 행사:</strong> 부활절, 추수감사절, 성탄절 등 기독교 문화를 체험합니다.</p>
                <p>TSC는 우리 아이들이 세상의 빛과 소금으로 자라나도록 기도와 사랑으로 양육합니다.</p>
            </div>
        ),
        tsy: (
            <div className="mt-4 pt-4 border-t border-blue-200 text-sm text-gray-700 space-y-2 animate-fade-in">
                <p><strong>[교육 비전]</strong><br />복음으로 무장하여 세상을 변화시키는 차세대 리더</p>
                <p><strong>[주요 활동]</strong><br />- <strong>열린 예배:</strong> 청소년들의 눈높이에 맞춘 찬양과 말씀 선포<br />- <strong>소그룹 나눔:</strong> 고민을 나누고 서로 중보하며 믿음의 우정을 쌓습니다.<br />- <strong>비전 트립:</strong> 수련회와 탐방을 통해 더 넓은 세상을 경험하고 비전을 찾습니다.</p>
                <p>TSY는 혼자가 아닌 '함께'의 가치를 배우며 믿음의 여정을 걸어가는 공동체입니다.</p>
            </div>
        )
    };

    return (
        <section id="worship" className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Worship & Ministry</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">예배 및 사역 안내</h2>
                </div>

                {/* Worship Times Table */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        {/* Service 1 */}
                        <div className="p-8 text-center hover:bg-blue-50 transition-colors">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-primary mb-4">
                                <Clock size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">주일 1부 예배</h3>
                            <p className="text-2xl font-bold text-secondary mb-1">12:00 PM</p>
                            <p className="text-gray-500 text-sm">본당 2층</p>
                        </div>

                        {/* Service 2 */}
                        <div className="p-8 text-center hover:bg-blue-50 transition-colors">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-primary mb-4">
                                <Clock size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">주일 2부 예배</h3>
                            <p className="text-2xl font-bold text-secondary mb-1">02:00 PM</p>
                            <p className="text-gray-500 text-sm">본당 2층</p>
                        </div>

                        {/* Prayer */}
                        <div className="p-8 text-center hover:bg-blue-50 transition-colors">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-primary mb-4">
                                <Heart size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2">수요 말씀 나눔</h3>
                            <p className="text-2xl font-bold text-secondary mb-1">07:30 PM</p>
                            <p className="text-gray-500 text-sm">온라인 Zoom</p>
                        </div>
                    </div>
                </div>

                {/* Next Gen Ministries */}
                <div id="nextgen" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* TSC */}
                    <div className="bg-yellow-50 rounded-2xl p-8 md:p-10 border border-yellow-100">
                        <h3 className="text-2xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
                            <Users size={28} /> TSC (Children)
                        </h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            아이들이 예배의 구경꾼이 아닌 주인공으로 자라납니다.<br />
                            하나님의 말씀 안에서 바른 인성과 꿈을 키우는 사랑의 터전입니다.
                        </p>
                        <div className="text-sm text-gray-600 font-medium bg-white/60 inline-block px-4 py-2 rounded-lg mb-4">
                            담당: 권희정 사모
                        </div>
                        <button
                            onClick={() => toggleSection('tsc')}
                            className="w-full py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold rounded-lg transition-colors text-sm"
                        >
                            {expandedSection === 'tsc' ? '접기' : '더보기'}
                        </button>
                        {expandedSection === 'tsc' && details.tsc}
                    </div>

                    {/* TSY */}
                    <div className="bg-blue-50 rounded-2xl p-8 md:p-10 border border-blue-100">
                        <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                            <Users size={28} /> TSY (Youth)
                        </h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            세상의 문화 속에서 그리스도의 빛을 발하는 청소년 공동체.<br />
                            서로 이해하고 격려하며 믿음의 동역자로 함께 성장합니다.
                        </p>
                        <div className="text-sm text-gray-600 font-medium bg-white/60 inline-block px-4 py-2 rounded-lg mb-4">
                            담당: 강명화 목사
                        </div>
                        <button
                            onClick={() => toggleSection('tsy')}
                            className="w-full py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-lg transition-colors text-sm"
                        >
                            {expandedSection === 'tsy' ? '접기' : '더보기'}
                        </button>
                        {expandedSection === 'tsy' && details.tsy}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
