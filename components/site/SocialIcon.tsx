import { FaGithub, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { SocialPlatform } from "@/lib/data/types";

export const SOCIAL_META: Record<SocialPlatform, { label: string; Icon: IconType }> = {
  instagram: { label: "Instagram", Icon: FaInstagram },
  whatsapp: { label: "WhatsApp", Icon: FaWhatsapp },
  github: { label: "GitHub", Icon: FaGithub },
  linkedin: { label: "LinkedIn", Icon: FaLinkedinIn },
};

export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const { Icon } = SOCIAL_META[platform];
  return <Icon className={className} aria-hidden />;
}
