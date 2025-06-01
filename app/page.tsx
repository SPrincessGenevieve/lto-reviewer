"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const navProf = () => {
    router.push("/type/professional");
  };

  const navNonProf = () => {
    router.push("/type/non-professional");
  };

  return (
    <div className="w-full h-full gap-2 flex flex-col justify-center items-center">
      <Label className="text-2xl">LTO Reviewer</Label>
      <div className="w-full max-w-[400px] flex flex-col gap-2">
        <Button onClick={navNonProf}>Non-professional</Button>
        <Button onClick={navProf}>Professional</Button>
      </div>
    </div>
  );
}
