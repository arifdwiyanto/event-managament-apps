"use client";

import { useEffect, useCallback } from "react";

interface useInfiniteScrollProps {
  threshold?: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  observerTarget: React.RefObject<HTMLDivElement | null>;
}

export const useInfiniteScroll = ({
  threshold = 1.0,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  observerTarget,
}: useInfiniteScrollProps) => {
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, { threshold });

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [onIntersect, observerTarget, threshold]);
};
