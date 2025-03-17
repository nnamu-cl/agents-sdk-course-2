export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Email Application",
  description: "A simple email application with inbox and sent mail functionality.",
  navItems: [
    {
      label: "Inbox",
      href: "/",
    },
    {
      label: "Sent",
      href: "/sent",
    },
    {
      label: "Compose",
      href: "/compose",
    },
  ],
  navMenuItems: [
    {
      label: "Inbox",
      href: "/",
    },
    {
      label: "Sent",
      href: "/sent",
    },
    {
      label: "Compose",
      href: "/compose",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
