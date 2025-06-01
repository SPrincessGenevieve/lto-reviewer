"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useUserContext } from "@/app/context/UserContext";
import { Label } from "@/components/ui/label";

export default function NonProfessional() {
  const router = useRouter();
  const { isNonProfViolated, nonProfLevel, setUserDetails } = useUserContext();
  const [level, setLevel] = useState("easy");
  const handleStartExam = () => {
    router.push("/type/non-professional/exam");
  };

  const handleViolation = () => {
    setUserDetails({
      isNonProfViolated: false,
    });
  };

  useEffect(() => {
    setUserDetails({
      nonProfLevel: level,
    });
  }, [level]);

  return (
    <div className="w-full flex flex-col justify-center items-center z-40">
      <div className="w-full max-w-3xl p-4 flex flex-col justify-center items-center gap-4">
        <Dialog open={isNonProfViolated === true && true}>
          <DialogContent className="w-full">
            <DialogTitle></DialogTitle>
            <div className="w-full flex flex-col justify-center items-center">
              <AlertTriangle size={70} color="red"></AlertTriangle>
              <Label className="text-red-500 font-bold text-[30px]">
                Warning
              </Label>
            </div>
            <p>
              You have violated the exam rules. This exam session will be
              cancelled. You may retake the exam at a later time.
            </p>
            <div className="flex w-full justify-end">
              <Button onClick={handleViolation}>Continue</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Card className="rounded-none">
          <CardContent className="">
            <CardTitle>
              Written Examination Introduction – LTO Non-Professional
            </CardTitle>
            <CardDescription className="text-justify flex flex-col gap-4">
              <div>
                <br></br>
                Please read each question carefully and choose the most
                appropriate answer. You will be given {nonProfLevel === "easy" ? "1 hour" : "1 hour and 30 minutes"} to
                complete the exam. Ensure you manage your time wisely.
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center font-semibold text-orange-600">
                  <AlertTriangle size={18}></AlertTriangle>{" "}
                  <p>Reminder before you begin.</p>
                </div>
                <div>
                  <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                    <li>
                      The exam will be automatically terminated if you switch or
                      open a new browser tab.
                    </li>
                    <li>
                      After completing the exam, please review your answers
                      carefully before submitting.
                    </li>
                    <li>
                      The exam consists of {nonProfLevel === "hard" ? "100" : "60"} items, and a minimum passing
                      score is 75%.
                    </li>
                  </ul>
                </div>
              </div>
            </CardDescription>
          </CardContent>
        </Card>
        <ToggleGroup
          type="single"
          value={level}
          onValueChange={(val) => {
            if (val) setLevel(val);
          }}
          className="inline-flex rounded-md bg-gray-100 p-1"
        >
          <ToggleGroupItem
            value="easy"
            aria-label="Easy"
            className="px-4 rounded-md text-sm font-medium
          data-[state=on]:bg-red-500 data-[state=on]:text-white"
          >
            Easy
          </ToggleGroupItem>
          <ToggleGroupItem
            value="hard"
            aria-label="Hard"
            className="px-4 rounded-md text-sm font-medium
          data-[state=on]:bg-red-500 data-[state=on]:text-white"
          >
            Hard
          </ToggleGroupItem>
        </ToggleGroup>
        <Button onClick={handleStartExam} className="w-full">
          Take Exam
        </Button>
      </div>
    </div>
  );
}
