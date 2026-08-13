"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FrequencyData } from "./types";

export interface UseAudioAnalyzerReturn {
  audioRef: React.MutableRefObject<FrequencyData>;
  isListening: boolean;
  permissionDenied: boolean;
  isSupported: boolean;
  startListening: () => Promise<boolean>;
  stopListening: () => void;
}

export function useAudioAnalyzer(externalOutputVolume: number = 0): UseAudioAnalyzerReturn {
  const [isListening, setIsListening] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Smooth lerp values stored in refs to avoid frame-by-frame React re-renders
  const audioRef = useRef<FrequencyData>({
    bass: 0,
    mid: 0,
    high: 0,
    overall: 0,
  });

  const stopListening = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
      setIsSupported(false);
      return false;
    }

    try {
      stopListening();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const sampleRate = ctx.sampleRate;
      const binWidth = sampleRate / analyser.fftSize;

      // Calculate bin index boundaries for frequency bands
      const bassMaxBin = Math.floor(250 / binWidth);
      const midMaxBin = Math.floor(2000 / binWidth);
      const highMaxBin = Math.floor(8000 / binWidth);

      const analyzeFrame = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        let bassSum = 0;
        let bassCount = 0;
        let midSum = 0;
        let midCount = 0;
        let highSum = 0;
        let highCount = 0;
        let overallSum = 0;

        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i] / 255.0;
          overallSum += val;

          if (i <= bassMaxBin) {
            bassSum += val;
            bassCount++;
          } else if (i <= midMaxBin) {
            midSum += val;
            midCount++;
          } else if (i <= highMaxBin) {
            highSum += val;
            highCount++;
          }
        }

        const rawBass = bassCount > 0 ? bassSum / bassCount : 0;
        const rawMid = midCount > 0 ? midSum / midCount : 0;
        const rawHigh = highCount > 0 ? highSum / highCount : 0;
        const rawOverall = bufferLength > 0 ? overallSum / bufferLength : 0;

        // Factor in AI output volume if present
        const targetBass = Math.max(rawBass, externalOutputVolume * 0.9);
        const targetMid = Math.max(rawMid, externalOutputVolume * 0.8);
        const targetHigh = Math.max(rawHigh, externalOutputVolume * 0.7);
        const targetOverall = Math.max(rawOverall, externalOutputVolume);

        // Lerp smoothing (0.15 smoothing factor for ultra-fluid motion)
        audioRef.current.bass += (targetBass - audioRef.current.bass) * 0.15;
        audioRef.current.mid += (targetMid - audioRef.current.mid) * 0.15;
        audioRef.current.high += (targetHigh - audioRef.current.high) * 0.15;
        audioRef.current.overall += (targetOverall - audioRef.current.overall) * 0.15;

        animFrameRef.current = requestAnimationFrame(analyzeFrame);
      };

      analyzeFrame();
      setIsListening(true);
      setPermissionDenied(false);
      return true;
    } catch (err: any) {
      console.warn("Microphone access error:", err);
      setPermissionDenied(true);
      setIsListening(false);
      return false;
    }
  }, [externalOutputVolume, stopListening]);

  // Effect to process synthetic audio levels when not using mic
  useEffect(() => {
    if (!isListening && externalOutputVolume > 0) {
      let frame: number;
      const updateSynthetic = () => {
        audioRef.current.bass += (externalOutputVolume * 0.9 - audioRef.current.bass) * 0.15;
        audioRef.current.mid += (externalOutputVolume * 0.8 - audioRef.current.mid) * 0.15;
        audioRef.current.high += (externalOutputVolume * 0.7 - audioRef.current.high) * 0.15;
        audioRef.current.overall += (externalOutputVolume - audioRef.current.overall) * 0.15;
        frame = requestAnimationFrame(updateSynthetic);
      };
      updateSynthetic();
      return () => cancelAnimationFrame(frame);
    }
  }, [externalOutputVolume, isListening]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    audioRef,
    isListening,
    permissionDenied,
    isSupported,
    startListening,
    stopListening,
  };
}
