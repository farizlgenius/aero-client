import { PropsWithChildren, useEffect, useRef, useState } from "react"
import Button from "../../components/ui/button/Button";
import ComponentCard from "../../components/common/ComponentCard";

interface NativeWebcamProp {
    modelStatus: boolean
    handleClick:(e: React.MouseEvent<HTMLButtonElement>) => void
    image:File | undefined,
    setImage:React.Dispatch<React.SetStateAction<File | undefined>>,
    newImage:File | undefined,
    setNewImage:React.Dispatch<React.SetStateAction<File | undefined>>
}

export const NativeWebcam: React.FC<PropsWithChildren<NativeWebcamProp>> = ({ handleClick,modelStatus,image,setImage,newImage,setNewImage }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imgUrl, setImgUrl] = useState<string | null>(null);

    useEffect(() => {
        // request webcam access
        let active = true;

        const start = async () => {
            setError(null)
            try {
                const s = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: "user" }, audio: false });
                if (!active) {
                    s.getTracks()
                        .forEach(t => t.stop());
                    return;
                }
                setStream(s);
                if (videoRef.current) videoRef.current.srcObject = s;
            } catch (err: any) {
                console.error(err)
                setError(err?.message ?? "Failed to access camera")
            }
        }

        start()

        return () => {
            active = false;
            if (stream) {
                stream.getTracks().forEach((t) => t.stop());
            }
        }
    }, [])

    useEffect(() => {
        if (!modelStatus) closeCamera()
    }, [modelStatus])

    const closeCamera = () => {
        if (!stream) return;
        stream.getTracks().forEach(track => track.stop());
        setStream(null);

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }

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
            // setImageFileDto(prev => ({...prev,fileData:url}))
        }, "image/png");
    }

    useEffect(() => {
        closeCamera()
    },[image])
    return (
        <ComponentCard title="Capture Zone">
             <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
            <section className="p-4 mb-6">
            <div className="flex gap-5">
                {
                    imgUrl == "" || imgUrl == null ? 
                    <div className="flex-1">
                    {error ? (
                        <div className="text-red-500">Error: {error}</div>
                    ) : (
                        <>
                            <video ref={videoRef} playsInline autoPlay muted className="rounded shadow" style={{ width: "100%", height: "auto" }} />
                        </>
                    )}
                </div>
                    :
                    <div className="flex-1">
                    <p className="text-sm text-gray-600">Preview</p>
                    <div className="mt-2 p-2 min-h-[180px] flex items-center justify-center">
                        {imgUrl ? (
                            <img src={imgUrl} alt="capture" className="max-w-full max-h-64" />
                        ) : (
                            <span className="text-gray-400">No capture yet</span>
                        )}
                    </div>
                </div>

                }
                


                
            </div>
            <div className="mt-2 flex gap-2 justify-center">
                {
                     imgUrl == "" || imgUrl == null ?
                     <>
                      <Button onClick={capture} className="px-3 py-1 rounded bg-green-500 text-white">Capture</Button>
                        {/* <Button onClick={closeCamera} className="px-3 py-1 rounded bg-indigo-500 text-white">Stop</Button> */}
                     </>   
                     :
                     <Button onClick={handleClick} name="close" className="px-3 py-1 rounded bg-indigo-500 text-white">OK</Button>
                }
                
                
                
            </div>


            {/* hidden canvas used for capture */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </section>

             </div>
        </ComponentCard>
        
    );
}