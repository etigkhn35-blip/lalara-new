"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cmsRecordStyle, type CmsLocale, type CmsMap, type CmsRecord, type CmsTextRole } from "./types";

type UseSiteContentOptions = {
  locale: CmsLocale;
  originals: CmsMap;
};

export function useSiteContent({ locale, originals }: UseSiteContentOptions) {
  const [overrides, setOverrides] = useState<CmsMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefix = `${locale}-`;

    return onSnapshot(
      collection(db, "siteContent"),
      (snapshot) => {
        const next: CmsMap = {};
snapshot.forEach((item) => {
 

  if (!item.id.startsWith(prefix)) return;

  const data = item.data() as CmsRecord;
  if (data.status && data.status !== "published") return;

  next[item.id.slice(prefix.length)] = data;
});

        setOverrides(next);
        setReady(true);
      },
      (error) => {
        console.error(`La Lara ${locale.toUpperCase()} siteContent live load error:`, error);
        // The website remains usable from code originals if Firebase is unavailable.
        setOverrides({});
        setReady(true);
      }
    );
  }, [locale]);

  const content = useMemo<CmsMap>(() => {
    const keys = new Set([...Object.keys(originals), ...Object.keys(overrides)]);
    const merged: CmsMap = {};

    keys.forEach((key) => {
      merged[key] = {
        ...(originals[key] ?? {}),
        ...(overrides[key] ?? {}),
      };
    });

    return merged;
  }, [originals, overrides]);

  function getContent(key: string) {
    return content[key];
  }

  function isVisible(key: string) {
    return content[key]?.visible !== false;
  }

  function styleFor(key: string, role: CmsTextRole) {
    return cmsRecordStyle(content[key], role);
  }

  return { ready, content, getContent, isVisible, styleFor };
}
