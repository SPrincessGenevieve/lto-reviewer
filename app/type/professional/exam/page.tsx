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

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function ExamProfPage() {
  const router = useRouter();
  const { setUserDetails, profLevel } = useUserContext();

  const QUESTIONS_PER_PAGE = profLevel === "easy" ? 10 : 25;
  const TOTAL_QUESTIONS = profLevel === "easy" ? 40 : 100;
  console.log(profLevel);

  const [timeLeft, setTimeLeft] = useState(0);
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
    // Clear saved timer on mount to reset on each page load
    localStorage.removeItem("exam_end_time_prof");

    const levelNormalized = profLevel?.trim().toLowerCase() || "";
    const durationMinutes = levelNormalized === "easy" ? 45 : 90;

    const endTime = Date.now() + durationMinutes * 60 * 1000;
    localStorage.setItem("exam_end_time_prof", endTime.toString());

    const interval = setInterval(() => {
      const secondsLeft = Math.floor((endTime - Date.now()) / 1000);

      if (secondsLeft <= 0) {
        clearInterval(interval);
        localStorage.removeItem("exam_end_time_prof");
        setUserDetails({ userAnswers: answers, examQuestions: questions });
        router.push("/type/non-professional/results");
      } else {
        setTimeLeft(secondsLeft);
        setFormattedTime(formatTime(secondsLeft));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      localStorage.removeItem("exam_end_time_prof");
    };
  }, [profLevel, answers, questions, router, setUserDetails]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Mark violation
        sessionStorage.setItem("prof_violation", "true");

        setUserDetails({
          isProfViolated: true,
        });

        router.replace("/type/professional");
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
      localStorage.removeItem("exam_end_time_prof");
      setUserDetails({ userAnswers: answers, examQuestions: questions });
      router.push("/type/professional/results");
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

  return (
    <div className="flex flex-col w-full h-full relative">
      <p className="text-red-600 fixed right-5 top-20 font-extrabold">
        Time Remaining: {formattedTime}
      </p>
      <div className="max-w-3xl h-full mx-auto p-4 ">
        <div className="w-full h-full max-h-[100px] bg-[white] flex flex-col gap-2 items-center justify-center">
          <Progress
            className="w-full"
            value={startIndex + currentQuestions.length}
          ></Progress>
          <p className="text-lg font-medium mb-4">
            Questions {startIndex + 1} - {startIndex + currentQuestions.length}{" "}
            of {questions.length}
          </p>
        </div>
        <div className="h-auto w-full">
          {currentQuestions.map((q, i) => (
            <div key={startIndex + i} className="mb-6">
              <p className="mb-2 font-semibold">
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
                    checked={answers[startIndex + i]?.includes(choice) || false}
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
        <div className="flex justify-end gap-2 py-4">
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
