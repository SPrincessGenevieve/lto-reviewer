"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { questions as allQuestions } from "@/lib/questions";
import { useUserContext } from "@/app/context/UserContext";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

const QUESTIONS_PER_PAGE = 10;
const TOTAL_QUESTIONS = 60;

export default function ExamPage() {
  const router = useRouter();
  const { setUserDetails } = useUserContext();

  const [questions, setQuestions] = useState<typeof allQuestions>([]);
  const [currentPage, setCurrentPage] = useState(0);
  // answers: array of arrays of strings, length = TOTAL_QUESTIONS
  const [answers, setAnswers] = useState<string[][]>([]);

  useEffect(() => {
    const random60 = shuffleArray(allQuestions).slice(0, TOTAL_QUESTIONS);
    setQuestions(random60);
    setAnswers(Array(TOTAL_QUESTIONS).fill([]));
  }, []);

  if (questions.length === 0)
    return <p className="p-4">Loading questions...</p>;

  // Get the 10 questions for the current page
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

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

  const handleNext = () => {
    if (currentPage < Math.floor(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE) - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Last page: save and go to results
      setUserDetails({ userAnswers: answers, examQuestions: questions });
      router.push("/type/non-professional/results");
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
    <div className="p-4 max-w-3xl mx-auto">
      <p className="text-lg font-medium mb-4">
        Questions {startIndex + 1} - {startIndex + currentQuestions.length} of{" "}
        {questions.length}
      </p>

      {currentQuestions.map((q, i) => (
        <div key={startIndex + i} className="mb-6">
          <p className="mb-2 font-semibold">{startIndex + i + 1}. {q.question}</p>
          {q.choices.map((choice, idx) => (
            <div className="flex items-center gap-3 mb-1" key={idx}>
              <input
                type="checkbox"
                id={`choice-${startIndex + i}-${idx}`}
                checked={answers[startIndex + i]?.includes(choice) || false}
                onChange={(e) =>
                  handleCheckboxChange(i, choice, e.target.checked)
                }
                className="w-5 h-5"
              />
              <Label htmlFor={`choice-${startIndex + i}-${idx}`}>
                {choice}
              </Label>
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-between">
        <Button onClick={handlePrev} disabled={currentPage === 0}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!allAnswered}>
          {currentPage === Math.floor(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE) - 1
            ? "Finish"
            : "Next"}
        </Button>
      </div>
    </div>
  );
}
