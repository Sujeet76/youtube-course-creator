import Image from "next/image";
import Link from "next/link";
import React from "react";

import { GraduationCapIcon, VideoIcon } from "lucide-react";

import UserAvatar from "@/components/shared/use-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";

import { getEnrolledCourses } from "../db";

interface Props {
  course: Awaited<ReturnType<typeof getEnrolledCourses>>[0]["course"];
  lastAccessedVideo: string;
}

const EnrolledCourseCard: React.FC<Props> = ({ course, lastAccessedVideo }) => {
  return (
    <li className="grid grid-rows-subgrid overflow-hidden rounded-xl border bg-card p-3 px-4 text-card-foreground shadow [grid-row:span_5]">
      <div className="relative aspect-video overflow-hidden rounded-md">
        <Image
          src={course.thumbnail ?? ""}
          alt={course.title}
          width={1080}
          height={720}
          className="size-full select-none object-cover"
        />
        <Badge
          // variant={"secondary"}
          className="absolute right-4 top-4 gap-1 text-sm font-normal"
        >
          <VideoIcon className="size-4" /> {course.video_count}{" "}
          {course.video_count === 1 ? "video" : "videos"}
        </Badge>
      </div>

      <CardTitle className="line-clamp-2">{course.title}</CardTitle>

      <CardDescription className="line-clamp-3">
        {course?.description ||
          "The author of the course has not provided any description."}
      </CardDescription>

      <div className="">
        <UserAvatar
          customUrl={course.author.customUrl ?? ""}
          title={course.author.name}
          avatar={course.author.imgUrl}
          count={course.author.subscriberCount}
          className="size-8"
        />
      </div>

      <div className="w-full">
        <Button className="w-full" asChild>
          <Link
            href={{
              pathname: `/dashboard/courses/${course.id}`,
              query: { v: lastAccessedVideo },
            }}
          >
            Start learning
            <GraduationCapIcon />
          </Link>
        </Button>
      </div>
    </li>
  );
};

export default EnrolledCourseCard;
