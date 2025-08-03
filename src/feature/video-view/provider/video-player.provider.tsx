"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

import { useStore } from "zustand";

import {
  type VideoPlayerStore,
  createVideoPlayerStore,
} from "../stores/use-editor.store";

export type VideoPlayerStoreApi = ReturnType<typeof createVideoPlayerStore>;

export const VideoPlayerStoreContext = createContext<
  VideoPlayerStoreApi | undefined
>(undefined);

export interface VideoPlayerStoreProviderProps {
  children: ReactNode;
}

export const VideoPlayerStoreProvider = ({
  children,
}: VideoPlayerStoreProviderProps) => {
  const storeRef = useRef<VideoPlayerStoreApi | null>(null);

  useEffect(() => {
    if (!storeRef.current) {
      storeRef.current = createVideoPlayerStore();
    }
  }, []);

  return (
    // eslint-disable-next-line react-compiler/react-compiler
    <VideoPlayerStoreContext.Provider value={storeRef.current || undefined}>
      {children}
    </VideoPlayerStoreContext.Provider>
  );
};

export const useVideoPlayer = <T,>(
  selector: (store: VideoPlayerStore) => T
): T => {
  const storeContext = useContext(VideoPlayerStoreContext);

  if (!storeContext) {
    throw new Error(
      "useVideoPlayer must be used within VideoPlayerStoreContext"
    );
  }

  return useStore(storeContext, selector);
};
