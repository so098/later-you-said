import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { tabs } from "../constants/categories";
import { colors, spacing } from "../styles/tokens";

type Props = {
  selectedTab: string;
  onChangeTab: (tab: string) => void;
};

export function BottomNav({ selectedTab, onChangeTab }: Props) {
  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = selectedTab === tab;

        return (
          <TouchableOpacity
            key={tab}
            style={styles.navButton}
            activeOpacity={0.8}
            onPress={() => onChangeTab(tab)}
          >
            <Text style={isActive ? styles.navActive : styles.navItem}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    left: 0,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    position: "absolute",
    right: 0,
  },
  navButton: {
    alignItems: "center",
    flex: 1,
  },
  navActive: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "800",
  },
  navItem: {
    color: colors.textDisabled, // #999999
    fontSize: 13,
    fontWeight: "600",
  },
});
