import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { login, currentUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('로그인 시도가 너무 많아 일시적으로 계정이 잠겼습니다. 나중에 다시 시도해주세요.');
            } else {
                setError(`로그인 중 오류가 발생했습니다: ${err.message || err}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!email) {
            setError('비밀번호를 재설정할 이메일을 입력해주세요.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await resetPassword(email);
            setResetSent(true);
            setError('');
        } catch (err) {
            console.error(err);
            setError('비밀번호 재설정 메일 발송 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // If already logged in and approved, redirect to home
    if (currentUser && currentUser.status === 'approved') {
        navigate('/');
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl space-y-8 relative overflow-hidden">
                {/* Back button */}
                <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors">
                    <ArrowLeft size={14} />
                    홈으로 돌아가기
                </Link>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-gray-800">교회 멤버십 로그인</h1>
                    <p className="text-sm font-medium text-gray-400">교인 전용 서비스를 이용하시려면 로그인해주세요.</p>
                </div>

                {/* If user is logged in but pending admin approval */}
                {currentUser && currentUser.status === 'pending' ? (
                    <div className="p-5 bg-amber-50 border border-amber-100 rounded-3xl text-center space-y-3">
                        <span className="text-3xl block">⏳</span>
                        <h3 className="font-bold text-amber-900 text-sm">가입 승인 대기 중</h3>
                        <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                            {currentUser.name} 님의 가입 신청이 정상 접수되었습니다.<br />
                            관리자가 회원 가입을 **승인**한 후에 전체 서비스를 이용하실 수 있습니다. 조금만 기다려주세요!
                        </p>
                        <button 
                            type="button" 
                            onClick={() => window.location.reload()} 
                            className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all"
                        >
                            승인 상태 확인하기
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
                                ⚠️ {error}
                            </div>
                        )}
                        {resetSent && (
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold border border-emerald-100">
                                📧 비밀번호 재설정 메일이 전송되었습니다. 이메일을 확인해주세요.
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 ml-1">이메일 주소</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={16} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="your-email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold text-gray-500">비밀번호</label>
                                <button
                                    type="button"
                                    onClick={handlePasswordReset}
                                    className="text-[10px] font-bold text-primary hover:underline"
                                    disabled={isLoading}
                                >
                                    비밀번호 분실?
                                </button>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-black text-base hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    로그인하기
                                    <LogIn size={18} />
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="border-t border-gray-100 pt-6 text-center">
                    <span className="text-xs text-gray-400 font-medium">아직 회원이 아니신가요? </span>
                    <Link to="/register" className="text-xs font-black text-primary hover:underline ml-1">
                        회원가입 신청하기
                    </Link>
                </div>
            </div>
        </div>
    );
}
