"use client";

import { Truck, ShieldCheck, RefreshCw, CreditCard, Award } from "lucide-react";

const BENEFITS = [
  {
    id: 1,
    icon: Truck,
    title: "Giao hàng hỏa tốc 2h",
    description: "Nội thành Hà Nội, TP.HCM",
    color: "text-emerald-500 dark:text-emerald-400"
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Bảo hành chính hãng 24 tháng",
    description: "Tới tận nơi, không cần mang ra trung tâm",
    color: "text-amber-500 dark:text-amber-400"
  },
  {
    id: 3,
    icon: RefreshCw,
    title: "Lỗi 1 đổi 1 trong 30 ngày",
    description: "Hỗ trợ đổi sản phẩm mới",
    color: "text-blue-500 dark:text-blue-400"
  },
  {
    id: 4,
    icon: CreditCard,
    title: "Trả góp 0%",
    description: "Lãi suất 0% qua thẻ tín dụng",
    color: "text-purple-500 dark:text-purple-400"
  },
  {
    id: 5,
    icon: Award,
    title: "Cam kết chính hãng",
    description: "Hoàn tiền 100% nếu hàng nhái",
    color: "text-red-500 dark:text-red-400"
  }
];

export default function ServiceBenefits() {
  return (
    <section className="bg-white dark:bg-zinc-950 border-y border-gray-200 dark:border-zinc-800/50 py-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 xs:gap-3">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.id}
              className="flex items-center gap-2 xs:gap-3 p-2 xs:p-3 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all"
            >
              <div className={`p-1.5 xs:p-2 bg-zinc-100 dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 ${benefit.color}`}>
                <benefit.icon className="w-4 xs:w-5 h-4 xs:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[10px] xs:text-xs font-bold text-zinc-900 dark:text-white truncate">{benefit.title}</h3>
                <p className="text-[9px] xs:text-[10px] text-zinc-600 dark:text-zinc-400 truncate">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}