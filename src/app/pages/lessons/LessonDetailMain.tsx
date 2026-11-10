import { LineIcon } from "../../components/LineIcon";
import type { SsrPageData } from "../../ssr/types";

type LessonData = Extract<SsrPageData, { kind: "lesson" }>;

function navLinks(data: LessonData | undefined) {
  if (!data) return { prevHref: "#", prevText: "Sebelumnya", prevArrow: true, nextHref: "#", nextText: "Berikutnya", nextArrow: true };
  return {
    prevHref: data.prevId ? "/lessons/" + encodeURIComponent(data.prevId) : "/lessons",
    prevText: data.prevId ? "Sebelumnya" : "Semua Lesson",
    prevArrow: true,
    nextHref: data.nextId ? "/lessons/" + encodeURIComponent(data.nextId) : "/lessons",
    nextText: data.nextId ? "Berikutnya" : "Selesai — Semua Lesson",
    nextArrow: !!data.nextId
  };
}

export function LessonNotFoundMain({ id }: { id: string }) {
  return (
    <main className="lesson-detail-page">
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p style={{ color: "var(--text-primary)", fontWeight: 700, marginBottom: "8px" }}>
          {"Lesson \"" + id + "\" tidak ditemukan"}
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8125rem", marginBottom: "16px" }}>
          Pilih salah satu lesson dari daftar.
        </p>
        <a href="/lessons" data-route-link="" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
          <span className="ui-ico ui-ico-arrow-left" aria-hidden="true" /> Kembali ke Lesson
        </a>
      </div>
    </main>
  );
}

export function LessonDetailMain({ data }: { data?: LessonData }) {
  const nav = navLinks(data);
  return (
    <main className="lesson-detail-page">
      <a href="/lessons" data-route-link="" className="lesson-detail-back">
        <LineIcon aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </LineIcon>
        Kembali ke Lesson
      </a>
      <h1 className="lesson-detail-title" id="lessonTitle">{data ? data.lesson.title : null}</h1>
      <section className="lesson-step-learn" aria-labelledby="learnLabel">
        <p className="lesson-step-label" id="learnLabel">Learn</p>
        <p id="lessonLearnText">{data ? data.lesson.learn : null}</p>
      </section>
      <section className="lesson-board-wrap" aria-labelledby="positionLabel">
        <p className="lesson-step-label" id="positionLabel">Position</p>
        <div
          className="lesson-board"
          id="lessonBoard"
          role="group"
          aria-label="Papan catur interaktif untuk lesson ini"
        />
        <p className="lesson-board-caption" id="lessonFenCaption">{data ? data.lesson.fenCaption : null}</p>
      </section>
      <section className="lesson-step-choose" aria-labelledby="chooseLabel">
        <p className="lesson-step-label" id="chooseLabel">Choose Move</p>
        <p className="lesson-move-hint" id="lessonMoveHint">
          {data ? "Giliran " + data.lesson.side + " — gerakkan bidak di papan untuk menjawab." : null}
        </p>
      </section>
      <section className="lesson-step-explain" id="lessonExplainBox" aria-live="polite">
        <p className="lesson-explain-heading" id="lessonExplainHeading" />
        <p id="lessonExplainText" />
      </section>
      <div className="lesson-detail-nav-row">
        <a className="lesson-nav-btn secondary" id="lessonPrevBtn" href={nav.prevHref} data-route-link="">{nav.prevArrow ? <span className="ui-ico ui-ico-arrow-left" aria-hidden="true" /> : null}{nav.prevArrow ? " " : ""}{nav.prevText}</a>
        <a className="lesson-nav-btn primary" id="lessonNextBtn" href={nav.nextHref} data-route-link="">{nav.nextText}{nav.nextArrow ? " " : ""}{nav.nextArrow ? <span className="ui-ico ui-ico-arrow-right" aria-hidden="true" /> : null}</a>
      </div>
    </main>
  );
}
