"use client";

import React, {
  ComponentProps,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from "react";

import { ListVideoIcon, Plus, XIcon } from "lucide-react";
import { MotionConfig, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { useVideoPlayer } from "../provider/video-player.provider";
import { RightSidebarSkeleton } from "./loader";
import PlayList from "./play-list";

const SidebarMotion = motion.create(Sidebar);

interface Props extends ComponentProps<typeof SidebarMotion> {
  params: {
    id: string;
  };
}

const RightSidebar: React.FC<Props> = ({ params, ...props }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)") || false;
  const videoPlayerHeight =
    useVideoPlayer((state) => state.videoPlayerHeight) || 0;
  const activeVideoTitle = useVideoPlayer((state) => state.activeVideoTitle);
  const { setOpen } = useSidebar();

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => {
      window.document.body.style.overflow = !prev ? "hidden" : "";
      if (!prev) {
        setOpen(false);
      }
      return !prev;
    });
  }, [setOpen]);

  const sidebarVariants = useMemo(() => {
    return {
      desktop: {
        height: "100svh",
        width: "var(--sidebar-width)",
        borderRadius: "0",
        backdropFilter: "none",
        boxShadow: "none",
        backgroundColor: "hsl(var(--sidebar-background))",
        top: 0,
      },
      mobileExpended: {
        height: `calc(100dvh - ${videoPlayerHeight}px - var(--header))`,
        bottom: 0,
        left: 0,
        width: "100%",
        borderRadius: "2rem 2rem 0 0",
        backdropFilter: "none",
        boxShadow: "none",
        backgroundColor: "hsl(var(--sidebar-background) / 1)",
      },
      mobileCollapsed: {
        height: "54px",
        bottom: "20px",
        left: "16px",
        width: "calc(100% - 2rem)",
        borderRadius: "1rem",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        backgroundColor: "hsl(var(--sidebar-background) / 0.85)",
      },
    };
  }, [videoPlayerHeight]);

  return (
    <Suspense fallback={<RightSidebarSkeleton />}>
      <MotionConfig
        transition={{
          type: "spring",
          bounce: 0,
          duration: 0.3,
        }}
      >
        <SidebarMotion
          collapsible="none"
          className={cn("fixed lg:sticky lg:flex lg:!w-[--sidebar-width]")}
          initial={false}
          style={
            {
              "--sidebar-width": "20rem",
            } as React.CSSProperties
          }
          variants={sidebarVariants}
          animate={
            isDesktop
              ? "desktop"
              : isExpanded
                ? "mobileExpended"
                : "mobileCollapsed"
          }
          layoutId="right-sidebar"
          variant="floating"
          {...props}
        >
          <SidebarHeader
            className={cn(isDesktop ? "flex" : isExpanded ? "flex" : "hidden")}
          >
            <SidebarMenu className="px-3">
              <div className="mx-auto h-2 w-1/2 rounded-full bg-muted lg:hidden"></div>
              <div className="flex items-start justify-between gap-0.5">
                <span className="line-clamp-2 font-semibold lg:mt-2">
                  {activeVideoTitle || "Video playing"}
                </span>
                <Button
                  size={"icon"}
                  className="size-8 shrink-0 rounded-full p-0 lg:hidden"
                  variant={"outline"}
                  onClick={toggleExpand}
                >
                  <XIcon />
                  <span className="sr-only">close playlist menu</span>
                </Button>
              </div>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <motion.div
              initial={false}
              animate={{
                display: isDesktop ? "flex" : isExpanded ? "block" : "none",
                opacity: isDesktop ? 1 : isExpanded ? 1 : 0,
                filter: isDesktop
                  ? "none"
                  : isExpanded
                    ? "blur(0)"
                    : "blur(4px)",
              }}
              className={cn("lg:block", isExpanded ? "block" : "hidden")}
            >
              <PlayList courseId={params.id} className="min-w-full" />
            </motion.div>
            <motion.button
              initial={false}
              layoutId="right-sidebar"
              className={cn(
                "line-clamp-2 flex size-full items-start gap-0.5 px-3 py-2 text-start text-sm font-medium lg:!hidden",
                isExpanded ? "hidden" : "flex"
              )}
              onClick={toggleExpand}
            >
              <ListVideoIcon className="mt-1 shrink-0" size={16} />
              {activeVideoTitle || "Video playing"}
            </motion.button>
          </SidebarContent>
          <SidebarFooter
            className={cn(isExpanded ? "flex" : "hidden", "lg:block")}
          >
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Plus />
                  <span>New Notes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </SidebarMotion>
      </MotionConfig>
    </Suspense>
  );
};

export default RightSidebar;
