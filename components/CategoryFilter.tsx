import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { categories } from "../constants/categories";
import { colors, radius, spacing } from "../styles/tokens";

type Props = {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  isCategoryOpen: boolean;
  setIsCategoryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categoryButtonLabel: string;
  isCompletedOnly: boolean;
  setIsCompletedOnly: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
  isCategoryOpen,
  setIsCategoryOpen,
  categoryButtonLabel,
  isCompletedOnly,
  setIsCompletedOnly,
}: Props) {
  const removeCategoryAt = (index: number) => {
    setSelectedCategories((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategories.length > 0 && styles.categoryButtonActive,
          ]}
          activeOpacity={0.8}
          onPress={() => setIsCategoryOpen((prev) => !prev)}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategories.length > 0 && styles.categoryButtonTextActive,
            ]}
          >
            {categoryButtonLabel}
          </Text>
          <View
            style={[
              isCategoryOpen
                ? styles.categoryChevronUp
                : styles.categoryChevron,
              selectedCategories.length > 0 &&
                (isCategoryOpen
                  ? styles.categoryChevronUpActive
                  : styles.categoryChevronActive),
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.completedFilterButton}
          activeOpacity={0.8}
          onPress={() => setIsCompletedOnly((prev) => !prev)}
        >
          <View
            style={[
              styles.completedCheckbox,
              isCompletedOnly && styles.completedCheckboxActive,
            ]}
          >
            {isCompletedOnly ? (
              <Text style={styles.completedCheckMark}>✓</Text>
            ) : null}
          </View>
          <Text
            style={[
              styles.completedFilterText,
              isCompletedOnly && styles.completedFilterTextActive,
            ]}
          >
            완료
          </Text>
        </TouchableOpacity>
      </View>

      {isCategoryOpen ? (
        <View style={styles.categoryDropdown}>
          {categories
            .filter((category) => category !== "전체")
            .map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryOption}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedCategories((prev) => [...prev, category]);
                }}
              >
                <Text style={styles.categoryOptionText}>{category}</Text>
              </TouchableOpacity>
            ))}
        </View>
      ) : null}

      {selectedCategories.length > 0 ? (
        <View style={styles.selectedTagRow}>
          {selectedCategories.map((category, index) => (
            <TouchableOpacity
              key={`${category}-${index}`}
              style={styles.selectedTag}
              activeOpacity={0.8}
              onPress={() => removeCategoryAt(index)}
            >
              <Text style={styles.selectedTagText}>{category}</Text>
              <Text style={styles.selectedTagClose}>×</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.selectedTagClear}
            activeOpacity={0.8}
            onPress={() => setSelectedCategories([])}
          >
            <Text style={styles.selectedTagClearText}>전체 지우기</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    zIndex: 2,
  },
  completedFilterButton: {
    alignItems: "center",
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  completedCheckbox: {
    alignItems: "center",
    borderColor: colors.borderMuted,
    borderRadius: 4,
    borderWidth: 1,
    height: 15,
    justifyContent: "center",
    marginRight: spacing.sm,
    width: 15,
  },
  completedCheckboxActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  completedCheckMark: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "800",
    includeFontPadding: false,
    lineHeight: 12,
  },
  completedFilterText: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: "600",
  },
  completedFilterTextActive: {
    color: colors.textPrimary,
  },
  categoryButton: {
    alignItems: "center",
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    borderWidth: 1,
    flexDirection: "row",
    maxWidth: 160,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  categoryButtonActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  categoryButtonText: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: "600",
  },
  categoryButtonTextActive: {
    color: colors.white,
  },
  categoryChevron: {
    borderLeftColor: "transparent",
    borderLeftWidth: 4,
    borderRightColor: "transparent",
    borderRightWidth: 4,
    borderTopColor: colors.textSubtle,
    borderTopWidth: 5,
    height: 0,
    marginLeft: spacing.md,
    width: 0,
  },
  categoryChevronActive: {
    borderTopColor: colors.white,
  },
  categoryChevronUp: {
    borderBottomColor: colors.textSubtle,
    borderBottomWidth: 5,
    borderLeftColor: "transparent",
    borderLeftWidth: 4,
    borderRightColor: "transparent",
    borderRightWidth: 4,
    borderTopWidth: 0,
    height: 0,
    marginLeft: spacing.md,
    width: 0,
  },
  categoryChevronUpActive: {
    borderBottomColor: colors.white,
  },
  categoryDropdown: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.chipGap,
    marginBottom: spacing.xxl,
    padding: spacing.lg,
  },
  categoryOption: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.paddingHSm,
    paddingVertical: spacing.md,
  },
  categoryOptionText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  selectedTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.chipGap,
    marginBottom: spacing.xxl,
  },
  selectedTag: {
    alignItems: "center",
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    flexDirection: "row",
    paddingHorizontal: spacing.paddingHSm,
    paddingVertical: spacing.chipGap,
  },
  selectedTagText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  selectedTagClose: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    includeFontPadding: false,
    lineHeight: 14,
    marginLeft: spacing.sm,
    textAlignVertical: "center",
  },
  selectedTagClear: {
    alignItems: "center",
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.paddingHSm,
    paddingVertical: spacing.chipGap,
  },
  selectedTagClearText: {
    color: colors.textSubtle,
    fontSize: 12,
    fontWeight: "600",
  },
});
