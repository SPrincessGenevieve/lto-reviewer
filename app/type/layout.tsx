"use client";
import "@/app/globals.css";
import MenuTab from "@/components/ui/menu";
import { usePathname } from "next/navigation";

export default function TypeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    // overflow-hidden
    // {pathname.includes("results") && "Results"}
    <div
      className={`relative w-full h-full  ${
        pathname.includes("results") ? "" : "overflow-hidden"
      }`}
    >
      <div className="fixed top-0 w-full h-[10%] z-50">
        <MenuTab></MenuTab>
      </div>
      <div className="w-full h-full p-2 mt-[40px]">{children}</div>
      {/* <div className="w-full h-[90%] mt-[100px] header">{children}</div> */}
    </div>
  );
}
