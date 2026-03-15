import { useEffect, useMemo, useState } from "react";

const themes = {
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
    heroOverlay: "from-black/65 via-black/25 to-transparent",
    badge: "bg-white/85 text-neutral-800",
    inputBg: "bg-white text-neutral-800",
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
    heroOverlay: "from-pink-600/65 via-orange-400/20 to-transparent",
    badge: "bg-yellow-100/90 text-rose-700",
    inputBg: "bg-white text-neutral-800",
    softBg: "bg-rose-50",
    timeText: "text-rose-500",
  },
  night: {
    name: "Night",
    pageBg: "bg-neutral-950",
    panelBg: "bg-neutral-900",
    sectionBg: "bg-neutral-900",
    cardBg: "bg-neutral-900",
    text: "text-neutral-100",
    subtext: "text-neutral-400",
    border: "border-neutral-700",
    ring: "ring-white/10",
    button: "border-neutral-600 hover:bg-neutral-800",
    heroOverlay: "from-black/80 via-indigo-900/30 to-transparent",
    badge: "bg-indigo-200/90 text-indigo-950",
    inputBg: "bg-neutral-950 text-white",
    softBg: "bg-neutral-950",
    timeText: "text-indigo-300",
  },
};

const tabLabels = [
  { key: "basic", label: "基本" },
  { key: "schedule", label: "日程" },
  { key: "packing", label: "持ち物" },
  { key: "photos", label: "Googleフォト" },
  { key: "complete", label: "完成" },
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
      } catch (error) {
        console.error("共有データの読み込みに失敗しました:", error);
      }
    }
  }, []);

  const currentTheme = useMemo(() => {
    return themes[trip.theme] || themes.classic;
  }, [trip.theme]);

  const inputClass = `w-full rounded-xl border px-3 py-2 text-sm ${currentTheme.border} ${currentTheme.inputBg}`;
  const textAreaClass = `min-h-[100px] w-full rounded-xl border px-3 py-2 text-sm ${currentTheme.border} ${currentTheme.inputBg}`;
  const smallInputClass = `w-full rounded-lg border px-3 py-2 text-sm ${currentTheme.border} ${currentTheme.inputBg}`;
  const pillButtonClass = `rounded-full border px-4 py-2 text-sm ${currentTheme.button}`;

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

  const renderTabButtons = () => (
    <div className="mb-5 flex flex-wrap gap-2">
      {tabLabels.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              isActive
                ? "bg-neutral-900 text-white border-neutral-900"
                : `${currentTheme.button}`
            } ${trip.theme === "night" && isActive ? "bg-white text-neutral-900 border-white" : ""}`}
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
        <label className="mb-1 block text-sm font-medium">タイトル</label>
        <input
          type="text"
          value={trip.title}
          onChange={(e) => updateTripField("title", e.target.value)}
          className={inputClass}
          placeholder="大人のしおり"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">サブタイトル</label>
        <input
          type="text"
          value={trip.subtitle}
          onChange={(e) => updateTripField("subtitle", e.target.value)}
          className={inputClass}
          placeholder="Sendai & Zao Trip"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">日付</label>
        <input
          type="text"
          value={trip.date}
          onChange={(e) => updateTripField("date", e.target.value)}
          className={inputClass}
          placeholder="2026/1/24 - 2026/1/25"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">テーマ</label>
        <select
          value={trip.theme}
          onChange={(e) => updateTripField("theme", e.target.value)}
          className={inputClass}
        >
          <option value="classic">Classic</option>
          <option value="pop">Pop</option>
          <option value="night">Night</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">説明文</label>
        <textarea
          value={trip.description}
          onChange={(e) => updateTripField("description", e.target.value)}
          className={textAreaClass}
          placeholder="旅の紹介文"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">表紙画像URL</label>
        <input
          type="url"
          value={trip.coverImage}
          onChange={(e) => updateTripField("coverImage", e.target.value)}
          className={inputClass}
          placeholder="https://..."
        />
      </div>
    </div>
  );

  const renderScheduleEditor = () => (
    <div className="space-y-6">
      {trip.days.map((day, dayIndex) => (
        <div
          key={dayIndex}
          className={`rounded-2xl border p-4 ${currentTheme.border}`}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <label className="block text-sm font-medium">日程タイトル</label>
            {trip.days.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay(dayIndex)}
                className={`${pillButtonClass} text-xs`}
              >
                この日を削除
              </button>
            )}
          </div>

          <input
            type="text"
            value={day.dayTitle}
            onChange={(e) => updateDayTitle(dayIndex, e.target.value)}
            className={inputClass}
          />

          <div className="mt-4 space-y-4">
            {day.schedule.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className={`rounded-xl p-3 ring-1 ${
                  trip.theme === "night"
                    ? "bg-neutral-950 ring-neutral-800"
                    : "bg-neutral-50 ring-neutral-200"
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">予定 {itemIndex + 1}</div>
                  {day.schedule.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeScheduleItem(dayIndex, itemIndex)}
                      className={`${pillButtonClass} text-xs`}
                    >
                      削除
                    </button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium">時間</label>
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
                      className={smallInputClass}
                      placeholder="11:30"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium">場所</label>
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
                      className={smallInputClass}
                      placeholder="牛たんランチ"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium">メモ</label>
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
                    className={`min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm ${currentTheme.border} ${currentTheme.inputBg}`}
                    placeholder="お店のメモや予定"
                  />
                </div>

                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium">リンク</label>
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
                    className={smallInputClass}
                    placeholder="https://..."
                  />
                </div>

                <div className="mt-3">
                  <label className="mb-1 block text-xs font-medium">
                    写真を選ぶ
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(dayIndex, itemIndex, e.target.files?.[0])
                    }
                    className={`block w-full rounded-lg border px-3 py-2 text-sm ${currentTheme.border} ${currentTheme.inputBg}`}
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
                      className={`${pillButtonClass} mt-3 text-xs`}
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
            className={`${pillButtonClass} mt-4`}
          >
            ＋ この日に予定を追加
          </button>
        </div>
      ))}

      <button type="button" onClick={addDay} className={`w-full ${pillButtonClass}`}>
        ＋ 日程を追加
      </button>
    </div>
  );

  const renderPackingEditor = () => (
    <div className="space-y-4">
      {trip.packingItems.map((item, index) => (
        <div
          key={index}
          className={`rounded-2xl border p-4 ${currentTheme.border}`}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-semibold">持ち物 {index + 1}</div>
            {trip.packingItems.length > 1 && (
              <button
                type="button"
                onClick={() => removePackingItem(index)}
                className={`${pillButtonClass} text-xs`}
              >
                削除
              </button>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium">持ち物名</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updatePackingItem(index, "name", e.target.value)}
                className={smallInputClass}
                placeholder="財布"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">メモ</label>
              <input
                type="text"
                value={item.note}
                onChange={(e) => updatePackingItem(index, "note", e.target.value)}
                className={smallInputClass}
                placeholder="忘れないように"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addPackingItem}
        className={`w-full ${pillButtonClass}`}
      >
        ＋ 持ち物を追加
      </button>
    </div>
  );

  const renderPhotoEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Googleフォトのリンク
        </label>
        <input
          type="url"
          value={trip.photoAlbumUrl}
          onChange={(e) => updateTripField("photoAlbumUrl", e.target.value)}
          className={inputClass}
          placeholder="https://photos.app.goo.gl/..."
        />
      </div>

      <div
        className={`rounded-2xl border p-4 text-sm leading-7 ${currentTheme.border} ${currentTheme.subtext}`}
      >
        Googleフォトの共有リンクをここに入れると、右側のプレビューに
        <span className="font-semibold">「Googleフォトを見る」</span>
        ボタンが出ます。
        <br />
        そのボタンを押すと、新しいタブでGoogleフォトを開けます。
      </div>
    </div>
  );

  const renderCompleteEditor = () => (
    <div
      className={`rounded-2xl border p-5 text-sm leading-7 ${currentTheme.border} ${currentTheme.subtext}`}
    >
      <p className="font-semibold">完成プレビュー</p>
      <p className="mt-2">
        ここでは編集というより、右側でしおり全体をまとめて確認するモードです。
      </p>
      <p className="mt-2">
        友達に送る前の最終チェックにちょうどいいやつ。
      </p>

      <div className="mt-4">
        <button type="button" onClick={copyShareUrl} className={pillButtonClass}>
          🔗 共有URLをコピー
        </button>
        {copied && (
          <p className="mt-3 text-sm text-emerald-500">
            共有URLをコピーしました！
          </p>
        )}
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
      case "complete":
        return renderCompleteEditor();
      default:
        return renderBasicEditor();
    }
  };

  const renderHeroSection = () => (
    <section
      className={`overflow-hidden rounded-[28px] ${currentTheme.sectionBg} shadow-sm ring-1 ${currentTheme.ring}`}
    >
      <div className="relative h-[320px] w-full md:h-[420px]">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="h-full w-full object-cover"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${currentTheme.heroOverlay}`}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${currentTheme.badge}`}
          >
            {themes[trip.theme]?.name || "Classic"}
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
        <p className={`leading-7 ${currentTheme.subtext}`}>{trip.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyShareUrl}
            className={`inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm ${currentTheme.button}`}
          >
            🔗 共有URLをコピー
          </button>

          {trip.photoAlbumUrl && (
            <a
              href={trip.photoAlbumUrl}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm ${currentTheme.button}`}
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
      className={`rounded-[28px] ${currentTheme.sectionBg} p-6 shadow-sm ring-1 ${currentTheme.ring} md:p-8`}
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
                  className={`overflow-hidden rounded-2xl border ${currentTheme.border} ${currentTheme.cardBg}`}
                >
                  <div className="grid gap-0 md:grid-cols-[110px_1fr]">
                    <div
                      className={`border-b px-4 py-4 text-sm font-semibold md:border-b-0 md:border-r ${currentTheme.border} ${currentTheme.timeText}`}
                    >
                      {item.time || "時間未定"}
                    </div>

                    <div className="p-4 md:p-5">
                      <h4 className="text-lg font-semibold">
                        {item.place || "場所未設定"}
                      </h4>

                      {item.note && (
                        <p
                          className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${currentTheme.subtext}`}
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
                            className={`inline-flex rounded-full border px-3 py-1 text-xs ${currentTheme.button}`}
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
      className={`rounded-[28px] ${currentTheme.sectionBg} p-6 shadow-sm ring-1 ${currentTheme.ring} md:p-8`}
    >
      <h2 className="mb-5 text-2xl font-bold">持ち物</h2>

      <div className="grid gap-3 md:grid-cols-2">
        {trip.packingItems.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border p-4 ${currentTheme.border} ${currentTheme.cardBg}`}
          >
            <div className="text-base font-semibold">
              {item.name || `持ち物 ${index + 1}`}
            </div>
            {item.note && (
              <p className={`mt-2 text-sm leading-6 ${currentTheme.subtext}`}>
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
      className={`rounded-[28px] ${currentTheme.sectionBg} p-6 shadow-sm ring-1 ${currentTheme.ring} md:p-8`}
    >
      <h2 className="mb-3 text-2xl font-bold">Googleフォト</h2>

      {trip.photoAlbumUrl ? (
        <>
          <p className={`mb-4 text-sm leading-6 ${currentTheme.subtext}`}>
            思い出アルバムをGoogleフォトで開けます。
          </p>
          <a
            href={trip.photoAlbumUrl}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm ${currentTheme.button}`}
          >
            📸 Googleフォトを見る
          </a>
        </>
      ) : (
        <p className={`text-sm leading-6 ${currentTheme.subtext}`}>
          まだGoogleフォトのリンクが入っていません。
        </p>
      )}
    </section>
  );

  const renderPreviewContent = () => {
    if (activeTab === "basic") {
      return (
        <>
          {renderHeroSection()}
        </>
      );
    }

    if (activeTab === "schedule") {
      return (
        <>
          {renderSchedulePreview()}
        </>
      );
    }

    if (activeTab === "packing") {
      return (
        <>
          {renderPackingPreview()}
        </>
      );
    }

    if (activeTab === "photos") {
      return (
        <>
          {renderGooglePhotoPreview()}
        </>
      );
    }

    return (
      <>
        {renderHeroSection()}
        {renderSchedulePreview()}
        {renderPackingPreview()}
        {renderGooglePhotoPreview()}
      </>
    );
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.pageBg} ${currentTheme.text} transition-colors duration-300`}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <aside
            className={`rounded-3xl ${currentTheme.panelBg} p-5 shadow-sm ring-1 ${currentTheme.ring}`}
          >
            <h1 className="mb-4 text-2xl font-bold">旅しおり編集</h1>

            {renderTabButtons()}

            <div className="space-y-4">{renderEditorContent()}</div>
          </aside>

          <main className="space-y-6">
            <div
              className={`rounded-3xl ${currentTheme.panelBg} p-4 shadow-sm ring-1 ${currentTheme.ring}`}
            >
              <div className="flex flex-wrap gap-2">
                {tabLabels.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        isActive
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : `${currentTheme.button}`
                      } ${trip.theme === "night" && isActive ? "bg-white text-neutral-900 border-white" : ""}`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {renderPreviewContent()}

            <footer
              className={`pb-8 pt-2 text-center text-xs ${currentTheme.subtext}`}
            >
              <p>©2026 Rela-Spo Komo</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;