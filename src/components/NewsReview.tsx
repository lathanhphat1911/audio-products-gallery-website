"use client";

import { useState, useEffect, useRef } from "react";
import { Music, Disc, Sliders, Play, Pause, Volume2 as VolumeIcon } from "lucide-react";
import { Headphones } from "lucide-react";

interface AudioVisualizerProps {
  isPlaying: boolean;
  preset: "reference" | "bass" | "vocal";
  onPresetChange: (preset: "reference" | "bass" | "vocal") => void;
  onPlayToggle: () => void;
}

// Audio Visualizer Component
function AudioVisualizer({ isPlaying, preset, onPresetChange, onPlayToggle }: AudioVisualizerProps) {
  const [heights, setHeights] = useState<number[]>(Array(24).fill(15));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      let minH = 10, maxH = 80, speed = 100;

      if (preset === "bass") {
        minH = 20; maxH = 95; speed = 70;
      } else if (preset === "vocal") {
        minH = 5; maxH = 65; speed = 130;
      }

      intervalRef.current = setInterval(() => {
        setHeights(Array(24).fill(0).map(() => Math.floor(Math.random() * (maxH - minH + 1)) + minH));
      }, speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setHeights(Array(24).fill(12));
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, preset]);

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-3 xs:p-4 flex flex-col gap-3 xs:gap-4">
      {/* Wave Visualizer */}
      <div className="h-28 xs:h-32 flex items-end justify-center gap-1 px-2 xs:px-4 border-y border-gray-200 dark:border-zinc-900/60 py-4 xs:py-6">
        {heights.map((height, idx) => (
          <div
            key={idx}
            className={`w-1.5 xs:w-2 md:w-3 rounded-full transition-all duration-100 ${
              preset === "reference"
                ? "bg-amber-600 dark:bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                : preset === "bass"
                  ? "bg-gradient-to-t from-red-600 to-amber-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                  : "bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 xs:gap-4">
        <div className="flex items-center gap-1.5 xs:gap-2">
          <Sliders className="w-3.5 xs:w-4 h-3.5 xs:w-4 text-amber-600 dark:text-amber-500" />
          <span className="text-[10px] xs:text-xs text-zinc-700 dark:text-zinc-300 font-semibold">Bộ lọc âm sắc:</span>
        </div>
        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-gray-300 dark:border-zinc-800">
          {(["reference", "bass", "vocal"] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPresetChange(p)}
              className={`px-2 xs:px-3 py-0.5 xs:py-1 text-[10px] xs:text-[11px] font-bold rounded-lg transition-all ${
                preset === p
                  ? "bg-amber-600 dark:bg-amber-500 text-white dark:text-zinc-950"
                  : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {p === "reference" ? "Studio" : p === "bass" ? "Bass" : "Vocal"}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onPlayToggle}
        className={`w-full py-2.5 xs:py-3 px-4 xs:px-6 rounded-xl font-bold text-xs xs:text-sm flex items-center justify-center gap-1.5 xs:gap-2 transition-all ${
          isPlaying
            ? "bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-gray-300 dark:border-zinc-700"
            : "bg-amber-600 hover:bg-amber-500 text-white dark:text-zinc-950 shadow-lg"
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 xs:w-4 h-3.5 xs:h-4" />
            Tạm Dừng
          </>
        ) : (
          <>
            <Play className="w-3.5 xs:w-4 h-3.5 xs:h-4" />
            Nghe Thử
          </>
        )}
      </button>
    </div>
  );
}

export default function NewsReview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [preset, setPreset] = useState<"reference" | "bass" | "vocal">("reference");

  const newsArticles = [
    {
      id: 1,
      title: "Review Tai Nghe Aura Studio Pro-X: Đỉnh cao audiophile",
      date: "15/06/2026",
      excerpt: "Chiếc tai nghe open-back mới của AuraSound mang lại âm trường tương đương loa hi-end triệu đô...",
      image: "🎧"
    },
    {
      id: 2,
      title: "Hướng dẫn chọn amply đèn cho người mới",
      date: "12/06/2026",
      excerpt: "Bóng đèn 300B có phải là lựa chọn đúng cho hệ thống của bạn? Cùng khám phá các tiêu chí...",
      image: "⚡"
    },
    {
      id: 3,
      title: "So sánh soundbar Dolby Atmos 2026",
      date: "10/06/2026",
      excerpt: "Aura Horizon Bar Duo nằm trong top 3 soundbar có thiết kế phối ghép tốt nhất năm nay...",
      image: "🔊"
    }
  ];

  return (
    <section id="news" className="bg-gradient-to-b from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 py-12 md:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-2 md:gap-3 mb-8 md:mb-12">
          <span className="text-[10px] xs:text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Tin tức & Review</span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
            Công Nghệ & Đánh Giá <span className="text-amber-600 dark:text-amber-500">Mới Nhất</span>
          </h2>
          <div className="w-12 md:w-16 h-1 bg-amber-600 dark:bg-amber-500 rounded-full mt-1"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* News Articles - Left Column */}
          <div className="lg:col-span-7 flex flex-col gap-4 md:gap-6">
            {newsArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 md:p-6 hover:border-amber-500/30 transition-all group"
              >
                <div className="flex gap-3 xs:gap-4">
                  <div className="w-12 xs:w-14 md:w-16 h-12 xs:h-14 md:h-16 bg-zinc-100 dark:bg-zinc-950 rounded-xl flex items-center justify-center text-2xl xs:text-3xl flex-shrink-0">
                    {article.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 xs:gap-3 text-[9px] xs:text-[10px] md:text-[11px] text-zinc-600 dark:text-zinc-400 mb-1.5 xs:mb-2">
                      <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 xs:px-2 py-0.5 rounded">{article.date}</span>
                      <span className="w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full"></span>
                      <span>Audio Review</span>
                    </div>
                    <h3 className="text-xs xs:text-sm md:text-lg font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-1.5 xs:mb-2">
                      {article.title}
                    </h3>
                    <p className="text-[10px] xs:text-xs md:text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Audio Visualizer - Right Column */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-50 dark:bg-zinc-900/20 rounded-xl xs:rounded-2xl p-3 xs:p-4 md:p-6 border border-gray-200 dark:border-zinc-800">
              <div className="flex items-center gap-1.5 xs:gap-2 mb-3 xs:mb-4">
                <Disc className="w-4 xs:w-5 h-4 xs:h-5 text-amber-600 dark:text-amber-500" />
                <h3 className="text-base xs:text-lg font-bold text-zinc-900 dark:text-white">Trải Nghiệm Âm Thanh</h3>
              </div>
              <p className="text-[9px] xs:text-xs text-zinc-600 dark:text-zinc-400 mb-3 xs:mb-4">
                Nghe thử mô phỏng âm sắc chất lượng cao từ AuraSound
              </p>
              <AudioVisualizer
                isPlaying={isPlaying}
                preset={preset}
                onPresetChange={setPreset}
                onPlayToggle={() => setIsPlaying(!isPlaying)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}