import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { api } from "@/trpc/server";

import VideoCard from "./component/video-card";

const LastAccessedVideoSection = async () => {
  const videos = await api.watchHistory.lastAccessVideos();

  if (videos.length === 0) {
    return (
      <div className="mt-4">
        <div>
          <h3 className="text-lg font-medium text-muted-foreground">
            Last accessed videos
          </h3>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-4">
          <p>No videos found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      <div>
        <h3 className="text-lg font-medium text-muted-foreground">
          Last accessed videos
        </h3>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="mt-3 w-full max-w-screen-xl"
      >
        <CarouselContent>
          {videos.map((videoDetail) => (
            <CarouselItem
              key={videoDetail.id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <VideoCard videoDetail={videoDetail} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  );
};

export default LastAccessedVideoSection;
