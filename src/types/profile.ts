export type AccountType = "personal" | "creator" | "business";

/** Linha da tabela public.profiles. */
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  website: string | null;
  category: string | null;
  avatar_url: string | null;
  account_type: AccountType;
  is_private: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
