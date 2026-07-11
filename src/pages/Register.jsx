import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, UserPlus, ArrowLeft } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name || !email || !password || !confirmPassword) {
            setError('필수 항목(* 표시)을 모두 입력해주세요.');
            return;
        }

        if (password.length < 6) {
            setError('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        if (password !== confirmPassword) {
            setError('비밀번호가 서로 일치하지 않습니다.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await register(email, password, name, phone);
            setSuccess(true);
            // Wait 3 seconds and redirect to login
            setTimeout(() => {
                navigate('/login');
            }, 3500);
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('이미 가입된 이메일 주소입니다.');
            } else if (err.code === 'auth/invalid-email') {
                setError('올바르지 않은 이메일 형식입니다.');
            } else if (err.code === 'auth/weak-password') {
                setError('비밀번호가 너무 취약합니다. 6자 이상의 비밀번호를 설정해주세요.');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('이메일/비밀번호 가입 기능이 Firebase 콘솔에서 활성화되어 있지 않습니다. Firebase Console > Authentication > Sign-in method에서 이메일/비밀번호 설정을 활성화(Enabled)해주세요.');
            } else {
                setError(`회원 가입 중 오류가 발생했습니다: ${err.message || err}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 py-12">
            {/* Header: Logo & Church Name */}
            <div className="flex items-center justify-center mb-8 max-w-md w-full">
                <img 
                    src="/images/church_logo.jpg" 
                    alt="Logo" 
                    className="w-12 h-12 md:w-14 h-14 object-cover mr-4 rounded-full border border-slate-100" 
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                <div className="text-left leading-tight">
                    <h1 className="text-[17px] md:text-xl font-black text-slate-800 tracking-tight">보내심을 받은 생명의소리 교회</h1>
                    <p className="text-xs md:text-sm font-bold text-slate-400 font-serif tracking-wide mt-0.5">The Church of the Sent</p>
                </div>
            </div>

            {/* Register Container Box */}
            <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm p-8 md:p-10 space-y-8 rounded-sm">
                <div className="text-left">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight">Member Register</h2>
                </div>

                {success ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-lg text-center space-y-4">
                        <span className="text-4xl block">🎉</span>
                        <h3 className="font-bold text-emerald-950 text-base">가입 신청 완료!</h3>
                        <p className="text-xs text-emerald-800/80 leading-relaxed font-medium">
                            회원 가입 신청이 성공적으로 완료되었습니다.<br />
                            보안과 질서 유지를 위해 **관리자 승인**이 완료된 후 서비스 이용이 가능합니다.<br />
                            <br />
                            잠시 후 로그인 페이지로 이동합니다...
                        </p>
                        <div className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mt-2" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 text-left">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                NAME
                                <span className="text-red-600 font-bold ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="이름을 입력해 주십시오"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#4c51bf] font-medium transition-all"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                EMAIL ADDRESS
                                <span className="text-red-600 font-bold ml-1">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="이메일을 입력해 주십시오"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#4c51bf] font-medium transition-all"
                            />
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                PHONE NUMBER
                            </label>
                            <input
                                type="tel"
                                placeholder="연락처를 입력해 주십시오"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#4c51bf] font-medium transition-all"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                PASSWORD
                                <span className="text-red-600 font-bold ml-1">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="비밀번호를 입력해 주십시오 (6자 이상)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#4c51bf] font-medium transition-all"
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                CONFIRM PASSWORD
                                <span className="text-red-600 font-bold ml-1">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="비밀번호를 다시 입력해 주십시오"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-md text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#4c51bf] font-medium transition-all"
                            />
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 mt-2 bg-[#4c51bf] hover:bg-[#434190] text-white rounded-md font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>
                )}

                {/* Bottom Link */}
                <div className="pt-2 text-center text-xs font-bold text-slate-500">
                    <Link to="/login" className="hover:text-[#4c51bf] transition-colors">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
