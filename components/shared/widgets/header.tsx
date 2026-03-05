"use client";
import { FC } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  headerTitle: string;
  className?: string;
}

export const Header: FC<Props> = ({ headerTitle, className }) => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 mb-2">
      <div
        onClick={() => router.back()}
        className="
          flex items-center justify-center w-10 h-10 rounded-full cursor-pointer
          bg-[#1c1c1e]/10 dark:bg-[#ffffff]/10
          backdrop-blur-[12px] saturate-[1.5]
          border border-black/5 dark:border-white/10
          shadow-sm transition-all duration-300
          hover:bg-[#1c1c1e]/20 dark:hover:bg-[#ffffff]/20 active:scale-95
        "
      >
        <ChevronLeft className="text-primary w-6 h-6 -ml-0.5" />
      </div>
      <p className="text-2xl font-semibold tracking-tight">{headerTitle}</p>
    </div>
  );
};
