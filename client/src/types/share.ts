export type ShareLinkStatus = "Active" | "Expired" | "Revoked";

export interface RawShareLink {
  id: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
  expiry: string | null;
  last_viewed_at: string | null;
  revoked?: boolean;
  status: ShareLinkStatus;
  video_id?: string;
}

export interface ShareLink {
  id: string;
  url: string;
  visibility: "PUBLIC" | "PRIVATE";
  expiry: string | null;
  last_viewed_at: string | null;
  status: ShareLinkStatus;
}

export interface UseShareLinksReturn {
  links: ShareLink[];
  loading: boolean;
  error: string | null;
  disableLink: (id: string) => Promise<void>;
  refetch: () => void;
}