
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import getCroppedImg from '../lib/cropImage';

interface ImageEditorProps {
    imageSrc: string;
    aspectRatio: number;
    onCancel: () => void;
    onCropComplete: (croppedBlob: Blob) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, aspectRatio, onCancel, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-wryft-border rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl animate-fade-in">
                {/* Header */}
                <div className="p-4 border-b border-wryft-border flex justify-between items-center bg-[#111]">
                    <h3 className="font-semibold text-white">Edit Image</h3>
                    <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="relative h-[400px] w-full bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={onZoomChange}
                        objectFit="contain"
                    />
                </div>

                {/* Controls */}
                <div className="p-6 space-y-6 bg-[#0a0a0a]">
                    <div className="flex items-center gap-4">
                        <ZoomOut size={16} className="text-gray-500" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1.5 bg-[#222] rounded-lg appearance-none cursor-pointer accent-violet-500 hover:accent-violet-400 transition-all"
                        />
                        <ZoomIn size={16} className="text-gray-500" />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={onCancel}
                            className="px-5 py-2.5 rounded-lg text-gray-400 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={loading}
                            className="px-8 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : <><Check size={18} /> Apply</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
