import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { X, Play, Pause } from "lucide-react";
import { useStories } from "@/store/useStories";
import { defaultStories } from "@/lib/data";

export const StoriesGallery = () => {
  const { isOpen, setOpen } = useStories();
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);
  const touchStartRef = useRef(null);
  const carouselApiRef = useRef(null);

  const storyData = defaultStories;

  useEffect(() => {
    if (isOpen) {
      setCurrentStory(0);
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setProgress(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isOpen]);

  // Следующая история
  const nextStory = () => {
    if (currentStory < storyData.length - 1) {
      setCurrentStory(currentStory + 1);
      setProgress(0);
      carouselApiRef.current?.scrollNext();
    } else {
      setOpen();
    }
  };

  // Предыдущая история
  const prevStory = () => {
    if (currentStory > 0) {
      setCurrentStory(currentStory - 1);
      setProgress(0);
      carouselApiRef.current?.scrollPrev();
    }
  };

  // Пауза/воспроизведение
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Обработка прогресса
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const currentDuration = storyData[currentStory]?.duration || 5000;
    const increment = 100 / (currentDuration / 100);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + increment;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentStory, isPlaying, isOpen]);

  // Обработка клика по области истории
  const handleStoryClick = (e, side) => {
    e.stopPropagation();
    if (side === "left") {
      prevStory();
    } else {
      nextStory();
    }
  };

  // Touch handlers для мобильных устройств
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextStory();
      } else {
        prevStory();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Размытый фон */}
      <div className="absolute inset-0">
        <img
          src={storyData[currentStory]?.image}
          alt=""
          className="w-full h-full object-cover filter blur-lg scale-110 opacity-20"
        />
      </div>

      {/* Прогресс-бары */}
      <div className="absolute top-6 left-6 right-6 flex space-x-1 z-30">
        {storyData.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white transition-all duration-100"
              style={{
                width:
                  index === currentStory
                    ? `${progress}%`
                    : index < currentStory
                    ? "100%"
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Заголовок и управление */}
      <div className="absolute top-12 left-6 right-6 flex items-start justify-between z-30">
        <div className="flex-1 pr-4">
          <h2 className="text-white font-semibold text-xl leading-tight">
            {storyData[currentStory]?.title}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {storyData[currentStory]?.description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlayPause}
            className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="w-full h-full flex items-center justify-center px-4">
        <Carousel
          className="w-full max-w-sm h-[80vh]"
          opts={{
            align: "center",
            loop: false,
          }}
          setApi={carouselApiRef.current}
        >
          <CarouselContent className="h-full">
            {storyData.map((story, index) => (
              <CarouselItem key={story.id} className="h-full">
                <Card className="h-full border-0 bg-transparent">
                  <CardContent
                    className="relative h-full p-0 overflow-hidden rounded-2xl"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Область для клика - весь экран переключает на следующую историю */}
                    <div
                      className="absolute inset-0 z-20 cursor-pointer"
                      onClick={handleStoryClick}
                    />

                    {/* Изображение */}
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Кнопки навигации - скрыты по умолчанию, показываем только на десктопе при ховере */}
          <div className="hidden md:block">
            <CarouselPrevious
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 border-white/20 text-white hover:bg-black/40 hover:text-white opacity-0 hover:opacity-100 transition-opacity duration-300"
              onClick={prevStory}
            />
            <CarouselNext
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 border-white/20 text-white hover:bg-black/40 hover:text-white opacity-0 hover:opacity-100 transition-opacity duration-300"
              onClick={nextStory}
            />
          </div>
        </Carousel>
      </div>

      {/* Индикатор внизу */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-2">
          {storyData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStory ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
