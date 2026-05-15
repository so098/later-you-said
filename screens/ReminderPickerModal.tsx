import React, { useRef } from "react";
import {
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, spacing } from "../styles/tokens";
import { ReminderCalendar } from "./reminder-picker/ReminderCalendar";
import { ReminderPickerFooter } from "./reminder-picker/ReminderPickerFooter";
import { ReminderRecurrence } from "./reminder-picker/ReminderRecurrence";
import { ReminderTimePicker } from "./reminder-picker/ReminderTimePicker";

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
  pickerHour: number | null;
  setPickerHour: (h: number) => void;
  pickerMinute: number | null;
  setPickerMinute: (m: number) => void;
  isTimePicked: boolean;
  pickerRepeat: string;
  setPickerRepeat: (r: string) => void;
  frequentDuration: string;
  setFrequentDuration: (duration: string) => void;
  isFrequentDurationOpen: boolean;
  setIsFrequentDurationOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  frequentDuration,
  setFrequentDuration,
  isFrequentDurationOpen,
  setIsFrequentDurationOpen,
  goToPrevMonth,
  goToNextMonth,
  selectDay,
  calendarDays,
  isTimePicked,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);

  const toggleFrequentDurationDropdown = () => {
    setIsFrequentDurationOpen((prev) => {
      const next = !prev;

      if (next) {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        });
      }

      return next;
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.monthArrow}
            activeOpacity={0.7}
            onPress={goToPrevMonth}
          >
            <View style={styles.chevronLeft} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {viewYear}년 {viewMonth + 1}월
          </Text>
          <TouchableOpacity
            style={styles.monthArrow}
            activeOpacity={0.7}
            onPress={goToNextMonth}
          >
            <View style={styles.chevronRight} />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ReminderCalendar
            viewYear={viewYear}
            viewMonth={viewMonth}
            pickerYear={pickerYear}
            pickerMonth={pickerMonth}
            pickerDay={pickerDay}
            today={today}
            calendarDays={calendarDays}
            selectDay={selectDay}
          />

          <View style={styles.sectionDivider} />

          <ReminderTimePicker
            today={today}
            pickerYear={pickerYear}
            pickerMonth={pickerMonth}
            pickerDay={pickerDay}
            pickerHour={pickerHour}
            setPickerHour={setPickerHour}
            pickerMinute={pickerMinute}
            setPickerMinute={setPickerMinute}
          />

          <View style={styles.sectionDivider} />

          <ReminderRecurrence
            pickerRepeat={pickerRepeat}
            setPickerRepeat={setPickerRepeat}
            frequentDuration={frequentDuration}
            setFrequentDuration={setFrequentDuration}
            isFrequentDurationOpen={isFrequentDurationOpen}
            setIsFrequentDurationOpen={setIsFrequentDurationOpen}
            onToggleFrequentDurationDropdown={toggleFrequentDurationDropdown}
          />
        </ScrollView>

        <ReminderPickerFooter
          isTimePicked={isTimePicked}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  header: {
    alignItems: "center",
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.xxxl,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  monthArrow: {
    alignItems: "center",
    height: 36, // 1회 사용 — 월 이동 터치 영역
    justifyContent: "center",
    width: 36, // 1회 사용 — 월 이동 터치 영역
  },
  chevronLeft: {
    borderColor: colors.textSecondary,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    height: 10, // 1회 사용 — 좌 화살표 크기
    transform: [{ rotate: "-45deg" }],
    width: 10, // 1회 사용 — 좌 화살표 크기
    marginLeft: spacing.xs,
  },
  chevronRight: {
    borderColor: colors.textSecondary,
    borderRightWidth: 2,
    borderTopWidth: 2,
    height: 10, // 1회 사용 — 우 화살표 크기
    transform: [{ rotate: "45deg" }],
    width: 10, // 1회 사용 — 우 화살표 크기
    marginRight: spacing.xs,
  },
  scrollContent: {
    paddingBottom: spacing.section,
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.xxxl,
  },
  sectionDivider: {
    backgroundColor: colors.divider,
    height: 1,
    marginVertical: spacing.xxxl,
  },
});
