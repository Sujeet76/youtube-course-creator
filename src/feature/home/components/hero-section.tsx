import Image from "next/image";
import React from "react";

import { CableIcon, FilmIcon, UserPlusIcon } from "lucide-react";

import YouTubeIcon from "@/assets/icons/youtube";
import LoginButton from "@/components/shared/login-button";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Spotlight } from "@/components/ui/spotlight-new";

const HeroSection: React.FC = () => {
  return (
    <section className="relative mt-(--header) overflow-x-clip">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(200, 100%, 85%, .08) 0, hsla(200, 100%, 55%, .08) 50%, hsla(200, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(150, 100%, 90%, .10) 0, hsla(150, 100%, 70%, .04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(50, 100%, 90%, .08) 0, hsla(50, 100%, 70%, .04) 80%, transparent 100%)"
      />

      <div className="mx-auto h-[calc(100dvh-var(--header))] w-full max-w-screen-2xl overflow-hidden px-6 pt-12 sm:overflow-visible sm:pt-16 md:px-8 lg:px-10">
        <div className="size-full">
          <div className="relative z-10 aspect-[1] w-full min-w-[200vw] -translate-x-[55vw] sm:min-w-0 sm:-translate-y-[24%] sm:translate-x-0">
            {/* --------------------circles------------------------ */}
            <div className="relative size-full">
              {/* circles starts */}
              <div className="border-primary/5 border-x-primary/8 shadow-primary/5 absolute inset-0 h-full w-full rounded-full border border-x-2 p-[10%] shadow-[0_0_80px_inset] sm:[mask-image:linear-gradient(transparent_15%,white_30%,white_60%,transparent_95%)]">
                <div className="border-primary/5 border-x-primary/8 shadow-primary/5 h-full w-full rounded-full border border-x-2 p-[12.25%] shadow-[0_0_80px_inset]">
                  <div className="border-primary/5 border-x-primary/8 shadow-primary/5 h-full w-full rounded-full border border-x-2 p-[12.25%] shadow-[0_0_80px_inset]"></div>
                </div>
              </div>
              {/* circles ends */}

              <svg
                viewBox="0 0 152 162"
                className="stroke-primary/12 absolute top-[50.5%] left-[1.85%] hidden w-[11.75%] -rotate-[31deg] stroke-2 sm:block"
              >
                <path
                  fill="none"
                  d="M11.5 0.5C4.50029 20 -7.46644 47.5 8.74439 69.5C17.5867 81.5 41.7436 98.375 51.7436 104C74.2436 116.656 91.2435 121 93.2435 146.5C93.7435 156 88.7443 166.667 83.7443 176.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <svg
                viewBox="0 0 94 177"
                className="to-succ stroke-primary/12 absolute top-[10.05%] left-[38%] w-[6.85%] -scale-x-100 rotate-[100deg] stroke-2 sm:top-[60%] sm:left-[87.9%] sm:w-[7%] sm:scale-x-100 sm:-rotate-1"
              >
                <path
                  fill="none"
                  d="M11.5 0.5C4.50029 20 -7.46644 47.5 8.74439 69.5C17.5867 81.5 41.7436 98.375 51.7436 104C74.2436 116.656 91.2435 121 93.2435 146.5C93.7435 156 88.7443 166.667 83.7443 176.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <defs>
                  <linearGradient id="LearnSvgGradient">
                    <stop offset="5%" stopColor="#4f46e5"></stop>
                    <stop offset="95%" stopColor="#c084fc"></stop>
                  </linearGradient>
                  <linearGradient id="ApplySvgGradient">
                    <stop offset="5%" stopColor="#0ea5e9"></stop>
                    <stop offset="95%" stopColor="#22d3ee"></stop>
                  </linearGradient>
                  <linearGradient id="GrowSvgGradient">
                    <stop offset="5%" stopColor="#65a30d"></stop>
                    <stop offset="95%" stopColor="#84cc16"></stop>
                  </linearGradient>
                  <linearGradient id="AccentSvgGradient">
                    <stop offset="10%" stopColor="#fde047"></stop>
                    <stop offset="90%" stopColor="#bef264"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* --------------------circles------------------------ */}

            <div className="absolute inset-0">
              {/* prop 1 */}
              <div className="group opacity-90 transition-opacity duration-300 ease-in-out hover:opacity-100">
                <div>
                  <Image
                    src={"/images/zoro.jpg"}
                    width={30}
                    height={30}
                    quality={100}
                    priority
                    unoptimized
                    alt="user profile img"
                    className="border-primary/30 absolute top-[56%] right-[9%] w-[4%] scale-95 rounded-full border-2 shadow transition-transform group-hover:scale-100"
                  />
                  <span className="bg-background/90 border-border absolute top-[59.25%] right-0 rounded-sm border px-[min(0.5%,8px)] text-[clamp(8px,0.77vw,12px)] font-medium whitespace-nowrap shadow lg:rounded">
                    😕 Confused what to watch
                  </span>
                  <div className="border-border bg-background/75 absolute top-[65%] right-[8.5%] flex h-[3%] w-[3%] items-center justify-center rounded-xl border p-[0.4%] text-center shadow">
                    <YouTubeIcon className="text-lg" />
                  </div>
                  <div className="border-border bg-background/75 absolute top-[73.5%] right-[5.5%] flex h-[3%] w-[3%] items-center justify-center rounded-xl border p-[0.4%] text-center shadow">
                    <CableIcon />
                  </div>
                  <span className="border-border bg-background/90 absolute top-[76.25%] right-0 rounded-sm border px-[min(0.5%,8px)] text-[clamp(8px,0.77vw,12px)] font-medium whitespace-nowrap shadow lg:rounded">
                    😀 Now i am happy
                  </span>
                </div>
              </div>

              {/* prop2 */}
              <div className="opacity-90 hover:opacity-100">
                <Image
                  alt="confused user who is trying to figure out what to watch"
                  width="64"
                  height="64"
                  decoding="async"
                  className="border-border absolute top-[12%] left-[30%] w-[4%] -rotate-12 rounded-full border-2 shadow sm:top-[49%] sm:-left-[2%] sm:rotate-0"
                  style={{ color: "transparent" }}
                  src={"/images/zoro.jpg"}
                />
                <span className="border-border bg-background/90 absolute top-[14.25%] left-[32.5%] -rotate-12 rounded-sm border px-[min(0.5%,8px)] text-[clamp(8px,0.77vw,12px)] font-medium whitespace-nowrap shadow sm:top-[52.5%] sm:-left-[1%] sm:rotate-0 lg:rounded">
                  😥 Stuck
                </span>
                <span className="border-border bg-background/90 absolute top-[17%] left-[-2%] -rotate-12 rounded-sm border px-[min(0.5%,8px)] text-[clamp(8px,0.77vw,12px)] font-medium whitespace-nowrap shadow sm:top-[58%] sm:left-[3%] sm:rotate-0 lg:rounded">
                  😄 Created course form playlist
                </span>
                <UserPlusIcon className="border-border bg-background/75 absolute top-[18.5%] left-[46.5%] h-[3%] w-[3%] -rotate-12 rounded-xl border p-[0.5%] text-black shadow sm:top-[62%] sm:left-[11%] sm:rotate-0" />
              </div>

              {/* props 3 */}
              <div className="bg-background border-border absolute top-[25%] right-[2%] hidden w-[17%] rounded-2xl border border-2 p-2 opacity-90 shadow-lg hover:opacity-100 sm:block">
                <div
                  className="bg-muted flex aspect-video max-h-18 w-full items-center justify-center rounded-lg"
                  aria-label="video playing"
                >
                  <FilmIcon />
                </div>
                <div>
                  <div className="my-1.5 flex items-center gap-0.5">
                    <Image
                      src={"/images/avatar.svg"}
                      unoptimized
                      alt="youtube chanel"
                      width={56}
                      height={56}
                      className="size-6 rounded-full object-cover select-none"
                      priority
                    />
                    <div>
                      <p className="text-sm font-semibold">Channel name</p>
                      <p className="text-ghost-foreground -mt-1 text-xs font-medium">
                        1.2k Subscribers
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="max-h-20 w-full overflow-hidden rounded-lg">
                      <Image
                        src={"/images/thumbnail.webp"}
                        width={1024}
                        height={1080}
                        priority
                        alt="thumbnail"
                        className="size-full overflow-hidden rounded-lg select-none"
                      />
                    </div>
                    <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-white">
                      Play next
                    </p>
                  </div>
                </div>
              </div>

              {/* props 4 */}
              <div className="absolute -top-3 left-[27%] flex w-[27%] max-w-60 -rotate-3 sm:top-[25%] sm:left-[6%] sm:rotate-0 sm:justify-center lg:justify-end">
                <div className="border-border bg-background/90 flex w-fit flex-col rounded-md border p-2 font-mono text-[clamp(8px,0.77vw,13px)] shadow lg:rounded-lg">
                  <div
                    className="aspect-video max-h-18 w-full overflow-hidden rounded-md"
                    aria-label="watching educational video with any interruption on playlistGenius"
                  >
                    <Image
                      src={"/images/bacteria.jpg"}
                      alt="thumbnail"
                      width={1024}
                      height={1080}
                      priority
                      className="size-full overflow-hidden select-none"
                    />
                  </div>
                  <div className="my-2">
                    <div className="flex items-center gap-0.5">
                      <Button
                        className="border-primary h-5 rounded-sm rounded-b-none border-b-2 p-0 px-1 text-xs"
                        variant={"ghost"}
                      >
                        Description
                      </Button>
                      <Button
                        className="h-5 rounded-sm p-0 px-1 text-xs"
                        variant={"ghost"}
                      >
                        Notes
                      </Button>
                      <Button
                        className="h-5 rounded-sm p-0 px-1 text-xs"
                        variant={"ghost"}
                      >
                        Friends
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="line-clamp-3 text-sm font-semibold">
                      Bacteria are microscopic, single-celled organisms that
                      exist everywhere—from deep oceans to human bodies. They
                      come in various shapes like rods, spheres, and spirals.
                      While some bacteria cause diseases, many are essential for
                      life, helping in digestion, decomposing waste, and even
                      producing medicines. These tiny creatures reproduce
                      rapidly, adapting to extreme conditions. From beneficial
                      probiotics to harmful pathogens, bacteria play a crucial
                      role in nature and science. Understanding them helps in
                      medicine, biotechnology, and environmental protection.
                      Stay tuned to our channel for fascinating insights into
                      the unseen world of bacteria and their impact on our
                      lives!
                    </p>
                  </div>
                </div>

                <div className="border-border bg-background flex aspect-square h-[12%] w-[12%] min-w-[24px] -translate-x-[60%] -translate-y-[35%] items-center justify-center rounded-full border p-[1%] shadow">
                  <Image
                    alt="user avatar"
                    width="64"
                    height="64"
                    decoding="async"
                    className="rounded-full object-cover select-none"
                    src={"/images/user.png"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 z-20 flex size-full flex-col items-center justify-center">
        <h1 className="font-sour-gummy relative mb-6 flex flex-col text-[min(10vw,4.5rem)] leading-none font-medium tracking-tight sm:text-[min(4.5vw,4.5rem)]">
          From Chaos to Clarity
        </h1>
        <h2 className="text-secondary-foreground relative mx-auto max-w-xl text-center text-[min(5vw,1rem)] leading-relaxed font-medium sm:text-[min(1.65vw,1.25rem)]">
          Watch as PlaylistsGenius metamorphoses your YouTube playlists into
          meticulously organized lessons.
        </h2>
        <div className="mt-8 flex gap-4">
          <LoginButton className="h-11" size={"lg"}>
            Get Start
          </LoginButton>
          <RainbowButton>Create a course</RainbowButton>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
