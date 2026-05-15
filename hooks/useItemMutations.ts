import { Alert } from "react-native";
import { SavedItem } from "../types/item";
import { tabs } from "../constants/categories";
import { trackEvent } from "../lib/analytics";
import { NewItemDraft } from "./useNewItemForm";

export function useItemMutations(
  setItems: React.Dispatch<React.SetStateAction<SavedItem[]>>,
  setSelectedTab: (tab: string) => void,
  setReminderIndex: (index: number) => void,
) {
  const addItem = (
    draft: NewItemDraft,
    editingItemId: number | null,
    onSuccess: () => void,
  ) => {
    if (!draft.source.trim()) {
      Alert.alert("링크가 필요해", "나중에 열 수 있게 링크부터 붙여줘.");
      return;
    }

    if (!draft.title.trim()) {
      return;
    }

    const normalized = {
      title: draft.title.trim(),
      source: draft.source.trim(),
      category: draft.category,
      meta: draft.meta.trim() || "15분 · 오늘 필요",
      pressure: draft.pressure.trim() || "저장했으면 한 번은 봐야지",
      reminder: draft.reminder.trim() || "직접 입력",
    };

    if (editingItemId !== null) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === editingItemId ? { ...item, ...normalized } : item,
        ),
      );
      void trackEvent("item_updated", {
        item_id: editingItemId,
        category: normalized.category,
        reminder: normalized.reminder,
      });
    } else {
      const createdItem: SavedItem = {
        id: Date.now(),
        status: "",
        ...normalized,
      };
      setItems((prevItems) => [createdItem, ...prevItems]);
      setSelectedTab(tabs[0]);
      setReminderIndex(0);
      void trackEvent("item_added", {
        item_id: createdItem.id,
        category: createdItem.category,
        reminder: createdItem.reminder,
      });
    }

    onSuccess();
  };

  const deleteItem = (id: number) => {
    let deletedItem: SavedItem | undefined;
    setItems((prev) => {
      deletedItem = prev.find((item) => item.id === id);
      return prev.filter((item) => item.id !== id);
    });
    void trackEvent("item_deleted", {
      item_id: id,
      category: deletedItem?.category,
      status: deletedItem?.status,
    });
  };

  const updateItemStatus = (id: number, status: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    void trackEvent("item_status_updated", { item_id: id, status });
  };

  return { addItem, deleteItem, updateItemStatus };
}
