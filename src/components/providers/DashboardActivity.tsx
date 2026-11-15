"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { DASHBOARD_FEATURES } from "@/lib/dashboard-activity";

export function DashboardActivity() {
  const pathname = usePathname();
  useEffect(() => {
    const segment = pathname.split("/")[2];
    const feature = Object.hasOwn(DASHBOARD_FEATURES, segment) ? segment : null;
    let visited = false;
    const controller = new AbortController();
    const heartbeat = () => {
      if (document.visibilityState !== "visible") return;
      const visit = !visited;
      visited = true;
      void fetch("/api/activity", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature, visit }), signal: controller.signal,
      }).then(response => { if (!response.ok && visit) visited = false; }).catch(() => {
        if (!controller.signal.aborted && visit) visited = false; // Retry a failed feature open with the next heartbeat.
      });
    };
    heartbeat();
    const timer = setInterval(heartbeat, 60_000);
    document.addEventListener("visibilitychange", heartbeat);
    return () => { clearInterval(timer); controller.abort(); document.removeEventListener("visibilitychange", heartbeat); };
  }, [pathname]);
  return null;
}
