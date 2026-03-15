import { useEffect, useMemo, useState } from "react";

const previewThemes = {
  classic: {
    name: "Classic",
    pageBg: "bg-stone-100",
    panelBg: "bg-white",
    sectionBg: "bg-white",
    cardBg: "bg-white",
    text: "text-neutral-800",
    subtext: "text-neutral-600",
    border: "border-neutral-200",
    ring: "ring-black/5",
    button: "border-neutral-300 hover:bg-neutral-50",
    heroOverlay: "from-black/65 via-black/20 to-transparent",
    badge: "bg-white/85 text-neutral-800",
    softBg: "bg-neutral-50",
    timeText: "text-neutral-500",
  },
  pop: {
    name: "Pop",
    pageBg: "bg-rose-50",
    panelBg: "bg-white",
    sectionBg: "bg-white",
    cardBg: "bg-white",
    text: "text-neutral-800",
    subtext: "text-neutral-600",
    border: "border-rose-200",
    ring: "ring-rose-200/60",
    button: "border-rose-300 hover:bg-rose-50",
    heroOverlay: "from-pink-600/65 via-orange-300/25 to-transparent",
    badge: "bg-yellow-100/90 text-rose-700",
    softBg: "bg-rose-50",
    timeText: "text-rose-500",
  },
  natural: {
    name: "Natural",
    pageBg: "bg-emerald-50",
    panelBg: "bg-white",
    sectionBg: "bg-white",
    cardBg: "bg-white",
    text: "text-neutral-800",
    subtext: "text-neutral-600",
    border: "border-emerald-200",
    ring: "ring-emerald-200/60",
    button: "border-emerald-300 hover:bg-emerald-50",
    heroOverlay: "from-emerald-900/60 via-lime-700/20 to-transparent",
    badge: "bg-emerald-100/90 text-emerald-800",
    softBg: "bg-emerald-50",
    timeText: "text-emerald-600",
  },
  sky: {
    name: "Sky",
    pageBg: "bg-sky-50",
    panelBg: "bg-white",
    sectionBg: "bg-white",
    cardBg: "bg-white",
    text: "text-neutral-800",
    subtext: "text-neutral-600",
    border: "border-sky-200",
    ring: "ring-sky-200/60",
    button: "border-sky-300 hover:bg-sky-50",
    heroOverlay: "from-sky-900/65 via-cyan-500/20 to-transparent",
    badge: "bg-sky-100/90 text-sky-800",
    softBg: "bg-sky-50",
    timeText: "text-sky-600",
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
      className={`overflow-hidden rounded-[28px] ${theme.sectionBg} shadow-sm ring-1 ${theme.ring}`}
    >
      <div className="relative h-[320px] w-full md:h-[430px]">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="h-full w-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${theme.heroOverlay}`} />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${theme.badge}`}
          >
            {theme.name}
          </span>
          <p className="mt-3 text-sm tracking-[0.2em] uppercase opacity-90">
            Travel Book
          </p>
          <h1 className="text-3xl font-bold md:text-5xl">{trip.title}</h1>
          <p className="mt-2 text-sm md:text-lg">{trip.subtitle}</p>
          <p className="mt-1 text-sm opacity-90">{trip.date}</p>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <p className={`leading-7 ${theme.subtext}`}>{trip.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
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
    </section>
  );

  const renderSchedulePreview = () => (
    <section
      className={`rounded-[28px] ${theme.sectionBg} p-6 shadow-sm ring-1 ${theme.ring} md:p-8`}
    >
      <h2 className="mb-6 text-2xl font-bold">日程</h2>

      <div className="space-y-8">
        {trip.days.map((day, dayIndex) => (
          <div key={dayIndex}>
            <h3 className="mb-4 text-xl font-semibold">{day.dayTitle}</h3>

            <div className="space-y-5">
              {day.schedule.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`overflow-hidden rounded-2xl border ${theme.border} ${theme.cardBg}`}
                >
                  <div className="grid gap-0 md:grid-cols-[110px_1fr]">
                    <div
                      className={`border-b px-4 py-4 text-sm font-semibold md:border-b-0 md:border-r ${theme.border} ${theme.timeText}`}
                    >
                      {item.time || "時間未定"}
                    </div>

                    <div className="p-4 md:p-5">
                      <h4 className="text-lg font-semibold">
                        {item.place || "場所未設定"}
                      </h4>

                      {item.note && (
                        <p
                          className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${theme.subtext}`}
                        >
                          {item.note}
                        </p>
                      )}

                      {item.link && (
                        <div className="mt-3">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex rounded-full border px-3 py-1 text-xs ${theme.button}`}
                          >
                            詳細を見る
                          </a>
                        </div>
                      )}

                      {item.image && (
                        <div className="mt-4">
                          <img
                            src={item.image}
                            alt={item.place || `予定 ${itemIndex + 1} の写真`}
                            className="h-56 w-full rounded-2xl object-cover md:h-72"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderPackingPreview = () => (
    <section
      className={`rounded-[28px] ${theme.sectionBg} p-6 shadow-sm ring-1 ${theme.ring} md:p-8`}
    >
      <h2 className="mb-5 text-2xl font-bold">持ち物</h2>

      <div className="grid gap-3 md:grid-cols-2">
        {trip.packingItems.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border p-4 ${theme.border} ${theme.cardBg}`}
          >
            <div className="text-base font-semibold">
              {item.name || `持ち物 ${index + 1}`}
            </div>
            {item.note && (
              <p className={`mt-2 text-sm leading-6 ${theme.subtext}`}>
                {item.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  const renderGooglePhotoPreview = () => (
    <section
      className={`rounded-[28px] ${theme.sectionBg} p-6 shadow-sm ring-1 ${theme.ring} md:p-8`}
    >
      <h2 className="mb-3 text-2xl font-bold">Googleフォト</h2>

      {trip.photoAlbumUrl ? (
        <>
          <p className={`mb-4 text-sm leading-6 ${theme.subtext}`}>
            思い出アルバムをGoogleフォトで開けます。
          </p>
          <a
            href={trip.photoAlbumUrl}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm ${theme.button}`}
          >
            📸 Googleフォトを見る
          </a>
        </>
      ) : (
        <p className={`text-sm leading-6 ${theme.subtext}`}>
          まだGoogleフォトのリンクが入っていません。
        </p>
      )}
    </section>
  );

  return (
    <div className={mode === "edit" ? "min-h-screen bg-neutral-100 text-neutral-800" : `min-h-screen ${theme.pageBg} ${theme.text} transition-colors duration-300`}>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-6">
          {renderModeSwitcher()}
        </div>

        {mode === "edit" ? (
          <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
            <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <h1 className="mb-4 text-2xl font-bold">旅しおり編集</h1>
              {renderTabButtons()}
              <div className="space-y-4">{renderEditorContent()}</div>
            </aside>

            <main className="space-y-6">
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h2 className="text-2xl font-bold text-neutral-900">編集メモ</h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-neutral-600">
                  <p>
                    ここは編集専用の画面です。入力や画像追加に集中できるように、
                    あえて完成版は分けています。
                  </p>
                  <p>
                    右上の <span className="font-semibold">完成モード</span> を押すと、
                    当日に見やすいしおり表示に切り替わります。
                  </p>
                  <p>
                    共有URLを送った相手は、最初から完成モードで開くようになっています。
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
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
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h2 className="text-xl font-bold text-neutral-900">選べる完成テーマ</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {Object.values(previewThemes).map((item) => (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                    >
                      <div className="text-base font-semibold text-neutral-900">
                        {item.name}
                      </div>
                      <p className="mt-2 text-sm text-neutral-600">
                        完成モードに切り替えたときの表示テーマです。
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        ) : (
          <main className="space-y-6">
            <div className={`rounded-3xl ${theme.panelBg} p-4 shadow-sm ring-1 ${theme.ring}`}>
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