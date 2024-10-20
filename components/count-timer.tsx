"use client";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CountDown = () => {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const timeRef = useRef<NodeJS.Timeout | null>(null);

  //Handling Duration
  const handleSetDuration = (): void => {
    const durationNum =
      typeof duration === "number" ? duration : parseInt(duration);
    if (durationNum > 0) {
      setTimeLeft(durationNum);
      setIsActive(false);
      setIsPaused(false);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  //Handling Start
  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false); // Unpause the countdown if it was paused.
    }
  };

  //Handling Pause
  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timeRef.current) {
        clearInterval(timeRef.current); // Clear the interval when paused.
      }
    }
  };

  //Handling Reset
  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
  };

  //Rendring
  useEffect(() => {
    if (isActive && !isPaused) {
      timeRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timeRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isActive, isPaused]);

  //Format Time
  const formatTime = (time: number): string => {
    const minute = Math.floor(time / 60);
    const second = time % 60;

    return `${String(minute).padStart(2, "0")}:${String(second).padStart(
      2,
      "0"
    )}`;
  };

  //Handling Change in Duration
  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <div className="flex justify-center items-center h-screen  bg-gray-100 dark:bg-gray-900 ">
      <div className="bg-white dark:bg-gray-800 shadow-lg px-4 py-8 w-full max-w-md">
        <h1 className="text-center font-semibold text-2xl text-gray-800 dark:text-gray-200">
          Countdown Timer
        </h1>

        <div className="m-4 flex items-center">
          <Input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 rounded-2xl dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 mr-2"
          />
          <Button
            className="rounded-xl gray-800 dark:text-gray-200"
            variant={"outline"}
            onClick={handleSetDuration}
          >
            Set
          </Button>
        </div>
        <div className="text-7xl font-semibold text-gray-800 dark:text-gray-200 mb-8 text-center">
          {formatTime(timeLeft)}
        </div>
        <div className="flex justify-center gap-3">
          <Button
            className="text-gray-800 rounded-lg dark:text-gray-200"
            variant={"outline"}
            onClick={handleStart}
          >
            {isPaused ? "Resume" : "Start"}
          </Button>
          <Button
            className="text-gray-800 rounded-lg dark:text-gray-200"
            variant={"outline"}
            onClick={handlePause}
          >
            Paused
          </Button>
          <Button
            className="text-gray-800 rounded-lg dark:text-gray-200"
            variant={"outline"}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CountDown;