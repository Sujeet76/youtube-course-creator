import Link from "next/link";
import React, { Fragment, ReactNode, useCallback, useMemo } from "react";

import { ExternalLinkIcon } from "lucide-react";

import DiscordIcon from "@/assets/icons/discord.icon";
import GithubIcon from "@/assets/icons/github.icon";
import GoogleDriveIcon from "@/assets/icons/google-drive.icon";
import GoogleIcon from "@/assets/icons/google.icon";
import HashnodeIcon from "@/assets/icons/hashnode.icon";
import InstagramIcon from "@/assets/icons/instagram.icon";
import LinkedInIcon from "@/assets/icons/linked-in-icon";
import MediumIcon from "@/assets/icons/medium.icon";
import TelegramIcon from "@/assets/icons/telegram.icon";
import XIcon from "@/assets/icons/x.icon";
import YouTubeIcon from "@/assets/icons/youtube";
import { convertTimestampToSeconds } from "@/lib/utils";

import { useVideoPlayer } from "../provider/video-player.provider";
import { LineSegment, TimestampMatch } from "../types";

export interface YouTubeDescriptionProps {
  description: string;
}

const YouTubeDescription: React.FC<YouTubeDescriptionProps> = ({
  description = "",
}) => {
  const getLinkIcon = useCallback((url: string): ReactNode => {
    if (!url) return <ExternalLinkIcon className="size-4" />;

    if (url.includes("youtube.com"))
      return <YouTubeIcon className="size-4 shrink-0" />;
    if (url.includes("twitter.com"))
      return <XIcon className="size-4 shrink-0 text-foreground" />;
    if (url.includes("instagram.com"))
      return <InstagramIcon className="size-4 shrink-0 text-foreground" />;
    if (url.includes("github.com"))
      return (
        <GithubIcon className="size-4 shrink-0 fill-black dark:fill-white" />
      );
    if (url.includes("discord.gg")) return <DiscordIcon className="size-4" />;
    if (
      url.includes("web.telegram.org") ||
      url.includes("telegram.org") ||
      url.includes("telegram.me")
    )
      return <TelegramIcon className="size-4 shrink-0" />;
    if (url.includes("medium.com"))
      return (
        <MediumIcon className="size-4 shrink-0 fill-black dark:fill-white" />
      );
    if (url.includes("drive.google.com"))
      return <GoogleDriveIcon className="size-4 shrink-0" />;
    if (url.includes("google.com"))
      return <GoogleIcon className="size-4 shrink-0" />;
    if (url.includes("linkedin.com"))
      return <LinkedInIcon className="size-4 shrink-0" />;
    if (url.includes("hashnode.com"))
      return <HashnodeIcon className="size-4 shrink-0" />;
    return <ExternalLinkIcon className="size-4 shrink-0" />;
  }, []);

  const findTimestamps = useCallback((text: string): TimestampMatch[] => {
    const timestampRegex = /\b(\d{1,2}:)?(\d{1,2}):(\d{2})\b/g;
    const matches: TimestampMatch[] = [];
    let match: RegExpExecArray | null;

    while ((match = timestampRegex.exec(text)) !== null) {
      matches.push({
        timestamp: match[0],
        index: match.index,
        length: match[0].length,
        seconds: convertTimestampToSeconds(match[0]),
      });
    }

    return matches;
  }, []);

  const parseTextSegment = useCallback((text: string): LineSegment[] => {
    const segments: LineSegment[] = [];
    const words = text.split(" ").filter(Boolean);

    words.forEach((word) => {
      if (word.startsWith("#")) {
        segments.push({
          type: "hashtag",
          tag: word.slice(1),
        });
      } else if (/^https?:\/\//.test(word)) {
        segments.push({
          type: "link",
          url: word,
          displayText: word.replace(/^https?:\/\//, ""),
        });
      } else {
        segments.push({
          type: "text",
          content: `${word} `,
        });
      }
    });

    return segments;
  }, []);

  const parseLineSegments = useCallback(
    (line: string): LineSegment[] => {
      const segments: LineSegment[] = [];
      const timestamps = findTimestamps(line);
      let lastIndex = 0;

      timestamps.forEach((match) => {
        if (match.index > lastIndex) {
          const textBefore = line.slice(lastIndex, match.index);
          segments.push(...parseTextSegment(textBefore));
        }

        segments.push({
          type: "timestamp",
          timestamp: match.timestamp,
          seconds: match.seconds,
        });

        lastIndex = match.index + match.length;
      });

      if (lastIndex < line.length) {
        const remainingText = line.slice(lastIndex);
        segments.push(...parseTextSegment(remainingText));
      }

      return segments;
    },
    [findTimestamps, parseTextSegment]
  );

  const renderSegment = useCallback(
    (segment: LineSegment, index: number): ReactNode => {
      switch (segment.type) {
        case "timestamp":
          return (
            <TimeStampComponent
              key={`timestamp-${index}`}
              timestamp={segment.timestamp}
              seconds={segment.seconds}
            />
          );

        case "link":
          return (
            <a
              key={`link-${index}`}
              href={segment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-1 pt-0.5 text-blue-600 hover:underline"
            >
              {getLinkIcon(segment.url)}
              <span className="break-all">{segment.displayText}</span>
            </a>
          );

        case "hashtag":
          return (
            <Link
              key={`hashtag-${index}`}
              href={`/hashtag/${segment.tag}`}
              target="_blank"
              className="mr-1 text-blue-600 hover:text-blue-800"
            >
              #{segment.tag}
            </Link>
          );

        case "text":
          return <Fragment key={`text-${index}`}>{segment.content}</Fragment>;
      }
    },
    [getLinkIcon]
  );

  const formattedContent = useMemo(() => {
    if (!description) {
      return <p className="text-secondary-90">No description available</p>;
    }

    return description.split("\n").map((line, lineIndex) => {
      if (line) {
        return (
          <p
            key={`line-${lineIndex}`}
            className="text-sm font-normal text-secondary-foreground/90 md:text-base"
          >
            {parseLineSegments(line).map((segment, segmentIndex) =>
              renderSegment(segment, segmentIndex)
            )}
          </p>
        );
      }

      return <br key={`line-${lineIndex}`} />;
    });
  }, [description, parseLineSegments, renderSegment]);

  return (
    <div className="mx-auto min-h-48 max-w-[900px] whitespace-pre-wrap pb-9 md:pb-0">
      {formattedContent}
    </div>
  );
};

const TimeStampComponent: React.FC<{ timestamp: string; seconds: number }> = ({
  timestamp,
  seconds,
}) => {
  const player = useVideoPlayer((state) => state.player);
  const handleClickTimeStamp = useCallback(() => {
    if (player) {
      player.seekTo(seconds, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [seconds, player]);

  return (
    <button
      onClick={handleClickTimeStamp}
      className="mr-1 font-geist-mono text-blue-600"
    >
      {timestamp}
    </button>
  );
};

export default YouTubeDescription;
