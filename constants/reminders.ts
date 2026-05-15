import { SavedItem } from "../types/item";

export const reminderPresets = ["오늘 밤 9시", "내일 오전", "직접 선택"];

export const DEFAULT_NEW_ITEM = {
  title: "",
  source: "",
  category: "",
  meta: "15분 · 오늘 필요",
  pressure: "",
  reminder: "오늘 밤 9:00",
};

export const seedItems: SavedItem[] = [
  {
    id: 1,
    title: "React Query 캐싱 전략 정리",
    source: "velog.io",
    status: "",
    category: "이직 취업",
    meta: "취업 · 15분 · 오늘 필요",
    pressure: "오늘 안 보면 또 묵힌다",
    reminder: "오늘 밤 9:00",
  },
  {
    id: 2,
    title: "포트폴리오 모바일 UX 레퍼런스",
    source: "dribbble.com",
    status: "",
    category: "프로젝트",
    meta: "프로젝트 · 5분 · 이번 주",
    pressure: "짧다. 핑계 금지.",
    reminder: "내일 오전 10:00",
  },
];
