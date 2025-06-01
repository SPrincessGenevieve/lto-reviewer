"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import MenuTab from "@/components/ui/menu";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useUserContext } from "@/app/context/UserContext";

export default function NonProfessional() {
  const router = useRouter();
  const { isNonProfViolated, setUserDetails } = useUserContext();

  const handleStartExam = () => {
    router.push("/type/non-professional/exam");
  };

  const handleViolation = () => {
    setUserDetails({
      isNonProfViolated: false,
    });
  };
  return (
    <div>
      <MenuTab></MenuTab>
      <div className="w-full p-4 flex flex-col justify-center items-center gap-4">
        <Dialog open={isNonProfViolated === true && true}>
          <DialogContent>
            <DialogTitle className="flex gap-2">
              <AlertTriangle color="red"></AlertTriangle>
              <p className="text-red-500">Warning</p>{" "}
            </DialogTitle>
            <p className="text-justify">
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
                This examination consists of 100 multiple-choice questions that
                will assess your knowledge and understanding.
                <br></br>
                <br></br>
                Please read each question carefully and choose the most
                appropriate answer. You will be given 1 hour and 30 minutes to
                complete the exam. Ensure you manage your time wisely.
              </div>
              <div>
                <div className="flex gap-2 items-center font-semibold text-yellow-500">
                  <AlertTriangle size={20}></AlertTriangle>{" "}
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
                      The exam consists of 60 items, and a minimum passing score
                      is 75%.
                    </li>
                  </ul>
                </div>
              </div>
            </CardDescription>
          </CardContent>
        </Card>
        <Button onClick={handleStartExam} className="w-full">
          Take Exam
        </Button>
      </div>
    </div>
  );
}
