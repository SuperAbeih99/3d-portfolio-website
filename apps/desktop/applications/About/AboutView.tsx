import { WindowProps } from "@/components/WindowManagement/WindowCompositor";
import { useEffect, useRef, useState, type ReactElement } from "react";
import styles from "./AboutView.module.css";
import { BaseApplicationManager } from "../ApplicationManager";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { ScreenResolution } from "@/apis/Screen/ScreenService";

type SubView =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "contact";

export type SubViewParams = {
  needsMobileView: boolean;
  manager: BaseApplicationManager;
  changeParent: (view: SubView) => void;
  translate: TFunction;
};

function Contact(props: { manager: BaseApplicationManager }) {
  function openContactApp() {
    props.manager.open("/Applications/Contact.app");
  }

  return (
    <>
      <p>
        If you have any questions or comments, please contact me via the{" "}
        <a onClick={() => openContactApp()} href="#contact">
          contact application
        </a>{" "}
        or shoot me an email at{" "}
        <a href="mailto:abeihhamani24@gmail.com">abeihhamani24@gmail.com</a>
      </p>
    </>
  );
}

function DownloadCv(props: { translate: TFunction }) {
  const t = props.translate;

  return (
    <>
      <div className={styles["download-cv"]}>
        <hr className={styles["about-hr"]} />
        <div className={styles["download-content"]}>
          <img src="/icons/printer.png" alt="Printer" draggable={false} />
          <div>
            <h2>{t("about.download_cv.title")}</h2>
            <a target="_blank" href={t("about.download_cv.download_link")}>
              {t("about.download_cv.instruction")}
            </a>
          </div>
        </div>
        <hr className={styles["about-hr"]} />
      </div>
    </>
  );
}

function HomeSubView(params: SubViewParams) {
  const t = params.translate;

  const mobileClass = params.needsMobileView ? styles["mobile"] : "";

  return (
    <>
      <div className={styles["subpage-home"]}>
        <h1 className={styles["home-title"]}>Abeih Hamani</h1>
        <h3 className={styles["home-subtitle"]}>Computer science student</h3>

        <div className={styles["home-button-container"]}>
          <button
            className={`${styles["home-button"]} system-button ${mobileClass}`}
            onClick={() => params.changeParent("about")}
          >
            {t("about.navigation.about")}
          </button>
          <button
            className={`${styles["home-button"]} system-button ${mobileClass}`}
            onClick={() => params.changeParent("experience")}
          >
            {t("about.navigation.experience")}
          </button>
          <button
            className={`${styles["home-button"]} system-button ${mobileClass}`}
            onClick={() => params.changeParent("projects")}
          >
            {t("about.navigation.projects")}
          </button>
          <button
            className={`${styles["home-button"]} system-button ${mobileClass}`}
            onClick={() => params.changeParent("contact")}
          >
            {t("about.navigation.contact")}
          </button>
        </div>
      </div>
    </>
  );
}

export function SubViewNavigation(params: SubViewParams) {
  const t = params.translate;

  const mobileClass = params.needsMobileView ? styles["mobile"] : "";

  return (
    <>
      <div className={styles["navigation"]}>
        <div>
          <span className={styles["logo-part"]}>Abeih</span>
          <span className={styles["logo-part"]}>Hamani</span>
        </div>

        <div
          className={`${styles["navigation-button-container"]} ${mobileClass}`}
        >
          <button
            className="system-button"
            onClick={() => params.changeParent("home")}
          >
            {t("about.navigation.home")}
          </button>
          <button
            className="system-button"
            onClick={() => params.changeParent("about")}
          >
            {t("about.navigation.about")}
          </button>
          <button
            className="system-button"
            onClick={() => params.changeParent("experience")}
          >
            {t("about.navigation.experience")}
          </button>
          <button
            className="system-button"
            onClick={() => params.changeParent("projects")}
          >
            {t("about.navigation.projects")}
          </button>
          <button
            className="system-button"
            onClick={() => params.changeParent("contact")}
          >
            {t("about.navigation.contact")}
          </button>
        </div>
      </div>
    </>
  );
}

function AboutSubView(params: SubViewParams) {
  const contactEmail = "abeihhamani24@gmail.com";

  function openContactApp() {
    params.manager.open("/Applications/Contact.app");
  }

  function ImageOfMyself() {
    return (
      <>
        <div className={styles["image-container"]}>
          <img
            draggable={false}
            src="/images/pfp.jpg"
            alt="Portrait of Abeih Hamani"
          />
        </div>
      </>
    );
  }

  function RenderContent() {
    return (
      <div>
        <h1 className={styles["page-h1"]}>Hi, I&apos;m Abeih Hamani</h1>

        <p>
          You&apos;ve just logged into my little corner of the internet.
          I&apos;m an undergraduate Computer Science student at The City College
          of New York (CCNY) who likes turning ideas into real projects with
          code, especially on the web and in AI.
        </p>

        <p>
          If you&apos;d like to say hi, talk tech, or send an opportunity my
          way, you can reach me through the{" "}
          <a onClick={() => openContactApp()} href="#contact">
            contact application
          </a>{" "}
          or at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>

        <DownloadCv translate={params.translate} />

        <h2>About me</h2>

        <ImageOfMyself />

        <p>
          I started coding in my freshman year of college with the basics: HTML,
          CSS, and JavaScript. At first it was just curiosity -- changing
          colors, moving things around, and seeing what I could break and fix.
          One thing led to another and I got hooked.
        </p>

        <p>
          From there I picked up React, and eventually moved into full-stack
          work with Node.js, Express, MongoDB, Next.js, Supabase, and Tailwind
          CSS. I use Git for version control, and I&apos;ve also worked with
          Python and C++ through classes and side projects. Web development
          started as a hobby, but it quickly became one of my favorite ways to
          learn and build.
        </p>

        <p>
          Right now I&apos;m studying Computer Science at CCNY, building a
          stronger foundation in algorithms, data structures, and how computers
          actually work under the hood. I&apos;m especially interested in AI and
          machine learning, and I enrolled in CodePath&apos;s Applied AI
          Engineering course starting on February 25 to go deeper into that
          world.
        </p>

        <p>
          I also like experimenting with 3D and interactive experiences --
          things like 3D scenes and playful interfaces for the web. I&apos;m
          still learning, but I enjoy slowly leveling up and seeing what&apos;s
          possible.
        </p>

        <p>
          Outside the classroom, I&apos;m part of ColorStack, a national
          nonprofit community that supports Black and Latinx computer science
          students with community, academic support, and career development
          opportunities. Learn more at{" "}
          <a href="https://www.colorstack.org" target="_blank" rel="noreferrer">
            colorstack.org
          </a>
          .
        </p>

        <p>
          Being surrounded by other CS students from all over the country keeps
          me motivated and reminds me that we&apos;re all grinding toward
          similar goals.
        </p>

        <p>
          My long-term goal is to grow into a strong engineer who can build
          useful, reliable products -- especially at the intersection of AI,
          software engineering, and rich, interactive web experiences.
        </p>

        <h2>Hobbies</h2>

        <p>A lot of my hobbies are connected to tech, but not all of them.</p>

        <p>
          I genuinely enjoy coding -- whether it&apos;s polishing a project,
          trying a new framework, or prototyping a random idea just to see if I
          can make it work.
        </p>

        <p>
          When I&apos;m not in front of a screen, you&apos;ll usually find me at
          the gym, playing soccer, or just having fun with friends and family.
          Soccer gives me the same things I like about coding: strategy,
          teamwork, and that feeling of slowly improving over time.
        </p>
      </div>
    );
  }

  return (
    <>
      <div data-subpage className={styles["subpage"]}>
        {SubViewNavigation(params)}
        <div data-subpage-content className={styles["subpage-content"]}>
          {RenderContent()}
        </div>
      </div>
    </>
  );
}

function ExperienceSubView(params: SubViewParams) {
  const t = params.translate;

  return (
    <>
      <div data-subpage className={styles["subpage"]}>
        {SubViewNavigation(params)}
        <div data-subpage-content className={styles["subpage-content"]}>
          <h1 className={styles["page-h1"]}>
            {t("about.navigation.experience")}
          </h1>
          <h2>ColorStack Member</h2>
          <p>Nov 2025 – Present</p>
          <p>
            I became a ColorStack member in November 2025. ColorStack is a
            community that supports Black and Latinx computer science students
            through mentorship, events, academic support, and career
            opportunities.
          </p>

          <h2>CodePath – Applied AI Engineering</h2>
          <p>Feb 2025 – Present</p>
          <p>
            I joined CodePath in February 2025. CodePath runs industry-backed
            tech courses that teach students practical skills for real-world
            software roles. I began the Applied AI Engineering course with
            CodePath in February 2026 to go deeper into AI engineering.
          </p>

          <h2>
            Secretary at Institute of Electrical Engineers Club | The City
            College of New York
          </h2>
          <p>September 2024 – May 2025</p>
          <ul>
            <li>
              Organized meetings, took minutes, and distributed updates to
              members.
            </li>
            <li>Managed event promotions through email and social media.</li>
            <li>Maintained records of chapter activities and participation.</li>
          </ul>

          <p>
            I was Secretary from September 2024 to May 2025 because I thought I
            was going to be an electrical engineer. After freshman year summer
            of college I decided to learn to code, liked it, and switched to
            Computer Science.
          </p>

          <h2>Founder &amp; Coach | Bensonhurst FC</h2>
          <p>Jan 2025 – Present</p>
          <ul>
            <li>
              Founded a community soccer club to provide affordable training and
              opportunities for neighborhood youth, many of whom cannot afford
              the $2,000–$3,000 annual cost of traditional teams.
            </li>
            <li>
              Designed and led weekly training sessions, focusing on technical
              skills, teamwork, and discipline for players aged 8-14.
            </li>
            <li>
              Personally trained younger players, including my brother, to
              improve ball control, dribbling, and tactical awareness.
            </li>
          </ul>

          <DownloadCv translate={params.translate} />

          <Contact manager={params.manager} />
        </div>
      </div>
    </>
  );
}

function ProjectsSubView(params: SubViewParams) {
  const t = params.translate;

  return (
    <>
      <div data-subpage className={styles["subpage"]}>
        {SubViewNavigation(params)}
        <div data-subpage-content className={styles["subpage-content"]}>
          <h1 className={styles["page-h1"]}>
            {t("about.navigation.projects")}
          </h1>
          <div className={styles["project-entry"]}>
            <h3>FinancePal</h3>
            <p>MERN Stack | MongoDB | Express.js | React | Node.js</p>
            <ul>
              <li>
                Developed and deployed a full-stack expense tracking application
                allowing users to log, categorize, and visualize expenses with
                interactive charts.
              </li>
              <li>
                Implemented JWT authentication, responsive dashboards, and PDF
                export functionality for financial reports.
              </li>
            </ul>
            <p>
              <a
                href="https://financepal-mern.vercel.app/login"
                target="_blank"
                rel="noreferrer"
              >
                Website
              </a>{" "}
              |{" "}
              <a
                href="https://github.com/SuperAbeih99/FinancePal"
                target="_blank"
                rel="noreferrer"
              >
                Source Code
              </a>
            </p>
          </div>

          <div className={styles["project-entry"]}>
            <h3>3D Portfolio Room</h3>
            <p>Next.js | React | TypeScript | Three.js | Blender</p>
            <ul>
              <li>
                Built an interactive 3D "bedroom" scene with a retro computer
                that users can orbit, zoom into, and explore as a playful entry
                point to my portfolio.
              </li>
              <li>
                Modeled and exported custom assets from Blender, optimized glTF
                loading, and implemented camera controls/animations for a
                smooth, game-like browsing experience.
              </li>
            </ul>
            <p>
              Live Demo (Coming Soon) |{" "}
              <a
                href="https://github.com/SuperAbeih99/PortfolioWebsite"
                target="_blank"
                rel="noreferrer"
              >
                Source Code
              </a>
            </p>
          </div>

          <div className={styles["project-entry"]}>
            <h3>MediGuard AI</h3>
            <p>Next.js | React | TypeScript | Supabase | OpenAI API</p>
            <ul>
              <li>
                Built an AI-powered hospital bill assistant that lets patients
                upload PDFs/images or paste text, select their insurance
                provider, and receive plain-language explanations of charges,
                coverage, and red flags.
              </li>
              <li>
                Designed a clean, mobile-friendly interface with guest sessions
                and sign-in flow so users can quickly run analyses while
                authenticated users can securely save and revisit previous
                results.
              </li>
            </ul>
            <p>
              <a
                href="https://mediguardai.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                Website
              </a>{" "}
              |{" "}
              <a
                href="https://github.com/SuperAbeih99/mediguard-ai"
                target="_blank"
                rel="noreferrer"
              >
                Source Code
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function RenderSubView(view: SubView, params: SubViewParams): ReactElement {
  switch (view) {
    case "home":
      return HomeSubView(params);
    case "about":
      return AboutSubView(params);
    case "experience":
      return ExperienceSubView(params);
    case "projects":
      return ProjectsSubView(params);
  }

  return <></>;
}

export default function AboutApplicationView(props: WindowProps) {
  const { application, windowContext } = props;

  const [subView, setSubView] = useState<SubView>("home");
  const [needsMobileView, setNeedsMobileView] = useState<boolean>(false);
  const { t, i18n } = useTranslation("common");

  const apis = application.apis;

  const contentParent = useRef<HTMLDivElement>(null);

  function resetSubPageScroll() {
    if (!contentParent.current) {
      return;
    }

    const subViewParent = contentParent.current;
    const subViewParentChildren = Array.from(subViewParent.children);

    const subView = subViewParentChildren.find((x) =>
      x.hasAttribute("data-subpage")
    );
    if (!subView) {
      return;
    }

    const subViewChildren = Array.from(subView.children);

    const contentView = subViewChildren.find((x) =>
      x.hasAttribute("data-subpage-content")
    );

    if (!contentView) {
      return;
    }
    contentView.scrollTop = 0;
  }

  function onScreenChangeListener(resolution: ScreenResolution): void {
    setNeedsMobileView(resolution.isMobileDevice());
  }

  useEffect(() => {
    const unsubscribe = apis.screen.subscribe(onScreenChangeListener);

    const resolution = apis.screen.getResolution();
    if (resolution) {
      onScreenChangeListener(resolution);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    resetSubPageScroll();
  }, [subView]);

  function changeParent(view: SubView) {
    if (view === "contact") {
      application.on({ kind: "about-open-contact-event" }, windowContext);
      return;
    }

    setSubView(view);
  }

  return (
    <div className="content-outer">
      <div className="content">
        <div className="content-inner" ref={contentParent}>
          {RenderSubView(subView, {
          needsMobileView,
          manager: application.manager,
          changeParent,
          translate: t,
        })}
        </div>
      </div>
    </div>
  );
}
