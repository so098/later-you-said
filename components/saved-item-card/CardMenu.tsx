import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SavedItem } from "../../types/item";
import { colors, radius, spacing, typography } from "../../styles/tokens";

type Props = {
  item: SavedItem;
  onEdit: (item: SavedItem) => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
  onShare: () => void;
  onClose: () => void;
};

export function CardMenu({
  item,
  onEdit,
  onDelete,
  onUpdateStatus,
  onShare,
  onClose,
}: Props) {
  return (
    <View style={styles.cardMenu}>
      <TouchableOpacity
        style={styles.cardMenuItem}
        activeOpacity={0.7}
        onPress={() => onEdit(item)}
      >
        <Text style={styles.cardMenuItemText}>수정</Text>
      </TouchableOpacity>
      <View style={styles.cardMenuDivider} />
      <TouchableOpacity
        style={styles.cardMenuItem}
        activeOpacity={0.7}
        onPress={onShare}
      >
        <Text style={styles.cardMenuItemText}>공유하기</Text>
      </TouchableOpacity>
      <View style={styles.cardMenuDivider} />
      <TouchableOpacity
        style={styles.cardMenuItem}
        activeOpacity={0.7}
        onPress={() => {
          onUpdateStatus(item.id, item.status === "완료" ? "" : "완료");
          onClose();
        }}
      >
        <Text style={styles.cardMenuItemText}>
          {item.status === "완료" ? "완료 취소" : "완료"}
        </Text>
      </TouchableOpacity>
      <View style={styles.cardMenuDivider} />
      <TouchableOpacity
        style={styles.cardMenuItem}
        activeOpacity={0.7}
        onPress={() => onDelete(item.id)}
      >
        <Text style={[styles.cardMenuItemText, styles.cardMenuItemDanger]}>
          삭제
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardMenu: {
    backgroundColor: colors.white,
    borderColor: colors.borderSubtle,
    borderRadius: radius.sm,
    borderWidth: 1,
    elevation: 4,
    minWidth: 110,
    position: "absolute",
    right: spacing.xxl,
    shadowColor: colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    top: 44,
    zIndex: 5,
  },
  cardMenuItem: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.buttonV,
  },
  cardMenuItemText: {
    color: colors.textSecondary,
    ...typography.bodySemibold,
  },
  cardMenuItemDanger: {
    color: colors.accentSun,
  },
  cardMenuDivider: {
    backgroundColor: colors.divider,
    height: 1,
  },
});
