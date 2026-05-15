import { useMemo, useState } from "react";

export function useReminderPicker() {
  const today = new Date();
  const [isReminderPickerOpen, setIsReminderPickerOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(today.getMonth());
  const [pickerDay, setPickerDay] = useState(today.getDate());
  const [pickerHour, setPickerHour] = useState(21);
  const [pickerMinute, setPickerMinute] = useState(0);
  const [pickerRepeat, setPickerRepeat] = useState("없음");

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDay = (day: number) => {
    setPickerYear(viewYear);
    setPickerMonth(viewMonth);
    setPickerDay(day);
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [viewYear, viewMonth]);

  const buildReminderLabel = () => {
    const monthStr = String(pickerMonth + 1).padStart(2, "0");
    const dayStr = String(pickerDay).padStart(2, "0");
    const hourStr = String(pickerHour).padStart(2, "0");
    const minuteStr = String(pickerMinute).padStart(2, "0");
    const dateLabel = `${pickerYear}.${monthStr}.${dayStr} ${hourStr}:${minuteStr}`;
    return pickerRepeat === "없음"
      ? dateLabel
      : `${dateLabel} · ${pickerRepeat}`;
  };

  return {
    today,
    isReminderPickerOpen,
    setIsReminderPickerOpen,
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
    buildReminderLabel,
  };
}
