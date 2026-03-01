import React from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log to console for better diagnostics
        console.group("🔴 ErrorBoundary Caught an Error");
        console.error("Error Object:", error);
        console.error("Error Info:", errorInfo);
        console.groupEnd();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">
                        오류가 발생했습니다
                    </h2>
                    <p className="text-slate-500 mb-8 max-w-md">
                        페이지를 불러오는 도중 문제가 발생했습니다.<br />
                        잠시 후 다시 시도해 주세요.
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                        <RefreshCcw size={18} />
                        페이지 새로고침
                    </button>
                    {(import.meta.env?.DEV) && (
                        <div className="mt-8 w-full max-w-2xl text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Debug Info (Dev Only)</p>
                            <pre className="p-4 bg-red-50 text-red-800 rounded-lg text-xs overflow-auto border border-red-100 shadow-inner">
                                {this.state.error && this.state.error.toString()}
                                {"\n\nStack Trace:\n"}
                                {this.state.error && this.state.error.stack}
                            </pre>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
