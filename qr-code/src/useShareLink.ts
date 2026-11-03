import { useEffect, useRef, useState } from "react";
import { ToastType } from "@onlyoffice/docspace-plugin-sdk";
import {
  isPluginApiError,
  usePluginActions,
  usePluginAPI,
} from "@onlyoffice/docspace-plugin-sdk/react";

import { t } from "./locales";

export type TShareTarget = {
  id: string | number;
  kind: "file" | "folder";
  /** A room keeps its links on the Contacts tab of the info panel, everything else on Share. */
  isRoom?: boolean;
};

/** The primary external link - the one on the Share tab, which the QR code encodes. */
export type TShareLink = {
  url: string;
  title: string;
  /** FileShare: 2 read only, 5 review, 6 comment, 7 form filling, 8 custom filter, 10 editing. */
  access: number;
  internal: boolean;
  hasPassword: boolean;
  expirationDate: string | null;
  isExpired: boolean;
};

export type TShareLinkState =
  | { status: "loading" }
  | { status: "ready"; link: TShareLink }
  | { status: "empty"; creating: boolean }
  | { status: "unsupported" }
  | { status: "error" };

type TLinkDto = {
  title?: string;
  shareLink?: string;
  primary?: boolean;
  internal?: boolean | null;
  password?: string | null;
  expirationDate?: string | null;
  isExpired?: boolean | null;
};

// Current portals answer with sharedLink; older ones carry the same object in sharedTo.
type TShareDto = {
  access: number;
  sharedLink?: TLinkDto | null;
  sharedTo?: TLinkDto | null;
};

type TFolderInfo = {
  roomType?: number;
  rootRoomType?: number;
};

// RoomType values from the api-sdk's own enum (not imported - rest-api.md: importing
// @onlyoffice/docspace-api-sdk bundles a second HTTP client, it is documentation only).
// Only these three room types expose a room-level public link (helpcenter.onlyoffice.com,
// "Managing rooms in DocSpace"); Collaboration and Virtual Data rooms never do. Resolved
// from the numeric roomType a folder fetch (/files/folder/{id}) returns - not from the
// string useCurrentFile().roomType carries, whose exact spelling ("PublicRoom"? "Public"?)
// is unconfirmed and was wrong for at least a Public room in testing.
const ROOM_TYPES_WITH_PUBLIC_LINK = new Set([
  1 /* FillingFormsRoom */, 5 /* CustomRoom */, 6 /* PublicRoom */,
]);

const linkOf = (dto: TShareDto): TLinkDto | null | undefined => dto.sharedLink ?? dto.sharedTo;

const toShareLink = (dto: TShareDto): TShareLink | null => {
  const link = linkOf(dto);
  if (!link?.shareLink) return null;
  return {
    url: link.shareLink,
    title: link.title ?? "",
    access: dto.access,
    internal: !!link.internal,
    hasPassword: !!link.password,
    expirationDate: link.expirationDate ?? null,
    isExpired: !!link.isExpired,
  };
};

const basePath = (target: TShareTarget): string =>
  target.kind === "file" ? `/files/file/${target.id}` : `/files/folder/${target.id}`;

export function useShareLink(target: TShareTarget | null) {
  const api = usePluginAPI();
  const { showToast } = usePluginActions();
  const [state, setState] = useState<TShareLinkState>({ status: "loading" });
  // Bumped by retry() to run the read again for the same target.
  const [attempt, setAttempt] = useState(0);
  // The target the state belongs to, so a create that lands after the selection moved is dropped.
  const current = useRef<string | null>(null);

  useEffect(() => {
    if (!target) {
      setState({ status: "error" });
      return;
    }

    const base = basePath(target);
    current.current = base;
    setState({ status: "loading" });
    const controller = new AbortController();
    const options = { signal: controller.signal };

    // The list only reads. GET .../link would answer as well, but it creates the primary link
    // when there is none - and looking at a tab must not share anything.
    (async () => {
      try {
        // The portal reports a total for this list, so the client resolves to { total, items };
        // a bare array is taken as well, in case an endpoint answers without one.
        const page = await api.get<TShareDto[] | { items: TShareDto[] }>(
          `${base}/links`,
          undefined,
          options,
        );
        const links = Array.isArray(page) ? page : page.items;
        const primary = links.find((dto) => linkOf(dto)?.primary);
        const link = primary ? toShareLink(primary) : null;
        if (link) {
          setState({ status: "ready", link });
          return;
        }
        if (target.kind === "folder") {
          const folder = await api.get<TFolderInfo>(base, undefined, options);
          const roomType = folder.roomType ?? folder.rootRoomType;
          if (roomType !== undefined && !ROOM_TYPES_WITH_PUBLIC_LINK.has(roomType)) {
            setState({ status: "unsupported" });
            return;
          }
        }
        setState({ status: "empty", creating: false });
      } catch (e) {
        if (isPluginApiError(e) && e.code === "ABORTED") return;
        setState({ status: "error" });
      }
    })();

    return () => controller.abort();
  }, [api, target?.id, target?.kind, attempt]);

  const retry = (): void => setAttempt((n) => n + 1);

  // Only on the user's request: this read creates the primary link - read access, no password,
  // no expiry - the same link "Create" on the Share tab gives.
  const create = async (): Promise<void> => {
    if (!target) return;
    const base = basePath(target);
    setState({ status: "empty", creating: true });
    try {
      const link = toShareLink(await api.get<TShareDto>(`${base}/link`));
      if (current.current !== base) return;
      if (!link) throw new Error("The answer carries no link");
      setState({ status: "ready", link });
    } catch {
      if (current.current !== base) return;
      setState({ status: "empty", creating: false });
      showToast({ type: ToastType.error, title: t("link.createFailed") });
    }
  };

  return { state, create, retry };
}
