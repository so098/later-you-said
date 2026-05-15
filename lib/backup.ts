import { File, Paths } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { SavedItem } from "../types/item";
import { trackEvent } from "./analytics";

type BackupPayload = {
  app: "later-you-said";
  version: 1;
  exportedAt: string;
  items: SavedItem[];
};

function getExportDate() {
  return new Date().toISOString().slice(0, 10);
}

function buildBackupFileName() {
  return `later-you-said-backup-${getExportDate()}.json`;
}

function buildObsidianFileName() {
  return `나중에본다며-${getExportDate()}.md`;
}

function buildNotionFileName() {
  return `나중에본다며-notion-${getExportDate()}.md`;
}

function escapeMarkdown(value: string) {
  return value.replace(/\|/g, "\\|").trim();
}

function buildObsidianMarkdown(items: SavedItem[]) {
  const exportedAt = new Date().toLocaleString("ko-KR");
  const itemLines = items
    .map((item, index) => {
      const status = item.status || "아직 안 봄";
      return [
        `## ${index + 1}. ${escapeMarkdown(item.title) || "제목 없음"}`,
        "",
        `- 출처: ${escapeMarkdown(item.source) || "없음"}`,
        `- 카테고리: ${escapeMarkdown(item.category) || "미분류"}`,
        `- 상태: ${escapeMarkdown(status)}`,
        `- 메타: ${escapeMarkdown(item.meta) || "없음"}`,
        `- 알림: ${escapeMarkdown(item.reminder) || "없음"}`,
        `- 압박 문구: ${escapeMarkdown(item.pressure) || "없음"}`,
        "",
        "---",
        "",
      ].join("\n");
    })
    .join("\n");

  return [
    "# 나중에본다며 백업",
    "",
    `- 내보낸 시간: ${exportedAt}`,
    `- 전체 항목: ${items.length}개`,
    "- 용도: Obsidian에서 읽기 좋은 Markdown export",
    "",
    "---",
    "",
    itemLines || "아직 묻어둔 게 없어. 이건 좋은 건가...?",
  ].join("\n");
}

function buildNotionMarkdown(items: SavedItem[]) {
  const exportedAt = new Date().toLocaleString("ko-KR");
  const tableRows = items
    .map((item) => {
      const status = item.status || "아직 안 봄";
      return `| ${escapeMarkdown(item.title) || "제목 없음"} | ${escapeMarkdown(item.source) || "없음"} | ${escapeMarkdown(item.category) || "미분류"} | ${escapeMarkdown(status)} | ${escapeMarkdown(item.meta) || "없음"} | ${escapeMarkdown(item.reminder) || "없음"} |`;
    })
    .join("\n");

  const detailBlocks = items
    .map((item) => {
      const status = item.status || "아직 안 봄";
      return [
        `### ${escapeMarkdown(item.title) || "제목 없음"}`,
        "",
        `- [ ] 보기`,
        `- 출처: ${escapeMarkdown(item.source) || "없음"}`,
        `- 카테고리: ${escapeMarkdown(item.category) || "미분류"}`,
        `- 상태: ${escapeMarkdown(status)}`,
        `- 메타: ${escapeMarkdown(item.meta) || "없음"}`,
        `- 알림: ${escapeMarkdown(item.reminder) || "없음"}`,
        `- 압박 문구: ${escapeMarkdown(item.pressure) || "없음"}`,
        "",
      ].join("\n");
    })
    .join("\n");

  return [
    "# 나중에본다며 Notion Export",
    "",
    `내보낸 시간: ${exportedAt}`,
    `전체 항목: ${items.length}개`,
    "",
    "## 전체 목록",
    "",
    "| 제목 | 출처 | 카테고리 | 상태 | 메타 | 알림 |",
    "| --- | --- | --- | --- | --- | --- |",
    tableRows || "| 아직 묻어둔 게 없음 | - | - | - | - | - |",
    "",
    "## 상세",
    "",
    detailBlocks || "아직 묻어둔 게 없어. Notion도 놀라는 중.",
  ].join("\n");
}

function isSavedItem(value: unknown): value is SavedItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<SavedItem>;
  return (
    typeof item.id === "number" &&
    typeof item.title === "string" &&
    typeof item.source === "string" &&
    typeof item.status === "string" &&
    typeof item.category === "string" &&
    typeof item.meta === "string" &&
    typeof item.pressure === "string" &&
    typeof item.reminder === "string"
  );
}

function parseBackupPayload(raw: string): SavedItem[] {
  const parsed: unknown = JSON.parse(raw);

  if (!parsed || typeof parsed !== "object") {
    throw new Error("백업 파일 형식이 이상해.");
  }

  const payload = parsed as Partial<BackupPayload>;

  if (payload.app !== "later-you-said" || payload.version !== 1) {
    throw new Error("이 앱에서 만든 백업 파일이 아닌 것 같아.");
  }

  if (!Array.isArray(payload.items) || !payload.items.every(isSavedItem)) {
    throw new Error("백업 안의 카드 데이터가 깨져 있어.");
  }

  return payload.items;
}

export async function exportItemsBackup(items: SavedItem[]) {
  const payload: BackupPayload = {
    app: "later-you-said",
    version: 1,
    exportedAt: new Date().toISOString(),
    items,
  };

  const file = new File(Paths.cache, buildBackupFileName());
  file.write(JSON.stringify(payload, null, 2));

  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    throw new Error("이 환경에서는 파일 저장/공유 창을 열 수 없어.");
  }

  await Sharing.shareAsync(file.uri, {
    dialogTitle: "백업 파일 저장하기",
    mimeType: "application/json",
    UTI: "public.json",
  });

  void trackEvent("backup_exported", { item_count: items.length });
}

export async function exportObsidianMarkdown(items: SavedItem[]) {
  const file = new File(Paths.cache, buildObsidianFileName());
  file.write(buildObsidianMarkdown(items));

  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    throw new Error("이 환경에서는 Markdown 파일 저장/공유 창을 열 수 없어.");
  }

  await Sharing.shareAsync(file.uri, {
    dialogTitle: "Obsidian용 Markdown 저장하기",
    mimeType: "text/markdown",
    UTI: "net.daringfireball.markdown",
  });

  void trackEvent("obsidian_markdown_exported", { item_count: items.length });
}

export async function exportNotionMarkdown(items: SavedItem[]) {
  const file = new File(Paths.cache, buildNotionFileName());
  file.write(buildNotionMarkdown(items));

  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    throw new Error("이 환경에서는 Notion용 Markdown 저장/공유 창을 열 수 없어.");
  }

  await Sharing.shareAsync(file.uri, {
    dialogTitle: "Notion용 Markdown 저장하기",
    mimeType: "text/markdown",
    UTI: "net.daringfireball.markdown",
  });

  void trackEvent("notion_markdown_exported", { item_count: items.length });
}

export async function importItemsBackup() {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
    multiple: false,
  });

  if (result.canceled || !result.assets?.[0]) {
    return null;
  }

  const selectedFile = new File(result.assets[0].uri);
  const raw = await selectedFile.text();
  const items = parseBackupPayload(raw);

  void trackEvent("backup_imported", { item_count: items.length });

  return items;
}
