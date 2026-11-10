import { LineIcon } from "../../components/LineIcon";
import type { SsrPageData } from "../../ssr/types";

type LessonsData = Extract<SsrPageData, { kind: "lessons" }>;

export function LessonsMain({ data }: { data?: LessonsData }) {
  return (
    <main className="lessons-page">
      <h1 className="lessons-title">Lesson</h1>
      <div id="lessonCategories" className="lessons-categories">
        {data &&
          data.categories.map((cat) => (
            <section className="lesson-category-block" aria-labelledby={"cat-" + cat.id} key={cat.id}>
              <div className="lesson-category-header">
                <span className="lesson-category-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: cat.icon }}
                  />
                </span>
                <div>
                  <h2 id={"cat-" + cat.id}>{cat.title}</h2>
                </div>
              </div>
              <div className="lesson-card-grid">
                {data.lessons
                  .filter((lesson) => lesson.category === cat.id)
                  .map((lesson) => (
                    <a className="lesson-card" href={"/lessons/" + encodeURIComponent(lesson.id)} data-route-link="" key={lesson.id}>
                      <span className="lesson-card-status" aria-hidden="true" />
                      <span className="lesson-card-body">
                        <span className="lesson-card-title">{lesson.title}</span>
                      </span>
                      <span className="lesson-card-chevron">
                        <LineIcon aria-hidden="true">
                          <path d="m9 18 6-6-6-6" />
                        </LineIcon>
                      </span>
                    </a>
                  ))}
              </div>
            </section>
          ))}
      </div>
    </main>
  );
}
