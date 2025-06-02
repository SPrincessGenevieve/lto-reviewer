"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function MenuTab() {
  const pathname = usePathname();
  return (
    <div className="w-full text-white border shadow-black p-4 border-red-950 bg-gradient-to-l from-[#02002c]  to-[#030044]">
      <div className="flex gap-2">
        <Link href={"/"}>Menu</Link>
        <ChevronRight></ChevronRight>
        <Link href={"/type/review"}>Review</Link>

        <ChevronRight
          className={`${pathname.includes("exam") ? "" : "hidden"}`}
        ></ChevronRight>

        <Link
          href={pathname.includes("exam") ? "/type/review/exam" : ""}
        >
          {pathname.includes("exam") && "Exam"}
        </Link>

        <ChevronRight
          className={`${pathname.includes("results") ? "" : "hidden"}`}
        ></ChevronRight>

        {pathname.includes("results") ? (
          <Link
            href={
              pathname.includes("results") ? "/type/review/exam" : ""
            }
          >
            {pathname.includes("results") && "Results"}
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
