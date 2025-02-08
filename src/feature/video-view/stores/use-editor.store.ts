import { type YouTubePlayer } from "react-youtube";
import { createStore } from "zustand/vanilla";

export type VideoPlayState = {
  player: YouTubePlayer | undefined;
};

export type VideoPlayActions = {
  setPlayer: (player: YouTubePlayer) => void;
};

export type VideoPlayerStore = VideoPlayActions & VideoPlayState;

export const defaultInitState: VideoPlayerStore = {
  setPlayer: () => {},
  player: undefined,
};

export const createVideoPlayerStore = (
  initState: VideoPlayerStore = defaultInitState
) => {
  return createStore<VideoPlayerStore>()((set) => ({
    ...initState,
    setPlayer: (player: YouTubePlayer) => set({ player: player }),
  }));
};
