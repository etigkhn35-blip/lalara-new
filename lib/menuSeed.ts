import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import { menu as foodMenu } from "@/app/food-menu/page";
import { menu as drinksMenu } from "@/app/drinks-menu/page";
import { menu as breakfastMenu } from "@/app/breakfast-menu/page";

export type MenuKey = "food" | "drinks" | "breakfast";

type LegacyItem = {
  name: string;
  description?: string;
  price?: string;
  prices?: string[];
  extras?: string[];
};

type LegacySection = {
  title: string;
  columns?: string[];
  items: LegacyItem[];
  note?: string;
};

type LegacyMenu = {
  en: LegacySection[];
  tr: LegacySection[];
};

function clean(value?: string) {
  return typeof value === "string" ? value : "";
}

function cleanArray(value?: string[]) {
  return Array.isArray(value) ? value : [];
}

function getSection(
  sections: LegacySection[],
  index: number
): LegacySection | undefined {
  return sections[index];
}

function getItem(
  section: LegacySection | undefined,
  index: number
): LegacyItem | undefined {
  return section?.items?.[index];
}

async function collectionHasMenu(
  collectionName: string,
  menu: MenuKey
) {
  const snapshot = await getDocs(collection(db, collectionName));

  return snapshot.docs.some((item) => {
    return item.data()?.menu === menu;
  });
}

async function seedSingleMenu(
  menuKey: MenuKey,
  source: LegacyMenu
) {
  const categoriesAlreadyExist = await collectionHasMenu(
    "menuCategories",
    menuKey
  );

  const itemsAlreadyExist = await collectionHasMenu(
    "menuItems",
    menuKey
  );

  if (categoriesAlreadyExist || itemsAlreadyExist) {
    throw new Error(
      `${menuKey.toUpperCase()} already contains Firestore menu data.`
    );
  }

  const enSections = source.en || [];
  const trSections = source.tr || [];

  const totalSections = Math.max(
    enSections.length,
    trSections.length
  );

  /*
   * Firestore batch limiti nedeniyle tek batch'e yüzlerce
   * kayıt doldurmuyoruz. Güvenli şekilde parçalara bölüyoruz.
   */
  let operations: Array<{
    ref: ReturnType<typeof doc>;
    data: Record<string, unknown>;
  }> = [];

  async function flush() {
    if (operations.length === 0) return;

    const batch = writeBatch(db);

    operations.forEach(({ ref, data }) => {
      batch.set(ref, data);
    });

    await batch.commit();

    operations = [];
  }

  async function queue(
    ref: ReturnType<typeof doc>,
    data: Record<string, unknown>
  ) {
    operations.push({ ref, data });

    if (operations.length >= 400) {
      await flush();
    }
  }

  for (
    let sectionIndex = 0;
    sectionIndex < totalSections;
    sectionIndex++
  ) {
    const enSection = getSection(enSections, sectionIndex);
    const trSection = getSection(trSections, sectionIndex);

    if (!enSection && !trSection) continue;

    const categoryRef = doc(collection(db, "menuCategories"));

    const columnsEN = cleanArray(enSection?.columns);
    const columnsTR = cleanArray(trSection?.columns);

    await queue(categoryRef, {
      menu: menuKey,

      nameEN: clean(enSection?.title),
      nameTR: clean(trSection?.title),

      noteEN: clean(enSection?.note),
      noteTR: clean(trSection?.note),

      columnsEN,
      columnsTR,

      order: sectionIndex,
      visible: true,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const enItems = enSection?.items || [];
    const trItems = trSection?.items || [];

    const totalItems = Math.max(
      enItems.length,
      trItems.length
    );

    for (
      let itemIndex = 0;
      itemIndex < totalItems;
      itemIndex++
    ) {
      const enItem = getItem(enSection, itemIndex);
      const trItem = getItem(trSection, itemIndex);

      if (!enItem && !trItem) continue;

      const itemRef = doc(collection(db, "menuItems"));

      /*
       * Food / Breakfast çoğunlukla price kullanıyor.
       * Drinks'in şarap ve alkollü içecek bölümlerinde
       * prices[] bulunuyor.
       */
      const singlePrice =
        clean(enItem?.price) ||
        clean(trItem?.price);

      const prices =
        enItem?.prices?.length
          ? cleanArray(enItem.prices)
          : cleanArray(trItem?.prices);

      await queue(itemRef, {
        menu: menuKey,
        categoryId: categoryRef.id,

        nameEN: clean(enItem?.name),
        nameTR: clean(trItem?.name),

        descriptionEN: clean(enItem?.description),
        descriptionTR: clean(trItem?.description),

        price: singlePrice,
        prices,

        extrasEN: cleanArray(enItem?.extras),
        extrasTR: cleanArray(trItem?.extras),

        order: itemIndex,
        visible: true,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }

  await flush();

  const settingsRef = doc(
    db,
    "menuSettings",
    menuKey
  );

  const settingsBatch = writeBatch(db);

  settingsBatch.set(
    settingsRef,
    {
      menu: menuKey,

      titleEN:
        menuKey === "food"
          ? "Food Menu"
          : menuKey === "drinks"
          ? "Drinks Menu"
          : "Breakfast",

      titleTR:
        menuKey === "food"
          ? "Yemek Menüsü"
          : menuKey === "drinks"
          ? "İçecek Menüsü"
          : "Kahvaltı",

      subtitleEN:
        menuKey === "breakfast"
          ? "Take your time."
          : "Restaurant & Bar",

      subtitleTR:
        menuKey === "breakfast"
          ? "Tadını çıkarın."
          : "Restaurant & Bar",

      visible: true,

      imported: true,
      importedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await settingsBatch.commit();
}

export async function seedFoodMenu() {
  await seedSingleMenu(
    "food",
    foodMenu as unknown as LegacyMenu
  );
}

export async function seedDrinksMenu() {
  await seedSingleMenu(
    "drinks",
    drinksMenu as unknown as LegacyMenu
  );
}

export async function seedBreakfastMenu() {
  await seedSingleMenu(
    "breakfast",
    breakfastMenu as unknown as LegacyMenu
  );
}

export async function seedAllMenus(
  onProgress?: (message: string) => void
) {
  onProgress?.("Importing Food menu...");

  await seedFoodMenu();

  onProgress?.("Food imported. Importing Drinks...");

  await seedDrinksMenu();

  onProgress?.(
    "Drinks imported. Importing Breakfast..."
  );

  await seedBreakfastMenu();

  onProgress?.("All menus imported.");
}

export async function getMenuImportStatus() {
  const [
    categoriesSnapshot,
    itemsSnapshot,
  ] = await Promise.all([
    getDocs(collection(db, "menuCategories")),
    getDocs(collection(db, "menuItems")),
  ]);

  const categoryMenus = new Set<MenuKey>();
  const itemMenus = new Set<MenuKey>();

  categoriesSnapshot.docs.forEach((item) => {
    const menu = item.data()?.menu as MenuKey;

    if (
      menu === "food" ||
      menu === "drinks" ||
      menu === "breakfast"
    ) {
      categoryMenus.add(menu);
    }
  });

  itemsSnapshot.docs.forEach((item) => {
    const menu = item.data()?.menu as MenuKey;

    if (
      menu === "food" ||
      menu === "drinks" ||
      menu === "breakfast"
    ) {
      itemMenus.add(menu);
    }
  });

  return {
    food:
      categoryMenus.has("food") &&
      itemMenus.has("food"),

    drinks:
      categoryMenus.has("drinks") &&
      itemMenus.has("drinks"),

    breakfast:
      categoryMenus.has("breakfast") &&
      itemMenus.has("breakfast"),

    complete:
      categoryMenus.has("food") &&
      itemMenus.has("food") &&
      categoryMenus.has("drinks") &&
      itemMenus.has("drinks") &&
      categoryMenus.has("breakfast") &&
      itemMenus.has("breakfast"),
  };
}