import { useState } from "react";
import { SavedItem } from "../types/item";
import { DEFAULT_NEW_ITEM, reminderPresets } from "../constants/reminders";

const PRESET_REMINDERS = reminderPresets.slice(0, 2);

export type NewItemDraft = typeof DEFAULT_NEW_ITEM;

export function useNewItemForm() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newItem, setNewItem] = useState<NewItemDraft>(DEFAULT_NEW_ITEM);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const isCustomReminder =
    newItem.reminder !== "" && !PRESET_REMINDERS.includes(newItem.reminder);

  const closeAddForm = () => {
    setIsAddFormOpen(false);
    setNewItem(DEFAULT_NEW_ITEM);
    setEditingItemId(null);
  };

  const startEditItem = (item: SavedItem) => {
    setNewItem({
      title: item.title,
      source: item.source,
      category: item.category,
      meta: item.meta,
      pressure: item.pressure,
      reminder: item.reminder,
    });
    setEditingItemId(item.id);
    setIsAddFormOpen(true);
    setActiveMenuId(null);
  };

  return {
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
  };
}
