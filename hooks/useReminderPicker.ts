import { useMemo, useState } from "react";

export function useReminderPicker() {
  const today = new Date();
  const [isReminderPickerOpen, setIsReminderPickerOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [pickerMonth, setPickerMonth] = useState(today.getMonth());
  const [pickerDay, setPickerDay] = useState(today.getDate());
  const [pickerHour, setPickerHourState] = useState<number | null>(null);
  const [pickerMinute, setPickerMinuteState] = useState<number | null>(null);
  const [pickerRepeat, setPickerRepeat] = useState("없음");
  const [frequentDuration, setFrequentDuration] = useState("30분");
  const [isFrequentDurationOpen, setIsFrequentDurationOpen] = useState(false);

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

  const getTodayDateOnly = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const isPastDate = (year: number, month: number, day: number) =>
    new Date(year, month, day) < getTodayDateOnly();

  const isSelectedDateToday = () => {
    const now = new Date();
    return (
      pickerYear === now.getFullYear() &&
      pickerMonth === now.getMonth() &&
      pickerDay === now.getDate()
    );
  };

  const selectDay = (day: number) => {
    if (isPastDate(viewYear, viewMonth, day)) {
      return;
    }

    setPickerYear(viewYear);
    setPickerMonth(viewMonth);
    setPickerDay(day);

    const now = new Date();
    const selectedIsToday =
      viewYear === now.getFullYear() &&
      viewMonth === now.getMonth() &&
      day === now.getDate();

    if (selectedIsToday && pickerHour !== null && pickerHour < now.getHours()) {
      setPickerHourState(null);
      setPickerMinuteState(null);
    }
  };

  const setPickerHour = (hour: number) => {
    const now = new Date();

    if (isPastDate(pickerYear, pickerMonth, pickerDay)) {
      return;
    }

    if (isSelectedDateToday() && hour < now.getHours()) {
      return;
    }

    setPickerHourState(hour);

    if (isSelectedDateToday() && hour === now.getHours()) {
      setPickerMinuteState((minute) =>
        minute !== null && minute <= now.getMinutes() ? null : minute,
      );
    }
  };

  const setPickerMinute = (minute: number) => {
    const now = new Date();

    if (isPastDate(pickerYear, pickerMonth, pickerDay)) {
      return;
    }

    if (
      isSelectedDateToday() &&
      pickerHour !== null &&
      pickerHour === now.getHours() &&
      minute <= now.getMinutes()
    ) {
      return;
    }

    setPickerMinuteState(minute);
  };

  const resetReminderPicker = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setPickerYear(now.getFullYear());
    setPickerMonth(now.getMonth());
    setPickerDay(now.getDate());
    setPickerHourState(null);
    setPickerMinuteState(null);
    setPickerRepeat("없음");
    setFrequentDuration("30분");
    setIsFrequentDurationOpen(false);
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

  const selectedDateTime =
    pickerHour === null || pickerMinute === null
      ? null
      : new Date(pickerYear, pickerMonth, pickerDay, pickerHour, pickerMinute);
  const isTimePicked =
    selectedDateTime !== null && selectedDateTime.getTime() > Date.now();

  const buildReminderLabel = () => {
    if (!isTimePicked || pickerHour === null || pickerMinute === null) {
      return null;
    }
    const monthStr = String(pickerMonth + 1).padStart(2, "0");
    const dayStr = String(pickerDay).padStart(2, "0");
    const hourStr = String(pickerHour).padStart(2, "0");
    const minuteStr = String(pickerMinute).padStart(2, "0");
    const dateLabel = `${pickerYear}.${monthStr}.${dayStr} ${hourStr}:${minuteStr}`;
    if (pickerRepeat === "없음") {
      return dateLabel;
    }

    if (pickerRepeat === "수시로") {
      return `${dateLabel} · 수시로 ${frequentDuration} 동안`;
    }

    return `${dateLabel} · ${pickerRepeat}`;
  };

  return {
    today,
    isReminderPickerOpen,
    setIsReminderPickerOpen,
    resetReminderPicker,
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
    buildReminderLabel,
    isTimePicked,
  };
}
