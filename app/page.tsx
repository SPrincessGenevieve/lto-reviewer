"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Landscape from "@/images/landscape.png";

export default function Home() {
  const router = useRouter();

  const navProf = () => {
    router.push("/type/professional");
  };

  const navNonProf = () => {
    router.push("/type/non-professional");
  };

  return (
    <div className="relative w-full h-full gap-2 flex flex-col justify-between items-center">
      <div className="w-full gap-4 z-20 h-full max-h-[400px] flex flex-col justify-center items-center bg-gradient-to-t from-blue-transparent  to-[#00a2ff]">
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
      </div>
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
