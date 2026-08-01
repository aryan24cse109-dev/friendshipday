import React, { useEffect, useMemo, useRef, useState } from "react";
import "./FriendshipDaySite.css";

/* ============================================================
   EDIT ME — all the personal content lives here
   ============================================================ */
const CONFIG = {
  friendName: "My Person",
  noteText:
    "Some people come into your life for a season, and some come in and just never leave the group chat. I'm so glad it's you. Here's to every inside joke, every 2am phone call, and every memory we haven't made yet.",
  certificateBody:
    "for endless laughs, unwavering loyalty, and always picking up the phone.",
  certificateDate: `Friendship Day, ${new Date().getFullYear()}`,
  characteristics: [
    "favorite person",
    "partner in crime",
    "therapist",
    "hype squad",
    "chaos coordinator",
    "forever plus one",
  ],
  memoryCaptions: [
    "the day it all started",
    "that one road trip",
    "way too much cake",
    "still going strong",
  ],
  finalNote: [
    "If you're reading this, it means you made it all the way here — just like you've made it through every version of me over the years.",
    "Thank you for the laughter, the late-night talks, and for never once making me feel alone.",
    "Happy Friendship Day. Here's to many, many more.",
  ],
  // image paths — see README for where to put your own photos
  images: {
    note: "/images/dictionary-photo.jpeg",
    bestie: "/images/bestie-photo.jpeg",
    memories: [
      "/images/memories/memory-1.jpeg",
      "/images/memories/memory-2.jpeg",
      "/images/memories/memory-3.jpeg",
      "/images/memories/memory-4.jpeg",
    ],
  },
};

const PAGE_COUNT = 6;

export default function FriendshipDaySite() {
  const [current, setCurrent] = useState(0);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [visited, setVisited] = useState({ 0: true });

  const goTo = (index) => {
    if (index < 0 || index >= PAGE_COUNT || index === current) return;
    setCurrent(index);
    setVisited((v) => ({ ...v, [index]: true }));
  };

  const handleEnvelopeClick = () => {
    if (envelopeOpened) return;
    setEnvelopeOpened(true);
    setTimeout(() => goTo(1), 900);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") goTo(current + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") goTo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  return (
    <div className="fd-root">
      <div className="grain" />
      <AmbientFloaties />

      <nav className="page-dots" aria-label="Page progress">
        {Array.from({ length: PAGE_COUNT }).map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </nav>

      <main className="fd-pages">
        <Page active={current === 0}>
          <Landing opened={envelopeOpened} onOpen={handleEnvelopeClick} />
        </Page>

        <Page active={current === 1}>
          <NotePage
            mounted={visited[1]}
            goNext={() => goTo(2)}
            image={CONFIG.images.note}
          />
        </Page>

        <Page active={current === 2}>
          <CertificatePage mounted={visited[2]} goNext={() => goTo(3)} />
        </Page>

        <Page active={current === 3}>
          <CharacteristicsPage
            mounted={visited[3]}
            goNext={() => goTo(4)}
            image={CONFIG.images.bestie}
          />
        </Page>

        <Page active={current === 4}>
          <MemoriesPage mounted={visited[4]} goNext={() => goTo(5)} />
        </Page>

        <Page active={current === 5}>
          <FinalPage mounted={visited[5]} onReplay={() => goTo(0)} />
        </Page>
      </main>

      <div className="side-nav">
        <button
          className="side-btn"
          disabled={current === 0}
          onClick={() => goTo(current - 1)}
          aria-label="Previous page"
        >
          ↑
        </button>
        <button
          className="side-btn"
          disabled={current === PAGE_COUNT - 1}
          onClick={() => goTo(current + 1)}
          aria-label="Next page"
        >
          ↓
        </button>
      </div>
    </div>
  );
}

/* ---------- generic page wrapper (crossfade) ---------- */
function Page({ active, children }) {
  return (
    <section className={`fd-page ${active ? "active" : ""}`}>
      {children}
    </section>
  );
}

/* ---------- PAGE 0 — landing / envelope ---------- */
function Landing({ opened, onOpen }) {
  return (
    <div className="landing">
      <p className="notif-line">You have a notification&hellip;</p>
      <button
        className={`envelope-wrap ${opened ? "opened" : ""}`}
        onClick={onOpen}
        aria-label="Open the envelope"
      >
        <span className="notif-badge">1</span>
        <span className="envelope">
          <span className="envelope-back" />
          <span className="letter-peek" />
          <span className="envelope-flap" />
          <span className="envelope-seal">&#10084;</span>
        </span>
      </button>
      <p className="tap-hint">tap the envelope to open it</p>
    </div>
  );
}

/* ---------- PAGE 1 — note + photo, staggered reveal ---------- */
function NotePage({ mounted, goNext, image }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showFrame, setShowFrame] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [wordsShown, setWordsShown] = useState(0);
  const [showBtn, setShowBtn] = useState(false);
  const words = useMemo(() => CONFIG.noteText.split(" "), []);

  useEffect(() => {
    if (!mounted) return;
    const timers = [];
    timers.push(setTimeout(() => setShowTitle(true), 200));
    timers.push(setTimeout(() => setShowFrame(true), 700));
    timers.push(setTimeout(() => setPhotoLoaded(true), 1600));

    const wordStart = 2000;
    words.forEach((_, i) => {
      timers.push(
        setTimeout(() => setWordsShown((n) => Math.max(n, i + 1)), wordStart + i * 55)
      );
    });
    timers.push(
      setTimeout(() => setShowBtn(true), wordStart + words.length * 55 + 300)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  return (
    <div className="paper-card note-card">
      <p className="eyebrow">a little something for you</p>
      <h1 className={`script-title reveal-item ${showTitle ? "shown" : ""}`}>
        Happy Friendship Day
      </h1>
      <div className={`photo-frame reveal-item ${showFrame ? "shown" : ""}`}>
        <div className={`photo-loader ${photoLoaded ? "done" : ""}`}>
          <span /><span /><span />
        </div>
        <img
          src={image}
          alt="A favorite memory together"
          className={photoLoaded ? "shown" : ""}
        />
        <span className="tape tape-left" />
        <span className="tape tape-right" />
      </div>
      <p className="note-text">
        {words.map((w, i) => (
          <span key={i} className={`word ${i < wordsShown ? "shown" : ""}`}>
            {w}{" "}
          </span>
        ))}
      </p>
      <button
        className={`next-btn reveal-item ${showBtn ? "shown" : ""}`}
        onClick={goNext}
      >
        Keep going &rarr;
      </button>
    </div>
  );
}

/* ---------- PAGE 2 — certificate ---------- */
function CertificatePage({ mounted, goNext }) {
  const [typed, setTyped] = useState("");
  const [showOpenBtn, setShowOpenBtn] = useState(false);
  const [opened, setOpened] = useState(false);
  const name = CONFIG.friendName;

  useEffect(() => {
    if (!mounted) return;
    let i = 0;
    const typer = setInterval(() => {
      i++;
      setTyped(name.slice(0, i));
      if (i >= name.length) {
        clearInterval(typer);
        setTimeout(() => setShowOpenBtn(true), 400);
      }
    }, 90);
    return () => clearInterval(typer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  return (
    <div className="cert-stage">
      {!opened && (
        <div className="award-intro">
          <p className="eyebrow">this year's</p>
          <p className="award-kicker">Lifetime Bestie Award</p>
          <p className="award-goes-to">goes to</p>
          <h2 className="script-title award-name">
            <span>{typed}</span>
            <span className="cursor">|</span>
          </h2>
          {showOpenBtn && (
            <button className="open-cert-btn" onClick={() => setOpened(true)}>
              Open the Certificate
            </button>
          )}
        </div>
      )}

      {opened && (
        <div className="certificate shown">
          <div className="certificate-inner">
            <span className="cert-corner tl" />
            <span className="cert-corner tr" />
            <span className="cert-corner bl" />
            <span className="cert-corner br" />
            <p className="cert-eyebrow">Certificate of Friendship</p>
            <p className="cert-medal">&#127942;</p>
            <p className="cert-line">This certifies that</p>
            <h3 className="cert-name">{CONFIG.friendName}</h3>
            <p className="cert-line">has officially earned the title of</p>
            <p className="cert-title-line">Lifetime Bestie</p>
            <p className="cert-body">{CONFIG.certificateBody}</p>
            <div className="cert-sign-row">
              <div className="cert-sign">
                <p className="sign-script">You know who</p>
                <p className="sign-label">Signed</p>
              </div>
              <div className="cert-ribbon">&#127941;</div>
              <div className="cert-sign">
                <p className="sign-script">{CONFIG.certificateDate}</p>
                <p className="sign-label">Date</p>
              </div>
            </div>
          </div>
          <button className="next-btn" onClick={goNext}>
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- PAGE 3 — characteristics with animated arrows ---------- */
function CharacteristicsPage({ mounted, goNext, image }) {
  const svgRef = useRef(null);
  const [drawn, setDrawn] = useState(false);
  const items = CONFIG.characteristics;
  const cx = 50, cy = 50, radius = 42;

  const points = useMemo(
    () =>
      items.map((label, i) => {
        const angle = (-90 + (360 / items.length) * i) * (Math.PI / 180);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const midX = cx + radius * 0.55 * Math.cos(angle) + 6 * Math.sin(angle);
        const midY = cy + radius * 0.55 * Math.sin(angle) - 6 * Math.cos(angle);
        return { label, x, y, midX, midY, d: `M ${cx} ${cy} Q ${midX} ${midY} ${x} ${y}` };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items]
  );

  useEffect(() => {
    if (!mounted || !svgRef.current) return;
    // measure real path lengths for a true draw-in effect
    const paths = svgRef.current.querySelectorAll("path");
    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
    const t = setTimeout(() => {
      paths.forEach((p) => (p.style.strokeDashoffset = 0));
      setDrawn(true);
    }, 300);
    return () => clearTimeout(t);
  }, [mounted]);

  return (
    <div className="char-stage">
      <h2 className="script-title char-title">You are my&hellip;</h2>
      <div className="char-orbit">
        <svg
          ref={svgRef}
          className="arrows-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {points.map((p, i) => (
            <path key={i} d={p.d} style={{ transitionDelay: `${i * 0.28}s` }} />
          ))}
        </svg>

        <div className="bestie-frame">
          <img src={image} alt="My bestie" className="bestie-photo" />
          <span className="tape tape-left" />
          <span className="tape tape-right" />
        </div>

        <div className="char-labels">
          {points.map((p, i) => (
            <div
              key={i}
              className={`char-label ${drawn ? "shown" : ""}`}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transitionDelay: `${i * 0.28 + 0.5}s`,
              }}
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>
      <button className="next-btn" onClick={goNext}>
        Next &rarr;
      </button>
    </div>
  );
}

/* ---------- PAGE 4 — memories collage ---------- */
function MemoriesPage({ mounted, goNext }) {
  const [shown, setShown] = useState(false);
  const imgs = CONFIG.images.memories;
  const captions = CONFIG.memoryCaptions;

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setShown(true), 150);
    return () => clearTimeout(t);
  }, [mounted]);

  return (
    <div className="memories-stage">
      <h2 className="script-title">Our Memories</h2>
      <div className="memories-row">
        <figure className={`mem mem-big mem-1 ${shown ? "shown" : ""}`}>
          <img src={imgs[0]} alt="Memory one" title={captions[0]} />
          <span className="tape tape-left" />
        </figure>
        <div className="mem-stack">
          <figure className={`mem mem-small mem-2 ${shown ? "shown" : ""}`}>
            <img src={imgs[1]} alt="Memory two" title={captions[1]} />
          </figure>
          <figure className={`mem mem-small mem-3 ${shown ? "shown" : ""}`}>
            <img src={imgs[2]} alt="Memory three" title={captions[2]} />
          </figure>
        </div>
        <figure className={`mem mem-big mem-4 ${shown ? "shown" : ""}`}>
          <img src={imgs[3]} alt="Memory four" title={captions[3]} />
          <span className="tape tape-right" />
        </figure>
      </div>
      <button className="next-btn" onClick={goNext}>
        Next &rarr;
      </button>
    </div>
  );
}

/* ---------- PAGE 5 — final full-page note ---------- */
function FinalPage({ mounted, onReplay }) {
  const [linesShown, setLinesShown] = useState(0);
  const hearts = useMemo(
    () =>
      Array.from({ length: 10 }).map(() => ({
        left: Math.random() * 100,
        size: 12 + Math.random() * 14,
        opacity: 0.3 + Math.random() * 0.4,
        duration: 6 + Math.random() * 5,
        delay: Math.random() * 4,
      })),
    []
  );

  useEffect(() => {
    if (!mounted) return;
    const timers = CONFIG.finalNote.map((_, i) =>
      setTimeout(() => setLinesShown((n) => Math.max(n, i + 1)), 300 + i * 500)
    );
    return () => timers.forEach(clearTimeout);
  }, [mounted]);

  return (
    <div className="final-note">
      <div className="final-hearts" aria-hidden="true">
        {hearts.map((h, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${h.left}%`,
              top: "-10%",
              color: "#ffb4a8",
              fontSize: h.size,
              opacity: h.opacity,
              animation: `heart-fall ${h.duration}s linear ${h.delay}s infinite`,
            }}
          >
            ❤
          </span>
        ))}
      </div>
      <p className="eyebrow">before you go</p>
      <h2 className="script-title">One Last Thing&hellip;</h2>
      <div className="final-note-body">
        {CONFIG.finalNote.map((line, i) => (
          <span key={i} className={`line ${i < linesShown ? "shown" : ""}`}>
            {line}
          </span>
        ))}
      </div>
      <p className="final-signature">
        Forever your person, <br />
        <span className="script-title">Me</span>
      </p>
      <button className="replay-btn" onClick={onReplay}>
        Read it again &#8635;
      </button>
    </div>
  );
}

/* ---------- ambient floating hearts on the landing background ---------- */
function AmbientFloaties() {
  const items = useMemo(() => {
    const emojis = ["💌", "💕", "✨", "🎀"];
    return Array.from({ length: 12 }).map((_, i) => ({
      emoji: emojis[i % emojis.length],
      left: Math.random() * 100,
      duration: 14 + Math.random() * 10,
      delay: Math.random() * 14,
      size: 14 + Math.random() * 14,
    }));
  }, []);
  return (
    <div className="floaties" aria-hidden="true">
      {items.map((it, i) => (
        <span
          key={i}
          style={{
            left: `${it.left}%`,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            fontSize: it.size,
          }}
        >
          {it.emoji}
        </span>
      ))}
    </div>
  );
}
