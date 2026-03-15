import { useEffect, useState } from "react";

const defaultTrip = {
  title: "大人のしおり",
  subtitle: "Sendai & Zao Trip",
  date: "2026/1/24 - 2026/1/25",
  coverImage:
    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80",
  description:
    "旅の予定や思い出を、友達と共有できるパンフ風しおりです。",
  photoAlbumUrl: "",
  days: [
    {
      dayTitle: "1日目｜仙台駅・牛たん・居酒屋",
      schedule: [
        {
          time: "11:30",
          place: "牛たんランチ",
          note: "仙台駅周辺でおいしい牛たんを楽しむ",
          link: "",
        },
        {
          time: "15:00",
          place: "カフェ休憩",
          note: "駅近でひと休み",
          link: "",
        },
        {
          time: "18:30",
          place: "居酒屋",
          note: "日本酒と仙台らしい料理を楽しむ",
          link: "",
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
        },
        {
          time: "11:00",
          place: "蔵王エリア観光",
          note: "景色や温泉を満喫",
          link: "",
        },
      ],
    },
  ],
};

function App() {
  const [trip, setTrip] = useState(defaultTrip);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      try {
        const hash = decodeURIComponent(window.location.hash.slice(1));
        const parsed = JSON.parse(hash);

        setTrip({
          ...defaultTrip,
          ...parsed,
          days: parsed.days?.length ? parsed.days : defaultTrip.days,
        });
      } catch (error) {
        console.error("共有データの読み込みに失敗しました:", error);
      }
    }
  }, []);

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
          },
        ],
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
          dayTitle: ` ${prev.days.length + 1}日目`,
          schedule: [
            {
              time: "",
              place: "",
              note: "",
              link: "",
            },
          ],
        },
      ],
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

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* 編集エリア */}
          <aside className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h1 className="mb-4 text-2xl font-bold">旅しおり編集</h1>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">タイトル</label>
                <input
                  type="text"
                  value={trip.title}
                  onChange={(e) => updateTripField("title", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  placeholder="大人のしおり"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">サブタイトル</label>
                <input
                  type="text"
                  value={trip.subtitle}
                  onChange={(e) => updateTripField("subtitle", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  placeholder="Sendai & Zao Trip"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">日付</label>
                <input
                  type="text"
                  value={trip.date}
                  onChange={(e) => updateTripField("date", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  placeholder="2026/1/24 - 2026/1/25"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">説明文</label>
                <textarea
                  value={trip.description}
                  onChange={(e) => updateTripField("description", e.target.value)}
                  className="min-h-[100px] w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  placeholder="旅の紹介文"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">表紙画像URL</label>
                <input
                  type="url"
                  value={trip.coverImage}
                  onChange={(e) => updateTripField("coverImage", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Googleフォトのリンク
                </label>
                <input
                  type="url"
                  value={trip.photoAlbumUrl}
                  onChange={(e) => updateTripField("photoAlbumUrl", e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  placeholder="https://photos.app.goo.gl/..."
                />
              </div>
            </div>

            <hr className="my-6 border-neutral-200" />

            <div className="space-y-6">
              {trip.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="rounded-2xl border border-neutral-200 p-4"
                >
                  <label className="mb-1 block text-sm font-medium">
                    日程タイトル
                  </label>
                  <input
                    type="text"
                    value={day.dayTitle}
                    onChange={(e) => updateDayTitle(dayIndex, e.target.value)}
                    className="mb-4 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                  />

                  <div className="space-y-4">
                    {day.schedule.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="rounded-xl bg-neutral-50 p-3 ring-1 ring-neutral-200"
                      >
                        <div className="grid gap-3 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium">
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
                              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                              placeholder="11:30"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-medium">
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
                              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                              placeholder="牛たんランチ"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="mb-1 block text-xs font-medium">
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
                            className="min-h-[80px] w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                            placeholder="お店のメモや予定"
                          />
                        </div>

                        <div className="mt-3">
                          <label className="mb-1 block text-xs font-medium">
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
                            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addScheduleItem(dayIndex)}
                    className="mt-4 rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
                  >
                    ＋ この日に予定を追加
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addDay}
                className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
              >
                ＋ 日程を追加
              </button>
            </div>
          </aside>

          {/* プレビューエリア */}
          <main className="space-y-6">
            <section className="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
              <div className="relative h-[320px] w-full md:h-[420px]">
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                  <p className="mb-2 text-sm tracking-[0.2em] uppercase opacity-90">
                    Travel Book
                  </p>
                  <h1 className="text-3xl font-bold md:text-5xl">{trip.title}</h1>
                  <p className="mt-2 text-sm md:text-lg">{trip.subtitle}</p>
                  <p className="mt-1 text-sm opacity-90">{trip.date}</p>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <p className="leading-7 text-neutral-700">{trip.description}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={copyShareUrl}
                    className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-2 text-sm hover:bg-neutral-50"
                  >
                    🔗 共有URLをコピー
                  </button>

                  {trip.photoAlbumUrl && (
                    <a
                      href={trip.photoAlbumUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-2 text-sm hover:bg-neutral-50"
                    >
                      📸 Googleフォトを見る
                    </a>
                  )}
                </div>

                {copied && (
                  <p className="mt-3 text-sm text-emerald-600">
                    共有URLをコピーしました！
                  </p>
                )}
              </div>
            </section>

            {trip.days.map((day, dayIndex) => (
              <section
                key={dayIndex}
                className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8"
              >
                <h2 className="mb-6 text-2xl font-bold text-neutral-900">
                  {day.dayTitle}
                </h2>

                <div className="space-y-4">
                  {day.schedule.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="rounded-2xl border border-neutral-200 p-4 md:p-5"
                    >
                      <div className="grid gap-3 md:grid-cols-[100px_1fr]">
                        <div className="text-sm font-semibold text-neutral-500">
                          {item.time || "時間未定"}
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900">
                            {item.place || "場所未設定"}
                          </h3>

                          {item.note && (
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                              {item.note}
                            </p>
                          )}

                          {item.link && (
                            <div className="mt-3">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex rounded-full border border-neutral-300 px-3 py-1 text-xs hover:bg-neutral-50"
                              >
                                詳細を見る
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {trip.photoAlbumUrl && (
              <section className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
                <h2 className="mb-3 text-2xl font-bold text-neutral-900">
                  思い出アルバム
                </h2>
                <p className="mb-4 text-sm leading-6 text-neutral-700">
                  写真はGoogleフォトにまとめています。旅の思い出をのぞいてみてください。
                </p>
                <a
                  href={trip.photoAlbumUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-2 text-sm hover:bg-neutral-50"
                >
                  📸 アルバムを開く
                </a>
              </section>
            )}

            <footer className="pb-8 pt-4 text-center text-xs text-neutral-500">
              <p>©2026 Rela-Spo Komo</p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;