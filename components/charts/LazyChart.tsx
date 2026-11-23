"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ChartProps } from "./DataChartClient";

const DataChartClient = dynamic(() => import("./DataChartClient"), { ssr: false });

/** Loads the chart library only when the chart scrolls near the viewport. Space is reserved (no layout shift). */
export function LazyChart(props: ChartProps & { summary: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setShow(true), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ minHeight: props.height ?? 320 }} role="img" aria-label={props.summary}>
      {show && <DataChartClient {...props} />}
    </div>
  );
}
