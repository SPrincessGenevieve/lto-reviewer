"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { questions as allQuestions } from "@/lib/questions";
import { useUserContext } from "@/app/context/UserContext";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import FaceDetectionCamera from "../../camera/page";
import "@/app/globals.css";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function ExamNonProfPage() {
  const router = useRouter();
  const {
    setUserDetails,
    nonProfLevel,
    nonProfFaceDetection,
    profFaceDetection,
  } = useUserContext();

  const QUESTIONS_PER_PAGE =
    nonProfLevel === "easy" ? 20 : nonProfLevel === "normal" ? 30 : 50;
  const TOTAL_QUESTIONS =
    nonProfLevel === "easy" ? 40 : nonProfLevel === "normal" ? 60 : 100;

  const [timeLeft, setTimeLeft] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [formattedTime, setFormattedTime] = useState("00:00:00");
  const [questions, setQuestions] = useState<typeof allQuestions>([]);
  const [currentPage, setCurrentPage] = useState(0);
  // answers: array of arrays of strings, length = TOTAL_QUESTIONS
  const [answers, setAnswers] = useState<string[][]>([]);

  useEffect(() => {
    const random60 = shuffleArray(allQuestions).slice(0, TOTAL_QUESTIONS);
    setQuestions(random60);
    setAnswers(Array(TOTAL_QUESTIONS).fill([]));
  }, []);

  useEffect(() => {
    if (nonProfFaceDetection === false) {
      setOpenDialog(true);
    }
  }, [nonProfFaceDetection]);

  useEffect(() => {
    if (nonProfLevel === "hard") {
      setUserDetails({
        nonProfFaceDetection: true,
      });
    }
  }, [nonProfLevel]);

  console.log(nonProfLevel);

  useEffect(() => {
    if (nonProfLevel === "hard") {
      // Clear saved timer on mount to reset on each page load
      localStorage.removeItem("exam_end_time_non_prof");

      const levelNormalized = nonProfLevel?.trim().toLowerCase() || "";
      const durationMinutes = levelNormalized === "easy" ? 45 : 90;

      const endTime = Date.now() + durationMinutes * 60 * 1000;
      localStorage.setItem("exam_end_time_non_prof", endTime.toString());

      const interval = setInterval(() => {
        const secondsLeft = Math.floor((endTime - Date.now()) / 1000);

        if (secondsLeft <= 0) {
          clearInterval(interval);
          localStorage.removeItem("exam_end_time_non_prof");
          setUserDetails({ userAnswers: answers, examQuestions: questions });
          router.push("/type/review/results");
        } else {
          setTimeLeft(secondsLeft);
          setFormattedTime(formatTime(secondsLeft));
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        localStorage.removeItem("exam_end_time_non_prof");
      };
    }
  }, [nonProfLevel, answers, questions, router, setUserDetails]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Mark violation
        sessionStorage.setItem("non_prof_violation", "true");

        setUserDetails({
          isNonProfViolated: true,
        });

        router.replace("/type/review");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  if (questions.length === 0)
    return <p className="p-4">Loading questions...</p>;

  // Get the 10 questions for the current page
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  function formatTime(seconds: number): string {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  }

  // Handle checkbox change for a question on current page
  const handleCheckboxChange = (
    questionIndex: number,
    choice: string,
    checked: boolean
  ) => {
    const globalIndex = startIndex + questionIndex;
    const updated = [...answers];
    const currentAnswers = updated[globalIndex] || [];

    if (checked) {
      updated[globalIndex] = [...currentAnswers, choice];
    } else {
      updated[globalIndex] = currentAnswers.filter((c) => c !== choice);
    }

    setAnswers(updated);
  };

  const handleSingleChoice = (
    questionIndex: number,
    choice: string,
    checked: boolean
  ) => {
    setAnswers((prevAnswers) => {
      const updated = [...prevAnswers];
      if (checked) {
        // Only one choice allowed: overwrite the array with the single choice
        updated[startIndex + questionIndex] = [choice];
      } else {
        // If unchecking the only selected item, clear the array
        updated[startIndex + questionIndex] = [];
      }
      return updated;
    });
  };

  const handleNext = () => {
    const lastPageIndex = Math.floor(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE) - 1;

    if (currentPage === lastPageIndex) {
      // Final page: submit and go to results
      localStorage.removeItem("exam_end_time_non_prof");
      setUserDetails({ userAnswers: answers, examQuestions: questions });
      router.push("/type/review/results");
    } else {
      // Go to next page
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Check if all questions on this page have at least one answer selected
  const allAnswered = currentQuestions.every(
    (_, i) => answers[startIndex + i]?.length > 0
  );

  const handleContinue = () => {
    setOpenDialog(false);
  };

  return (
    <div className="flex w-full h-full">
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogTitle
            className={`${
              nonProfFaceDetection === false ? "text-red-600" : "text-green-600"
            }`}
          >
            {nonProfFaceDetection === false
              ? "Warning: No face detected"
              : "You may continue with your exam"}
          </DialogTitle>
          <FaceDetectionCamera></FaceDetectionCamera>
          <Button
            onClick={handleContinue}
            disabled={nonProfFaceDetection === false ? true : false}
            className="w-auto"
          >
            Continue
          </Button>
        </DialogContent>
      </Dialog>
      {nonProfLevel === "hard" && (
        <div className="w-[20%] max-w-[300px] flex flex-col gap-2">
          <FaceDetectionCamera></FaceDetectionCamera>
        </div>
      )}

      <div className="w-full h-full flex flex-col">
        <div className="w-full h-[10%] flex flex-col items-center justify-center">
          <div className="w-full max-w-[800px]">
            <div className="w-full flex justify-between">
              <p className="text-[15px]">
                Questions {startIndex + 1} -{" "}
                {startIndex + currentQuestions.length} of {questions.length}
              </p>
              {nonProfLevel === "hard" && (
                <p className="text-red-600 text-[14px] text-center">
                  Time Remaining: {formattedTime}
                </p>
              )}
            </div>
            <Progress
              className="w-full h-2"
              value={startIndex + currentQuestions.length}
            ></Progress>
          </div>
        </div>
        <div className="w-full h-[80%] overflow-y-auto">
          <div className="w-full h-auto p-2 ">
            {currentQuestions.map((q, i) => (
              <div key={startIndex + i} className="mb-6">
                <p
                  className="mb-2 font-semibold select-none"
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                >
                  {startIndex + i + 1}. {q.question}
                </p>
                {q.image !== "" && (
                  <Image
                    src={q.image}
                    width={400}
                    height={400}
                    className="h-[100px] w-auto my-4"
                    alt=""
                  ></Image>
                )}
                {q.choices.map((choice, idx) => (
                  <div className="flex items-center gap-3 mb-1" key={idx}>
                    <Checkbox
                      id={`choice-${startIndex + i}-${idx}`}
                      checked={
                        answers[startIndex + i]?.includes(choice) || false
                      }
                      onCheckedChange={(checked) => {
                        if (q.isMultiple) {
                          handleCheckboxChange(i, choice, Boolean(checked));
                        } else {
                          // Single selection: set this choice as the only one
                          handleSingleChoice(i, choice, Boolean(checked));
                        }
                      }}
                      className="w-5 h-5"
                    />
                    <Label
                      className="font-normal"
                      htmlFor={`choice-${startIndex + i}-${idx}`}
                    >
                      {choice}
                    </Label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 p-2 justify-between w-full h-[10%]">
          <Button
            className="w-full max-w-[100px]"
            onClick={handlePrev}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            className="w-full max-w-[100px]"
            onClick={handleNext}
            disabled={!allAnswered}
          >
            {currentPage ===
            Math.floor(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE) - 1
              ? "Finish"
              : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
