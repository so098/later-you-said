import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { categories } from "../constants/categories";
import { reminderPresets } from "../constants/reminders";
import { NewItemDraft } from "../hooks/useNewItemForm";
import { AddPageChipGroup } from "../components/AddPageChipGroup";
import { colors, radius, spacing, typography } from "../styles/tokens";

type Props = {
  editingItemId: number | null;
  newItem: NewItemDraft;
  setNewItem: React.Dispatch<React.SetStateAction<NewItemDraft>>;
  isCustomReminder: boolean;
  isReminderPickerOpen: boolean;
  setIsReminderPickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  onSubmit: () => void;
};

export function AddItemForm({
  editingItemId,
  newItem,
  setNewItem,
  isCustomReminder,
  isReminderPickerOpen,
  setIsReminderPickerOpen,
  onClose,
  onSubmit,
}: Props) {
  return (
    <View style={styles.addPageOverlay}>
      <View style={styles.addPageHeader}>
        <View>
          <Text style={styles.addPageHeaderTitle}>
            {editingItemId !== null ? "묻어둔 것 고치기" : "새로 묻어둘 것"}
          </Text>
          <Text style={styles.addPageHeaderSubtitle}>
            {editingItemId !== null
              ? "내용 바꾸면 알림도 새 값으로 간다"
              : "나중의 내가 또 미루지 못하게"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addPageHeaderClose}
          activeOpacity={0.8}
          onPress={onClose}
        >
          <View style={[styles.closeIconLine, styles.closeIconLineLeft]} />
          <View style={[styles.closeIconLine, styles.closeIconLineRight]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.addPageScroll}
      >
        <View style={styles.addPageField}>
          <Text style={styles.addPageLabel}>링크를 적어줘</Text>
          <TextInput
            style={styles.addPageInput}
            placeholder="https:// 링크 붙여넣기"
            placeholderTextColor={colors.placeholder}
            value={newItem.source}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            textContentType="URL"
            onChangeText={(source) =>
              setNewItem((prev) => ({ ...prev, source }))
            }
          />
        </View>

        <View style={styles.addPageField}>
          <Text style={styles.addPageLabel}>메모</Text>
          <TextInput
            style={styles.addPageInput}
            placeholder="뭘 저장하는 건데?"
            placeholderTextColor={colors.placeholder}
            value={newItem.title}
            onChangeText={(title) =>
              setNewItem((prev) => ({ ...prev, title }))
            }
          />
        </View>

        <AddPageChipGroup
          label="왜 할거야?"
          options={categories.slice(1)}
          activeOption={newItem.category}
          onSelect={(category) =>
            setNewItem((prev) => ({ ...prev, category }))
          }
        />

        <View style={styles.addPageField}>
          <Text style={styles.addPageLabel}>언제 알림 받을래?</Text>
          <View style={styles.addPageChipRow}>
            {reminderPresets.map((reminder) => {
              const isActive =
                reminder === "직접 선택"
                  ? isCustomReminder || isReminderPickerOpen
                  : newItem.reminder === reminder;
              return (
                <TouchableOpacity
                  key={reminder}
                  style={[
                    styles.addPageChip,
                    isActive && styles.addPageChipActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (reminder === "직접 선택") {
                      setIsReminderPickerOpen((prev) => !prev);
                    } else {
                      setNewItem((prev) => ({ ...prev, reminder }));
                      setIsReminderPickerOpen(false);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.addPageChipText,
                      isActive && styles.addPageChipTextActive,
                    ]}
                  >
                    {reminder === "직접 선택" && isCustomReminder
                      ? newItem.reminder
                      : reminder}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <AddPageChipGroup
          label="얼마나 걸려?"
          options={["5분 이하", "15분 이하", "30분 이하", "길게 봐야 함"]}
          activeOption={newItem.meta.split(" · ")[0]}
          onSelect={(time) =>
            setNewItem((prev) => ({ ...prev, meta: `${time} · 오늘 필요` }))
          }
        />

        <AddPageChipGroup
          label="안 보면 손해 보는 이유는?"
          options={[
            "가볍게 봐도 됨",
            "안 보면 아까움",
            "진짜 봐야 함",
            "또 미루면 인간 아님",
          ]}
          activeOption={newItem.pressure}
          onSelect={(pressure) =>
            setNewItem((prev) => ({ ...prev, pressure }))
          }
        />
      </ScrollView>

      <View style={styles.addPageSubmitBar}>
        <TouchableOpacity
          style={styles.addPageSubmitButton}
          activeOpacity={0.85}
          onPress={onSubmit}
        >
          <Text style={styles.addPageSubmitText}>
            {editingItemId !== null ? "이대로 저장" : "추가하고 무조건 보기"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addPageOverlay: {
    backgroundColor: colors.white,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 8,
  },
  addPageHeader: {
    alignItems: "center",
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.xxxl,
  },
  addPageHeaderTitle: {
    color: colors.textPrimary,
    ...typography.formTitle,
  },
  addPageHeaderSubtitle: {
    color: colors.textDisabled,
    fontSize: 12,
    fontWeight: "400",
    marginTop: spacing.xs,
  },
  addPageHeaderClose: {
    alignItems: "center",
    borderColor: colors.borderStrong,
    borderRadius: 18,   // 36×36 버튼의 circle radius — 1회 사용
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    position: "relative",
    width: 36,
  },
  closeIconLine: {
    backgroundColor: colors.textMuted,
    borderRadius: radius.pill,
    height: 1.6,
    position: "absolute",
    width: 15,
  },
  closeIconLineLeft: {
    transform: [{ rotate: "45deg" }],
  },
  closeIconLineRight: {
    transform: [{ rotate: "-45deg" }],
  },
  addPageScroll: {
    paddingBottom: 32,
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.pageH,
  },
  addPageSubmitBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    paddingBottom: spacing.section,
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.xl,
  },
  addPageField: {
    marginBottom: spacing.pageH,
  },
  addPageLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: spacing.lg,
  },
  addPageInput: {
    borderBottomColor: colors.borderStrong,
    borderBottomWidth: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "500",
    paddingBottom: spacing.lg,
    paddingTop: spacing.xs,
  },
  addPageChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  addPageChip: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.paddingHMd,
    paddingVertical: 9,
  },
  addPageChipActive: {
    backgroundColor: colors.black,
  },
  addPageChipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  addPageChipTextActive: {
    color: colors.white,
  },
  addPageSubmitButton: {
    alignItems: "center",
    backgroundColor: colors.black,
    borderRadius: radius.md,
    paddingVertical: 16,
  },
  addPageSubmitText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
});
