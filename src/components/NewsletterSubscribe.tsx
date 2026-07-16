"use client";

import { Send, CheckCircle2 } from "lucide-react";

export default function NewsletterSubscribe() {
  return (
    <section className="relative py-24 bg-zinc-950 border-t border-zinc-900 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center text-center gap-6 mb-12">
          <span className="text-xs text-amber-500 font-extrabold uppercase tracking-widest">Đăng ký nhận tin</span>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Nhận Cẩm Nang Audiophile & Ưu Đãi <span className="text-amber-500">10%</span>
          </h2>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-white mb-4">Đăng Ký Bản Tin Ngay</h3>

          <form onSubmit={(e) => {
            e.preventDefault();
            alert("Cảm ơn bạn đã đăng ký! Ebook và mã giảm giá đã được gửi vào hòm thư.");
          }} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn..."
              required
              className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-100 px-4 py-3.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 transition-all placeholder-zinc-600"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Gửi Đăng Ký
            </button>
          </form>

          <p className="text-[10px] text-zinc-600 mt-3 italic leading-relaxed">
            Chúng tôi cam kết bảo mật thông tin tuyệt đối và không gửi spam thư quảng cáo quá 1 lần/tuần.
          </p>

          <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span className="text-xs text-zinc-300 font-semibold">Tặng Ebook "Cẩm nang phối ghép Amply Đèn & Loa Cột"</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span className="text-xs text-zinc-300 font-semibold">Mã giảm giá 10% (Tối đa 1.000.000đ)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span className="text-xs text-zinc-300 font-semibold">Cập nhật sớm nhất các sản phẩm giới hạn</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}