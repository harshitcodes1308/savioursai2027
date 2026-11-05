import type { AppIconName } from "@/components/ui/AppIcon";

const ROUTE_ICONS: Record<string, AppIconName> = {
  "/dashboard": "panel",
  "/dashboard/pre-board-90": "history",
  "/dashboard/planner": "map",
  "/dashboard/todo": "check-circle",
  "/dashboard/tracker": "chart",
  "/dashboard/study-flow": "book",
  "/dashboard/video-lectures": "play-circle",
  "/dashboard/webinar": "play-circle",
  "/dashboard/ai-assistant": "brain",
  "/dashboard/ebooks": "book",
  "/dashboard/chronoscroll": "scroll",
  "/dashboard/numerical-mastery": "calculator",
  "/dashboard/focus": "focus",
  "/dashboard/precision-practice": "target",
  "/dashboard/half-yearly": "history",
  "/dashboard/tests": "file-check",
  "/dashboard/guess-papers": "file",
  "/dashboard/flip-the-question": "refresh",
  "/dashboard/date-battle": "timer",
  "/dashboard/profile": "graduation",
  "/dashboard/policies": "shield",
};

export function getDashboardIcon(path: string): AppIconName {
  return ROUTE_ICONS[path] ?? "square";
}
