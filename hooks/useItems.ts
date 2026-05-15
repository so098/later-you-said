import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SavedItem } from "../types/item";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { trackEvent } from "../lib/analytics";

export function useItems() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    async function hydrateItems() {
      try {
        const storedItems = await AsyncStorage.getItem(STORAGE_KEYS.items);

        if (storedItems) {
          const parsedItems: unknown = JSON.parse(storedItems);

          if (Array.isArray(parsedItems)) {
            setItems(parsedItems as SavedItem[]);
          }
        }

        void trackEvent("app_opened");
      } catch (error) {
        console.warn("failed to load local items", error);
      } finally {
        setIsHydrated(true);
      }
    }

    void hydrateItems();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void AsyncStorage.setItem(STORAGE_KEYS.items, JSON.stringify(items));
  }, [isHydrated, items]);

  return { items, setItems, isHydrated };
}
