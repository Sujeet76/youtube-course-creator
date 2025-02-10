import Link from "next/link";
import React from "react";

import { LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { profileMenuLinks } from "@/constants";
import { getSession } from "@/lib/auth";

import LoginButton from "../login-button";
import LogoutButton from "./logout-button";

const ProfileMenu: React.FC = async () => {
  const session = await getSession();

  if (!session?.user) {
    return <LoginButton />;
  }

  return (
    <DropdownMenu modal={false}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger
              aria-label={session.user.image ?? "profile menu"}
              asChild
            >
              <Button
                size={"icon"}
                className="text-clip rounded-full border-2 border-primary"
                variant={"ghost"}
              >
                <Avatar className="m-2 rounded-full">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name}
                    className="rounded-full"
                  />
                  <AvatarFallback className="uppercase">
                    {session.user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">click to open profile menu</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent align="end" sideOffset={10}>
            <p>Profile menu</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end" className="w-56" sideOffset={10}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {profileMenuLinks.map((link) => (
            <MenuItem icon={link.icon} href={link.href} key={link.href}>
              {link.children}
            </MenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <LogoutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface MenuItemProps {
  href: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

const MenuItem = ({ href, icon: Icon, children }: MenuItemProps) => {
  return (
    <DropdownMenuItem asChild className="hover:cursor-pointer">
      <Link href={href}>
        {Icon && (
          <DropdownMenuShortcut className="ml-0">
            <Icon size={16} strokeWidth={2} />
          </DropdownMenuShortcut>
        )}
        <span>{children}</span>
      </Link>
    </DropdownMenuItem>
  );
};

export default ProfileMenu;
