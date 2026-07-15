"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { Clock7, LayoutGrid, Cog, BookOpenText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";

interface Props {
  className?: string;
}

const navItems = [
  { path: "/", label: "Сегодня", icon: Clock7 },
  { path: "/hadiths", label: "Лучи", icon: BookOpenText },
  { path: "/services", label: "Сервисы", icon: LayoutGrid },
  { path: "/settings", label: "Настройки", icon: Cog },
];

const spring = { type: "spring" as const, stiffness: 500, damping: 32 };

export const BottomNavigation: React.FC<Props> = ({ className }) => {
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const getActiveIndex = () => {
    const index = navItems.findIndex((item) =>
      item.path === "/" ? pathname === item.path : pathname.includes(item.path)
    );
    return index === -1 ? 0 : index;
  };

  const [activeIndex, setActiveIndex] = useState(getActiveIndex());
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [itemWidth, setItemWidth] = useState(0);

  // Позиция капли по X и её "жидкая" деформация при перетаскивании
  const x = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const skewX = useMotionValue(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const styles = getComputedStyle(el);
      const paddingX =
        parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      setItemWidth((el.offsetWidth - paddingX) / navItems.length);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActiveIndex(getActiveIndex());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!itemWidth) return;
    setDragIndex(null);
    animate(x, activeIndex * itemWidth, spring);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, itemWidth]);

  const navigateTo = (index: number) => {
    setActiveIndex(index);
    router.push(navItems[index].path);
  };

  const nearestIndex = () => {
    if (!itemWidth) return activeIndex;
    return Math.min(
      navItems.length - 1,
      Math.max(0, Math.round(x.get() / itemWidth))
    );
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (!itemWidth) return;
    setDragIndex(nearestIndex());

    // Упругая деформация капли в сторону движения пальца
    const v = info.velocity.x;
    scaleX.set(Math.min(1.35, 1 + Math.abs(v) / 6000));
    skewX.set(Math.max(-10, Math.min(10, -v / 80)));
  };

  const handleDragEnd = () => {
    animate(scaleX, 1, spring);
    animate(skewX, 0, spring);
    navigateTo(nearestIndex());
  };

  const highlightIndex = dragIndex ?? activeIndex;

  return (
    <nav
      className={cn(
        "fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4",
        className
      )}
    >
      <div
        ref={containerRef}
        className="
          relative flex items-center justify-between w-full max-w-[380px]
          rounded-[3rem] p-[6px]
          bg-white/70 dark:bg-[#121212]/85
          backdrop-blur-[24px] saturate-[1.5]
          border border-black/5 dark:border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          overflow-hidden
        "
      >
        {itemWidth > 0 && (
          <motion.div
            drag="x"
            dragConstraints={{
              left: 0,
              right: itemWidth * (navItems.length - 1),
            }}
            dragElastic={0.15}
            dragMomentum={false}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ x, scaleX, skewX, width: itemWidth }}
            className="absolute top-[6px] bottom-[6px] left-[6px] z-20 touch-none cursor-grab rounded-[2.5rem] bg-black/5 active:cursor-grabbing dark:bg-white/10"
            transition={spring}
          />
        )}

        {navItems.map(({ path, label, icon: Icon }, idx) => {
          const isActive = idx === highlightIndex;
          return (
            <div
              key={path}
              onClick={() => navigateTo(idx)}
              style={{ width: itemWidth || undefined }}
              className="relative z-10 flex flex-col items-center justify-center gap-[2px] py-2 rounded-[2.5rem] cursor-pointer"
            >
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
      </div>
    </nav>
  );
};
