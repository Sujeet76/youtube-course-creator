import {
  HomeIcon,
  LucideLayoutDashboard,
  SettingsIcon,
  UserCheck2Icon,
} from "lucide-react";

export const profileMenuLinks = [
  {
    href: "/",
    icon: HomeIcon,
    children: "Home",
  },
  {
    href: "/dashboard",
    icon: LucideLayoutDashboard,
    children: "Dashboard",
  },
  {
    href: "/dashboard/profile",
    icon: UserCheck2Icon,
    children: "Profile",
  },
  {
    href: "/dashboard/settings",
    icon: SettingsIcon,
    children: "Settings",
  },
];
