import { StyleSheet, View } from "react-native";
import { colors, radius } from "../styles/tokens";

type Props = {
  variant?: "inline" | "header";
};

export function AlarmClockIcon({ variant = "inline" }: Props) {
  const s = variant === "header" ? headerStyles : inlineStyles;
  return (
    <View style={s.icon}>
      <View style={s.face}>
        <View style={s.handLong} />
        <View style={s.handShort} />
      </View>
      <View style={s.topLeft} />
      <View style={s.topRight} />
    </View>
  );
}

const inlineStyles = StyleSheet.create({
  icon: {
    alignItems: "center",
    height: 18,
    justifyContent: "center",
    marginRight: 7,
    position: "relative",
    width: 18,
  },
  face: {
    alignItems: "center",
    borderColor: colors.black,
    borderRadius: radius.sm,
    borderWidth: 1.3,
    height: 14,
    justifyContent: "center",
    position: "relative",
    width: 14,
  },
  handLong: {
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    height: 4.5,
    position: "absolute",
    top: 3,
    width: 1.2,
  },
  handShort: {
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    height: 1.2,
    position: "absolute",
    right: 3,
    top: 6.2,
    width: 4,
  },
  topLeft: {
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    height: 3,
    left: 3.7,
    position: "absolute",
    top: 1.8,
    transform: [{ rotate: "-35deg" }],
    width: 5.5,
  },
  topRight: {
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    height: 3,
    position: "absolute",
    right: 3.7,
    top: 1.8,
    transform: [{ rotate: "35deg" }],
    width: 5.5,
  },
});

const headerStyles = StyleSheet.create({
  icon: {
    alignItems: "center",
    borderColor: colors.borderMuted,
    borderRadius: radius.circle,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    position: "relative",
    width: 42,
  },
  face: {
    alignItems: "center",
    borderColor: colors.black,
    borderRadius: radius.sm,
    borderWidth: 1.7,
    height: 22,
    justifyContent: "center",
    position: "relative",
    width: 22,
  },
  handLong: {
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    height: 7,
    position: "absolute",
    top: 5,
    width: 1.8,
  },
  handShort: {
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    height: 1.8,
    position: "absolute",
    right: 5,
    top: 10,
    width: 6,
  },
  topLeft: {
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    height: 5,
    left: 12,
    position: "absolute",
    top: 8,
    transform: [{ rotate: "-35deg" }],
    width: 9,
  },
  topRight: {
    backgroundColor: colors.black,
    borderRadius: radius.sm,
    height: 5,
    position: "absolute",
    right: 12,
    top: 8,
    transform: [{ rotate: "35deg" }],
    width: 9,
  },
});
