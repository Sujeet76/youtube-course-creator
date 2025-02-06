import Image from "next/image";
import Link from "next/link";
import React from "react";

import { GraduationCapIcon, VideoIcon } from "lucide-react";

import UserAvatar from "@/components/shared/use-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getEnrolledCourses } from "../db";

interface Props {
  course: Awaited<ReturnType<typeof getEnrolledCourses>>[0]["course"];
}

const EnrolledCourseCard: React.FC<Props> = ({ course }) => {
  return (
    <Card className="overflow-hidden">
      <div>
        <CardHeader className="p-3">
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
          <CardDescription className="line-clamp-5">
            {course?.description ?? "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <UserAvatar
              customUrl={course.author.customUrl ?? ""}
              title={course.author.name}
              avatar={course.author.imgUrl}
              count={course.author.subscriberCount}
              className="size-8"
            />
          </div>
        </CardContent>
      </div>
      <CardFooter className="w-full">
        <Button className="w-full" asChild>
          <Link href={`/dashboard/courses/${course.id}`}>
            Start learning
            <GraduationCapIcon />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnrolledCourseCard;
