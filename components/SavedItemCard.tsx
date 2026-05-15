import {
  Alert,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SavedItem } from "../types/item";
import { AlarmClockIcon } from "./AlarmClockIcon";
import { trackEvent } from "../lib/analytics";
import { colors, radius, spacing, typography } from "../styles/tokens";

type Props = {
  item: SavedItem;
  activeMenuId: number | null;
  setActiveMenuId: (id: number | null) => void;
  onEdit: (item: SavedItem) => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
};

function normalizeUrl(source: string) {
  const trimmed = source.trim();

  if (!trimmed) {
    return "";
  }

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function SavedItemCard({
  item,
  activeMenuId,
  setActiveMenuId,
  onEdit,
  onDelete,
  onUpdateStatus,
}: Props) {
  const shareItemLink = async () => {
    const url = normalizeUrl(item.source);

    if (!url || item.source === "saved.link") {
      Alert.alert("공유할 링크가 없어", "이 카드엔 아직 링크가 없어.");
      return;
    }

    try {
      await Share.share({
        title: item.title,
        message: `${item.title}\n${url}`,
        url,
      });
      await trackEvent("item_shared", {
        item_id: item.id,
        category: item.category,
      });
      setActiveMenuId(null);
    } catch (error) {
      console.warn("failed to share link", error);
      Alert.alert("공유 실패", "공유창 열다가 삐끗했어.");
    }
  };

  const openItemLink = async () => {
    const url = normalizeUrl(item.source);

    if (!url || item.source === "saved.link") {
      Alert.alert("링크가 없어", "이 카드엔 열 수 있는 링크가 아직 없어.");
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        Alert.alert("못 여는 링크야", "주소가 맞는지 한 번 봐줘.");
        return;
      }

      await trackEvent("item_opened", {
        item_id: item.id,
        category: item.category,
        has_url: true,
      });
      await Linking.openURL(url);
    } catch (error) {
      console.warn("failed to open link", error);
      Alert.alert("링크 열기 실패", "주소 열다가 삐끗했어.");
    }
  };

  return (
    <View style={styles.card}>
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
                  setActiveMenuId(
                    activeMenuId === item.id ? null : item.id,
                  )
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

      {activeMenuId === item.id ? (
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
            onPress={() => void shareItemLink()}
          >
            <Text style={styles.cardMenuItemText}>공유하기</Text>
          </TouchableOpacity>
          <View style={styles.cardMenuDivider} />
          <TouchableOpacity
            style={styles.cardMenuItem}
            activeOpacity={0.7}
            onPress={() => {
              onUpdateStatus(item.id, item.status === "완료" ? "" : "완료");
              setActiveMenuId(null);
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
      ) : null}

      <View style={styles.reminderBox}>
        <View style={styles.reminderTimeRow}>
          <AlarmClockIcon />
          <Text style={styles.reminderTime}>{item.reminder}</Text>
        </View>
        <Text style={styles.reminderCopy}>{item.pressure}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryAction}
          activeOpacity={0.85}
          onPress={() => void openItemLink()}
        >
          <Text style={styles.primaryActionText}>지금 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryAction}
          activeOpacity={0.85}
          onPress={() => onUpdateStatus(item.id, "완료")}
        >
          <Text style={styles.secondaryActionText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginBottom: spacing.xxl,
    padding: spacing.xxxl,
  },
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
    fontSize: 11,
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
    fontSize: 13,
    fontWeight: "600",
  },
  cardMenuItemDanger: {
    color: colors.accentSun,
  },
  cardMenuDivider: {
    backgroundColor: colors.divider,
    height: 1,
  },
  source: {
    color: colors.textDisabled,
    fontSize: 12,
    fontWeight: "400",
    marginTop: spacing.xs,
  },
  meta: {
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: spacing.lg,
  },
  reminderBox: {
    backgroundColor: colors.surfaceAlt, // #F7F7F7 — 1회 사용
    borderRadius: radius.md,
    marginTop: 15,
    padding: spacing.xxl,
  },
  reminderTimeRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
  },
  reminderTime: {
    color: colors.textPrimary,
    ...typography.bodyBold,
  },
  reminderCopy: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 19,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    flex: 1.25,
    paddingVertical: spacing.xl,
  },
  primaryActionText: {
    color: colors.white,
    ...typography.bodyBold,
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    flex: 1,
    paddingVertical: spacing.xl,
  },
  secondaryActionText: {
    color: colors.textTertiary,
    fontSize: 13,
    fontWeight: "600",
  },
});
