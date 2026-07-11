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
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 py-12">
            {/* Header: Logo & Church Name */}
            <div className="flex items-center justify-center mb-8 max-w-md w-full">
                <img 
                    src="/images/church_logo.jpg" 
                    alt="Logo" 
                    className="w-12 h-12 md:w-14 h-14 object-cover mr-4 rounded-full border border-slate-100" 
                    onError={(e) => {
                        // Fallback in case logo doesn't load
                        e.target.style.display = 'none';
                    }}
                />
                <div className="text-left leading-tight">
                    <h1 className="text-[17px] md:text-xl font-black text-slate-800 tracking-tight">보내심을 받은 생명의소리 교회</h1>
                    <p className="text-xs md:text-sm font-bold text-slate-400 font-serif tracking-wide mt-0.5">The Church of the Sent</p>
                </div>
            </div>

            {/* Login Container Box */}
            <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm p-8 md:p-10 space-y-8 rounded-sm">
                <div className="text-left">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Member Login</h2>
                </div>

                {/* If user is logged in but pending admin approval */}
                {currentUser && currentUser.status === 'pending' ? (
                    <div className="p-5 bg-amber-50 border border-amber-100 rounded-lg text-center space-y-3">
                        <span className="text-3xl block">⏳</span>
                        <h3 className="font-bold text-amber-900 text-sm">가입 승인 대기 중</h3>
                        <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                            {currentUser.name} 님의 가입 신청이 정상 접수되었습니다.<br />
                            보안과 질서 유지를 위해 관리자가 회원 가입을 **승인**한 후에 서비스 이용이 가능합니다. 조금만 기다려주세요!
                        </p>
                        <button 
                            type="button" 
                            onClick={() => window.location.reload()} 
                            className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all"
                        >
                            승인 상태 확인하기
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100 text-left">
                                ⚠️ {error}
                            </div>
                        )}
                        {resetSent && (
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-100 text-left">
                                📧 비밀번호 재설정 메일이 전송되었습니다. 이메일을 확인해주세요.
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="space-y-1.5 text-left">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    EMAIL ADDRESS
                                    <span className="text-red-600 font-bold ml-1">*</span>
                                </label>
                            </div>
                            <input
                                type="email"
                                placeholder="이메일을 입력해 주십시오"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#4c51bf] font-medium transition-all"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5 text-left">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    PASSWORD
                                    <span className="text-red-600 font-bold ml-1">*</span>
                                </label>
                            </div>
                            <input
                                type="password"
                                placeholder="비밀번호를 입력해 주십시오"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#4c51bf] font-medium transition-all"
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center text-left">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="w-4 h-4 rounded text-[#4c51bf] focus:ring-[#4c51bf]/20 accent-[#4c51bf] border-slate-300 cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-xs font-bold text-slate-500 cursor-pointer select-none">
                                Remember Me
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-[#4c51bf] hover:bg-[#434190] text-white rounded-md font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                )}

                {/* Bottom Links */}
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-500">
                    <Link to="/register" className="hover:text-[#4c51bf] transition-colors">
                        New Register
                    </Link>
                    <button
                        type="button"
                        onClick={handlePasswordReset}
                        className="hover:text-[#4c51bf] transition-colors"
                        disabled={isLoading}
                    >
                        I forgot my password
                    </button>
                </div>
            </div>
        </div>
    );
}
