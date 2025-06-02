"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { useUserContext } from "@/app/context/UserContext";
import { usePathname } from "next/navigation";

const FaceDetectionCamera = () => {
  const pathname = usePathname();

  const webcamRef = useRef<Webcam | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const { nonProfFaceDetection, profFaceDetection, setUserDetails } =
    useUserContext();

  useEffect(() => {
    if (pathname.includes("review")) {
      setUserDetails({
        nonProfFaceDetection: isFaceDetected,
      });
    } else {
      setUserDetails({
        profFaceDetection: isFaceDetected,
      });
    }
  }, [isFaceDetected]);

  let consecutiveDetections = 0;
  let consecutiveNoDetections = 0;

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      setModelsLoaded(true); // ✅ Models are now loaded
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;

    const interval = setInterval(async () => {
      const video = webcamRef.current?.video;

      if (video && video.readyState === 4) {
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320, // or 416 for higher accuracy
            scoreThreshold: 0.5,
          })
        );

        const faceDetected = detections.some((d) => d.score > 0.8);

        if (faceDetected) {
          consecutiveDetections++;
          consecutiveNoDetections = 0;
        } else {
          consecutiveNoDetections++;
          consecutiveDetections = 0;
        }

        setIsFaceDetected(detections.length > 0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-auto h-40"
        videoConstraints={{
          facingMode: "user", // Use front camera
        }}
      />
      <p className="text-[14px]">{isFaceDetected ? "✅ Face Detected" : "❌ No Face Detected"}</p>
    </div>
  );
};

export default FaceDetectionCamera;
