import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing } from "../styles/tokens";

type Props = {
  onPress: () => void;
};

export function Fab({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.fabIconLine} />
      <View style={[styles.fabIconLine, styles.fabIconLineVertical]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    alignItems: "center",
    backgroundColor: colors.black,
    borderRadius: radius.fab,
    bottom: 88,
    height: 58,
    justifyContent: "center",
    position: "absolute",
    right: spacing.pageH,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    width: 58,
    zIndex: 10,
  },
  fabIconLine: {
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    height: 2,
    position: "absolute",
    width: 20,
  },
  fabIconLineVertical: {
    transform: [{ rotate: "90deg" }],
  },
});
