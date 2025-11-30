import { useEffect, useState } from "react";
import { WindowProps } from "@/components/WindowManagement/WindowCompositor";
import styles from "./MemesView.module.css";

type MemePayload = {
  url?: string;
  title?: string;
  postLink?: string;
  author?: string;
  subreddit?: string;
  tags?: string[];
};

type MemeState = {
  image: string;
  caption: string;
  tags: string[];
  source: string;
};

const WHOLESOME_SUBS = [
  "wholesomememes",
  "CleanMemes",
  "AnimalsBeingDerps",
  "aww",
  "dogmemes",
];

const BANNED_PATTERNS = [
  /nsfw/i,
  /politic/i,
  /trump/i,
  /biden/i,
  /election/i,
  /kill/i,
  /murder/i,
  /gun/i,
  /weapon/i,
  /drugs?/i,
  /sex/i,
  /porn/i,
  /nazi/i,
  /hitler/i,
  /damn/i,
  /hell/i,
  /shit/i,
  /fuck/i,
  /bitch/i,
  /bastard/i,
  /whore/i,
];

const FALLBACK_MEMES: MemeState[] = [
  {
    image: "https://i.imgur.com/w1aN5dM.jpg",
    caption: "Golden retriever demoing excellent pair-programming etiquette.",
    tags: [],
    source: "Offline Vault",
  },
  {
    image: "https://i.imgur.com/2l6ZJ1w.jpg",
    caption: "Cat who just merged a pull request without conflicts.",
    tags: [],
    source: "Offline Vault",
  },
  {
    image: "https://i.imgur.com/vLw1JcZ.jpg",
    caption: "Baby sloth reminding you to take breaks.",
    tags: [],
    source: "Offline Vault",
  },
  {
    image: "https://i.imgur.com/omw5Jwq.jpg",
    caption: "Hedgehog hype team cheering for your sprint demo.",
    tags: [],
    source: "Offline Vault",
  },
  {
    image: "https://i.imgur.com/Vy3t7yR.jpg",
    caption: "Dog with coffee ready for Monday stand-up.",
    tags: [],
    source: "Offline Vault",
  },
];

export default function MemesView(_props: WindowProps) {
  const [meme, setMeme] = useState<MemeState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMeme() {
    try {
      setLoading(true);
      setError(null);
      const subreddit = WHOLESOME_SUBS[Math.floor(Math.random() * WHOLESOME_SUBS.length)];
      const response = await fetch(`https://meme-api.com/gimme/${subreddit}`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: MemePayload = await response.json();
      console.log("Memes app API response", data);

      const image = data.url || "";
      const caption = (data.title || "").trim();
      const tags = data.tags || [];

      if (!image) {
        throw new Error("Response missing image");
      }

      const content = `${caption} ${tags.join(" ")}`;
      if (BANNED_PATTERNS.some((pattern) => pattern.test(content))) {
        throw new Error("Filtered meme");
      }

      setMeme({ image, caption, tags, source: `r/${data.subreddit || subreddit}` });
    } catch (err) {
      console.error(err);
      if (FALLBACK_MEMES.length) {
        const fallback = FALLBACK_MEMES[Math.floor(Math.random() * FALLBACK_MEMES.length)];
        setMeme(fallback);
        setError("Using the wholesome backup feed while the live source recuperates.");
      } else {
        setError("Could not load a meme. Please try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMeme();
  }, []);

  return (
    <div className={styles["memes-app"]}>
      <h1>Random Meme Generator</h1>

      <div className={styles.controls}>
        <button className={styles.button} onClick={fetchMeme} disabled={loading}>
          {loading ? "Fetching..." : "New Meme"}
        </button>
        <span className={styles.status}>
          {loading && "Loading meme..."}
          {!loading && !meme && !error && "Click the button to fetch a meme"}
          {error && <span className={styles.error}>{error}</span>}
        </span>
      </div>

      <div className={styles.canvas}>
        {meme ? (
          <>
            <img
              src={meme.image}
              alt={meme.caption || "Random meme"}
              className={styles["meme-image"]}
              draggable={false}
            />
            {meme.caption && <div className={styles.caption}>{meme.caption}</div>}
            <div className={styles.meta}>{meme.source}</div>
          </>
        ) : (
          !loading && <p>Ready when you are! Press “New Meme”.</p>
        )}
      </div>
    </div>
  );
}
