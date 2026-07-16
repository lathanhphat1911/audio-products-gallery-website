"use client";

import { useState } from "react";
import { X, Music, Calendar, MapPin, Send, Zap, CheckCircle2 } from "lucide-react";

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  location: string;
  date: string;
  time: string;
  genre: string;
  notes: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1); // 1: form, 2: success ticket
  const [form, setForm] = useState<BookingForm>({
    name: "",
    phone: "",
    email: "",
    location: "Hà Nội - 88 Hai Bà Trưng",
    date: "",
    time: "10:00",
    genre: "Jazz & Vocal",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert("Vui lòng điền họ tên và số điện thoại!");
      return;
    }
    setStep(2);
  };

  const reset = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      location: "Hà Nội - 88 Hai Bà Trưng",
      date: "",
      time: "10:00",
      genre: "Jazz & Vocal",
      notes: ""
    });
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xs"
        onClick={reset}
      ></div>

      {/* Modal */}
      <div className="relative bg-zinc-950 border border-zinc-800 max-w-lg w-full rounded-3xl p-6 md:p-8 shadow-2xl z-10 animate-[slideDown_0.3s_ease-out]">
        {/* Close Button */}
        <button
          onClick={reset}
          className="absolute top-4 right-4 p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          // Form Step
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col gap-1.5 border-b border-zinc-900 pb-3 mb-1">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-black text-white">Đăng Ký Phòng Nghe Thử Hi-End</h3>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Vui lòng điền thông tin để chúng tôi sắp xếp phòng nghe riêng tư.
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="0909123456"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-400 font-bold uppercase">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-400 font-bold uppercase">Địa điểm *</label>
              <select
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500"
              >
                <option value="Hà Nội - 88 Hai Bà Trưng">Hà Nội - 88 Hai Bà Trưng</option>
                <option value="TP.HCM - 124 Nguyễn Thị Minh Khai">TP.HCM - 124 Nguyễn Thị Minh Khai</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase">Ngày *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-400 font-bold uppercase">Giờ *</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500"
                >
                  <option value="09:00">09:00 - 10:30</option>
                  <option value="10:00">10:00 - 12:00</option>
                  <option value="14:00">14:00 - 15:30</option>
                  <option value="15:00">15:00 - 17:00</option>
                  <option value="17:00">17:00 - 18:30</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-zinc-400 font-bold uppercase">Thể loại âm nhạc</label>
              <select
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className="bg-zinc-900 border border-zinc-800 text-zinc-200 px-3.5 py-2.5 rounded-xl text-xs focus:border-amber-500"
              >
                <option value="Jazz & Vocal">Jazz, Vocal ngọt ngào</option>
                <option value="Classical">Cổ điển, Giao hưởng</option>
                <option value="Pop">Nhạc trẻ Pop, Ballad</option>
                <option value="Rock">Rock, Metal mạnh mẽ</option>
                <option value="Dolby Atmos">Xem phim Dolby Atmos</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950 font-black text-sm rounded-xl shadow-lg"
            >
              XÁC NHẬN ĐĂNG KÝ
            </button>
          </form>
        ) : (
          // Success Step
          <div className="flex flex-col items-center justify-center text-center gap-6 py-6">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-black text-white">Đăng Ký Thành Công!</h3>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mx-auto">
                Chuyên viên sẽ liên hệ xác nhận trong vòng 10 phút.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3 text-left">
              <div className="border-b border-dashed border-zinc-800 pb-3 flex justify-between text-[10px] font-mono text-zinc-500">
                <span>MÃ VÉ: ARS-{(Math.floor(Math.random() * 9000) + 1000)}</span>
                <span className="text-amber-500 font-bold">VÉ VIP</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Khách hàng</span>
                  <strong className="text-white">{form.name}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Điện thoại</span>
                  <strong className="text-white">{form.phone}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Thời gian</span>
                  <strong className="text-white">{form.date} ({form.time})</strong>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Địa điểm</span>
                  <strong className="text-white">{form.location.split(" - ")[0]}</strong>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                  <Zap className="w-3 h-3" /> FREE PASS
                </span>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={reset}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl transition-all"
              >
                Đóng
              </button>
              <a
                href="https://zalo.me"
                target="_blank"
                className="flex-1 py-3 bg-amber-500 text-zinc-950 font-black text-xs rounded-xl text-center shadow-lg"
              >
                Chat Zalo
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}