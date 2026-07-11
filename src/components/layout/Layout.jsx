import { Outlet, useLocation, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useSiteConfigValue } from '../../context/SiteConfigContext';
import { useAuth } from '../../context/AuthContext';
import { Lock, Clock } from 'lucide-react';

const Layout = () => {
    const location = useLocation();
    const { config } = useSiteConfigValue();
    const { currentUser } = useAuth();

    // Check if the current route is marked as protected in the database
    const protectedPaths = config?.protectedPaths || [];
    
    // Support matching exact paths or sub-paths
    const isCurrentPathProtected = protectedPaths.some(path => {
        const currentPath = location.pathname.toLowerCase();
        const targetPath = path.toLowerCase();
        return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
    });

    const renderWall = () => {
        if (!currentUser) {
            return (
                <div className="flex-grow flex items-center justify-center py-20 px-4">
                    <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl space-y-6 text-center">
                        <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center border border-slate-100 animate-pulse mx-auto shrink-0">
                            <Lock size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-gray-800">회원 전용 메뉴</h2>
                            <p className="text-sm font-medium text-gray-400 leading-relaxed break-keep">
                                해당 메뉴는 **교회 멤버만** 이용하실 수 있습니다.<br />
                                로그인 후 이용해 주시기 바랍니다.
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.01]"
                        >
                            로그인하러 가기 🔑
                        </Link>
                    </div>
                </div>
            );
        }

        if (currentUser.status !== 'approved') {
            return (
                <div className="flex-grow flex items-center justify-center py-20 px-4">
                    <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl space-y-6 text-center">
                        <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center border border-amber-100 animate-bounce mx-auto shrink-0">
                            <Clock size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-gray-800">회원 승인 대기 중</h2>
                            <p className="text-sm font-medium text-gray-400 leading-relaxed break-keep">
                                안녕하세요, <span className="text-primary font-black">{currentUser.name}</span> 님!<br />
                                해당 메뉴는 **정회원 전용** 공간입니다.<br />
                                보안을 위해 관리자가 회원 가입을 승인한 후에 열람이 가능합니다. 조금만 기다려주세요!
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-amber-200 active:scale-98"
                        >
                            승인 상태 새로고침 🔄
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    };

    const wallElement = isCurrentPathProtected ? renderWall() : null;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20 flex flex-col">
                {wallElement ? wallElement : <Outlet />}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
