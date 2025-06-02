"use client";

import { useUserContext } from "@/app/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";
import "@/app/globals.css";
import Image from "next/image";
import Passed from "@/images/passed.png";

const ITEMS_PER_PAGE = 9;

export default function ResultsNonProfPage() {
  const { userAnswers, examQuestions } = useUserContext();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  if (
    !userAnswers ||
    userAnswers.length === 0 ||
    !examQuestions ||
    examQuestions.length === 0
  ) {
    return <div className="p-4">No answers or questions found.</div>;
  }

  const totalPages = Math.ceil(examQuestions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentQuestions = examQuestions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  function isAnswerCorrect(
    userAnswer: string[] | string,
    correctAnswer: string[] | string
  ): boolean {
    if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
      const userSet = new Set(userAnswer.map(cleanString));
      const correctSet = new Set(correctAnswer.map(cleanString));
      if (userSet.size !== correctSet.size) return false;
      for (const ans of userSet) {
        if (!correctSet.has(ans)) return false;
      }
      return true;
    }

    return (
      cleanString(String(userAnswer)) === cleanString(String(correctAnswer))
    );
  }

  function cleanString(str: string): string {
    return str
      .normalize("NFKC")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .trim()
      .toLowerCase();
  }

  const score = examQuestions.reduce((acc, question, i) => {
    const userAnswer = userAnswers[i];
    const correctAnswer = question.answer;
    if (userAnswer !== undefined && correctAnswer !== undefined) {
      if (isAnswerCorrect(userAnswer, correctAnswer)) {
        return acc + 1;
      }
    }
    return acc;
  }, 0);

  const passingScore = Math.ceil(examQuestions.length * 0.75);
  const passed = score >= passingScore;

  const handleRetake = () => {
    router.push("/type/review");
  };

  return (
    <div className="w-full h-full flex flex-col  p-4 ">
      <div className="w-full flex items-center justify-center  h-auto">
        {passed ? (
          <Image
            src={Passed}
            alt=""
            width={400}
            height={400}
            className="w-auto h-[90px]"
          ></Image>
        ) : (
          <Image
            src="https://cdni.iconscout.com/illustration/premium/thumb/boy-feeling-sad-for-fail-in-exam-illustration-download-svg-png-gif-file-formats--scared-student-failed-failure-academic-performance-school-test-pack-education-illustrations-9802017.png"
            alt=""
            width={400}
            height={400}
            className="w-auto h-[90px]"
          ></Image>
        )}
      </div>
      <div className="w-full h-auto flex flex-col items-center justify-center">
        <p
          className={`text-xl font-semibold text-center ${
            passed ? "text-green-600" : "text-red-600"
          }`}
        >
          {passed
            ? "Congratulations! You passed!"
            : "You did not pass. Please try again."}
        </p>

        <Button onClick={handleRetake} className="w-full max-w-[400px] mt-2">
          Retake
        </Button>
      </div>

      <div className="w-full rounded-lg h-full  flex flex-col">
        <h1 className="text-2xl font-bold text-center">Exam Results</h1>

        <p className="text-lg text-center">
          Your Score: <strong>{score}</strong> / {examQuestions.length}
        </p>

        <div className="card grid grid-cols-3 w-full justify-center  gap-2">
          {currentQuestions.map((q, i) => {
            const actualIndex = startIndex + i;
            const userAnswer = userAnswers[actualIndex];
            const correctAnswer = q.answer;
            const correct =
              userAnswer !== undefined && correctAnswer !== undefined
                ? isAnswerCorrect(userAnswer, correctAnswer)
                : false;

            return (
              <Card key={actualIndex}>
                <CardContent className="w-full">
                  <p className="font-medium">
                    Q{actualIndex + 1}: {q.question}
                  </p>
                  <p>
                    <strong>Your Answer:</strong>{" "}
                    {Array.isArray(userAnswer)
                      ? userAnswer.join(", ")
                      : userAnswer || "No answer"}
                  </p>
                  <p>
                    <strong>Correct Answer:</strong>{" "}
                    {Array.isArray(correctAnswer)
                      ? correctAnswer.join(", ")
                      : correctAnswer || "No correct answer"}
                  </p>
                  <p
                    className={`font-semibold ${
                      correct ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {correct ? "Correct" : "Incorrect"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ShadCN Pagination */}
        <Pagination className=" mt-4">
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter((page) => {
                if (totalPages <= 6) return true; // show all if <= 6
                if (
                  page === 1 || // always show first page
                  page === totalPages || // always show last page
                  (page >= currentPage - 2 && page <= currentPage + 2) // window around current
                ) {
                  return true;
                }
                return false;
              })
              .map((page, idx, filteredPages) => {
                const isEllipsis =
                  idx > 0 && page !== filteredPages[idx - 1] + 1;

                return (
                  <React.Fragment key={page}>
                    {isEllipsis && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                );
              })}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
