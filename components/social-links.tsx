import { Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SocialLinksProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline";
}

export function SocialLinks({ 
  className,
  size = "md",
  variant = "solid" 
}: SocialLinksProps) {
  const sizeClasses = {
    sm: "p-1.5 gap-1.5",
    md: "p-2 gap-2",
    lg: "p-3 gap-3"
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  const baseStyles = cn(
    "flex items-center rounded-lg font-medium transition-colors duration-200",
    sizeClasses[size],
    className
  );

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/yourusername",
      styles: variant === "solid" 
        ? "bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
        : "text-[#1DA1F2] hover:bg-[#1DA1F2]/10 border border-[#1DA1F2]"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/in/yourusername",
      styles: variant === "solid"
        ? "bg-[#0A66C2] hover:bg-[#094c8f] text-white"
        : "text-[#0A66C2] hover:bg-[#0A66C2]/10 border border-[#0A66C2]"
    },
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/yourusername",
      styles: variant === "solid"
        ? "bg-[#24292F] hover:bg-[#1b1f23] text-white"
        : "text-[#24292F] hover:bg-[#24292F]/10 border border-[#24292F] dark:text-white dark:border-white"
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {socialLinks.map((social) => (
        <Link
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(baseStyles, social.styles)}
          title={`Follow on ${social.name}`}
        >
          <social.icon size={iconSizes[size]} />
          {size === "lg" && <span>{social.name}</span>}
        </Link>
      ))}
    </div>
  );
} 