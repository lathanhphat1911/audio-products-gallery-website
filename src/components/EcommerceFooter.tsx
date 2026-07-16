"use client";

import { Headphones, MapPin, Phone, Mail, CreditCard, Shield, Truck, Clock, Award } from "lucide-react";

export default function EcommerceFooter() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 pt-12 xs:pt-16 pb-8 xs:pb-12 text-zinc-700 dark:text-zinc-400 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 md:px-6 grid grid-cols-1 md:grid-cols-12 gap-6 xs:gap-8 mb-8 xs:mb-12">

        {/* Company Info - Column 1 */}
        <div className="md:col-span-4 flex flex-col gap-4 xs:gap-6">
          <a href="#" className="flex items-center gap-1.5 xs:gap-2 self-start">
            <div className="w-8 xs:w-9 h-8 xs:w-9 rounded-xl bg-amber-600 dark:bg-amber-500 flex items-center justify-center shadow-md">
              <Headphones className="w-4 h-4 text-zinc-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg xs:text-xl font-extrabold tracking-wider text-zinc-900 dark:text-white">THÀNH NAM AUDIO</span>
              <span className="hidden xs:inline-block text-[8px] xs:text-[9px] text-amber-600 dark:text-amber-500 tracking-[0.15em] xs:tracking-[0.2em] uppercase font-bold -mt-0.5">Hi-Fi Reference</span>
            </div>
          </a>

          <p className="text-[10px] xs:text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Thành Nam Audio tự hào là nhà phân phối thiết bị âm thanh Hi-End, Hi-Fi hàng đầu Việt Nam.
          </p>

          <div className="flex flex-col gap-2 xs:gap-3 text-[10px] xs:text-xs">
            <div className="flex items-start gap-2 xs:gap-3">
              <MapPin className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 dark:text-white">Hà Nội:</strong> Số 88 Hai Bà Trưng, Quận Hoàn Kiếm
              </div>
            </div>
            <div className="flex items-center gap-2 xs:gap-3">
              <Phone className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-amber-600 dark:text-amber-500" />
              <span>1900.88.99.99 - 0909.123.456</span>
            </div>
            <div className="flex items-center gap-2 xs:gap-3">
              <Mail className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-amber-600 dark:text-amber-500" />
              <span>contact@aurasound.vn</span>
            </div>
          </div>
        </div>

        {/* Products - Column 2 */}
        <div className="md:col-span-2 flex flex-col gap-3 xs:gap-4">
          <h4 className="text-xs xs:text-sm font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">Sản Phẩm</h4>
          <ul className="flex flex-col gap-1.5 xs:gap-2.5 text-[10px] xs:text-xs">
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Tai nghe chụp tai</a></li>
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Loa bluetooth</a></li>
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Soundbar</a></li>
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Amply đèn</a></li>
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">DAC</a></li>
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Phụ kiện</a></li>
          </ul>
        </div>

        {/* Services - Column 3 */}
        <div className="md:col-span-2 flex flex-col gap-3 xs:gap-4">
          <h4 className="text-xs xs:text-sm font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">Dịch Vụ</h4>
          <ul className="flex flex-col gap-1.5 xs:gap-2.5 text-[10px] xs:text-xs">
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Bảo hành 24 tháng</a></li>
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Đổi trả 30 ngày</a></li>
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Giao hàng 2 giờ</a></li>
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Trả góp 0%</a></li>
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Nghe thử tại nhà</a></li>
            <li><a href="#" className="hover:text-amber-600 dark:hover:text-amber-500 transition-colors">Hướng dẫn mua hàng</a></li>
          </ul>
        </div>

        {/* Support - Column 4 */}
        <div className="md:col-span-3 flex flex-col gap-3 xs:gap-4">
          <h4 className="text-xs xs:text-sm font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">Hỗ Trợ</h4>
          <ul className="flex flex-col gap-2 xs:gap-3 text-[10px] xs:text-xs">
            <li className="flex items-start gap-1.5 xs:gap-2">
              <Phone className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 dark:text-white block">Gọi mua hàng:</strong>
                <span className="text-amber-600 dark:text-amber-500 font-bold">1900.88.99.99</span> (Miễn phí)
              </div>
            </li>
            <li className="flex items-start gap-1.5 xs:gap-2">
              <Shield className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 dark:text-white block">Khiếu nại:</strong>
                <span>1900.88.99.99 (Phím 2)</span>
              </div>
            </li>
            <li className="flex items-start gap-1.5 xs:gap-2">
              <Clock className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-900 dark:text-white block">Bảo hành:</strong>
                <span>1900.88.99.99 (Phím 3)</span>
              </div>
            </li>
          </ul>
        </div>

        

      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 md:px-6 pt-6 xs:pt-8 border-t border-gray-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-3 xs:gap-4 text-[9px] xs:text-[10px] text-zinc-600 dark:text-zinc-400">
        <p>© 2026 Thành Nam Audio Premium Co., Ltd. Bảo lưu mọi quyền.</p>
        <div className="flex gap-4 xs:gap-6">
          <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">Điều khoản</a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">Bảo mật</a>
          <a href="#" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}