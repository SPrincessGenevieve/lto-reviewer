"use client";

import { useUserContext } from "@/app/context/UserContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const { userAnswers, examQuestions } = useUserContext();
  const router = useRouter();
  if (
    !userAnswers ||
    userAnswers.length === 0 ||
    !examQuestions ||
    examQuestions.length === 0
  ) {
    return <div className="p-4">No answers or questions found.</div>;
  }

  let score = 0;

  // Helper function to compare answers (array or string)
  function isAnswerCorrect(
    userAnswer: string[] | string,
    correctAnswer: string[] | string
  ): boolean {
    if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
      const userSet = new Set(userAnswer.map((a) => cleanString(String(a))));
      const correctSet = new Set(
        correctAnswer.map((a) => cleanString(String(a)))
      );
      if (userSet.size !== correctSet.size) return false;
      for (const ans of userSet) {
        if (!correctSet.has(ans)) return false;
      }
      return true;
    } else {
      return (
        cleanString(String(userAnswer)) === cleanString(String(correctAnswer))
      );
    }
  }

  function cleanString(str: string): string {
    return str
      .normalize("NFKC")
      .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero width spaces and BOM
      .trim()
      .toLowerCase();
  }

  const handleRetake = () => {
    router.push("/type/non-professional");
  };

  return (
    <div className="p-4 max-w-xl mx-auto flex gap-2 flex-col">
      <div>
        <h1 className="text-2xl font-bold mb-4 text-center">Exam Results</h1>
        <p className="text-lg text-center mb-6">
          Your Score:{" "}
          {
            (score = examQuestions.reduce((acc, question, i) => {
              if (isAnswerCorrect(userAnswers[i], question.answer)) {
                return acc + 1;
              }
              return acc;
            }, 0))
          }{" "}
          / {examQuestions.length}
        </p>

        {examQuestions.map((q, i) => {
          const correct = isAnswerCorrect(userAnswers[i], q.answer);
          return (
            <div key={i} className="mb-4 border p-3 rounded">
              <p className="font-semibold">
                Q{i + 1}: {q.question}
              </p>
              <p>
                <strong>Your Answer:</strong>{" "}
                {Array.isArray(userAnswers[i])
                  ? userAnswers[i].join(", ")
                  : userAnswers[i]}
              </p>
              <p>
                <strong>Correct Answer:</strong>{" "}
                {Array.isArray(q.answer) ? q.answer.join(", ") : q.answer}
              </p>
              <p
                className={`font-semibold ${
                  correct ? "text-green-600" : "text-red-600"
                }`}
              >
                {correct ? "Correct" : "Incorrect"}
              </p>
            </div>
          );
        })}

        <p
          className={`text-xl mt-6 font-semibold text-center ${
            score >= Math.ceil(examQuestions.length * 0.75)
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {score >= Math.ceil(examQuestions.length * 0.75)
            ? "Congratulations! You passed!"
            : "You did not pass. Please try again."}
        </p>
      </div>

      <Button onClick={handleRetake} className="w-full">
        Retake
      </Button>
    </div>
  );
}
