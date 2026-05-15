import { useMemo } from "react";
import { SavedItem } from "../types/item";
import { tabs } from "../constants/categories";

type Params = {
  items: SavedItem[];
  selectedTab: string;
  selectedCategories: string[];
  isCompletedOnly: boolean;
};

export function useFilteredItems({
  items,
  selectedTab,
  selectedCategories,
  isCompletedOnly,
}: Params) {
  const tabItems = useMemo(
    () =>
      selectedTab === tabs[1]
        ? items.filter((item) => item.meta.includes("오늘"))
        : items,
    [items, selectedTab],
  );

  const filteredItems = useMemo(() => {
    const uniqueCategories = Array.from(new Set(selectedCategories));
    const categoryFiltered =
      uniqueCategories.length === 0
        ? tabItems
        : tabItems.filter((item) => uniqueCategories.includes(item.category));
    return isCompletedOnly
      ? categoryFiltered.filter((item) => item.status === "완료")
      : categoryFiltered;
  }, [tabItems, selectedCategories, isCompletedOnly]);

  return { filteredItems };
}
