import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

const FileUpload = ({ onUpload, loading }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onUpload(file);
    };

    return (
        <div className="w-full">
            <div
                className={`relative flex flex-col items-center justify-center w-full min-h-[320px] p-6 border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out ${dragActive ? 'border-agri-500 bg-agri-50 scale-[1.02]' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-50 hover:border-agri-300'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                />

                {preview ? (
                    <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in-up w-full h-full">
                        <div className="relative w-56 h-56 rounded-xl overflow-hidden shadow-lg border-4 border-white group">
                            <img src={preview} alt="Crop preview" className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                            {loading && (
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-sm transition-opacity">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>
                        {!loading && (
                            <label htmlFor="file-upload" className="cursor-pointer text-sm font-semibold text-agri-700 hover:text-agri-800 flex items-center bg-white px-5 py-2.5 border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <ImageIcon className="w-4 h-4 mr-2" /> Upload Different Image
                            </label>
                        )}
                    </div>
                ) : (
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer space-y-5">
                        <div className="p-5 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow group-hover:scale-105 duration-300 border border-gray-100">
                            <UploadCloud className="w-10 h-10 text-agri-500 transform transition-transform group-hover:-translate-y-1" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-lg font-bold text-gray-700">Click to upload or drag and drop</p>
                            <p className="text-sm font-medium text-gray-400">SVG, PNG, JPG or GIF</p>
                        </div>
                        <div className="mt-4 px-4 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-500">
                            Max file size: 10MB
                        </div>
                    </label>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
