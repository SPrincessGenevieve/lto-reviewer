"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Landscape from "@/images/landscape.png";
import FaceDetectionCamera from "./type/camera/page";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();

  const navReview = () => {
    router.push("/type/review");
  };

  return (
    <div className="relative w-full h-full gap-2 flex flex-col justify-between items-center">
      <div className="w-full h-full flex gap-8 flex-col justify-center items-center z-10">
        <div className="w-full flex flex-col justify-center items-center">
          <Label className="text-4xl font-sans text-white">
            Land Transportation Office Reviewer
          </Label>
          <Label className="text-3xl font-sans text-white">
            Professional | Non-professional
          </Label>
          <Label className="mt-4 font-light text-white w-full max-w-[600px] text-center">
            LTO Reviewer is designed to help you study smarter and succeed. With
            realistic practice questions, updated formats, and helpful visuals,
            you’ll feel confident walking into your exam.
          </Label>
        </div>
        <Button
          onClick={navReview}
          className="h-10 w-[300px] bg-transparent hover:bg-red-900 border border-red-950 bg-gradient-to-l from-blue-transparent  to-red-700"
        >
          Review
        </Button>
      </div>

      {/* <div className="w-full gap-4 z-20 h-full max-h-[400px] flex flex-col justify-center items-center">
        <Label className="text-4xl font-sans text-white">LTO Reviewer</Label>
        <div className="w-full max-w-[400px] p-4 flex flex-col gap-2">
          <Button
            onClick={navNonProf}
            className="h-10 bg-transparent hover:bg-blue-600 border border-blue-500 bg-gradient-to-l from-blue-transparent  to-[#00a2ff]"
          >
            Non-professional
          </Button>
          <Button
            onClick={navProf}
            className="h-10 bg-transparent hover:bg-blue-600 border border-blue-500 bg-gradient-to-l from-blue-transparent  to-[#00a2ff]"
          >
            Professional
          </Button>
        </div>
      </div> */}
      <div
        className="w-full h-full absolute z-0" // set desired height!
        style={{
          backgroundImage: `url(${Landscape.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );
}
