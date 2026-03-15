import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  NotebookText,
  ShieldAlert,
  RotateCcw,
  Save,
  GripVertical,
  ImagePlus,
  CalendarDays,
  Backpack,
  Eye,
  PencilLine,
  MapPin,
  Clock3,
  MessageCircleMore,
  Train,
  Footprints,
  Bus,
  Car,
  Wallet,
  Palette,
  Sparkles,
  Building2,
  Flower2,
  Landmark,
  Ticket,
  Star,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

/* ===============================
   設定
================================ */
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/* ===============================
   定数・ユーティリティ
================================ */
const STORAGE_KEY = "trip-booklet-app";

const uid = () => Math.random().toString(36).slice(2, 10);

const TRANSPORT_OPTIONS = [
  { value: "徒歩", label: "徒歩", icon: Footprints },
  { value: "電車", label: "電車", icon: Train },
  { value: "バス", label: "バス", icon: Bus },
  { value: "車", label: "車", icon: Car },
];

const THEMES = {
  natural: {
    name: "ナチュラル",
    icon: Flower2,
    appBg: "from-amber-50 via-stone-50 to-lime-50",
    sectionCard: "bg-white/85 border-stone-200",
    previewCard: "bg-white/90 border-stone-200",
    coverFallback: "from-amber-100 via-stone-50 to-lime-100",
    accentChip: "bg-lime-100 text-lime-800",
    softChip: "bg-amber-50 text-amber-700",
    memoBox: "bg-amber-50 text-neutral-700",
    transportChip: "bg-lime-50 text-lime-700",
    costChip: "bg-amber-50 text-amber-700",
    tabActive: "bg-neutral-900 text-white shadow-md",
    tabInactive:
      "border border-neutral-200 bg-white/80 text-neutral-700 hover:bg-white",
    heroTextNoPhoto: "text-neutral-900",
    heroSubNoPhoto: "text-neutral-500",
    heroBadgeNoPhoto: "border bg-white/80 text-neutral-700",
    dayPill: "bg-lime-50 text-lime-700",
  },
  city: {
    name: "シティ",
    icon: Building2,
    appBg: "from-slate-100 via-white to-zinc-100",
    sectionCard: "bg-white border-slate-200",
    previewCard: "bg-white border-slate-200",
    coverFallback: "from-slate-200 via-zinc-50 to-white",
    accentChip: "bg-slate-100 text-slate-800",
    softChip: "bg-zinc-100 text-zinc-700",
    memoBox: "bg-slate-50 text-slate-700",
    transportChip: "bg-slate-50 text-slate-700",
    costChip: "bg-zinc-100 text-zinc-700",
    tabActive: "bg-slate-900 text-white shadow-md",
    tabInactive:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    heroTextNoPhoto: "text-slate-900",
    heroSubNoPhoto: "text-slate-500",
    heroBadgeNoPhoto: "border bg-white text-slate-700",
    dayPill: "bg-slate-100 text-slate-700",
  },
  pop: {
    name: "ポップ",
    icon: Sparkles,
    appBg: "from-pink-50 via-sky-50 to-yellow-50",
    sectionCard: "bg-white/90 border-pink-100",
    previewCard: "bg-white/95 border-pink-100",
    coverFallback: "from-pink-100 via-sky-50 to-yellow-100",
    accentChip: "bg-pink-100 text-pink-700",
    softChip: "bg-sky-100 text-sky-700",
    memoBox: "bg-yellow-50 text-neutral-700",
    transportChip: "bg-sky-50 text-sky-700",
    costChip: "bg-pink-50 text-pink-700",
    tabActive: "bg-pink-500 text-white shadow-md",
    tabInactive:
      "border border-pink-100 bg-white/90 text-neutral-700 hover:bg-white",
    heroTextNoPhoto: "text-pink-900",
    heroSubNoPhoto: "text-pink-500",
    heroBadgeNoPhoto: "border bg-white/90 text-pink-700",
    dayPill: "bg-pink-50 text-pink-700",
  },
  wa: {
    name: "和モダン",
    icon: Landmark,
    appBg: "from-amber-50 via-orange-50 to-red-50",
    sectionCard: "bg-white/90 border-amber-200",
    previewCard: "bg-white/95 border-amber-200",
    coverFallback: "from-amber-100 via-orange-50 to-red-100",
    accentChip: "bg-red-100 text-red-800",
    softChip: "bg-amber-100 text-amber-800",
    memoBox: "bg-orange-50 text-neutral-700",
    transportChip: "bg-red-50 text-red-700",
    costChip: "bg-amber-50 text-amber-700",
    tabActive: "bg-red-700 text-white shadow-md",
    tabInactive:
      "border border-amber-200 bg-white/90 text-neutral-700 hover:bg-white",
    heroTextNoPhoto: "text-amber-950",
    heroSubNoPhoto: "text-amber-700",
    heroBadgeNoPhoto: "border bg-white/90 text-amber-900",
    dayPill: "bg-red-50 text-red-700",
  },
};

const createScheduleItem = (
  time = "",
  place = "",
  note = "",
  transport = "",
  cost = ""
) => ({
  id: uid(),
  time,
  place,
  note,
  transport,
  cost,
  photo: "",
});

const createDay = (index = 1, date = "") => ({
  id: uid(),
  label: `Day${index}`,
  date,
  items: [createScheduleItem()],
});

const demoTrip = () => ({
  id: uid(),
  title: "大人の修学旅行 in 仙台",
  startDate: "2026-01-24",
  endDate: "2026-01-25",
  coverPhoto: "",
  theme: "wa",
  days: [
    {
      id: uid(),
      label: "Day1",
      date: "2026-01-24",
      items: [
        createScheduleItem(
          "09:00",
          "仙台駅集合",
          "新幹線改札あたりに集合",
          "電車",
          "新幹線代 11,000円"
        ),
        createScheduleItem(
          "12:00",
          "牛タンランチ",
          "予約名を確認しておく",
          "徒歩",
          "ランチ 2,000円"
        ),
      ],
    },
  ],
  packing: [
    { id: uid(), label: "保険証", done: false },
    { id: uid(), label: "充電器", done: false },
  ],
});

function toMapsUrl(place) {
  const q = encodeURIComponent(place || "");
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function reorderList(list, startIndex, endIndex) {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function isValidTripData(data) {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.days) &&
    Array.isArray(data.packing)
  );
}

function loadTripFromHash() {
  try {
    const hash = window.location.hash.slice(1);
    if (!hash) return null;
    const parsed = JSON.parse(decodeURIComponent(hash));
    return isValidTripData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function loadTripFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidTripData(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getTransportMeta(value) {
  return (
    TRANSPORT_OPTIONS.find((option) => option.value === value) || {
      value: "",
      label: "",
      icon: Footprints,
    }
  );
}

function getTripStatus(startDate, endDate) {
  if (!startDate || !endDate) {
    return {
      label: "日付を設定するとカウントダウンが出るよ",
      kind: "empty",
    };
  }

  const today = new Date();
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  if (now < startDay) {
    const diffMs = startDay - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      label: `出発まで あと${diffDays}日`,
      kind: "countdown",
    };
  }

  if (now >= startDay && now <= endDay) {
    return {
      label: "ただいま旅行満喫中 ✈️",
      kind: "traveling",
    };
  }

  return {
    label: "旅の思い出をふりかえろう",
    kind: "finished",
  };
}

/* ===============================
   共通 UI
================================ */
function TabButton({ active, children, onClick, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "relative rounded-full px-4 py-2 text-sm font-medium transition " +
        (active ? theme.tabActive : theme.tabInactive)
      }
    >
      {children}
      {active && (
        <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-300" />
      )}
    </button>
  );
}

function SectionCard({ children, className = "", theme }) {
  return (
    <div
      className={`rounded-3xl border p-4 shadow-sm ${theme.sectionCard} ${className}`}
    >
      {children}
    </div>
  );
}

/* ===============================
   テーマ別表紙
================================ */
function CoverNatural({ trip, theme, completedPackingCount, tripStatus, tripStatusClass }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border">
      {trip.coverPhoto ? (
        <>
          <img
            src={trip.coverPhoto}
            alt="表紙"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-white/35" />
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.coverFallback}`} />
      )}

      <div className="relative px-6 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-xs tracking-[0.25em] text-neutral-500">
            TRAVEL NOTE
          </div>
          <h2 className="mt-3 text-3xl font-bold text-neutral-900 sm:text-4xl">
            {trip.title || "旅のしおり"}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className={`rounded-full px-3 py-1 ${theme.heroBadgeNoPhoto}`}>
              📅 {trip.startDate || "----"} 〜 {trip.endDate || "----"}
            </span>
            <span className={`rounded-full px-3 py-1 ${theme.heroBadgeNoPhoto}`}>
              🧭 {trip.days.length} Days
            </span>
            <span className={`rounded-full px-3 py-1 ${theme.heroBadgeNoPhoto}`}>
              🎒 {completedPackingCount}/{trip.packing.length}
            </span>
            <span className={`rounded-full px-3 py-1 font-medium ${tripStatusClass}`}>
              {tripStatus.label}
            </span>
          </div>
          <div className="mt-6 rounded-2xl bg-lime-50/90 px-4 py-3 text-sm text-lime-800">
            やさしい色合いの、手帳みたいなしおり
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverCity({ trip, theme, completedPackingCount, tripStatus, tripStatusClass }) {
  return (
    <div className="relative overflow-hidden rounded-[20px] border bg-white">
      <div className="grid min-h-[320px] md:grid-cols-[1.2fr_0.8fr]">
        <div className="relative">
          {trip.coverPhoto ? (
            <img
              src={trip.coverPhoto}
              alt="表紙"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${theme.coverFallback}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="text-xs tracking-[0.3em] text-white/70">CITY GUIDE</div>
            <h2 className="mt-3 text-3xl font-black uppercase sm:text-5xl">
              {trip.title || "TRIP BOOKLET"}
            </h2>
          </div>
        </div>

        <div className="flex flex-col justify-between p-6">
          <div>
            <div className="text-xs tracking-[0.2em] text-slate-500">FEATURE</div>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div>・旅程を雑誌っぽく整理</div>
              <div>・見やすく、シンプルに</div>
              <div>・大人っぽいガイドブック風</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className={`inline-flex rounded-full px-3 py-1 text-sm ${theme.accentChip}`}>
              {trip.startDate || "----"} 〜 {trip.endDate || "----"}
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className={`rounded-full px-3 py-1 ${theme.heroBadgeNoPhoto}`}>
                Days {trip.days.length}
              </span>
              <span className={`rounded-full px-3 py-1 ${theme.heroBadgeNoPhoto}`}>
                Packing {completedPackingCount}/{trip.packing.length}
              </span>
              <span className={`rounded-full px-3 py-1 font-medium ${tripStatusClass}`}>
                {tripStatus.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverPop({ trip, theme, completedPackingCount, tripStatus, tripStatusClass }) {
  return (
    <div className="relative overflow-hidden rounded-[36px] border">
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.coverFallback}`} />
      {trip.coverPhoto ? (
        <img
          src={trip.coverPhoto}
          alt="表紙"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
      ) : null}

      <div className="relative p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rotate-[-4deg] rounded-2xl bg-white px-3 py-2 text-xs font-bold text-pink-600 shadow">
            LET'S GO!
          </span>
          <span className="rotate-[3deg] rounded-2xl bg-yellow-200 px-3 py-2 text-xs font-bold text-yellow-800 shadow">
            FUN TRIP
          </span>
          <span className="rotate-[-2deg] rounded-2xl bg-sky-200 px-3 py-2 text-xs font-bold text-sky-800 shadow">
            CUTE PLAN
          </span>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-lg backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-700">
            <Star className="h-3.5 w-3.5" />
            POP STYLE
          </div>

          <h2 className="mt-4 text-3xl font-black text-pink-900 sm:text-4xl">
            {trip.title || "旅のしおり"}
          </h2>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white px-3 py-1 text-pink-700 shadow-sm">
              📅 {trip.startDate || "----"} 〜 {trip.endDate || "----"}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-sky-700 shadow-sm">
              🧭 {trip.days.length} Days
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-yellow-700 shadow-sm">
              🎒 {completedPackingCount}/{trip.packing.length}
            </span>
            <span className={`rounded-full px-3 py-1 font-medium shadow-sm ${tripStatusClass}`}>
              {tripStatus.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoverWa({ trip, theme, completedPackingCount, tripStatus, tripStatusClass }) {
  return (
    <div className="relative overflow-hidden rounded-[20px] border bg-white">
      {trip.coverPhoto ? (
        <>
          <img
            src={trip.coverPhoto}
            alt="表紙"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-amber-950/10 to-amber-950/55" />
        </>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.coverFallback}`} />
      )}

      <div className="relative px-6 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-3xl border border-white/40 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <div className="text-center">
            <div className="text-xs tracking-[0.35em] text-amber-700">旅 の し お り</div>
            <div className="mx-auto mt-3 h-px w-20 bg-amber-300" />
            <h2 className="mt-5 text-3xl font-bold text-amber-950 sm:text-4xl">
              {trip.title || "大人の修学旅行"}
            </h2>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="rounded-full border bg-white/90 px-3 py-1 text-amber-900">
                📅 {trip.startDate || "----"} 〜 {trip.endDate || "----"}
              </span>
              <span className="rounded-full border bg-white/90 px-3 py-1 text-amber-900">
                🧭 {trip.days.length} Days
              </span>
              <span className="rounded-full border bg-white/90 px-3 py-1 text-amber-900">
                🎒 {completedPackingCount}/{trip.packing.length}
              </span>
              <span className={`rounded-full px-3 py-1 font-medium ${tripStatusClass}`}>
                {tripStatus.label}
              </span>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm text-red-800">
              <Ticket className="h-4 w-4" />
              旅館のしおり風デザイン
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeCover({
  trip,
  theme,
  completedPackingCount,
  tripStatus,
  tripStatusClass,
}) {
  if (trip.theme === "city") {
    return (
      <CoverCity
        trip={trip}
        theme={theme}
        completedPackingCount={completedPackingCount}
        tripStatus={tripStatus}
        tripStatusClass={tripStatusClass}
      />
    );
  }
  if (trip.theme === "pop") {
    return (
      <CoverPop
        trip={trip}
        theme={theme}
        completedPackingCount={completedPackingCount}
        tripStatus={tripStatus}
        tripStatusClass={tripStatusClass}
      />
    );
  }
  if (trip.theme === "wa") {
    return (
      <CoverWa
        trip={trip}
        theme={theme}
        completedPackingCount={completedPackingCount}
        tripStatus={tripStatus}
        tripStatusClass={tripStatusClass}
      />
    );
  }
  return (
    <CoverNatural
      trip={trip}
      theme={theme}
      completedPackingCount={completedPackingCount}
      tripStatus={tripStatus}
      tripStatusClass={tripStatusClass}
    />
  );
}

/* ===============================
   メイン
================================ */
export default function App() {
  const [trip, setTrip] = useState(() => {
    const loaded = loadTripFromHash() || loadTripFromStorage() || demoTrip();
    return {
      ...loaded,
      theme: loaded.theme || "natural",
    };
  });

  const [step, setStep] = useState("create");
  const [newPackingItem, setNewPackingItem] = useState("");
  const [dragState, setDragState] = useState({
    dayId: "",
    fromIndex: -1,
  });

  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const tabs = useMemo(
    () => [
      { key: "create", label: "基本", icon: PencilLine },
      { key: "schedule", label: "日程", icon: CalendarDays },
      { key: "packing", label: "持ち物", icon: Backpack },
      { key: "preview", label: "完成", icon: Eye },
    ],
    []
  );

  const currentTheme = THEMES[trip.theme] || THEMES.natural;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
  }, [trip]);

  const updateTrip = (updater) => {
    setTrip((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  const updateDay = (dayId, updater) => {
    updateTrip((prev) => ({
      ...prev,
      days: prev.days.map((day) => (day.id === dayId ? updater(day) : day)),
    }));
  };

  const updateItem = (dayId, itemId, patch) => {
    updateDay(dayId, (day) => ({
      ...day,
      items: day.items.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item
      ),
    }));
  };

  const addDay = () => {
    updateTrip((prev) => {
      const nextIndex = prev.days.length + 1;
      return {
        ...prev,
        days: [...prev.days, createDay(nextIndex)],
      };
    });
  };

  const removeDay = (dayId) => {
    updateTrip((prev) => {
      const filtered = prev.days.filter((d) => d.id !== dayId);
      const normalized =
        filtered.length > 0
          ? filtered.map((d, index) => ({
              ...d,
              label: `Day${index + 1}`,
            }))
          : [createDay(1, prev.startDate || "")];

      return {
        ...prev,
        days: normalized,
      };
    });
  };

  const addScheduleItem = (dayId) => {
    updateDay(dayId, (day) => ({
      ...day,
      items: [...day.items, createScheduleItem()],
    }));
  };

  const removeScheduleItem = (dayId, itemId) => {
    updateDay(dayId, (day) => ({
      ...day,
      items: day.items.filter((item) => item.id !== itemId),
    }));
  };

  const addPackingItem = () => {
    const label = newPackingItem.trim();
    if (!label) return;

    updateTrip((prev) => ({
      ...prev,
      packing: [...prev.packing, { id: uid(), label, done: false }],
    }));
    setNewPackingItem("");
  };

  const togglePackingItem = (packingId) => {
    updateTrip((prev) => ({
      ...prev,
      packing: prev.packing.map((item) =>
        item.id === packingId ? { ...item, done: !item.done } : item
      ),
    }));
  };

  const removePackingItem = (packingId) => {
    updateTrip((prev) => ({
      ...prev,
      packing: prev.packing.filter((item) => item.id !== packingId),
    }));
  };

  const resetTrip = () => {
    const ok = window.confirm("入力内容をリセットしてデモ状態に戻しますか？");
    if (!ok) return;

    const fresh = demoTrip();
    setTrip(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    window.location.hash = "";
    setStep("create");
  };

  const copyShareUrl = async () => {
    try {
      const data = encodeURIComponent(JSON.stringify(trip));
      const url = `${window.location.origin}${window.location.pathname}#${data}`;
      await navigator.clipboard.writeText(url);
      alert("共有URLをコピーしました！友達に送ってね📩");
    } catch {
      alert("URLのコピーに失敗しました");
    }
  };

  const handleCoverPhotoChange = async (file) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateTrip((prev) => ({
        ...prev,
        coverPhoto: dataUrl,
      }));
    } catch {
      alert("表紙写真の読み込みに失敗しました");
    }
  };

  const handleItemPhotoChange = async (dayId, itemId, file) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateItem(dayId, itemId, { photo: dataUrl });
    } catch {
      alert("写真の読み込みに失敗しました");
    }
  };

  const removeItemPhoto = (dayId, itemId) => {
    updateItem(dayId, itemId, { photo: "" });
  };

  const removeCoverPhoto = () => {
    updateTrip((prev) => ({
      ...prev,
      coverPhoto: "",
    }));
  };

  const moveScheduleItem = (dayId, fromIndex, toIndex) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

    updateDay(dayId, (day) => ({
      ...day,
      items: reorderList(day.items, fromIndex, toIndex),
    }));
  };

  const handleDragStart = (dayId, index) => {
    setDragState({ dayId, fromIndex: index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (dayId, toIndex) => {
    if (dragState.dayId !== dayId) return;
    moveScheduleItem(dayId, dragState.fromIndex, toIndex);
    setDragState({ dayId: "", fromIndex: -1 });
  };

  const handleDragEnd = () => {
    setDragState({ dayId: "", fromIndex: -1 });
  };

  const stepOrder = tabs.map((t) => t.key);

  const goToStepByOffset = (offset) => {
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex === -1) return;

    const nextIndex = currentIndex + offset;
    if (nextIndex < 0 || nextIndex >= stepOrder.length) return;

    setStep(stepOrder[nextIndex]);
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.changedTouches[0].clientX;
    touchEndXRef.current = e.changedTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchEndXRef.current - touchStartXRef.current;

    if (Math.abs(diff) < 60) {
      touchStartXRef.current = 0;
      touchEndXRef.current = 0;
      return;
    }

    if (diff < 0) {
      goToStepByOffset(1);
    } else {
      goToStepByOffset(-1);
    }

    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  const completedPackingCount = trip.packing.filter((item) => item.done).length;
  const tripStatus = getTripStatus(trip.startDate, trip.endDate);

  const tripStatusClassMap = {
    empty: "bg-neutral-100 text-neutral-600",
    countdown: "bg-sky-100 text-sky-700",
    traveling: "bg-emerald-100 text-emerald-700",
    finished: "bg-amber-100 text-amber-800",
  };

  const tripStatusClass =
    tripStatusClassMap[tripStatus.kind] || "bg-neutral-100 text-neutral-700";

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${currentTheme.appBg} px-3 py-4 text-neutral-800 sm:px-6 sm:py-8`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mx-auto max-w-6xl pb-28 sm:pb-10">
        <header className="mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                <NotebookText className="h-7 w-7 sm:h-8 sm:w-8" />
                大人の修学旅行 しおり
              </h1>

              {!supabase && (
                <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                  <ShieldAlert className="h-4 w-4" />
                  Supabase未設定（いまはデモ表示）
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetTrip}
                className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm shadow-sm hover:bg-neutral-50"
              >
                <RotateCcw className="h-4 w-4" />
                リセット
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
                  alert("ローカル保存しました");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white shadow-sm hover:opacity-90"
              >
                <Save className="h-4 w-4" />
                保存
              </button>
            </div>
          </div>
        </header>

        <div className="mb-6 hidden flex-wrap gap-2 sm:flex">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <TabButton
                key={t.key}
                active={step === t.key}
                onClick={() => setStep(t.key)}
                theme={currentTheme}
              >
                <span className="inline-flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {t.label}
                </span>
              </TabButton>
            );
          })}
        </div>

        <div className="fixed inset-x-0 bottom-3 z-30 px-3 sm:hidden">
          <div className="mx-auto grid max-w-md grid-cols-4 rounded-[24px] border bg-white/95 p-2 shadow-lg backdrop-blur">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = step === t.key;

              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setStep(t.key)}
                  className={
                    "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition " +
                    (active ? currentTheme.tabActive : "text-neutral-600")
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {step === "create" && (
          <SectionCard className="space-y-5" theme={currentTheme}>
            <div>
              <div className="mb-1 text-sm font-medium text-neutral-700">
                タイトル
              </div>
              <input
                className="w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900/10"
                value={trip.title}
                onChange={(e) =>
                  updateTrip((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="旅のしおりタイトル"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="mb-1 text-sm font-medium text-neutral-700">
                  開始日
                </div>
                <input
                  type="date"
                  className="w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900/10"
                  value={trip.startDate}
                  onChange={(e) =>
                    updateTrip((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>

              <div>
                <div className="mb-1 text-sm font-medium text-neutral-700">
                  終了日
                </div>
                <input
                  type="date"
                  className="w-full rounded-2xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-neutral-900/10"
                  value={trip.endDate}
                  onChange={(e) =>
                    updateTrip((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
                <Palette className="h-4 w-4" />
                デザイン
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(THEMES).map(([key, theme]) => {
                  const Icon = theme.icon;
                  const active = trip.theme === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        updateTrip((prev) => ({
                          ...prev,
                          theme: key,
                        }))
                      }
                      className={
                        "rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm " +
                        (active
                          ? "ring-2 ring-neutral-900 border-neutral-300"
                          : "border-neutral-200")
                      }
                    >
                      <div
                        className={`h-16 rounded-xl bg-gradient-to-br ${theme.coverFallback}`}
                      />
                      <div className="mt-2 inline-flex items-center gap-2 text-sm font-medium">
                        <Icon className="h-4 w-4" />
                        {theme.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-4 shadow-sm">
              <div className="mb-2 text-sm font-medium text-neutral-700">
                表紙写真
              </div>

              {trip.coverPhoto ? (
                <div className="space-y-3">
                  <img
                    src={trip.coverPhoto}
                    alt="表紙"
                    className="h-52 w-full rounded-2xl object-cover"
                  />
                  <div className="flex gap-2">
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-full border bg-white px-4 py-2 text-sm hover:bg-neutral-50">
                      写真を変更
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) =>
                          handleCoverPhotoChange(e.target.files?.[0])
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={removeCoverPhoto}
                      className="rounded-full border px-4 py-2 text-sm hover:bg-neutral-50"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center hover:bg-white">
                  <ImagePlus className="mb-2 h-6 w-6 text-neutral-500" />
                  <div className="text-sm font-medium">表紙写真を追加</div>
                  <div className="mt-1 text-xs text-neutral-500">
                    スマホで撮った旅写真をそのまま使えるよ
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleCoverPhotoChange(e.target.files?.[0])}
                  />
                </label>
              )}
            </div>

            <div className={`rounded-2xl border p-4 text-sm ${currentTheme.softChip}`}>
              タイトル・デザイン・日付・表紙写真を決めたら、次は「日程」で予定を並べていこう。
            </div>
          </SectionCard>
        )}

        {step === "schedule" && (
          <div className="space-y-4">
            {trip.days.map((day, dayIndex) => (
              <SectionCard key={day.id} theme={currentTheme}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <div className="mb-1 text-xs text-neutral-500">
                          Dayラベル
                        </div>
                        <input
                          className="w-full rounded-2xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                          value={day.label}
                          onChange={(e) =>
                            updateDay(day.id, (current) => ({
                              ...current,
                              label: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <div className="mb-1 text-xs text-neutral-500">日付</div>
                        <input
                          type="date"
                          className="w-full rounded-2xl border bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                          value={day.date}
                          onChange={(e) =>
                            updateDay(day.id, (current) => ({
                              ...current,
                              date: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-neutral-500">
                      予定をドラッグして順番を入れ替えできるよ
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => addScheduleItem(day.id)}
                      className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm text-white shadow-sm hover:opacity-95"
                    >
                      ＋ 行を追加
                    </button>

                    <button
                      type="button"
                      onClick={() => removeDay(day.id)}
                      className="rounded-2xl border bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm hover:bg-neutral-50"
                    >
                      Day削除
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {day.items.map((item, index) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(day.id, index)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(day.id, index)}
                      onDragEnd={handleDragEnd}
                      className={
                        "overflow-hidden rounded-[28px] border bg-white shadow-sm transition " +
                        (dragState.dayId === day.id && dragState.fromIndex === index
                          ? "opacity-60 ring-2 ring-amber-300"
                          : "hover:-translate-y-0.5 hover:shadow-md")
                      }
                    >
                      <div className="relative">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.place || "予定写真"}
                            className="h-48 w-full object-cover"
                          />
                        ) : (
                          <div
                            className={`flex h-32 items-center justify-center bg-gradient-to-br ${currentTheme.coverFallback} text-neutral-500`}
                          >
                            <div className="text-center">
                              <ImagePlus className="mx-auto mb-2 h-6 w-6" />
                              <div className="text-xs">写真を入れると旅感アップ</div>
                            </div>
                          </div>
                        )}

                        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-3 py-1 text-xs text-white backdrop-blur">
                          <GripVertical className="h-3.5 w-3.5" />
                          ドラッグで並び替え
                        </div>

                        <div className="absolute right-3 top-3">
                          <button
                            type="button"
                            onClick={() => removeScheduleItem(day.id, item.id)}
                            className="rounded-full bg-white/90 px-3 py-1 text-xs text-neutral-700 shadow hover:bg-white"
                          >
                            削除
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 p-4">
                        <div className="grid gap-3 md:grid-cols-3">
                          <div>
                            <div className="mb-1 inline-flex items-center gap-1 text-xs text-neutral-500">
                              <Clock3 className="h-3.5 w-3.5" />
                              時間
                            </div>
                            <input
                              className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                              placeholder="09:00"
                              value={item.time}
                              onChange={(e) =>
                                updateItem(day.id, item.id, {
                                  time: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="md:col-span-2">
                            <div className="mb-1 inline-flex items-center gap-1 text-xs text-neutral-500">
                              <MapPin className="h-3.5 w-3.5" />
                              場所
                            </div>
                            <input
                              className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                              placeholder="仙台駅、牛タンのお店、ホテル..."
                              value={item.place}
                              onChange={(e) =>
                                updateItem(day.id, item.id, {
                                  place: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <div className="mb-1 inline-flex items-center gap-1 text-xs text-neutral-500">
                              <Train className="h-3.5 w-3.5" />
                              交通手段
                            </div>
                            <select
                              className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                              value={item.transport}
                              onChange={(e) =>
                                updateItem(day.id, item.id, {
                                  transport: e.target.value,
                                })
                              }
                            >
                              <option value="">選択してください</option>
                              {TRANSPORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <div className="mb-1 inline-flex items-center gap-1 text-xs text-neutral-500">
                              <Wallet className="h-3.5 w-3.5" />
                              費用メモ
                            </div>
                            <input
                              className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                              placeholder="ランチ 2,000円 / 入場料 1,500円"
                              value={item.cost}
                              onChange={(e) =>
                                updateItem(day.id, item.id, {
                                  cost: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <div className="mb-1 inline-flex items-center gap-1 text-xs text-neutral-500">
                            <MessageCircleMore className="h-3.5 w-3.5" />
                            メモ
                          </div>
                          <textarea
                            rows={3}
                            className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
                            placeholder="予約名、集合場所、注意点、食べたいものなど"
                            value={item.note}
                            onChange={(e) =>
                              updateItem(day.id, item.id, {
                                note: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <a
                            href={toMapsUrl(item.place)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full border bg-white px-4 py-2 text-sm shadow-sm hover:bg-neutral-50"
                          >
                            📍 地図で見る
                          </a>

                          <label className="inline-flex cursor-pointer items-center justify-center rounded-full border bg-white px-4 py-2 text-sm shadow-sm hover:bg-neutral-50">
                            📷 写真を追加
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              className="hidden"
                              onChange={(e) =>
                                handleItemPhotoChange(
                                  day.id,
                                  item.id,
                                  e.target.files?.[0]
                                )
                              }
                            />
                          </label>

                          {item.photo && (
                            <button
                              type="button"
                              onClick={() => removeItemPhoto(day.id, item.id)}
                              className="inline-flex items-center justify-center rounded-full border bg-white px-4 py-2 text-sm shadow-sm hover:bg-neutral-50"
                            >
                              写真を削除
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {day.items.length === 0 && (
                    <div className="rounded-2xl border bg-white/70 p-4 text-sm text-neutral-600">
                      まだ予定がありません。「＋ 行を追加」から入れてみよう。
                    </div>
                  )}
                </div>

                {dayIndex === trip.days.length - 1 && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={addDay}
                      className="rounded-2xl border bg-white px-4 py-2 text-sm shadow-sm hover:bg-neutral-50"
                    >
                      ＋ Dayを追加
                    </button>
                  </div>
                )}
              </SectionCard>
            ))}
          </div>
        )}

        {step === "packing" && (
          <SectionCard className="space-y-4" theme={currentTheme}>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                className="flex-1 rounded-xl border bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900/10"
                placeholder="持ち物を追加"
                value={newPackingItem}
                onChange={(e) => setNewPackingItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addPackingItem();
                }}
              />
              <button
                type="button"
                onClick={addPackingItem}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white hover:opacity-90"
              >
                追加
              </button>
            </div>

            <div className="text-sm text-neutral-600">
              完了 {completedPackingCount} / {trip.packing.length}
            </div>

            <div className="space-y-2">
              {trip.packing.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => togglePackingItem(item.id)}
                    />
                    <span
                      className={item.done ? "text-neutral-400 line-through" : ""}
                    >
                      {item.label}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePackingItem(item.id)}
                    className="rounded-xl border px-3 py-1 text-xs hover:bg-neutral-50"
                  >
                    削除
                  </button>
                </label>
              ))}

              {trip.packing.length === 0 && (
                <div className="rounded-2xl border bg-white/70 p-4 text-sm text-neutral-600">
                  持ち物がまだありません。必要なものを追加しておこう。
                </div>
              )}
            </div>
          </SectionCard>
        )}

        {step === "preview" && (
          <div className="space-y-6">
            <div
              className={`overflow-hidden rounded-[28px] border shadow-sm ${currentTheme.previewCard}`}
            >
              <div className="p-4 sm:p-6">
                <ThemeCover
                  trip={trip}
                  theme={currentTheme}
                  completedPackingCount={completedPackingCount}
                  tripStatus={tripStatus}
                  tripStatusClass={tripStatusClass}
                />
              </div>

              <div className="space-y-8 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(250,250,249,0.9))] p-4 sm:p-6">
                {trip.days.map((day, idx) => (
                  <div key={day.id} className="space-y-3">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="text-xs font-medium tracking-[0.2em] text-neutral-400">
                          DAY {idx + 1}
                        </div>
                        <div className="mt-1 text-xl font-bold text-neutral-900">
                          {day.label}
                          {day.date ? (
                            <span className="ml-2 text-sm font-normal text-neutral-500">
                              ({day.date})
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div
                        className={`rounded-full px-3 py-1 text-xs ${currentTheme.dayPill}`}
                      >
                        当日用しおり
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border bg-white">
                      <div className="divide-y">
                        {day.items.map((item, itemIndex) => {
                          const transportMeta = getTransportMeta(item.transport);
                          const TransportIcon = transportMeta.icon;

                          return (
                            <div
                              key={item.id}
                              className="relative flex gap-3 px-4 py-5 sm:px-5"
                            >
                              <div className="flex w-16 flex-col items-center">
                                <div className="rounded-2xl border bg-neutral-50 px-2 py-2 text-center text-sm font-semibold">
                                  {item.time || "--:--"}
                                </div>

                                {itemIndex !== day.items.length - 1 && (
                                  <div className="mt-2 w-px flex-1 bg-neutral-200" />
                                )}
                              </div>

                              <div className="flex-1 pb-2">
                                <div className="rounded-[24px] border bg-white p-4 shadow-sm">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="inline-flex items-center gap-1 text-xs text-neutral-500">
                                        <MapPin className="h-3.5 w-3.5" />
                                        SPOT
                                      </div>

                                      <div className="mt-1 text-base font-semibold text-neutral-900">
                                        {item.place || "（未入力）"}
                                      </div>
                                    </div>

                                    {item.place ? (
                                      <a
                                        href={toMapsUrl(item.place)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="shrink-0 rounded-full border bg-white px-3 py-1.5 text-xs hover:bg-neutral-50"
                                      >
                                        地図
                                      </a>
                                    ) : null}
                                  </div>

                                  {(item.transport || item.cost) && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {item.transport ? (
                                        <div
                                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${currentTheme.transportChip}`}
                                        >
                                          <TransportIcon className="h-3.5 w-3.5" />
                                          {item.transport}
                                        </div>
                                      ) : null}

                                      {item.cost ? (
                                        <div
                                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${currentTheme.costChip}`}
                                        >
                                          <Wallet className="h-3.5 w-3.5" />
                                          {item.cost}
                                        </div>
                                      ) : null}
                                    </div>
                                  )}

                                  {item.photo ? (
                                    <img
                                      src={item.photo}
                                      alt={item.place || "予定写真"}
                                      className="mt-4 h-44 w-full rounded-2xl object-cover"
                                    />
                                  ) : null}

                                  {item.note ? (
                                    <div
                                      className={`mt-4 rounded-2xl px-4 py-3 text-sm leading-relaxed ${currentTheme.memoBox}`}
                                    >
                                      <div className="mb-1 inline-flex items-center gap-1 text-xs opacity-80">
                                        <MessageCircleMore className="h-3.5 w-3.5" />
                                        MEMO
                                      </div>
                                      <div>{item.note}</div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="space-y-3">
                  <div className="text-lg font-semibold">持ち物チェック</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {trip.packing.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border bg-white px-4 py-3 text-sm"
                      >
                        {item.done ? "✅" : "⬜️"} {item.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-neutral-600">
                    ✅ これを見ながら当日動けるように準備しよう
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                      🖨 印刷する
                    </button>

                    <button
                      type="button"
                      onClick={copyShareUrl}
                      className="inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm"
                    >
                      🔗 共有URL
                    </button>
                  </div>
                </div>

                <div className="text-xs text-neutral-500">
                  ※ ブラウザの印刷設定で「背景のグラフィック」をONにすると、よりパンフっぽく出ます。
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}