export const reminderPresets = ["오늘 밤 9시", "내일 오전", "직접 입력"];

export const DEFAULT_NEW_ITEM = {
  title: "",
  source: "",
  category: "",
  meta: "15분 · 오늘 필요",
  pressure: "",
  reminder: "직접 입력",
};

export const REPEAT_OPTIONS = ["없음", "매일", "매주", "매월"] as const;
export const FREQUENT_DURATIONS = ["10분", "30분", "1시간", "2시간", "하루"] as const;
export type RepeatOption = (typeof REPEAT_OPTIONS)[number] | "수시로";

