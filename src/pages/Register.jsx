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
        <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl space-y-8 relative overflow-hidden">
                {/* Back button */}
                <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors">
                    <ArrowLeft size={14} />
                    로그인 페이지로 가기
                </Link>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-gray-800">교회 멤버십 가입 신청</h1>
                    <p className="text-sm font-medium text-gray-400">교회 식구이시면 회원 가입을 신청하실 수 있습니다.</p>
                </div>

                {success ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-center space-y-4">
                        <span className="text-4xl block">🎉</span>
                        <h3 className="font-bold text-emerald-950 text-base">가입 신청 완료!</h3>
                        <p className="text-xs text-emerald-800/80 leading-relaxed font-medium">
                            회원 가입 신청이 성공적으로 완료되었습니다.<br />
                            보안과 질서 유지를 위해 **관리자 승인**이 완료된 후 서비스 이용이 가능합니다.<br />
                            <br />
                            잠시 후 로그인 페이지로 이동합니다...
                        </p>
                        <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mt-2" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* 이름 */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">이름 *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User size={16} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="홍길동"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                                />
                            </div>
                        </div>

                        {/* 이메일 */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">이메일 주소 *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail size={16} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="your-email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                                />
                            </div>
                        </div>

                        {/* 연락처 */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">연락처 (관리자 확인용)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Phone size={16} />
                                </span>
                                <input
                                    type="tel"
                                    placeholder="010-1234-5678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                                />
                            </div>
                        </div>

                        {/* 비밀번호 */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">비밀번호 *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="최소 6자 이상"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                                />
                            </div>
                        </div>

                        {/* 비밀번호 확인 */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 ml-1">비밀번호 확인 *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type="password"
                                    placeholder="비밀번호 재입력"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 mt-2 bg-primary text-white rounded-2xl font-black text-base hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.01]"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    가입 신청하기
                                    <UserPlus size={18} />
                                </>
                            )}
                        </button>
                    </form>
                )}

                <div className="border-t border-gray-100 pt-6 text-center">
                    <span className="text-xs text-gray-400 font-medium">이미 가입하셨나요? </span>
                    <Link to="/login" className="text-xs font-black text-primary hover:underline ml-1">
                        로그인하러 가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
