import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing } from "../styles/tokens";

const HOURS = Array.from({ length: 24 }, (_, h) => h);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  today: Date;
  viewYear: number;
  viewMonth: number;
  pickerYear: number;
  pickerMonth: number;
  pickerDay: number;
  pickerHour: number;
  setPickerHour: (h: number) => void;
  pickerMinute: number;
  setPickerMinute: (m: number) => void;
  pickerRepeat: string;
  setPickerRepeat: (r: string) => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  selectDay: (day: number) => void;
  calendarDays: (number | null)[];
};

export function ReminderPickerModal({
  visible,
  onClose,
  onConfirm,
  today,
  viewYear,
  viewMonth,
  pickerYear,
  pickerMonth,
  pickerDay,
  pickerHour,
  setPickerHour,
  pickerMinute,
  setPickerMinute,
  pickerRepeat,
  setPickerRepeat,
  goToPrevMonth,
  goToNextMonth,
  selectDay,
  calendarDays,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.calendarModal}>
        <View style={styles.calendarModalHeader}>
          <TouchableOpacity
            style={styles.calendarMonthArrow}
            activeOpacity={0.7}
            onPress={goToPrevMonth}
          >
            <View style={styles.chevronLeft} />
          </TouchableOpacity>
          <Text style={styles.calendarModalTitle}>
            {viewYear}년 {viewMonth + 1}월
          </Text>
          <TouchableOpacity
            style={styles.calendarMonthArrow}
            activeOpacity={0.7}
            onPress={goToNextMonth}
          >
            <View style={styles.chevronRight} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.calendarModalScroll}
        >
          <View style={styles.weekdayRow}>
            {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
              <View key={day} style={styles.weekdayCell}>
                <Text
                  style={[
                    styles.weekdayText,
                    i === 0 && styles.weekdayTextSun,
                    i === 6 && styles.weekdayTextSat,
                  ]}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.dayGrid}>
            {calendarDays.map((day, index) => {
              const dayOfWeek = index % 7;
              const isSelected =
                day !== null &&
                day === pickerDay &&
                viewYear === pickerYear &&
                viewMonth === pickerMonth;
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.dayCell}
                  activeOpacity={day === null ? 1 : 0.7}
                  disabled={day === null}
                  onPress={() => day !== null && selectDay(day)}
                >
                  {day !== null ? (
                    <View
                      style={[
                        styles.dayPill,
                        isSelected && styles.dayPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          dayOfWeek === 0 && !isSelected && styles.dayTextSun,
                          dayOfWeek === 6 && !isSelected && styles.dayTextSat,
                          isToday && !isSelected && styles.dayTextToday,
                          isSelected && styles.dayTextActive,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.calendarSectionDivider} />

          <Text style={styles.pickerSectionLabel}>시간</Text>
          <View style={styles.timeRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeScrollContent}
            >
              {HOURS.map((h) => {
                const isActive = pickerHour === h;
                return (
                  <TouchableOpacity
                    key={`h-${h}`}
                    style={[styles.timeChip, isActive && styles.timeChipActive]}
                    activeOpacity={0.8}
                    onPress={() => setPickerHour(h)}
                  >
                    <Text
                      style={[
                        styles.timeChipText,
                        isActive && styles.timeChipTextActive,
                      ]}
                    >
                      {String(h).padStart(2, "0")}시
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.timeRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeScrollContent}
            >
              {MINUTES.map((m) => {
                const isActive = pickerMinute === m;
                return (
                  <TouchableOpacity
                    key={`m-${m}`}
                    style={[styles.timeChip, isActive && styles.timeChipActive]}
                    activeOpacity={0.8}
                    onPress={() => setPickerMinute(m)}
                  >
                    <Text
                      style={[
                        styles.timeChipText,
                        isActive && styles.timeChipTextActive,
                      ]}
                    >
                      {String(m).padStart(2, "0")}분
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.calendarSectionDivider} />

          <Text style={styles.pickerSectionLabel}>반복</Text>
          <View style={styles.addPageChipRow}>
            {["없음", "매일", "매주", "매월"].map((repeat) => {
              const isActive = pickerRepeat === repeat;
              return (
                <TouchableOpacity
                  key={repeat}
                  style={[
                    styles.addPageChip,
                    isActive && styles.addPageChipActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setPickerRepeat(repeat)}
                >
                  <Text
                    style={[
                      styles.addPageChipText,
                      isActive && styles.addPageChipTextActive,
                    ]}
                  >
                    {repeat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.calendarModalFooter}>
          <TouchableOpacity
            style={styles.calendarFooterCancel}
            activeOpacity={0.85}
            onPress={onClose}
          >
            <Text style={styles.calendarFooterCancelText}>닫기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.calendarFooterConfirm}
            activeOpacity={0.85}
            onPress={onConfirm}
          >
            <Text style={styles.calendarFooterConfirmText}>완료</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  calendarModal: {
    backgroundColor: colors.white,
    flex: 1,
  },
  calendarModalHeader: {
    alignItems: "center",
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.xxxl,
  },
  calendarModalTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  calendarMonthArrow: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  chevronLeft: {
    borderColor: colors.textSecondary,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    height: 10,
    transform: [{ rotate: "-45deg" }],
    width: 10,
    marginLeft: spacing.xs,
  },
  chevronRight: {
    borderColor: colors.textSecondary,
    borderRightWidth: 2,
    borderTopWidth: 2,
    height: 10,
    transform: [{ rotate: "45deg" }],
    width: 10,
    marginRight: spacing.xs,
  },
  calendarModalScroll: {
    paddingBottom: spacing.section,
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.xxxl,
  },
  calendarSectionDivider: {
    backgroundColor: colors.divider,
    height: 1,
    marginVertical: spacing.xxxl,
  },
  calendarModalFooter: {
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: spacing.lg,
    paddingBottom: spacing.section,
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.xl,
  },
  calendarFooterCancel: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flex: 1,
    paddingVertical: spacing.footerV,
  },
  calendarFooterCancelText: {
    color: colors.textQuaternary, // #444444 — 2회 사용
    fontSize: 14,
    fontWeight: "700",
  },
  calendarFooterConfirm: {
    alignItems: "center",
    backgroundColor: colors.black,
    borderRadius: radius.md,
    flex: 1.5,
    paddingVertical: spacing.footerV,
  },
  calendarFooterConfirmText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: spacing.xs,
  },
  weekdayCell: {
    alignItems: "center",
    flex: 1,
    paddingVertical: spacing.sm,
  },
  weekdayText: {
    color: colors.textFaint,
    fontSize: 11,
    fontWeight: "600",
  },
  weekdayTextSun: {
    color: colors.accentSun,
  },
  weekdayTextSat: {
    color: colors.accentSat,
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    alignItems: "center",
    paddingVertical: 3,
    width: `${100 / 7}%`,
  },
  dayPill: {
    alignItems: "center",
    borderRadius: radius.sm,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  dayPillActive: {
    backgroundColor: colors.black,
  },
  dayText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  dayTextSun: {
    color: colors.accentSun,
  },
  dayTextSat: {
    color: colors.accentSat,
  },
  dayTextToday: {
    fontWeight: "800",
  },
  dayTextActive: {
    color: colors.white,
    fontWeight: "700",
  },
  pickerSectionLabel: {
    color: colors.textSection, // #666666 — 1회 사용
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: spacing.lg,
  },
  timeRow: {
    marginBottom: spacing.md,
    marginHorizontal: -spacing.pageH,
  },
  timeScrollContent: {
    paddingHorizontal: spacing.pageH,
  },
  timeChip: {
    backgroundColor: colors.white,
    borderColor: colors.borderSubtle,
    borderRadius: radius.sm,
    borderWidth: 1,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.chipGap,
  },
  timeChipActive: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  timeChipText: {
    color: colors.textQuaternary, // #444444
    fontSize: 13,
    fontWeight: "600",
  },
  timeChipTextActive: {
    color: colors.white,
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
});
