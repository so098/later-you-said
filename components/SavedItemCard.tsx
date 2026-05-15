import { Alert, Linking, Share, StyleSheet, View } from "react-native";
import { SavedItem } from "../types/item";
import { trackEvent } from "../lib/analytics";
import { colors, radius, spacing } from "../styles/tokens";
import { CardHeader } from "./saved-item-card/CardHeader";
import { CardMenu } from "./saved-item-card/CardMenu";
import { CardReminderBox } from "./saved-item-card/CardReminderBox";
import { CardActions } from "./saved-item-card/CardActions";

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
      <CardHeader
        item={item}
        activeMenuId={activeMenuId}
        setActiveMenuId={setActiveMenuId}
      />

      {activeMenuId === item.id ? (
        <CardMenu
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
          onShare={() => void shareItemLink()}
          onClose={() => setActiveMenuId(null)}
        />
      ) : null}

      <CardReminderBox reminder={item.reminder} pressure={item.pressure} />

      <CardActions
        onOpen={() => void openItemLink()}
        onComplete={() => onUpdateStatus(item.id, "완료")}
      />
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
});
