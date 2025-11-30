import Head from "next/head";
import { SceneLoader } from "../components";
import { useEffect, useState } from "react";
import { NoScriptWarning } from "@/components/noscript/NoScript";
import { Analytics } from "@vercel/analytics/react"

const focusedTitle = "Abeih Hamani - Portfolio";
const blurredTitle = "Abeih Hamani - Portfolio";

export default function Web() {
  const [title, setTitle] = useState("Abeih Hamani - Portfolio");

  function onVisibilityChange() {
    const title = document.visibilityState === 'visible' ? focusedTitle : blurredTitle;

    setTitle(title);
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    }

  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name="description" content="Portfolio website of Abeih Hamani, a CCNY Computer Science student focused on web development, AI, and interactive experiences." />

        <meta property="og:title" content="Abeih Hamani - Portfolio" />
        <meta property="og:description" content="Portfolio website of Abeih Hamani, a CCNY Computer Science student focused on web development, AI, and interactive experiences." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://abeihhamani.vercel.app/assets/thumbnail.png" />
        <meta property="og:url" content="https://abeihhamani.vercel.app/" />
        
        <meta property="twitter:image" content="https://abeihhamani.vercel.app/assets/thumbnail.png"/>
        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:title" content="Abeih Hamani's portfolio"/>
        <meta property="twitter:description" content="Portfolio website of Abeih Hamani, a CCNY Computer Science student focused on web development, AI, and interactive experiences."/>
        <meta property="og:site_name" content="Abeih Hamani's portfolio"></meta>

        <link rel="icon" type="image/svg+xml" href="/icons/ah-portfolio-icon.svg" />
      </Head>
      <NoScriptWarning />
      <SceneLoader />
      <Analytics />
    </>
  );
}
