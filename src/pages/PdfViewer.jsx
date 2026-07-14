import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, ExternalLink, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PdfViewer() {
    const { filename } = useParams();
    const { user } = useAuth();
    
    // Resolve proper PDF filename with .pdf extension
    const pdfName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    const pdfUrl = `/pdf/${pdfName}`;
    
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'

    useEffect(() => {
        const verifyFile = async () => {
            try {
                // Perform a fast HEAD request to check file existence
                const headResponse = await fetch(pdfUrl, { method: 'HEAD' });
                if (headResponse.ok) {
                    setStatus('success');
                    return;
                }
                
                // Fallback to GET check if HEAD is not supported/fails
                const getResponse = await fetch(pdfUrl);
                if (getResponse.ok) {
                    setStatus('success');
                } else {
                    setStatus('error');
                }
            } catch (err) {
                setStatus('error');
            }
        };

        verifyFile();
    }, [pdfUrl]);

    // Format filename into a readable title
    const formatTitle = (name) => {
        let baseName = name.replace(/\.pdf$/i, '');
        // Replace dashes, underscores, and dots with spaces
        baseName = baseName.replace(/[_\-\.]+/g, ' ');
        // Capitalize each word
        return baseName.replace(/\b\w/g, char => char.toUpperCase());
    };

    const displayTitle = formatTitle(pdfName);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-400 font-medium animate-pulse">Verifying and loading document...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
                    <div className="w-16 h-16 bg-red-950/50 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">Document Not Found</h2>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                        The requested PDF document <code className="px-1.5 py-0.5 bg-slate-800 rounded text-red-400 font-mono text-xs">{pdfName}</code> could not be located on the server. Please check the URL or ensure the file exists in the public pdf folder.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to={user ? "/" : "/login"}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {user ? 'Back to Dashboard' : 'Back to Login'}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
            {/* Premium Header */}
            <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-10 shadow-md">
                <div className="flex items-center gap-4 min-w-0">
                    <Link
                        to={user ? "/" : "/login"}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title={user ? "Dashboard" : "Login"}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    
                    <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>
                    
                    <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <h1 className="text-sm font-semibold text-slate-100 truncate" title={pdfName}>
                            {displayTitle}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all border border-slate-800 hover:border-slate-700"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">Open in New Tab</span>
                    </a>
                    
                    <a
                        href={pdfUrl}
                        download={pdfName}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/10"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                    </a>
                </div>
            </header>

            {/* Embedded PDF Viewer */}
            <main className="flex-1 w-full bg-slate-950 relative">
                <iframe
                    src={`${pdfUrl}#toolbar=1&navpanes=0`}
                    title={displayTitle}
                    className="w-full h-full border-0 bg-slate-900"
                />
            </main>
        </div>
    );
}
