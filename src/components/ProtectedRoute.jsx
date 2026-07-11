import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock } from 'lucide-react';

export default function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!currentUser) {
        // Redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (currentUser.status !== 'approved') {
        // Render a gorgeous "Pending Approval" page inside the layout
        return (
            <div className="flex flex-col items-center justify-center max-w-lg mx-auto py-20 px-6 text-center space-y-6">
                <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center shadow-inner border border-amber-100 animate-bounce">
                    <Clock size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-800">회원 승인 대기 중</h2>
                    <p className="text-sm font-medium text-gray-400 leading-relaxed break-keep">
                        안녕하세요, <span className="text-primary font-black">{currentUser.name}</span> 님!<br />
                        해당 메뉴는 <b>정회원 전용</b> 공간입니다.<br />
                        보안과 교회의 소중한 정보 보호를 위해 관리자의 승인 완료 후 이용 가능합니다.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-amber-200 transition-all active:scale-95 hover:scale-102"
                >
                    승인 상태 새로고침 🔄
                </button>
            </div>
        );
    }

    return children;
}
