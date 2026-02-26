"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { Clock7, LayoutGrid, Cog } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Props {
  className?: string;
}

const navItems = [
  { path: "/", label: "Сегодня", icon: Clock7 },
  { path: "/services", label: "Сервисы", icon: LayoutGrid },
  { path: "/settings", label: "Настройки", icon: Cog },
];

export const BottomNavigation: React.FC<Props> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveIndex = () => {
    const index = navItems.findIndex((item) =>
      item.path === "/" ? pathname === item.path : pathname.includes(item.path)
    );
    return index === -1 ? 0 : index;
  };

  const [activeIndex, setActiveIndex] = useState(getActiveIndex());

  useEffect(() => {
    setActiveIndex(getActiveIndex());
  }, [pathname]);

  const handleNavClick = (index: number) => {
    setActiveIndex(index);
    router.push(navItems[index].path);
  };

  // Обработка свайпов влево/вправо
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 30; // сила свайпа для переключения
    if (info.offset.x < -swipeThreshold && activeIndex < navItems.length - 1) {
      // Свайп влево -> следующий пункт
      handleNavClick(activeIndex + 1);
    } else if (info.offset.x > swipeThreshold && activeIndex > 0) {
      // Свайп вправо -> предыдущий пункт
      handleNavClick(activeIndex - 1);
    }
  };

  return (
    <nav
      className={cn(
        "fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4",
        className
      )}
    >
      <motion.div
        className="
          relative flex items-center justify-between w-full max-w-[340px]
          rounded-[3rem] p-[6px]
          bg-white/70 dark:bg-[#121212]/85
          backdrop-blur-[24px] saturate-[1.5]
          border border-black/5 dark:border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          overflow-hidden touch-none
        "
        onPanEnd={handleDragEnd}
      >
        {navItems.map(({ path, label, icon: Icon }, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={path}
              onClick={() => handleNavClick(idx)}
              className={cn(
                "relative z-10 flex flex-col items-center justify-center gap-[2px] py-2 rounded-[2.5rem] cursor-pointer",
                "w-1/3" // чтобы элементы были одинаковой ширины
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-[2.5rem] -z-10"
                  style={{
                    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 0 0 1px rgba(0,0,0,0.02)"
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}

              <Icon
                size={24}
                className={cn(
                  "transition-all duration-300 ease-out",
                  isActive
                    ? "text-primary drop-shadow-[0_0_8px_rgba(74,222,128,0.4)] scale-105"
                    : "text-gray-500 hover:text-gray-700 dark:text-white/60 dark:hover:text-white/80"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[11px] font-semibold tracking-wide transition-all duration-300 ease-out",
                  isActive
                    ? "text-primary drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                    : "text-gray-500 dark:text-white/60"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </motion.div>
    </nav>
  );
};
