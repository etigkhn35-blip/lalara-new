"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import AdminShell from "@/components/admin/AdminShell";
import { auth, db } from "@/lib/firebase";
import {
  getMenuImportStatus,
  seedAllMenus,
  type MenuKey,
} from "@/lib/menuSeed";

type Language = "EN" | "TR";

type MenuCategory = {
  id: string;
  menu: MenuKey;

  nameEN: string;
  nameTR: string;

  noteEN: string;
  noteTR: string;

  columnsEN: string[];
  columnsTR: string[];

  order: number;
  visible: boolean;
};

type MenuItem = {
  id: string;
  menu: MenuKey;
  categoryId: string;

  nameEN: string;
  nameTR: string;

  descriptionEN: string;
  descriptionTR: string;

  price: string;
  prices: string[];

  extrasEN: string[];
  extrasTR: string[];

  order: number;
  visible: boolean;
};

type MenuSettings = {
  titleEN?: string;
  titleTR?: string;

  subtitleEN?: string;
  subtitleTR?: string;

  visible?: boolean;
  imported?: boolean;
};

type ImportStatus = {
  food: boolean;
  drinks: boolean;
  breakfast: boolean;
  complete: boolean;
};

const menuLabels: Record<
  MenuKey,
  {
    label: string;
    description: string;
  }
> = {
  food: {
    label: "Food",
    description: "Main food menu",
  },

  drinks: {
    label: "Drinks",
    description: "Cocktails, wine & drinks",
  },

  breakfast: {
    label: "Breakfast",
    description: "Breakfast menu",
  },
};

const defaultSettings: Record<MenuKey, MenuSettings> = {
  food: {
    titleEN: "Food Menu",
    titleTR: "Yemek Menüsü",
    subtitleEN: "Restaurant & Bar",
    subtitleTR: "Restaurant & Bar",
    visible: true,
  },

  drinks: {
    titleEN: "Drinks Menu",
    titleTR: "İçecek Menüsü",
    subtitleEN: "Restaurant & Bar",
    subtitleTR: "Restaurant & Bar",
    visible: true,
  },

  breakfast: {
    titleEN: "Breakfast",
    titleTR: "Kahvaltı",
    subtitleEN: "Take your time.",
    subtitleTR: "Tadını çıkarın.",
    visible: true,
  },
};

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.map((item) => String(item ?? ""));
}

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[]): string {
  return value.join("\n");
}

export default function MenusPage() {
  const [activeMenu, setActiveMenu] =
    useState<MenuKey>("food");

  const [language, setLanguage] =
    useState<Language>("EN");

  const [categories, setCategories] =
    useState<MenuCategory[]>([]);

  const [items, setItems] =
    useState<MenuItem[]>([]);

  const [menuSettings, setMenuSettings] =
    useState<Record<MenuKey, MenuSettings>>(
      defaultSettings
    );

  const [importStatus, setImportStatus] =
    useState<ImportStatus>({
      food: false,
      drinks: false,
      breakfast: false,
      complete: false,
    });

  const [newCategory, setNewCategory] =
    useState("");

  const [editingCategory, setEditingCategory] =
    useState<string | null>(null);

  const [editingItem, setEditingItem] =
    useState<string | null>(null);

  const [state, setState] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [importing, setImporting] =
    useState(false);

  /* =========================================================
     LOAD
     ========================================================= */

  useEffect(() => {
    void loadMenus();
  }, []);

  async function loadMenus() {
    try {
      setLoading(true);

      const [
        categorySnapshot,
        itemSnapshot,
        settingsSnapshot,
        status,
      ] = await Promise.all([
        getDocs(
          collection(db, "menuCategories")
        ),

        getDocs(
          collection(db, "menuItems")
        ),

        getDocs(
          collection(db, "menuSettings")
        ),

        getMenuImportStatus(),
      ]);

      const loadedCategories: MenuCategory[] =
        categorySnapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,

            menu:
              data.menu as MenuKey,

            nameEN:
              data.nameEN || "",

            nameTR:
              data.nameTR || "",

            noteEN:
              data.noteEN || "",

            noteTR:
              data.noteTR || "",

            columnsEN:
              stringArray(
                data.columnsEN
              ),

            columnsTR:
              stringArray(
                data.columnsTR
              ),

            order:
              data.order ?? 0,

            visible:
              data.visible !== false,
          };
        });

      const loadedItems: MenuItem[] =
        itemSnapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,

            menu:
              data.menu as MenuKey,

            categoryId:
              data.categoryId || "",

            nameEN:
              data.nameEN || "",

            nameTR:
              data.nameTR || "",

            descriptionEN:
              data.descriptionEN || "",

            descriptionTR:
              data.descriptionTR || "",

            price:
              data.price || "",

            prices:
              stringArray(
                data.prices
              ),

            extrasEN:
              stringArray(
                data.extrasEN
              ),

            extrasTR:
              stringArray(
                data.extrasTR
              ),

            order:
              data.order ?? 0,

            visible:
              data.visible !== false,
          };
        });

      const nextSettings: Record<
        MenuKey,
        MenuSettings
      > = {
        food: {
          ...defaultSettings.food,
        },

        drinks: {
          ...defaultSettings.drinks,
        },

        breakfast: {
          ...defaultSettings.breakfast,
        },
      };

      settingsSnapshot.forEach(
        (item) => {
          const key =
            item.id as MenuKey;

          if (
            key === "food" ||
            key === "drinks" ||
            key === "breakfast"
          ) {
            nextSettings[key] = {
              ...nextSettings[key],
              ...item.data(),
            };
          }
        }
      );

      setCategories(
        loadedCategories.sort(
          (a, b) =>
            a.order - b.order
        )
      );

      setItems(
        loadedItems.sort(
          (a, b) =>
            a.order - b.order
        )
      );

      setMenuSettings(
        nextSettings
      );

      setImportStatus(
        status
      );
    } catch (error) {
      console.error(error);

      setState(
        "Menus could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     IMPORT CURRENT MENUS
     ========================================================= */

  async function importCurrentMenus() {
    const user =
      auth.currentUser;

    if (!user) {
      setState(
        "Session expired."
      );

      return;
    }

    const approved = confirm(
      "Import the current Food, Drinks and Breakfast menus into Firestore?"
    );

    if (!approved) {
      return;
    }

    try {
      setImporting(true);

      setState(
        "Preparing current menus..."
      );

      await seedAllMenus(
        (message) => {
          setState(message);
        }
      );

      setState(
        "Menus imported successfully ✓"
      );

      await loadMenus();
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Menu import failed.";

      setState(message);

      await loadMenus();
    } finally {
      setImporting(false);
    }
  }

  /* =========================================================
     FILTERED DATA
     ========================================================= */

  const activeCategories =
    useMemo(() => {
      return categories
        .filter(
          (category) =>
            category.menu ===
            activeMenu
        )
        .sort(
          (a, b) =>
            a.order - b.order
        );
    }, [
      categories,
      activeMenu,
    ]);

  function categoryItems(
    categoryId: string
  ) {
    return items
      .filter(
        (item) =>
          item.menu ===
            activeMenu &&
          item.categoryId ===
            categoryId
      )
      .sort(
        (a, b) =>
          a.order - b.order
      );
  }

  /* =========================================================
     SETTINGS
     ========================================================= */

  const currentSettings =
    menuSettings[activeMenu];

  function updateLocalSetting(
    field: keyof MenuSettings,
    value: string | boolean
  ) {
    setMenuSettings(
      (current) => ({
        ...current,

        [activeMenu]: {
          ...current[activeMenu],
          [field]: value,
        },
      })
    );
  }

  async function saveMenuSettings() {
    const user =
      auth.currentUser;

    if (!user) {
      setState(
        "Session expired."
      );

      return;
    }

    try {
      setState(
        "Saving menu settings..."
      );

      await setDoc(
        doc(
          db,
          "menuSettings",
          activeMenu
        ),
        {
          ...currentSettings,

          menu:
            activeMenu,

          updatedAt:
            serverTimestamp(),

          updatedBy:
            user.uid,

          updatedByEmail:
            user.email || "",
        },
        {
          merge: true,
        }
      );

      setState(
        "Menu settings saved ✓"
      );
    } catch (error) {
      console.error(error);

      setState(
        "Menu settings could not be saved."
      );
    }
  }

  async function toggleMenuVisibility(visible: boolean) {
    const previous = currentSettings.visible !== false;
    updateLocalSetting("visible", visible);

    try {
      await setDoc(
        doc(db, "menuSettings", activeMenu),
        { menu: activeMenu, visible, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setState(
        visible
          ? "Menu is now shown on the website ✓"
          : "Menu is now hidden from the website ✓"
      );
    } catch (error) {
      console.error(error);
      updateLocalSetting("visible", previous);
      setState("Menu visibility could not be changed.");
    }
  }

  /* =========================================================
     CATEGORY
     ========================================================= */

  async function addCategory() {
    const name =
      newCategory.trim();

    if (!name) {
      return;
    }

    const user =
      auth.currentUser;

    if (!user) {
      setState(
        "Session expired."
      );

      return;
    }

    const order =
      activeCategories.length > 0
        ? Math.max(
            ...activeCategories.map(
              (item) =>
                item.order
            )
          ) + 1
        : 0;

    try {
      const payload = {
        menu:
          activeMenu,

        nameEN:
          language === "EN"
            ? name
            : "",

        nameTR:
          language === "TR"
            ? name
            : "",

        noteEN: "",
        noteTR: "",

        columnsEN: [],
        columnsTR: [],

        order,

        visible: true,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),

        updatedBy:
          user.uid,

        updatedByEmail:
          user.email || "",
      };

      const result =
        await addDoc(
          collection(
            db,
            "menuCategories"
          ),
          payload
        );

      const created: MenuCategory = {
        id: result.id,

        menu:
          activeMenu,

        nameEN:
          language === "EN"
            ? name
            : "",

        nameTR:
          language === "TR"
            ? name
            : "",

        noteEN: "",
        noteTR: "",

        columnsEN: [],
        columnsTR: [],

        order,

        visible: true,
      };

      setCategories(
        (current) => [
          ...current,
          created,
        ]
      );

      setNewCategory("");

      setEditingCategory(
        result.id
      );

      setState(
        "Category added ✓"
      );
    } catch (error) {
      console.error(error);

      setState(
        "Category could not be added."
      );
    }
  }

  function updateCategoryLocal(
    id: string,
    field:
      | "nameEN"
      | "nameTR"
      | "noteEN"
      | "noteTR"
      | "columnsEN"
      | "columnsTR"
      | "visible",
    value:
      | string
      | string[]
      | boolean
  ) {
    setCategories(
      (current) =>
        current.map(
          (category) =>
            category.id === id
              ? {
                  ...category,
                  [field]: value,
                }
              : category
        )
    );
  }

  async function toggleCategoryVisibility(
    category: MenuCategory,
    visible: boolean
  ) {
    try {
      updateCategoryLocal(category.id, "visible", visible);

      await updateDoc(doc(db, "menuCategories", category.id), {
        visible,
        updatedAt: serverTimestamp(),
      });

      setState(
        visible
          ? "Category is now shown on the website ✓"
          : "Category is now hidden from the website ✓"
      );
    } catch (error) {
      console.error(error);
      updateCategoryLocal(category.id, "visible", !visible);
      setState("Category visibility could not be changed.");
    }
  }

  async function updateCategory(
    category: MenuCategory
  ) {
    try {
      await updateDoc(
        doc(
          db,
          "menuCategories",
          category.id
        ),
        {
          nameEN:
            category.nameEN,

          nameTR:
            category.nameTR,

          noteEN:
            category.noteEN,

          noteTR:
            category.noteTR,

          columnsEN:
            category.columnsEN,

          columnsTR:
            category.columnsTR,

          visible:
            category.visible,

          order:
            category.order,

          updatedAt:
            serverTimestamp(),
        }
      );

      setEditingCategory(
        null
      );

      setState(
        "Category updated ✓"
      );
    } catch (error) {
      console.error(error);

      setState(
        "Category update failed."
      );
    }
  }

  async function deleteCategory(
    category: MenuCategory
  ) {
    const relatedItems =
      categoryItems(
        category.id
      );

    const title =
      category.nameEN ||
      category.nameTR ||
      "category";

    const approved =
      confirm(
        relatedItems.length > 0
          ? `Delete "${title}" and its ${relatedItems.length} menu item(s)?`
          : `Delete "${title}"?`
      );

    if (!approved) {
      return;
    }

    try {
      await Promise.all(
        relatedItems.map(
          (item) =>
            deleteDoc(
              doc(
                db,
                "menuItems",
                item.id
              )
            )
        )
      );

      await deleteDoc(
        doc(
          db,
          "menuCategories",
          category.id
        )
      );

      setItems(
        (current) =>
          current.filter(
            (item) =>
              item.categoryId !==
              category.id
          )
      );

      setCategories(
        (current) =>
          current.filter(
            (item) =>
              item.id !==
              category.id
          )
      );

      setState(
        "Category deleted ✓"
      );
    } catch (error) {
      console.error(error);

      setState(
        "Category could not be deleted."
      );
    }
  }

  /* =========================================================
     CATEGORY ORDER
     ========================================================= */

  async function moveCategory(
    categoryId: string,
    direction:
      | "up"
      | "down"
  ) {
    const list = [
      ...activeCategories,
    ];

    const index =
      list.findIndex(
        (item) =>
          item.id ===
          categoryId
      );

    if (index === -1) {
      return;
    }

    const swapIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      swapIndex < 0 ||
      swapIndex >= list.length
    ) {
      return;
    }

    const current =
      list[index];

    const swap =
      list[swapIndex];

    try {
      await Promise.all([
        updateDoc(
          doc(
            db,
            "menuCategories",
            current.id
          ),
          {
            order:
              swap.order,

            updatedAt:
              serverTimestamp(),
          }
        ),

        updateDoc(
          doc(
            db,
            "menuCategories",
            swap.id
          ),
          {
            order:
              current.order,

            updatedAt:
              serverTimestamp(),
          }
        ),
      ]);

      setCategories(
        (all) =>
          all.map((item) => {
            if (
              item.id ===
              current.id
            ) {
              return {
                ...item,
                order:
                  swap.order,
              };
            }

            if (
              item.id ===
              swap.id
            ) {
              return {
                ...item,
                order:
                  current.order,
              };
            }

            return item;
          })
      );
    } catch (error) {
      console.error(error);

      setState(
        "Category order could not be changed."
      );
    }
  }

  /* =========================================================
     ITEMS
     ========================================================= */

  async function addItem(
    categoryId: string
  ) {
    const user =
      auth.currentUser;

    if (!user) {
      setState(
        "Session expired."
      );

      return;
    }

    const existing =
      categoryItems(
        categoryId
      );

    const order =
      existing.length > 0
        ? Math.max(
            ...existing.map(
              (item) =>
                item.order
            )
          ) + 1
        : 0;

    const category =
      categories.find(
        (item) =>
          item.id ===
          categoryId
      );

    const categoryColumns =
      language === "EN"
        ? category?.columnsEN || []
        : category?.columnsTR || [];

    const prices =
      categoryColumns.length > 0
        ? categoryColumns.map(
            () => ""
          )
        : [];

    try {
      const payload = {
        menu:
          activeMenu,

        categoryId,

        nameEN: "",
        nameTR: "",

        descriptionEN: "",
        descriptionTR: "",

        price: "",
        prices,

        extrasEN: [],
        extrasTR: [],

        order,

        visible: true,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),

        updatedBy:
          user.uid,

        updatedByEmail:
          user.email || "",
      };

      const result =
        await addDoc(
          collection(
            db,
            "menuItems"
          ),
          payload
        );

      const created: MenuItem = {
        id: result.id,

        menu:
          activeMenu,

        categoryId,

        nameEN: "",
        nameTR: "",

        descriptionEN: "",
        descriptionTR: "",

        price: "",
        prices,

        extrasEN: [],
        extrasTR: [],

        order,

        visible: true,
      };

      setItems(
        (current) => [
          ...current,
          created,
        ]
      );

      setEditingItem(
        result.id
      );

      setState(
        "New menu item added ✓"
      );
    } catch (error) {
      console.error(error);

      setState(
        "Menu item could not be added."
      );
    }
  }

  function updateItemLocal(
    id: string,
    field:
      | "nameEN"
      | "nameTR"
      | "descriptionEN"
      | "descriptionTR"
      | "price"
      | "prices"
      | "extrasEN"
      | "extrasTR"
      | "visible",
    value:
      | string
      | string[]
      | boolean
  ) {
    setItems(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        )
    );
  }

  async function toggleItemVisibility(
    item: MenuItem,
    visible: boolean
  ) {
    try {
      updateItemLocal(item.id, "visible", visible);

      await updateDoc(doc(db, "menuItems", item.id), {
        visible,
        updatedAt: serverTimestamp(),
      });

      setState(
        visible
          ? "Menu item is now shown on the website ✓"
          : "Menu item is now hidden from the website ✓"
      );
    } catch (error) {
      console.error(error);
      updateItemLocal(item.id, "visible", !visible);
      setState("Menu item visibility could not be changed.");
    }
  }

  function updateMultiPrice(
    item: MenuItem,
    index: number,
    value: string
  ) {
    const next =
      [...item.prices];

    while (
      next.length <= index
    ) {
      next.push("");
    }

    next[index] =
      value;

    updateItemLocal(
      item.id,
      "prices",
      next
    );
  }

  async function saveItem(item: MenuItem) {
    const currentName =
      language === "EN" ? item.nameEN.trim() : item.nameTR.trim();

    if (!currentName) {
      setState(
        language === "EN"
          ? "Please enter the product name before saving."
          : "Kaydetmeden önce ürün adını girin."
      );
      return;
    }

    try {
      setState(language === "EN" ? "Saving menu item..." : "Ürün kaydediliyor...");

      await updateDoc(doc(db, "menuItems", item.id), {
        nameEN: item.nameEN,
        nameTR: item.nameTR,
        descriptionEN: item.descriptionEN,
        descriptionTR: item.descriptionTR,
        price: item.price,
        prices: item.prices,
        extrasEN: item.extrasEN,
        extrasTR: item.extrasTR,
        visible: item.visible,
        order: item.order,
        updatedAt: serverTimestamp(),
      });

      setEditingItem(null);
      setState(
        language === "EN"
          ? "Saved — changes are now live on the website ✓"
          : "Kaydedildi — değişiklikler artık web sitesinde yayında ✓"
      );
    } catch (error) {
      console.error(error);
      setState(
        language === "EN"
          ? "Menu item could not be saved."
          : "Ürün kaydedilemedi."
      );
    }
  }

  async function deleteItem(
    item: MenuItem
  ) {
    const approved =
      confirm(
        `Delete "${
          item.nameEN ||
          item.nameTR ||
          "this item"
        }"?`
      );

    if (!approved) {
      return;
    }

    try {
      await deleteDoc(
        doc(
          db,
          "menuItems",
          item.id
        )
      );

      setItems(
        (current) =>
          current.filter(
            (currentItem) =>
              currentItem.id !==
              item.id
          )
      );

      setState(
        "Menu item deleted ✓"
      );
    } catch (error) {
      console.error(error);

      setState(
        "Menu item could not be deleted."
      );
    }
  }

  /* =========================================================
     ITEM ORDER
     ========================================================= */

  async function moveItem(
    item: MenuItem,
    direction:
      | "up"
      | "down"
  ) {
    const list =
      categoryItems(
        item.categoryId
      );

    const index =
      list.findIndex(
        (current) =>
          current.id ===
          item.id
      );

    if (index === -1) {
      return;
    }

    const swapIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      swapIndex < 0 ||
      swapIndex >= list.length
    ) {
      return;
    }

    const swap =
      list[swapIndex];

    try {
      await Promise.all([
        updateDoc(
          doc(
            db,
            "menuItems",
            item.id
          ),
          {
            order:
              swap.order,

            updatedAt:
              serverTimestamp(),
          }
        ),

        updateDoc(
          doc(
            db,
            "menuItems",
            swap.id
          ),
          {
            order:
              item.order,

            updatedAt:
              serverTimestamp(),
          }
        ),
      ]);

      setItems(
        (current) =>
          current.map(
            (currentItem) => {
              if (
                currentItem.id ===
                item.id
              ) {
                return {
                  ...currentItem,
                  order:
                    swap.order,
                };
              }

              if (
                currentItem.id ===
                swap.id
              ) {
                return {
                  ...currentItem,
                  order:
                    item.order,
                };
              }

              return currentItem;
            }
          )
      );
    } catch (error) {
      console.error(error);

      setState(
        "Menu item order could not be changed."
      );
    }
  }

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <AdminShell
      eyebrow="Website"
      title="Menus"
    >
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">
            Restaurant Menu
          </p>

          <h1>
            Menus.
          </h1>

          <p
            style={{
              marginTop: 10,
              opacity: 0.65,
              maxWidth: 680,
            }}
          >
            Manage every menu category,
            product, description and price
            directly from the website.
          </p>
        </div>
      </div>

      {/* IMPORT */}

      {!loading &&
        !importStatus.complete && (
          <section
            style={{
              padding: 24,
              border:
                "1px solid rgba(200,84,93,.35)",
              borderRadius: 16,
              marginBottom: 28,
              background:
                "rgba(200,84,93,.05)",
            }}
          >
            <p className="admin-eyebrow">
              Initial Setup
            </p>

            <h2
              style={{
                marginTop: 6,
                marginBottom: 10,
              }}
            >
              Import current menus
            </h2>

            <p
              style={{
                opacity: 0.65,
                maxWidth: 700,
                marginBottom: 18,
              }}
            >
              Copy the current Food,
              Drinks and Breakfast menu
              content into the CMS.
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <span>
                Food:{" "}
                <strong>
                  {importStatus.food
                    ? "Imported"
                    : "Waiting"}
                </strong>
              </span>

              <span>
                Drinks:{" "}
                <strong>
                  {importStatus.drinks
                    ? "Imported"
                    : "Waiting"}
                </strong>
              </span>

              <span>
                Breakfast:{" "}
                <strong>
                  {importStatus.breakfast
                    ? "Imported"
                    : "Waiting"}
                </strong>
              </span>
            </div>

            <button
              type="button"
              className="admin-button"
              disabled={importing}
              onClick={
                importCurrentMenus
              }
            >
              {importing
                ? "IMPORTING..."
                : "IMPORT CURRENT MENUS"}
            </button>
          </section>
        )}

      {/* MENU SELECTOR */}

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        {(
          Object.keys(
            menuLabels
          ) as MenuKey[]
        ).map((key) => {
          const count =
            categories.filter(
              (item) =>
                item.menu === key
            ).length;

          return (
            <button
              key={key}
              type="button"
              className={`admin-button ${
                activeMenu === key
                  ? ""
                  : "secondary"
              }`}
              onClick={() => {
                setActiveMenu(
                  key
                );

                setEditingCategory(
                  null
                );

                setEditingItem(
                  null
                );
              }}
            >
              {
                menuLabels[key]
                  .label
              }

              {count > 0
                ? ` (${count})`
                : ""}
            </button>
          );
        })}
      </div>

      {/* LANGUAGE */}

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 26,
        }}
      >
        <button
          type="button"
          className={`admin-button ${
            language === "EN"
              ? ""
              : "secondary"
          }`}
          onClick={() =>
            setLanguage("EN")
          }
        >
          EN
        </button>

        <button
          type="button"
          className={`admin-button ${
            language === "TR"
              ? ""
              : "secondary"
          }`}
          onClick={() =>
            setLanguage("TR")
          }
        >
          TR
        </button>
      </div>

      <div
        style={{
          marginTop: -14,
          marginBottom: 26,
          padding: "10px 14px",
          borderRadius: 10,
          background: "rgba(0,0,0,.035)",
          fontSize: 12,
        }}
      >
        <strong>
          {language === "EN"
            ? "Editing English content"
            : "Türkçe içerik düzenleniyor"}
        </strong>
        <span style={{ opacity: 0.6, marginLeft: 6 }}>
          {language === "EN"
            ? "Switch to TR to enter the Turkish version."
            : "İngilizce versiyonu düzenlemek için EN'e geçin."}
        </span>
      </div>

      {state && (
        <p
          className="admin-save-message"
          style={{
            marginBottom: 20,
          }}
        >
          {state}
        </p>
      )}

      {loading ? (
        <p>
          Loading menus...
        </p>
      ) : (
        <>
          {/* MENU SETTINGS */}

          <section
            style={{
              padding: 24,
              border:
                "1px solid rgba(0,0,0,.12)",
              borderRadius: 16,
              marginBottom: 30,
            }}
          >
            <p className="admin-eyebrow">
              Menu Settings
            </p>

            <h2
              style={{
                marginTop: 6,
                marginBottom: 20,
              }}
            >
              {
                menuLabels[
                  activeMenu
                ].label
              }
            </h2>

            <div
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              <label>
                <span>
                  Menu title
                </span>

                <input
                  className="admin-input"
                  value={
                    language === "EN"
                      ? currentSettings.titleEN ||
                        ""
                      : currentSettings.titleTR ||
                        ""
                  }
                  onChange={(event) =>
                    updateLocalSetting(
                      language === "EN"
                        ? "titleEN"
                        : "titleTR",
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  Subtitle
                </span>

                <textarea
                  className="admin-input"
                  rows={3}
                  value={
                    language === "EN"
                      ? currentSettings.subtitleEN ||
                        ""
                      : currentSettings.subtitleTR ||
                        ""
                  }
                  onChange={(event) =>
                    updateLocalSetting(
                      language === "EN"
                        ? "subtitleEN"
                        : "subtitleTR",
                      event.target.value
                    )
                  }
                />
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 10,
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    currentSettings.visible !==
                    false
                  }
                  onChange={(event) =>
                    void toggleMenuVisibility(event.target.checked)
                  }
                />

                <span>
                  {currentSettings.visible !== false
                    ? "Menu shown on website"
                    : "Menu hidden from website"}
                </span>
                <small style={{ opacity: 0.55 }}>Saves automatically</small>
              </label>

              <div>
                <button
                  type="button"
                  className="admin-button"
                  onClick={
                    saveMenuSettings
                  }
                >
                  {language === "EN"
                    ? "Save Menu Settings"
                    : "Menü Ayarlarını Kaydet"}
                </button>
              </div>
            </div>
          </section>

          {/* ADD CATEGORY */}

          <section
            style={{
              padding: 24,
              border:
                "1px solid rgba(0,0,0,.12)",
              borderRadius: 16,
              marginBottom: 30,
            }}
          >
            <p className="admin-eyebrow">
              Categories
            </p>

            <h2
              style={{
                marginTop: 6,
                marginBottom: 18,
              }}
            >
              Add category
            </h2>

            <p
              style={{
                marginTop: -8,
                marginBottom: 18,
                opacity: 0.6,
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              {language === "EN"
                ? "Categories group your menu items. Example: Starters, Main Courses, Cocktails or Coffee. Enter a name and click Add Category."
                : "Kategoriler ürünleri gruplandırır. Örnek: Başlangıçlar, Ana Yemekler, Kokteyller veya Kahve. Kategori adını yazın ve Kategori Ekle butonuna basın."}
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <input
                className="admin-input"
                style={{
                  flex:
                    "1 1 280px",
                }}
                placeholder={
                  language === "EN"
                    ? "Category name"
                    : "Kategori adı"
                }
                value={
                  newCategory
                }
                onChange={(event) =>
                  setNewCategory(
                    event.target.value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    void addCategory();
                  }
                }}
              />

       <button
  type="button"
  className={`admin-button ${
    !newCategory.trim() ? "category-button-disabled" : ""
  }`}
  disabled={!newCategory.trim()}
  onClick={() => void addCategory()}
>
  {language === "EN"
    ? "Add Category"
    : "Kategori Ekle"}
</button>
            </div>
          </section>

          {/* CATEGORIES */}

          <div
            style={{
              display: "grid",
              gap: 20,
            }}
          >
            {activeCategories.length ===
              0 && (
              <div
                style={{
                  padding: 30,
                  border:
                    "1px dashed rgba(0,0,0,.2)",
                  borderRadius: 16,
                }}
              >
                No categories yet.
              </div>
            )}

            {activeCategories.map(
              (
                category,
                categoryIndex
              ) => {
                const list =
                  categoryItems(
                    category.id
                  );

                const categoryName =
                  language === "EN"
                    ? category.nameEN
                    : category.nameTR;

                const note =
                  language === "EN"
                    ? category.noteEN
                    : category.noteTR;

                const columns =
                  language === "EN"
                    ? category.columnsEN
                    : category.columnsTR;

                const isCategoryEditing =
                  editingCategory ===
                  category.id;

                return (
                  <section
                    key={
                      category.id
                    }
                    style={{
                      border:
                        "1px solid rgba(0,0,0,.12)",
                      borderRadius: 16,
                      overflow:
                        "hidden",
                    }}
                  >
                    {/* CATEGORY HEADER */}

                    <div
                      style={{
                        padding: 20,
                        display:
                          "flex",
                        gap: 12,
                        alignItems:
                          "flex-start",
                        justifyContent:
                          "space-between",
                        flexWrap:
                          "wrap",
                        background:
                          "rgba(0,0,0,.025)",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: 260,
                        }}
                      >
                        {isCategoryEditing ? (
                          <div
                            style={{
                              display:
                                "grid",
                              gap: 12,
                            }}
                          >
                            <label>
                              <span>
                                Category name
                              </span>

                              <input
                                className="admin-input"
                                value={
                                  categoryName
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateCategoryLocal(
                                    category.id,
                                    language ===
                                      "EN"
                                      ? "nameEN"
                                      : "nameTR",
                                    event
                                      .target
                                      .value
                                  )
                                }
                              />
                            </label>

                            <label>
                              <span>
                                Price columns
                              </span>

                              <input
                                className="admin-input"
                                placeholder={
                                  language ===
                                  "EN"
                                    ? "Glass, Bottle"
                                    : "Kadeh, Şişe"
                                }
                                value={
                                  columns.join(
                                    ", "
                                  )
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateCategoryLocal(
                                    category.id,
                                    language ===
                                      "EN"
                                      ? "columnsEN"
                                      : "columnsTR",
                                    event.target.value
                                      .split(",")
                                      .map(
                                        (
                                          item
                                        ) =>
                                          item.trim()
                                      )
                                      .filter(
                                        Boolean
                                      )
                                  )
                                }
                              />

                              <small
                                style={{
                                  opacity:
                                    0.55,
                                }}
                              >
                                Leave empty
                                for normal
                                single-price
                                items.
                              </small>
                            </label>

                            <label>
                              <span>
                                Category note
                              </span>

                              <textarea
                                className="admin-input"
                                rows={2}
                                value={
                                  note
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateCategoryLocal(
                                    category.id,
                                    language ===
                                      "EN"
                                      ? "noteEN"
                                      : "noteTR",
                                    event
                                      .target
                                      .value
                                  )
                                }
                              />
                            </label>
                          </div>
                        ) : (
                          <>
                            <p
                              className="admin-eyebrow"
                              style={{
                                marginBottom: 4,
                              }}
                            >
                              Category{" "}
                              {categoryIndex +
                                1}
                            </p>

                            <h2>
                              {categoryName ||
                                (language ===
                                "EN"
                                  ? category.nameTR ||
                                    "Untitled category"
                                  : category.nameEN ||
                                    "İsimsiz kategori")}
                            </h2>

                            {columns.length >
                              0 && (
                              <p
                                style={{
                                  marginTop: 6,
                                  opacity:
                                    0.55,
                                }}
                              >
                                Price columns:{" "}
                                {columns.join(
                                  " · "
                                )}
                              </p>
                            )}

                            {note && (
                              <p
                                style={{
                                  marginTop: 6,
                                  opacity:
                                    0.65,
                                }}
                              >
                                {note}
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          gap: 8,
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <button
                          type="button"
                          className="admin-button secondary"
                          disabled={
                            categoryIndex ===
                            0
                          }
                          onClick={() =>
                            void moveCategory(
                              category.id,
                              "up"
                            )
                          }
                        >
                          ↑
                        </button>

                        <button
                          type="button"
                          className="admin-button secondary"
                          disabled={
                            categoryIndex ===
                            activeCategories.length -
                              1
                          }
                          onClick={() =>
                            void moveCategory(
                              category.id,
                              "down"
                            )
                          }
                        >
                          ↓
                        </button>

                        <label
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap: 6,
                            padding:
                              "0 8px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={
                              category.visible
                            }
                            onChange={(event) =>
                              void toggleCategoryVisibility(
                                category,
                                event.target.checked
                              )
                            }
                          />

                          <span style={{ fontSize: 12, fontWeight: 700 }}>
                            {category.visible
                              ? "Shown on website"
                              : "Hidden from website"}
                          </span>
                        </label>

                        {isCategoryEditing ? (
                          <button
                            type="button"
                            className="admin-button"
                            onClick={() =>
                              void updateCategory(
                                category
                              )
                            }
                          >
                            {language === "EN"
                              ? "Save Changes"
                              : "Değişiklikleri Kaydet"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="admin-button secondary"
                            onClick={() =>
                              setEditingCategory(
                                category.id
                              )
                            }
                          >
                            Edit
                          </button>
                        )}

                        <button
                          type="button"
                          className="admin-button secondary"
                          onClick={() =>
                            void deleteCategory(
                              category
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* ITEMS */}

                    <div
                      style={{
                        padding: 20,
                      }}
                    >
                      {list.length ===
                        0 && (
                        <p
                          style={{
                            opacity:
                              0.55,
                            marginBottom:
                              16,
                          }}
                        >
                          No menu items
                          in this
                          category.
                        </p>
                      )}

                      <div
                        style={{
                          display:
                            "grid",
                          gap: 12,
                        }}
                      >
                        {list.map(
                          (
                            item,
                            itemIndex
                          ) => {
                            const name =
                              language ===
                              "EN"
                                ? item.nameEN
                                : item.nameTR;

                            const description =
                              language ===
                              "EN"
                                ? item.descriptionEN
                                : item.descriptionTR;

                            const extras =
                              language ===
                              "EN"
                                ? item.extrasEN
                                : item.extrasTR;

                            const isEditing =
                              editingItem ===
                              item.id;

                            return (
                              <article
                                key={
                                  item.id
                                }
                                style={{
                                  padding:
                                    16,
                                  border:
                                    "1px solid rgba(0,0,0,.1)",
                                  borderRadius:
                                    12,
                                }}
                              >
                                {isEditing ? (
                                  <div
                                    style={{
                                      display:
                                        "grid",
                                      gap: 12,
                                    }}
                                  >
                                    <div
                                      style={{
                                        padding: "14px 16px",
                                        borderRadius: 12,
                                        background: "rgba(200,84,93,.07)",
                                        border: "1px solid rgba(200,84,93,.18)",
                                      }}
                                    >
                                      <strong style={{ display: "block", marginBottom: 5, fontSize: 13 }}>
                                        {language === "EN"
                                          ? "How to edit this item"
                                          : "Bu ürün nasıl düzenlenir?"}
                                      </strong>
                                      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, opacity: 0.7 }}>
                                        {language === "EN"
                                          ? "1. Fill in the product name, description and price. 2. Check the information. 3. Click Save Item below. Visibility saves automatically."
                                          : "1. Ürün adı, açıklama ve fiyat alanlarını doldurun. 2. Bilgileri kontrol edin. 3. Aşağıdaki Ürünü Kaydet butonuna basın. Görünürlük otomatik kaydedilir."}
                                      </p>
                                    </div>

                                    <label>
                                      <span>
                                        Name
                                      </span>

                                      <input
                                        className="admin-input"
                                        value={
                                          name
                                        }
                                        onChange={(
                                          event
                                        ) =>
                                          updateItemLocal(
                                            item.id,
                                            language ===
                                              "EN"
                                              ? "nameEN"
                                              : "nameTR",
                                            event
                                              .target
                                              .value
                                          )
                                        }
                                      />
                                    </label>

                                    <label>
                                      <span>
                                        Description
                                      </span>

                                      <textarea
                                        className="admin-input"
                                        rows={3}
                                        value={
                                          description
                                        }
                                        onChange={(
                                          event
                                        ) =>
                                          updateItemLocal(
                                            item.id,
                                            language ===
                                              "EN"
                                              ? "descriptionEN"
                                              : "descriptionTR",
                                            event
                                              .target
                                              .value
                                          )
                                        }
                                      />
                                    </label>

                                    {columns.length >
                                    0 ? (
                                      <div>
                                        <span
                                          style={{
                                            display:
                                              "block",
                                            marginBottom:
                                              8,
                                          }}
                                        >
                                          Prices
                                        </span>

                                        <div
                                          style={{
                                            display:
                                              "grid",
                                            gridTemplateColumns:
                                              "repeat(auto-fit, minmax(140px, 1fr))",
                                            gap: 10,
                                          }}
                                        >
                                          {columns.map(
                                            (
                                              column,
                                              priceIndex
                                            ) => (
                                              <label
                                                key={`${item.id}-${priceIndex}`}
                                              >
                                                <span>
                                                  {
                                                    column
                                                  }
                                                </span>

                                                <input
                                                  className="admin-input"
                                                  placeholder="₺"
                                                  value={
                                                    item
                                                      .prices[
                                                      priceIndex
                                                    ] ||
                                                    ""
                                                  }
                                                  onChange={(
                                                    event
                                                  ) =>
                                                    updateMultiPrice(
                                                      item,
                                                      priceIndex,
                                                      event
                                                        .target
                                                        .value
                                                    )
                                                  }
                                                />
                                              </label>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <label>
                                        <span>
                                          Price
                                        </span>

                                        <input
                                          className="admin-input"
                                          placeholder="₺"
                                          value={
                                            item.price
                                          }
                                          onChange={(
                                            event
                                          ) =>
                                            updateItemLocal(
                                              item.id,
                                              "price",
                                              event
                                                .target
                                                .value
                                            )
                                          }
                                        />
                                      </label>
                                    )}

                                    <label>
                                      <span>
                                        Extras
                                      </span>

                                      <textarea
                                        className="admin-input"
                                        rows={3}
                                        placeholder={
                                          language ===
                                          "EN"
                                            ? "One extra per line"
                                            : "Her satıra bir ekstra"
                                        }
                                        value={
                                          arrayToLines(
                                            extras
                                          )
                                        }
                                        onChange={(
                                          event
                                        ) =>
                                          updateItemLocal(
                                            item.id,
                                            language ===
                                              "EN"
                                              ? "extrasEN"
                                              : "extrasTR",
                                            linesToArray(
                                              event
                                                .target
                                                .value
                                            )
                                          )
                                        }
                                      />
                                    </label>

                                    <label
                                      style={{
                                        display:
                                          "flex",
                                        gap: 8,
                                        alignItems:
                                          "center",
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={
                                          item.visible
                                        }
                                        onChange={(event) =>
                                          void toggleItemVisibility(
                                            item,
                                            event.target.checked
                                          )
                                        }
                                      />

                                      <span style={{ fontSize: 13, fontWeight: 700 }}>
                                        {item.visible
                                          ? "Shown on website"
                                          : "Hidden from website"}
                                      </span>
                                      <small style={{ opacity: 0.55 }}>
                                        Saves automatically
                                      </small>
                                    </label>

                                    <div
                                      style={{
                                        display:
                                          "flex",
                                        gap: 8,
                                        flexWrap:
                                          "wrap",
                                      }}
                                    >
                                      <button
                                        type="button"
                                        className="admin-button"
                                        onClick={() =>
                                          void saveItem(
                                            item
                                          )
                                        }
                                      >
                                        {language === "EN"
                                          ? "Save Item & Publish"
                                          : "Ürünü Kaydet ve Yayınla"}
                                      </button>

                                      <button
                                        type="button"
                                        className="admin-button secondary"
                                        onClick={() =>
                                          setEditingItem(
                                            null
                                          )
                                        }
                                      >
                                        {language === "EN"
                                          ? "Close Without Saving"
                                          : "Kaydetmeden Kapat"}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display:
                                        "flex",
                                      gap: 14,
                                      justifyContent:
                                        "space-between",
                                      alignItems:
                                        "center",
                                      flexWrap:
                                        "wrap",
                                    }}
                                  >
                                    <div
                                      style={{
                                        flex: 1,
                                        minWidth:
                                          220,
                                      }}
                                    >
                                      <strong
                                        style={{
                                          display:
                                            "block",
                                          marginBottom:
                                            4,
                                        }}
                                      >
                                        {name ||
                                          (language ===
                                          "EN"
                                            ? item.nameTR ||
                                              "Untitled item"
                                            : item.nameEN ||
                                              "İsimsiz ürün")}
                                      </strong>

                                      {description && (
                                        <span
                                          style={{
                                            display:
                                              "block",
                                            opacity:
                                              0.6,
                                            marginBottom:
                                              4,
                                          }}
                                        >
                                          {
                                            description
                                          }
                                        </span>
                                      )}

                                      {columns.length >
                                      0 ? (
                                        <div
                                          style={{
                                            display:
                                              "flex",
                                            gap: 12,
                                            flexWrap:
                                              "wrap",
                                            marginTop:
                                              6,
                                          }}
                                        >
                                          {columns.map(
                                            (
                                              column,
                                              priceIndex
                                            ) => (
                                              <span
                                                key={`${item.id}-display-${priceIndex}`}
                                              >
                                                <small
                                                  style={{
                                                    opacity:
                                                      0.55,
                                                  }}
                                                >
                                                  {
                                                    column
                                                  }
                                                  :{" "}
                                                </small>

                                                <strong>
                                                  {item
                                                    .prices[
                                                    priceIndex
                                                  ] ||
                                                    "—"}
                                                </strong>
                                              </span>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        item.price && (
                                          <span>
                                            {
                                              item.price
                                            }
                                          </span>
                                        )
                                      )}

                                      {extras.length >
                                        0 && (
                                        <div
                                          style={{
                                            marginTop:
                                              6,
                                            opacity:
                                              0.6,
                                          }}
                                        >
                                          {extras.map(
                                            (
                                              extra,
                                              extraIndex
                                            ) => (
                                              <div
                                                key={`${item.id}-extra-${extraIndex}`}
                                              >
                                                {
                                                  extra
                                                }
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    <div
                                      style={{
                                        display:
                                          "flex",
                                        gap: 8,
                                        flexWrap:
                                          "wrap",
                                      }}
                                    >
                                      <button
                                        type="button"
                                        className="admin-button secondary"
                                        disabled={
                                          itemIndex ===
                                          0
                                        }
                                        onClick={() =>
                                          void moveItem(
                                            item,
                                            "up"
                                          )
                                        }
                                      >
                                        ↑
                                      </button>

                                      <button
                                        type="button"
                                        className="admin-button secondary"
                                        disabled={
                                          itemIndex ===
                                          list.length -
                                            1
                                        }
                                        onClick={() =>
                                          void moveItem(
                                            item,
                                            "down"
                                          )
                                        }
                                      >
                                        ↓
                                      </button>

                                      <button
                                        type="button"
                                        className="admin-button secondary"
                                        onClick={() =>
                                          setEditingItem(
                                            item.id
                                          )
                                        }
                                      >
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        className="admin-button secondary"
                                        onClick={() =>
                                          void deleteItem(
                                            item
                                          )
                                        }
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </article>
                            );
                          }
                        )}
                      </div>

                      <button
                        type="button"
                        className="admin-button secondary"
                        style={{
                          marginTop: 16,
                        }}
                        onClick={() =>
                          void addItem(
                            category.id
                          )
                        }
                      >
                        {language === "EN"
                          ? "+ Add New Menu Item"
                          : "+ Yeni Ürün Ekle"}
                      </button>
                    </div>
                  </section>
                );
              }
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}