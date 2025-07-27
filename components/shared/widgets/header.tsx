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
    <div className="flex items-center justify-between gap-3">
      <p className="text-2xl font-medium">{headerTitle}</p>
      <ChevronLeft
        className="text-primary cursor-pointer"
        onClick={() => router.back()}
      />
    </div>
  );
};
