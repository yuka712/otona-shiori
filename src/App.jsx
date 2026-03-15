import { useEffect, useMemo, useState } from "react";

const previewThemes = {
  classic: {
    name: "Classic",
    pageBg: "bg-stone-100",
    sectionBg: "bg-white",
    cardBg: "bg-white",
    accentBg: "bg-stone-50",
    text: "text-neutral-800",
    subtext: "text-neutral-600",
    border: "border-neutral-200",
    ring: "ring-black/5",
    button: "border-neutral-300 hover:bg-neutral-50",
    heroOverlay: "from-black/65 via-black/20 to-transparent",
    badge: "bg-white/90 text-neutral-800",
    accent: "text-amber-700",
    softLine: "bg-neutral-200",
    chip: "bg-neutral-100 text-neutral-700",
  },
  pop: {
    name: "Pop",
    pageBg: "bg-rose-50",
    sectionBg: "bg-white",
    cardBg: "bg-white",
    accentBg: "bg-rose-50",
    text: "text-neutral-800",
    subtext: "text-neutral-600",
    border: "border-rose-200",
    ring: "ring-rose-200/60",
    button: "border-rose-300 hover:bg-rose-50",
    heroOverlay: "from-pink-600/65 via-orange-300/25 to-transparent",
    badge: "bg-yellow-100/95 text-rose-700",
    accent: "text-rose-600",
    softLine: "bg-rose-200",
    chip: "bg-rose-100 text-rose-700",
  },
  natural: {
    name: "Natural",
    pageBg: "bg-emerald-50",
    sectionBg: "bg-white",
    cardBg: "bg-white",
    accentBg: "bg-emerald-50",
    text: "text-neutral-800",
    subtext: "text-neutral-600",
    border: "border-emerald-200",
    ring: "ring-emerald-200/60",
    button: "border-emerald-300 hover:bg-emerald-50",
    heroOverlay: "from-emerald-900/60 via-lime-700/20 to-transparent",
    badge: "bg-emerald-100/95 text-emerald-800",
    accent: "text-emerald-700",
    softLine: "bg-emerald-200",
    chip: "bg-emerald-100 text-emerald-700",
  },
  sky: {
    name: "Sky",
    pageBg: "bg-sky-50",
    sectionBg: "bg-white",
    cardBg: "bg-white",
    accentBg: "bg-sky-50",
    text: "text-neutral-800",
    subtext: "text-neutral-600",
    border: "border-sky-200",
    ring: "ring-sky-200/60",
    button: "border-sky-300 hover:bg-sky-50",
    heroOverlay: "from-sky-900/65 via-cyan-500/20 to-transparent",
    badge: "bg-sky-100/95 text-sky-800",
    accent: "text-sky-700",
    softLine: "bg-sky-200",
    chip: "bg-sky-100 text-sky-700",
  },
};

const editorTabs = [
  { key: "basic", label: "基本" },
  { key: "schedule", label: "日程" },
  { key: "packing", label: "持ち物" },
  { key: "photos", label: "Googleフォト" },
];

const modes = [
  { key: "edit", label: "編集モード" },
  { key: "preview", label: "完成モード" },
];

const defaultTrip = {
  title: "大人のしおり",
  subtitle: "Sendai & Zao Trip",
  date: "2026/1/24 - 2026/1/25",
  theme: "classic",
  coverImage:
    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80",
  description:
    "旅の予定や思い出を、友達と共有できるパンフ風しおりです。",
  photoAlbumUrl: "",
  packingItems: [
    { name: "財布", note: "現金・カードも確認" },
    { name: "スマホ充電器", note: "モバイルバッテリーもあると安心" },
    { name: "着替え", note: "天気に合わせて準備" },
  ],
  days: [
    {
      dayTitle: "1日目｜仙台駅・牛たん・居酒屋",
      schedule: [
        {
          time: "11:30",
          place: "牛たんランチ",
          note: "仙台駅周辺でおいしい牛たんを楽しむ",
          link: "",
          image: "",
        },
        {
          time: "15:00",
          place: "カフェ休憩",
          note: "駅近でひと休み",
          link: "",
          image: "",
        },
      ],
    },
    {
      dayTitle: "2日目｜蔵王・温泉",
      schedule: [
        {
          time: "09:00",
          place: "出発",
          note: "朝ごはんを食べて移動",
          link: "",
          image: "",
        },
        {
          time: "11:00",
          place: "蔵王エリア観光",
          note: "景色や温泉を満喫",
          link: "",
          image: "",
        },
      ],
    },
  ],
};

function App() {
  const [trip, setTrip] = useState(defaultTrip);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState("edit");
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (window.location.hash) {
      try {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        const parsed = JSON.parse(hash);

        setTrip({
          ...defaultTrip,
          ...parsed,
          theme: parsed.theme || defaultTrip.theme,
          packingItems:
            parsed.packingItems?.length > 0
              ? parsed.packingItems
              : defaultTrip.packingItems,
          days:
            parsed.days?.length > 0
              ? parsed.days.map((day) => ({
                  ...day,
                  schedule: (day.schedule || []).map((item) => ({
                    ...item,
                    image: item.image || "",
                  })),
                }))
              : defaultTrip.days,
        });

        setMode("preview");
      } catch (error) {
        console.error("共有データの読み込みに失敗しました:", error);
      }
    }
  }, []);

  const theme = useMemo(() => {
    return previewThemes[trip.theme] || previewThemes.classic;
  }, [trip.theme]);

  const editorInputClass =
    "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800";
  const editorTextAreaClass =
    "min-h-[100px] w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800";
  const editorSmallInputClass =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800";
  const editorPillClass =
    "rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50";

  const updateTripField = (key, value) => {
    setTrip((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateDayTitle = (dayIndex, value) => {
    setTrip((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        dayTitle: value,
      };
      return { ...prev, days: updatedDays };
    });
  };

  const updateScheduleField = (dayIndex, itemIndex, key, value) => {
    setTrip((prev) => {
      const updatedDays = [...prev.days];
      const updatedSchedule = [...updatedDays[dayIndex].schedule];
      updatedSchedule[itemIndex] = {
        ...updatedSchedule[itemIndex],
        [key]: value,
      };
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        schedule: updatedSchedule,
      };
      return { ...prev, days: updatedDays };
    });
  };

  const addDay = () => {
    setTrip((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          dayTitle: `${prev.days.length + 1}日目`,
          schedule: [
            {
              time: "",
              place: "",
              note: "",
              link: "",
              image: "",
            },
          ],
        },
      ],
    }));
  };

  const removeDay = (dayIndex) => {
    setTrip((prev) => ({
      ...prev,
      days: prev.days.filter((_, index) => index !== dayIndex),
    }));
  };

  const addScheduleItem = (dayIndex) => {
    setTrip((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        schedule: [
          ...updatedDays[dayIndex].schedule,
          {
            time: "",
            place: "",
            note: "",
            link: "",
            image: "",
          },
        ],
      };
      return { ...prev, days: updatedDays };
    });
  };

  const removeScheduleItem = (dayIndex, itemIndex) => {
    setTrip((prev) => {
      const updatedDays = [...prev.days];
      updatedDays[dayIndex] = {
        ...updatedDays[dayIndex],
        schedule: updatedDays[dayIndex].schedule.filter(
          (_, index) => index !== itemIndex
        ),
      };
      return { ...prev, days: updatedDays };
    });
  };

  const handleImageUpload = (dayIndex, itemIndex, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateScheduleField(dayIndex, itemIndex, "image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeScheduleImage = (dayIndex, itemIndex) => {
    updateScheduleField(dayIndex, itemIndex, "image", "");
  };

  const updatePackingItem = (index, key, value) => {
    setTrip((prev) => {
      const updated = [...prev.packingItems];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, packingItems: updated };
    });
  };

  const addPackingItem = () => {
    setTrip((prev) => ({
      ...prev,
      packingItems: [...prev.packingItems, { name: "", note: "" }],
    }));
  };

  const removePackingItem = (index) => {
    setTrip((prev) => ({
      ...prev,
      packingItems: prev.packingItems.filter((_, i) => i !== index),
    }));
  };

  const copyShareUrl = async () => {
    try {
      const data = encodeURIComponent(JSON.stringify(trip));
      const url = `${window.location.origin}${window.location.pathname}#${data}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert("共有URLのコピーに失敗しました。");
      console.error(error);
    }
  };

  const renderModeSwitcher = () => (
    <div className="mb-5 flex flex-wrap gap-2">
      {modes.map((item) => {
        const isActive = mode === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setMode(item.key)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              isActive
                ? "bg-neutral-900 text-white"
                : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );

  const renderTabButtons = () => (
    <div className="mb-5 flex flex-wrap gap-2">
      {editorTabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              isActive
                ? "bg-neutral-900 text-white"
                : "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );

  const renderBasicEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          タイトル
        </label>
        <input
          type="text"
          value={trip.title}
          onChange={(e) => updateTripField("title", e.target.value)}
          className={editorInputClass}
          placeholder="大人のしおり"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          サブタイトル
        </label>
        <input
          type="text"
          value={trip.subtitle}
          onChange={(e) => updateTripField("subtitle", e.target.value)}
          className={editorInputClass}
          placeholder="Sendai & Zao Trip"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          日付
        </label>
        <input
          type="text"
          value={trip.date}
          onChange={(e) => updateTripField("date", e.target.value)}
          className={editorInputClass}
          placeholder="2026/1/24 - 2026/1/25"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          完成画面のテーマ
        </label>
        <select
          value={trip.theme}
          onChange={(e) => updateTripField("theme", e.target.value)}
          className={editorInputClass}
        >
          <option value="classic">Classic</option>
          <option value="pop">Pop</option>
          <option value="natural">Natural</option>
          <option value="sky">Sky</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          説明文
        </label>
        <textarea
          value={trip.description}
          onChange={(e) => updateTripField("description", e.target.value)}
          className={editorTextAreaClass}
          placeholder="旅の紹介文"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          表紙画像URL
        </label>
        <input
          type="url"
          value={trip.coverImage}
          onChange={(e) => updateTripField("coverImage", e.target.value)}
          className={editorInputClass}
          placeholder="https://..."
        />
      </div>
    </div>
  );

  const renderScheduleEditor = () => (
    <div className="space-y-6">
      {trip.days.map((day, dayIndex) => (
        <div key={dayIndex} className="rounded-2xl border border-neutral-200 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="block text-sm font-medium text-neutral-700">
              日程タイトル
            </label>
            {trip.days.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay(dayIndex)}
                className={`${editorPillClass} text-xs`}
              >
                この日を削除
              </button>
            )}
          </div>

          <input
            type="text"
            value={day.dayTitle}
            onChange={(e) => updateDayTitle(dayIndex, e.target.value)}
            className={editorInputClass}
          />

          <div className="mt-4 space-y-4">
            {day.schedule.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="rounded-xl bg-neutral-50 p-3 ring-1 ring-neutral-200"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-neutral-800">
                    予定 {itemIndex + 1}
                  </div>
                  {day.schedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeScheduleItem(dayIndex, itemIndex)}
                      className={`${editorPillClass} text-xs`}
                    >
                      削除
                    </button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-700">
                      時間
                    </label>
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) =>
                        updateScheduleField(
                          dayIndex,
                          itemIndex,
                          "time",
                          e.target.value
                        )
                      }
                      className={editorSmallInputClass}
                      placeholder="11:30"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-700">
                      場所
                    </label>
                    <input
                      type="text"
                      value={item.place}
                      onChange={(e) =>
                        updateScheduleField(
                          dayIndex,
                          itemIndex,
                          "place",
                          e.target.value
                        )
                      }
                      className={editorSmallInputClass}
                      placeholder="牛たんランチ"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-neutral-700">
                    メモ
                  </label>
                  <textarea
                    value={item.note}
                    onChange={(e) =>
                      updateScheduleField(
                        dayIndex,
                        itemIndex,
                        "note",
                        e.target.value
                      )
                    }
                    className="min-h-[80px] w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800"
                    placeholder="お店のメモや予定"
                  />
                </div>

                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-neutral-700">
                    リンク
                  </label>
                  <input
                    type="url"
                    value={item.link}
                    onChange={(e) =>
                      updateScheduleField(
                        dayIndex,
                        itemIndex,
                        "link",
                        e.target.value
                      )
                    }
                    className={editorSmallInputClass}
                    placeholder="https://..."
                  />
                </div>

                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium text-neutral-700">
                    写真を選ぶ
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(dayIndex, itemIndex, e.target.files?.[0])
                    }
                    className="block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800"
                  />
                </div>

                {item.image && (
                  <div className="mt-3">
                    <img
                      src={item.image}
                      alt={item.place || `予定 ${itemIndex + 1}`}
                      className="h-40 w-full rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeScheduleImage(dayIndex, itemIndex)}
                      className={`${editorPillClass} mt-3 text-xs`}
                    >
                      写真を削除
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addScheduleItem(dayIndex)}
            className={`${editorPillClass} mt-4`}
          >
            ＋ この日に予定を追加
          </button>
        </div>
      ))}

      <button type="button" onClick={addDay} className={`w-full ${editorPillClass}`}>
        ＋ 日程を追加
      </button>
    </div>
  );

  const renderPackingEditor = () => (
    <div className="space-y-4">
      {trip.packingItems.map((item, index) => (
        <div key={index} className="rounded-2xl border border-neutral-200 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-neutral-800">
              持ち物 {index + 1}
            </div>
            {trip.packingItems.length > 1 && (
              <button
                type="button"
                onClick={() => removePackingItem(index)}
                className={`${editorPillClass} text-xs`}
              >
                削除
              </button>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-700">
                持ち物名
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updatePackingItem(index, "name", e.target.value)}
                className={editorSmallInputClass}
                placeholder="財布"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-700">
                メモ
              </label>
              <input
                type="text"
                value={item.note}
                onChange={(e) => updatePackingItem(index, "note", e.target.value)}
                className={editorSmallInputClass}
                placeholder="忘れないように"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPackingItem}
        className={`w-full ${editorPillClass}`}
      >
        ＋ 持ち物を追加
      </button>
    </div>
  );

  const renderPhotoEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Googleフォトのリンク
        </label>
        <input
          type="url"
          value={trip.photoAlbumUrl}
          onChange={(e) => updateTripField("photoAlbumUrl", e.target.value)}
          className={editorInputClass}
          placeholder="https://photos.app.goo.gl/..."
        />
      </div>

      <div className="rounded-2xl border border-neutral-200 p-4 text-sm leading-7 text-neutral-600">
        Googleフォトの共有リンクをここに入れると、完成モードに
        <span className="font-semibold">「Googleフォトを見る」</span>
        ボタンが表示されます。
      </div>
    </div>
  );

  const renderEditorContent = () => {
    switch (activeTab) {
      case "basic":
        return renderBasicEditor();
      case "schedule":
        return renderScheduleEditor();
      case "packing":
        return renderPackingEditor();
      case "photos":
        return renderPhotoEditor();
      default:
        return renderBasicEditor();
    }
  };

  const renderHeroSection = () => (
    <section
      className={`overflow-hidden rounded-[32px] ${theme.sectionBg} shadow-sm ring-1 ${theme.ring}`}
    >
      <div className="relative h-[360px] w-full md:h-[500px]">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="h-full w-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${theme.heroOverlay}`} />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
          <div className="max-w-3xl">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${theme.badge}`}
            >
              {theme.name}
            </span>
            <p className="mt-4 text-xs tracking-[0.35em] uppercase opacity-90 md:text-sm">
              Travel Pamphlet
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">
              {trip.title}
            </h1>
            <p className="mt-3 text-base opacity-95 md:text-xl">{trip.subtitle}</p>
            <p className="mt-2 text-sm opacity-90 md:text-base">{trip.date}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
        <div>
          <p className={`text-sm tracking-[0.25em] uppercase ${theme.accent}`}>
            Introduction
          </p>
          <p className={`mt-3 text-base leading-8 ${theme.subtext}`}>
            {trip.description}
          </p>
        </div>

        <div className={`rounded-3xl ${theme.accentBg} p-5`}>
          <p className={`text-sm font-semibold ${theme.accent}`}>Quick Access</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyShareUrl}
              className={`inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm ${theme.button}`}
            >
              🔗 共有URLをコピー
            </button>

            {trip.photoAlbumUrl && (
              <a
                href={trip.photoAlbumUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm ${theme.button}`}
              >
                📸 Googleフォトを見る
              </a>
            )}
          </div>

          {copied && (
            <p className="mt-3 text-sm text-emerald-500">
              共有URLをコピーしました！
            </p>
          )}
        </div>
      </div>
    </section>
  );

  const renderSchedulePreview = () => (
    <section
      className={`rounded-[32px] ${theme.sectionBg} p-6 shadow-sm ring-1 ${theme.ring} md:p-10`}
    >
      <div className="mb-8 md:flex md:items-end md:justify-between">
        <div>
          <p className={`text-sm tracking-[0.25em] uppercase ${theme.accent}`}>
            Schedule
          </p>
          <h2 className="mt-2 text-3xl font-bold">旅のスケジュール</h2>
        </div>
        <div className={`mt-4 h-px w-full md:mt-0 md:ml-6 ${theme.softLine}`} />
      </div>

      <div className="space-y-12">
        {trip.days.map((day, dayIndex) => (
          <div key={dayIndex}>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${theme.chip}`}>
                DAY {dayIndex + 1}
              </span>
              <h3 className="text-2xl font-bold">{day.dayTitle}</h3>
            </div>

            <div className="space-y-5">
              {day.schedule.map((item, itemIndex) => (
                <article
                  key={itemIndex}
                  className={`overflow-hidden rounded-[28px] border ${theme.border} ${theme.cardBg}`}
                >
                  <div className="grid md:grid-cols-[110px_1fr]">
                    <div className={`border-b px-5 py-5 md:border-b-0 md:border-r ${theme.border}`}>
                      <div className={`text-sm font-semibold ${theme.timeText}`}>
                        {item.time || "時間未定"}
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className={item.image ? "grid gap-5 lg:grid-cols-[1fr_320px]" : ""}>
                        <div>
                          <h4 className="text-xl font-semibold">
                            {item.place || "場所未設定"}
                          </h4>

                          {item.note && (
                            <p className={`mt-3 whitespace-pre-wrap text-sm leading-7 ${theme.subtext}`}>
                              {item.note}
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex rounded-full border px-4 py-2 text-xs ${theme.button}`}
                              >
                                詳細を見る
                              </a>
                            )}
                          </div>
                        </div>

                        {item.image && (
                          <div>
                            <img
                              src={item.image}
                              alt={item.place || `予定 ${itemIndex + 1} の写真`}
                              className="h-64 w-full rounded-3xl object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderPackingPreview = () => (
    <section
      className={`rounded-[32px] ${theme.sectionBg} p-6 shadow-sm ring-1 ${theme.ring} md:p-10`}
    >
      <div className="mb-8 md:flex md:items-end md:justify-between">
        <div>
          <p className={`text-sm tracking-[0.25em] uppercase ${theme.accent}`}>
            Packing List
          </p>
          <h2 className="mt-2 text-3xl font-bold">持ち物メモ</h2>
        </div>
        <div className={`mt-4 h-px w-full md:mt-0 md:ml-6 ${theme.softLine}`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {trip.packingItems.map((item, index) => (
          <div
            key={index}
            className={`rounded-[24px] border ${theme.border} ${theme.cardBg} p-5`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 h-3 w-3 rounded-full ${theme.softLine}`} />
              <div>
                <div className="text-lg font-semibold">
                  {item.name || `持ち物 ${index + 1}`}
                </div>
                {item.note && (
                  <p className={`mt-2 text-sm leading-7 ${theme.subtext}`}>
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderGooglePhotoPreview = () => (
    <section
      className={`rounded-[32px] ${theme.sectionBg} p-6 shadow-sm ring-1 ${theme.ring} md:p-10`}
    >
      <div className="mb-8 md:flex md:items-end md:justify-between">
        <div>
          <p className={`text-sm tracking-[0.25em] uppercase ${theme.accent}`}>
            Memories
          </p>
          <h2 className="mt-2 text-3xl font-bold">思い出アルバム</h2>
        </div>
        <div className={`mt-4 h-px w-full md:mt-0 md:ml-6 ${theme.softLine}`} />
      </div>

      <div className={`rounded-[28px] ${theme.accentBg} p-6`}>
        {trip.photoAlbumUrl ? (
          <>
            <p className={`text-sm leading-7 ${theme.subtext}`}>
              写真はGoogleフォトにもまとめています。旅の思い出を、あとからゆっくり眺める用のアルバムです。
            </p>
            <div className="mt-5">
              <a
                href={trip.photoAlbumUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm ${theme.button}`}
              >
                📸 Googleフォトを見る
              </a>
            </div>
          </>
        ) : (
          <p className={`text-sm leading-7 ${theme.subtext}`}>
            まだGoogleフォトのリンクが入っていません。
          </p>
        )}
      </div>
    </section>
  );

  return (
    <div
      className={
        mode === "edit"
          ? "min-h-screen bg-neutral-100 text-neutral-800"
          : `min-h-screen ${theme.pageBg} ${theme.text} transition-colors duration-300`
      }
    >
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-6">{renderModeSwitcher()}</div>

        {mode === "edit" ? (
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h1 className="mb-4 text-2xl font-bold">旅しおり編集</h1>
              {renderTabButtons()}
              <div className="space-y-4">{renderEditorContent()}</div>
            </aside>

            <main className="space-y-6">
              <section className="overflow-hidden rounded-[32px] bg-white shadow-sm ring-1 ring-black/5">
                <div className="relative h-[280px] md:h-[360px]">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                    <p className="text-xs tracking-[0.3em] uppercase opacity-90">
                      Preview Style
                    </p>
                    <h2 className="mt-2 text-3xl font-bold md:text-5xl">
                      {trip.title}
                    </h2>
                    <p className="mt-2 text-sm md:text-lg">{trip.subtitle}</p>
                    <p className="mt-1 text-sm opacity-90">{trip.date}</p>
                  </div>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
                  <div>
                    <p className="text-sm tracking-[0.25em] uppercase text-neutral-500">
                      Editing
                    </p>
                    <p className="mt-3 text-sm leading-8 text-neutral-600">
                      ここは編集専用の画面です。完成版の華やかさは残しつつ、
                      入力側はごちゃつかないように分けています。
                    </p>
                  </div>

                  <div className="rounded-3xl bg-neutral-50 p-5">
                    <p className="text-sm font-semibold text-neutral-700">
                      Quick Action
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setMode("preview")}
                        className="rounded-full bg-neutral-900 px-5 py-2 text-sm text-white hover:opacity-90"
                      >
                        完成モードで見る
                      </button>

                      <button
                        type="button"
                        onClick={copyShareUrl}
                        className="rounded-full border border-neutral-300 px-5 py-2 text-sm hover:bg-neutral-50"
                      >
                        🔗 共有URLをコピー
                      </button>
                    </div>

                    {copied && (
                      <p className="mt-3 text-sm text-emerald-600">
                        共有URLをコピーしました！
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
                <div className="mb-6 md:flex md:items-end md:justify-between">
                  <div>
                    <p className="text-sm tracking-[0.25em] uppercase text-neutral-500">
                      Themes
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-neutral-900">
                      完成画面のテーマ
                    </h2>
                  </div>
                  <div className="mt-4 h-px w-full bg-neutral-200 md:mt-0 md:ml-6" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {Object.values(previewThemes).map((item) => (
                    <div
                      key={item.name}
                      className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-lg font-semibold text-neutral-900">
                          {item.name}
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs text-neutral-600">
                          theme
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-neutral-600">
                        完成モードの見た目に反映されます。パンフっぽさを残しつつ、
                        旅の雰囲気に合わせて選べます。
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        ) : (
          <main className="space-y-6">
            <div className={`rounded-3xl ${theme.sectionBg} p-4 shadow-sm ring-1 ${theme.ring}`}>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                >
                  編集モードに戻る
                </button>

                <button
                  type="button"
                  onClick={copyShareUrl}
                  className={`rounded-full border px-4 py-2 text-sm ${theme.button}`}
                >
                  🔗 共有URLをコピー
                </button>

                {trip.photoAlbumUrl && (
                  <a
                    href={trip.photoAlbumUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`rounded-full border px-4 py-2 text-sm ${theme.button}`}
                  >
                    📸 Googleフォトを見る
                  </a>
                )}
              </div>

              {copied && (
                <p className="mt-3 text-sm text-emerald-500">
                  共有URLをコピーしました！
                </p>
              )}
            </div>

            {renderHeroSection()}
            {renderSchedulePreview()}
            {renderPackingPreview()}
            {renderGooglePhotoPreview()}

            <footer className={`pb-8 pt-2 text-center text-xs ${theme.subtext}`}>
              <p>©2026 Rela-Spo Komo</p>
            </footer>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;