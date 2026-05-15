import { useRef } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SavedItem } from "../types/item";
import { colors, radius, spacing, typography } from "../styles/tokens";

type Props = {
  items: SavedItem[];
  reminderIndex: number;
  setReminderIndex: (index: number) => void;
  previewCardWidth: number;
};

export function ReminderPreviewCarousel({
  items,
  reminderIndex,
  setReminderIndex,
  previewCardWidth,
}: Props) {
  const previewPagerRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.reminderPreviewSection}>
      <View style={[styles.previewPagerFrame, { width: previewCardWidth }]}>
        <Animated.ScrollView
          ref={previewPagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate="fast"
          style={styles.previewPager}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: true,
              listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const nextIndex = Math.round(
                  event.nativeEvent.contentOffset.x / previewCardWidth,
                );
                const clampedIndex = Math.min(
                  Math.max(nextIndex, 0),
                  items.length - 1,
                );

                if (clampedIndex !== reminderIndex) {
                  setReminderIndex(clampedIndex);
                }
              },
            },
          )}
          onMomentumScrollEnd={(
            event: NativeSyntheticEvent<NativeScrollEvent>,
          ) => {
            const nextIndex = Math.round(
              event.nativeEvent.contentOffset.x / previewCardWidth,
            );
            setReminderIndex(Math.min(Math.max(nextIndex, 0), items.length - 1));
          }}
        >
          {items.map((item, index) => {
            const inputRange = [
              (index - 1) * previewCardWidth,
              index * previewCardWidth,
              (index + 1) * previewCardWidth,
            ];
            const animatedCardStyle = {
              opacity: scrollX.interpolate({
                inputRange,
                outputRange: [0.35, 1, 0.35],
                extrapolate: "clamp" as const,
              }),
              transform: [
                {
                  scale: scrollX.interpolate({
                    inputRange,
                    outputRange: [0.94, 1, 0.94],
                    extrapolate: "clamp" as const,
                  }),
                },
              ],
            };

            return (
              <Animated.View
                key={item.id}
                style={[
                  styles.notificationPreview,
                  { width: previewCardWidth },
                  animatedCardStyle,
                ]}
              >
                <Text style={styles.previewStar}>★</Text>
                <View style={styles.previewContent}>
                  <Text style={styles.previewTitle}>야… {item.pressure}</Text>
                  <Text style={styles.previewMeta}>{item.title}</Text>
                  <Text style={styles.previewTime}>{item.reminder}</Text>
                </View>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      </View>
      <View style={styles.previewDots}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.previewDot,
              reminderIndex === index && styles.previewDotActive,
            ]}
            activeOpacity={0.8}
            onPress={() => {
              setReminderIndex(index);
              previewPagerRef.current?.scrollTo({
                x: index * previewCardWidth,
                animated: true,
              });
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reminderPreviewSection: {
    marginBottom: spacing.xxl,
  },
  previewPagerFrame: {
    borderRadius: radius.lg,
    overflow: "hidden",
    position: "relative",
  },
  previewPager: {
    borderRadius: radius.lg,
  },
  notificationPreview: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: "row",
    minHeight: 116,
    padding: spacing.xxxl,
  },
  previewStar: {
    color: colors.starFaint, // #D3D3D3 — 1회 사용
    fontSize: 40,
    includeFontPadding: false,
    lineHeight: 44,
    marginRight: spacing.xxl,
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  previewMeta: {
    color: colors.textSubtle,
    ...typography.captionRegular,
  },
  previewTime: {
    color: colors.textPrimary,
    ...typography.captionSemibold,
    fontWeight: "700",
    marginTop: spacing.md,
  },
  previewDots: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
  },
  previewDot: {
    backgroundColor: colors.dot, // #D9D9D9 — 1회 사용
    borderRadius: radius.sm,
    height: 7,
    marginHorizontal: spacing.xs,
    width: 7,
  },
  previewDotActive: {
    backgroundColor: colors.black,
    width: 18,
  },
});
