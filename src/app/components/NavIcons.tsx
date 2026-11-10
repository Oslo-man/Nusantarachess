import NextMove from "../pages/gamereview/svg/nextMove";
import SkipGame from "../pages/gamereview/svg/skipGame";
import Play from "../pages/gamereview/svg/play";
import Pause from "../pages/gamereview/svg/pause";

export type NavIconName = "first" | "prev" | "play" | "pause" | "next" | "last";

interface NavIconProps {
  name: NavIconName;
  className?: string;
}

export function NavIcon({ name, className }: NavIconProps) {
  const cls = "nav-ico nav-ico-" + name + (className ? " " + className : "");
  switch (name) {
    case "first":
    case "last":
      return <SkipGame class={cls} />;
    case "prev":
    case "next":
      return <NextMove class={cls} />;
    case "play":
      return <Play class={cls} />;
    case "pause":
      return <Pause class={cls} />;
  }
}
