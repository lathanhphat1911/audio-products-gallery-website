"use client";

import { Trash2, ShoppingCart, X } from "lucide-react";

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    category?: string;
  };
  quantity: number;
  selectedColor?: string;
}

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (index: number) => void;
  onUpdateQuantity: (index: number, change: number) => void;
  total: number;
}

export default function ShoppingCartDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
  onUpdateQuantity,
  total
}: ShoppingCartDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 text-zinc-100 flex flex-col shadow-2xl animate-[slideIn_0.3s_ease-out]">
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-white">Giỏ Hàng Của Bạn</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
            {items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedColor || index}`}
                  className="bg-zinc-900/40 border border-zinc-900 p-3.5 rounded-xl flex gap-4 items-center justify-between"
                >
                  <div className="p-2.5 bg-zinc-950 rounded-lg border border-zinc-850 flex-shrink-0">
                    <span className="text-lg">🎧</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                    {item.selectedColor && (
                      <span className="text-[10px] text-zinc-500 font-mono">Màu: {item.selectedColor}</span>
                    )}
                    <p className="text-xs font-black text-amber-500 mt-1">
                      {item.product.price.toLocaleString("vi-VN")}₫
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-zinc-950 rounded-lg border border-zinc-800 p-1">
                      <button
                        onClick={() => onUpdateQuantity(index, -1)}
                        className="w-5 h-5 flex items-center justify-center text-xs text-zinc-400 hover:text-white font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs px-2 text-white font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, 1)}
                        className="w-5 h-5 flex items-center justify-center text-xs text-zinc-400 hover:text-white font-bold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemove(index)}
                      className="p-1 text-zinc-600 hover:text-red-500 transition-all"
                      title="Xóa khỏi giỏ hàng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                <div className="p-4 bg-zinc-900 rounded-full text-zinc-600">
                  <ShoppingCart className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Giỏ hàng rỗng</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[200px] leading-relaxed mx-auto">
                    Bạn chưa thêm bất kỳ thiết bị âm thanh nào vào giỏ hàng. Hãy lướt xem bộ sưu tập của chúng tôi!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl"
                >
                  Khám phá ngay
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-zinc-900 bg-zinc-950 flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-zinc-400">Tổng cộng:</span>
                <span className="text-lg font-black text-amber-500">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {}}
                  className="px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  Xóa Hết
                </button>
                <button
                  onClick={() => {
                    alert("Cảm ơn bạn đã đặt hàng! AuraSound sẽ liên hệ xác nhận thông tin đơn hàng trong 5 phút.");
                    onClose();
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950 font-extrabold text-xs rounded-xl text-center shadow-lg"
                >
                  Tiến Hành Đặt Mua (Giao Miễn Phí)
                </button>
              </div>
              <span className="text-[10px] text-zinc-600 text-center">
                Miễn phí vận chuyển & Hỗ trợ trả góp 0% khi thanh toán trực tuyến
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}