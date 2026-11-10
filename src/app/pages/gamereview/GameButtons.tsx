import NextMove from "./svg/nextMove";
import SkipGame from "./svg/skipGame";
import Play from "./svg/play";
import Pause from "./svg/pause";

export function GameButtons({ variant }: { variant: "below" }) {
  return (
    <div className={"bc-gbtns bc-gbtns-" + variant} role="group" aria-label="Navigasi langkah">
      <button type="button" data-nav="first" title="Langkah pertama" aria-label="Langkah pertama">
        <SkipGame class="bc-gi bc-gi-skip bc-rot" />
      </button>
      <button type="button" data-nav="prev" title="Sebelumnya" aria-label="Sebelumnya">
        <NextMove class="bc-gi bc-gi-step bc-rot" />
      </button>
      <button type="button" data-nav="play" aria-pressed="false" title="Putar otomatis" aria-label="Putar otomatis">
        <Play class="bc-gi bc-gi-step bc-gi-play" />
        <Pause class="bc-gi bc-gi-step bc-gi-pause" />
      </button>
      <button type="button" data-nav="next" title="Berikutnya" aria-label="Berikutnya">
        <NextMove class="bc-gi bc-gi-step" />
      </button>
      <button type="button" data-nav="last" title="Langkah terakhir" aria-label="Langkah terakhir">
        <SkipGame class="bc-gi bc-gi-skip" />
      </button>
    </div>
  );
}
