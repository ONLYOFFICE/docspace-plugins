import { useEffect, useState } from "react";
import { usePluginAPI, isPluginApiError } from "@onlyoffice/docspace-plugin-sdk/react";

export type TShareTarget = {
  id: string | number;
  kind: "file" | "folder";
};

export type TShareLinkState =
  | { status: "loading" }
  | { status: "ready"; link: string }
  | { status: "empty" }
  | { status: "unsupported" }
  | { status: "error" };

type TLinkResponse = {
  sharedLink?: { shareLink?: string | null } | null;
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
const ROOM_TYPES_WITH_PUBLIC_LINK = new Set([1 /* FillingFormsRoom */, 5 /* CustomRoom */, 6 /* PublicRoom */]);

export function useShareLink(target: TShareTarget | null): TShareLinkState {
  const api = usePluginAPI();
  const [state, setState] = useState<TShareLinkState>({ status: "loading" });

  useEffect(() => {
    if (!target) {
      setState({ status: "error" });
      return;
    }

    setState({ status: "loading" });
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const path = target.kind === "file" ? `/files/file/${target.id}/link` : `/files/folder/${target.id}/link`;

    api
      .get<TLinkResponse>(path, undefined, options)
      .then(async (res) => {
        const link = res?.sharedLink?.shareLink;
        if (link) {
          setState({ status: "ready", link });
          return;
        }
        if (target.kind !== "folder") {
          setState({ status: "empty" });
          return;
        }
        try {
          const folder = await api.get<TFolderInfo>(`/files/folder/${target.id}`, undefined, options);
          const roomType = folder.roomType ?? folder.rootRoomType;
          const unsupported = roomType !== undefined && !ROOM_TYPES_WITH_PUBLIC_LINK.has(roomType);
          setState({ status: unsupported ? "unsupported" : "empty" });
        } catch {
          setState({ status: "empty" });
        }
      })
      .catch((e) => {
        if (isPluginApiError(e) && e.code === "ABORTED") return;
        setState({ status: "error" });
      });

    return () => controller.abort();
  }, [api, target?.id, target?.kind]);

  return state;
}
