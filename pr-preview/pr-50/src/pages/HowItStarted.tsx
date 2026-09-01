// The About page: the account of how the work started, followed by the two things that
// came out of it, the pipeline and a year of activity.

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import ContributionYear from "../components/ContributionYear";
import Pipeline from "../components/Pipeline";

const HowItStarted = () => {
  useDocumentTitle("About");
  // Top padding only. This is the one page whose children are themselves `section-y`
  // sections, so a `section-y` here would stack its bottom padding under theirs and leave
  // twice the space before the footer that every other page has.
  return (
    <section className="pt-12 text-light-text dark:text-white md:pt-16">

      {/* CENTERED CONTAINER FOR BOTH TITLE + CONTENT */}
      <div className="page-frame">

        {/* Every page names itself above its h1. */}
        <p className="eyebrow">About</p>
        <h1 className="title-page mb-8 text-4xl md:text-5xl">
          Before I knew it was cloud
        </h1>

        {/* The opening paragraph takes the lead treatment a long essay gets in print, so
            the page has an entry point rather than starting at full density. */}

        {/* The words are Ibtisam's own account. The writing rules for this repository
            govern its comments and its interface copy, not this. */}
        <div className="max-w-[68ch] space-y-6 text-lg leading-relaxed text-light-muted first:*:text-xl first:*:leading-relaxed first:*:text-light-text dark:text-gray-400 dark:first:*:text-text-primary">

          <p>
            I didn’t grow up around computers. My early education was in medical sciences,
            and later in agriculture. During that time, I had almost no exposure to laptops,
            programming, or technical systems of any kind.
          </p>

          <p>
            For years, I didn’t even know what the word “cloud” meant.
          </p>

          <p>
            When I entered my master’s program, I was appointed as the class representative.
            At that stage, I wasn’t thinking about architecture or infrastructure.
            I simply wanted processes to run without unnecessary friction.
          </p>

          <p>
            One of my responsibilities was collecting assignments from the entire class.
            Practically, I had only two channels available: email or WhatsApp. Email wasn’t
            a common workflow in our academic environment, so most students were sending their work
            individually to my WhatsApp inbox.
          </p>

          <p>
            That workflow drained me 😄
          </p>

          <p>
            Imagine 70–80 people sending files one by one. Downloading. Creating folders.
            Renaming files. Reorganizing everything again for submission to the teacher.
            The process felt fragile, repetitive, and extremely manual. By instinct, I’ve
            always gravitated toward automation rather than repetition.
          </p>

          <p>
            So I attempted a simple system.
          </p>

          <p>
            I created a shared Google Drive folder and a companion Google Sheet, and posted
            both short links inside our class coordination group. The concept was straightforward:
            students would upload their files to the Drive and record their details in the Sheet.
          </p>

          <p>
            On paper, it seemed structured.
          </p>

          <p>
            In reality, it wasn’t.
          </p>

          <p>
            Files began disappearing from the Drive. Entries inside the Sheet were modified.
            Students could view, overwrite, or copy each other’s work. At that time,
            I didn’t know terms like <em>access control</em>, <em>data integrity</em>,
            or <em>concurrency issues</em>. I just recognized that the system was unreliable.
            And unreliable systems always collapse under pressure.
          </p>

          <p>
            That’s when I discovered Google Forms.
          </p>

          <p>
            I built a form that allowed students to upload their assignments while automatically
            logging their details into a Google Sheet. For the first time, I experienced what
            controlled input, structured data, and predictable behavior felt like. Submissions
            became consistent. Nothing could be silently deleted or modified. Everything was
            traceable and orderly.
          </p>

          <p>
            It felt… clean.
          </p>

          <p>
            Later in the same semester, I encountered a different challenge. Another course
            required me to share learning material with the class, but the content wasn’t static.
            It evolved almost daily as new topics were added.
          </p>

          <p>
            PDFs failed. Word files failed. Sending updated files every day felt inefficient.
          </p>

          <p>
            That’s when I found Google Docs.
          </p>

          <p>
            I created a single live document and shared a shortened link. I still remember using
            a URL shortener at the time (Cutly) because I had just learned that long URLs
            could be simplified. I continued using similar tools for quite some time before
            eventually transitioning to open-source options like dub.co as I moved deeper into engineering.
          </p>

          <p>
            There was even a small glitch: many classmates accessed the document through the Google
            Docs mobile app, which often displayed stale content unless refreshed properly. Once I
            understood the issue, I simply taught everyone how to reload the document correctly,
            and the entire system stabilized again. Looking back, it was my first real encounter
            with the idea of caching and state freshness, long before I knew those terms existed.
          </p>

          <p>
            I would update the document in one place and watch the changes propagate everywhere
            instantly. At that stage, it genuinely felt like magic 😄
            <br />
            Thanks, Google Docs.
          </p>

          <p>
            At that time, I still wasn’t thinking in terms of “cloud”, “SaaS”, or “infrastructure”.
            I wasn’t chasing any title. I was simply trying to make messy processes predictable,
            consistent, and fair for everyone.
          </p>

          <p>
            Years later, when I formally began my transition into DevOps and cloud engineering,
            I realized something interesting: many of the problems I was learning to solve were
            the same kinds of problems I had unknowingly solved years before. I had practiced
            the mindset long before I learned the vocabulary.
          </p>

          <p>
            I learned the terminology after I had already learned the thinking.
          </p>

          <p>
            That realization stayed with me. Even now, I don’t chase tools or buzzwords.
            I look for broken systems and redesign them until they become reliable,
            predictable, and calm under pressure.
          </p>

        </div>

        {/*
         * The turn from the story to the two sections that come out of it. The order is an
         * argument: the essay ends on a claim about method, the pipeline is that method, and
         * the year is the evidence. A hairline alone does not carry it.
         */}
        <p className="mt-14 max-w-[68ch] border-t border-light-border pt-12 text-lg leading-relaxed text-light-muted dark:border-border-subtle dark:text-gray-400">
          That is where the habit came from. The rest of this page is what it turned into:
          the shape every project moves through, and the year of actually moving them.
        </p>

        <Pipeline />

        <ContributionYear />
      </div>
    </section>
  );
};

export default HowItStarted;

