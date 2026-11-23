import { Clapperboard, Compass, Heart, House, MessageCircle, PlusSquare, UserRound, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Aparece na barra inferior do celular (máx. 5 itens). */
  mobile?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/feed", label: "Início", icon: House, mobile: true },
  { href: "/explore", label: "Explorar", icon: Compass, mobile: true },
  { href: "/create", label: "Criar", icon: PlusSquare, mobile: true },
  { href: "/reels", label: "Reels", icon: Clapperboard, mobile: true },
  { href: "/messages", label: "Mensagens", icon: MessageCircle },
  { href: "/notifications", label: "Notificações", icon: Heart },
  { href: "/profile", label: "Perfil", icon: UserRound, mobile: true },
];
