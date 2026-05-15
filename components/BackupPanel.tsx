import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SavedItem } from "../types/item";
import {
  exportItemsBackup,
  exportNotionMarkdown,
  exportObsidianMarkdown,
  importItemsBackup,
} from "../lib/backup";
import { colors, radius, spacing } from "../styles/tokens";

type BackupPanelProps = {
  items: SavedItem[];
  onRestoreItems: (items: SavedItem[]) => void;
};

export function BackupPanel({ items, onRestoreItems }: BackupPanelProps) {
  const handleExport = async () => {
    try {
      await exportItemsBackup(items);
    } catch (error) {
      Alert.alert(
        "백업 실패",
        error instanceof Error ? error.message : "파일로 저장하다가 삐끗했어.",
      );
    }
  };

  const handleExportObsidian = async () => {
    try {
      await exportObsidianMarkdown(items);
    } catch (error) {
      Alert.alert(
        "Obsidian 내보내기 실패",
        error instanceof Error ? error.message : "Markdown 만들다가 삐끗했어.",
      );
    }
  };

  const handleExportNotion = async () => {
    try {
      await exportNotionMarkdown(items);
    } catch (error) {
      Alert.alert(
        "Notion 내보내기 실패",
        error instanceof Error ? error.message : "Notion용 Markdown 만들다가 삐끗했어.",
      );
    }
  };

  const handleImport = async () => {
    try {
      const importedItems = await importItemsBackup();

      if (!importedItems) {
        return;
      }

      Alert.alert(
        "복원할까?",
        `지금 목록을 백업 파일의 ${importedItems.length}개 항목으로 바꿀 거야. 괜찮아?`,
        [
          { text: "아냐", style: "cancel" },
          {
            text: "복원 ㄱㄱ",
            style: "destructive",
            onPress: () => onRestoreItems(importedItems),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "복원 실패",
        error instanceof Error ? error.message : "파일을 읽다가 삐끗했어.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.copyWrap}>
        <Text style={styles.title}>iCloud 백업</Text>
        <Text style={styles.description}>
          카드 내용은 폰에 두고, 백업은 iCloud Drive에. Obsidian/Notion용 노트도 뽑을 수 있어.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.82}
          onPress={handleImport}
        >
          <Text style={styles.secondaryButtonText}>가져오기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.82}
          onPress={handleExport}
        >
          <Text style={styles.primaryButtonText}>백업 내보내기</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.exportButton}
        activeOpacity={0.82}
        onPress={handleExportObsidian}
      >
        <Text style={styles.exportButtonText}>Obsidian용 Markdown 내보내기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.exportButton}
        activeOpacity={0.82}
        onPress={handleExportNotion}
      >
        <Text style={styles.exportButtonText}>Notion용 Markdown 내보내기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    padding: spacing.xxl,
  },
  copyWrap: {
    gap: 5,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
  description: {
    color: colors.textFaint,
    fontSize: 12,
    lineHeight: 17,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.black,
    borderRadius: radius.button,
    flex: 1,
    paddingVertical: spacing.buttonV,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: colors.borderMuted,
    borderRadius: radius.button,
    borderWidth: 1,
    flex: 1,
    paddingVertical: spacing.lg,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  exportButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.button,
    marginTop: spacing.md,
    paddingVertical: spacing.buttonV,
  },
  exportButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
});
