import React, { useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { colors } from "../constants/theme";
import MainHeader from "../components/MainHeader";
import ScreenHeader from "../components/ScreenHeader";
import { Pose } from "@mediapipe/pose";
import { FaceMesh } from "@mediapipe/face_mesh";
import * as Facemesh from "@mediapipe/face_mesh";
import * as pose from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import * as draw from '@mediapipe/drawing_utils'
import * as control from '@mediapipe/control_utils'
import * as control3d from '@mediapipe/control_utils_3d'
import Webcam from "react-webcam";

function HomeScreen() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const connect = window.drawConnectors;

  function onResults(results) {
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0,
      canvasElement.width, canvasElement.height);
      
      if (results.poseLandmarks) {
        canvasCtx.globalCompositeOperation = 'source-over';
        draw.drawConnectors(canvasCtx, results.poseLandmarks, pose.POSE_CONNECTIONS,
                       {color: '#00FF00', lineWidth: 4});
        draw.drawLandmarks(canvasCtx, results.poseLandmarks,
                      {color: '#FF0000', lineWidth: 2});
        canvasCtx.restore();
  
      }


}

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });
    

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    pose.onResults(onResults);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  return (
    <center>
      <div className="App">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          className="output_canvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </div>
    </center>
  );
}


export default HomeScreen;
