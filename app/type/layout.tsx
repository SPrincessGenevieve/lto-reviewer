import "@/app/globals.css";
import MenuTab from "@/components/ui/menu";

export default function TypeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative w-full h-full">
      <div className="fixed top-0 w-full h-[10%] z-50">
        <MenuTab></MenuTab>
      </div>
      <div className="w-full h-full p-[50px]">
        {children}
      </div>
      {/* <div className="w-full h-[90%] mt-[100px] header">{children}</div> */}
    </div>
  );
}
