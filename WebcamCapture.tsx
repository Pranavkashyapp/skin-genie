import { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Camera, RotateCw } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
}

export default function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  
  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode,
  };
  
  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);
  
  const toggleCamera = useCallback(() => {
    setFacingMode(prevMode => prevMode === "user" ? "environment" : "user");
  }, []);
  
  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  return (
    <div className="webcam-section flex flex-col items-center">
      <div className="relative w-full max-w-md mb-6">
        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={handleUserMedia}
            mirrored={facingMode === "user"}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border-2 border-dashed border-primary"></div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500 text-center">
          Face should be clearly visible and well-lit
        </div>
      </div>

      <div className="webcam-controls flex space-x-4">
        <Button 
          variant="outline" 
          onClick={toggleCamera}
          className="flex items-center"
          disabled={!isCameraReady}
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Switch Camera
        </Button>
        
        <Button 
          onClick={handleCapture}
          className="flex items-center"
          disabled={!isCameraReady}
        >
          <Camera className="h-4 w-4 mr-2" />
          Capture Image
        </Button>
      </div>
    </div>
  );
}
