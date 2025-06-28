
import React, { useRef } from 'react';

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    courseName: string;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, studentName, courseName }) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        alert("Certificate download simulation! In a real app, this would generate a PDF.");
        // In a real app, you might use a library like html2canvas and jspdf
        // For now, we just simulate the download.
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl w-full">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Completion Certificate</h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>

                <p className="text-green-600 mb-4">Congratulations! You have completed all sections. Here is your certificate.</p>
                
                <div ref={certificateRef} className="bg-white border-4 border-brand-primary p-8 text-center">
                    <h1 className="text-3xl font-bold text-brand-secondary">Certificate of Completion</h1>
                    <p className="mt-8 text-lg">This is to certify that</p>
                    <p className="text-2xl font-bold my-4 text-brand-primary">{studentName}</p>
                    <p className="text-lg">has successfully completed the course</p>
                    <p className="text-2xl font-bold my-4 text-brand-primary">{courseName}</p>
                    <p className="mt-8 text-lg">on</p>
                    <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                </div>

                <div className="text-right mt-6">
                     <button onClick={handleDownload} className="bg-brand-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90">
                        Download Certificate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CertificateModal;
