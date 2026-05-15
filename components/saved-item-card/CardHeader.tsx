import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SavedItem } from "../../types/item";
import { colors, radius, spacing, typography } from "../../styles/tokens";

type Props = {
  item: SavedItem;
  activeMenuId: number | null;
  setActiveMenuId: (id: number | null) => void;
};

export function CardHeader({ item, activeMenuId, setActiveMenuId }: Props) {
  return (
    <View style={styles.cardTop}>
      <Text style={styles.cardStar}>★</Text>
      <View style={styles.cardMain}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.cardTitleEnd}>
            {item.status ? (
              <Text style={styles.status}>{item.status}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.cardMenuButton}
              activeOpacity={0.6}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={() =>
                setActiveMenuId(activeMenuId === item.id ? null : item.id)
              }
            >
              <View style={styles.cardMenuDot} />
              <View style={styles.cardMenuDot} />
              <View style={styles.cardMenuDot} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.source}>{item.source}</Text>
        <Text style={styles.meta}>
          {item.category} · {item.meta}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardTop: {
    flexDirection: "row",
  },
  cardStar: {
    color: colors.starMuted,
    fontSize: 28,
    includeFontPadding: false,
    lineHeight: 32,
    marginRight: spacing.xl,
    marginTop: 2,
  },
  cardMain: {
    flex: 1,
  },
  cardTitleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.4,
    lineHeight: 22,
    paddingRight: spacing.lg,
  },
  status: {
    color: colors.textPrimary,
    fontSize: 11, // 완료 뱃지 전용 소형 크기 — 1회 사용
    fontWeight: "600",
    marginRight: spacing.xs,
    marginTop: spacing.xs,
  },
  cardTitleEnd: {
    alignItems: "center",
    flexDirection: "row",
  },
  cardMenuButton: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    marginLeft: spacing.sm,
    width: 24,
  },
  cardMenuDot: {
    backgroundColor: colors.menuDot, // #AAAAAA — 1회 사용
    borderRadius: radius.sm,
    height: 3.5,
    marginVertical: 1.2,
    width: 3.5,
  },
  source: {
    color: colors.textDisabled,
    ...typography.captionRegular,
    marginTop: spacing.xs,
  },
  meta: {
    color: colors.textTertiary,
    ...typography.captionSemibold,
    marginTop: spacing.lg,
  },
});
