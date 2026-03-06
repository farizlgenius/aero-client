import { PropsWithChildren, useEffect, useRef, useState } from "react"
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";

interface NativeWebcamProp {
    modelStatus: boolean
    handleClick:(e: React.MouseEvent<HTMLButtonElement>) => void
    image:File | undefined,
    setImage:React.Dispatch<React.SetStateAction<File | undefined>>,
    setNewImage:React.Dispatch<React.SetStateAction<File | undefined>>
}

export const NativeWebcam: React.FC<PropsWithChildren<NativeWebcamProp>> = ({ handleClick,modelStatus,image,setImage,setNewImage }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imgUrl, setImgUrl] = useState<string | null>(null);

    const stopStream = (targetStream?: MediaStream | null) => {
        const activeStream = targetStream ?? stream ?? (videoRef.current?.srcObject as MediaStream | null);
        if (activeStream) {
            activeStream.getTracks().forEach((track) => track.stop());
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setStream(null);
    };

    useEffect(() => {
        let isActive = true;
        let localStream: MediaStream | null = null;

        const startCamera = async () => {
            setError(null);
            try {
                const s = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1920, height: 1080, facingMode: "user" },
                    audio: false
                });

                // If modal closed before camera permission resolved, stop immediately.
                if (!isActive) {
                    s.getTracks().forEach((track) => track.stop());
                    return;
                }

                localStream = s;
                setStream(s);
                if (videoRef.current) videoRef.current.srcObject = s;
            } catch (err: any) {
                if (!isActive) return;
                console.error(err);
                setError(err?.message ?? "Failed to access camera");
            }
        };

        startCamera();

        return () => {
            isActive = false;
            stopStream(localStream);
        };
    }, [])

    useEffect(() => {
        if (!modelStatus) stopStream()
    }, [modelStatus])

    const capture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // draw current frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);


        // optional: we can apply filters or crop here before exporting


        // get blob (async) and create object URL
        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], `capture_${Date.now()}.png`, { type: "image/png" });
            setImage(file);
            setNewImage(file); 
            const url = URL.createObjectURL(blob);
            setImgUrl(url);
            stopStream();
        }, "image/png");
    }

    useEffect(() => {
        stopStream()
    },[image])
    return (
        <ComponentCard title="Image Session" desc="Align face in the frame, then capture a clear photo.">
            <section className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/30">
                    {imgUrl ? (
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-black dark:border-gray-700">
                            <img src={imgUrl} alt="Captured preview" className="h-[420px] w-full object-cover lg:h-[520px]" />
                        </div>
                    ) : error ? (
                        <div className="flex h-[420px] items-center justify-center rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-600 lg:h-[520px]">
                            Error: {error}
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-black shadow-sm dark:border-gray-700">
                            <video
                                ref={videoRef}
                                playsInline
                                autoPlay
                                muted
                                className="h-[420px] w-full object-cover lg:h-[520px]"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-3">
                    {imgUrl ? (
                        <Button onClick={handleClick} name="close" variant="primary" className="min-w-[140px]">
                            Use This Photo
                        </Button>
                    ) : (
                        <Button onClick={capture} variant="green" className="min-w-[140px]">
                            Capture
                        </Button>
                    )}
                </div>
                {/* hidden canvas used for capture */}
                <canvas ref={canvasRef} style={{ display: "none" }} />
            </section>
        </ComponentCard>

    );
}
