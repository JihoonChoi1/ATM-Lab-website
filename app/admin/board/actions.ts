"use server";

import { prisma } from "@/lib/db";
import {
  saveHeroMeta,
  type HeroMetaFormState,
  type SingletonDelegate,
} from "../_lib/hero-meta";

// The public /board page (News + Gallery combined) has no admin list of its own,
// so its hero-meta editor lives at /admin/board/meta, reachable from both the
// News and Gallery admin lists. Only the singleton update action lives here.

export async function updatePageMeta(
  _prev: HeroMetaFormState,
  formData: FormData,
): Promise<HeroMetaFormState> {
  return saveHeroMeta(
    {
      delegate: prisma.boardPageMeta as unknown as SingletonDelegate,
      entity: "BoardPageMeta",
      label: "Board 페이지 메타",
      metaPath: "/admin/board/meta",
    },
    formData,
  );
}
