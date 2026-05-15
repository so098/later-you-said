import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { colors, spacing } from "./styles/tokens";
import { tabs } from "./constants/categories";

import { AppHeader } from "./components/AppHeader";
import { PageHeader } from "./components/PageHeader";
import { ReminderPreviewCarousel } from "./components/ReminderPreviewCarousel";
import { CategoryFilter } from "./components/CategoryFilter";
import { EmptyState } from "./components/EmptyState";
import { SavedItemCard } from "./components/SavedItemCard";
import { Fab } from "./components/Fab";
import { BottomNav } from "./components/BottomNav";
import { BackupPanel } from "./components/BackupPanel";
import { AddItemForm } from "./screens/AddItemForm";
import { ReminderPickerModal } from "./screens/ReminderPickerModal";
import { useItems } from "./hooks/useItems";
import { useNewItemForm } from "./hooks/useNewItemForm";
import { useItemMutations } from "./hooks/useItemMutations";
import { useReminderPicker } from "./hooks/useReminderPicker";
import { useFilteredItems } from "./hooks/useFilteredItems";
import { scheduleTestNotification } from "./lib/notifications";

const isDevelopment = __DEV__;

export default function App() {
  const { width } = useWindowDimensions();
  const previewCardWidth = width - spacing.pageH * 2;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [isCompletedOnly, setIsCompletedOnly] = useState(false);
  const [reminderIndex, setReminderIndex] = useState(0);

  const { items, setItems } = useItems();

  const {
    isAddFormOpen,
    setIsAddFormOpen,
    newItem,
    setNewItem,
    editingItemId,
    activeMenuId,
    setActiveMenuId,
    isCustomReminder,
    closeAddForm,
    startEditItem,
  } = useNewItemForm();

  const { addItem, deleteItem, updateItemStatus } = useItemMutations(
    setItems,
    setSelectedTab,
    setReminderIndex,
  );

  const {
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
  } = useReminderPicker();

  const confirmCustomReminder = () => {
    setNewItem((prev) => ({ ...prev, reminder: buildReminderLabel() }));
    setIsReminderPickerOpen(false);
  };

  const changeTab = (tab: string) => {
    setSelectedTab(tab);
    setSelectedCategories([]);
    setIsCompletedOnly(false);
    setIsCategoryOpen(false);
  };

  const { filteredItems } = useFilteredItems({
    items,
    selectedTab,
    selectedCategories,
    isCompletedOnly,
  });

  const isMyInfoTab = selectedTab === tabs[2];

  const emptyStateLabel = isCompletedOnly
    ? "완료"
    : selectedCategories.length > 0
      ? selectedCategories.join(", ")
      : selectedTab;

  const pageTitle = selectedTab === tabs[0] ? "쌓인 것들" : selectedTab;
  const pageDescription =
    selectedTab === tabs[1]
      ? "오늘 안 보면 또 내일의 내가 운다"
      : selectedTab === tabs[2]
        ? "백업이랑 앱 데이터는 여기서 챙겨"
        : "저장만 해놓고 도망간 것들";

  const categoryButtonLabel =
    selectedCategories.length === 0
      ? "왜 할거야?"
      : selectedCategories.length === 1
        ? selectedCategories[0]
        : `${selectedCategories[0]} 외 ${selectedCategories.length - 1}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <AppHeader
          isDevelopment={isDevelopment}
          onAlarmPress={scheduleTestNotification}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <PageHeader
            title={pageTitle}
            description={pageDescription}
            isDevelopment={isDevelopment}
            onReminderPress={scheduleTestNotification}
          />

          {isMyInfoTab ? (
            <BackupPanel items={items} onRestoreItems={setItems} />
          ) : (
            <>
              <ReminderPreviewCarousel
                items={items}
                reminderIndex={reminderIndex}
                setReminderIndex={setReminderIndex}
                previewCardWidth={previewCardWidth}
              />

              <CategoryFilter
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                isCategoryOpen={isCategoryOpen}
                setIsCategoryOpen={setIsCategoryOpen}
                categoryButtonLabel={categoryButtonLabel}
                isCompletedOnly={isCompletedOnly}
                setIsCompletedOnly={setIsCompletedOnly}
              />

              {filteredItems.length === 0 ? (
                <EmptyState label={emptyStateLabel} />
              ) : null}

              {filteredItems.map((item) => (
                <SavedItemCard
                  key={item.id}
                  item={item}
                  activeMenuId={activeMenuId}
                  setActiveMenuId={setActiveMenuId}
                  onEdit={startEditItem}
                  onDelete={deleteItem}
                  onUpdateStatus={updateItemStatus}
                />
              ))}
            </>
          )}
        </ScrollView>

        {isAddFormOpen ? (
          <AddItemForm
            editingItemId={editingItemId}
            newItem={newItem}
            setNewItem={setNewItem}
            isCustomReminder={isCustomReminder}
            isReminderPickerOpen={isReminderPickerOpen}
            setIsReminderPickerOpen={setIsReminderPickerOpen}
            onClose={closeAddForm}
            onSubmit={() => addItem(newItem, editingItemId, closeAddForm)}
          />
        ) : null}

        {!isAddFormOpen && !isMyInfoTab ? (
          <Fab onPress={() => setIsAddFormOpen(true)} />
        ) : null}

        {!isAddFormOpen ? (
          <BottomNav selectedTab={selectedTab} onChangeTab={changeTab} />
        ) : null}

        <ReminderPickerModal
          visible={isReminderPickerOpen}
          onClose={() => setIsReminderPickerOpen(false)}
          onConfirm={confirmCustomReminder}
          today={today}
          viewYear={viewYear}
          viewMonth={viewMonth}
          pickerYear={pickerYear}
          pickerMonth={pickerMonth}
          pickerDay={pickerDay}
          pickerHour={pickerHour}
          setPickerHour={setPickerHour}
          pickerMinute={pickerMinute}
          setPickerMinute={setPickerMinute}
          pickerRepeat={pickerRepeat}
          setPickerRepeat={setPickerRepeat}
          goToPrevMonth={goToPrevMonth}
          goToNextMonth={goToNextMonth}
          selectDay={selectDay}
          calendarDays={calendarDays}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 104,
    paddingHorizontal: spacing.pageH,
    paddingTop: spacing.md,
  },
});
