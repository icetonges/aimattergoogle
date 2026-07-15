"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Language = "en" | "zh";
type Theme = "dark" | "light";
type Story = {
  slug: string;
  titleEn: string;
  titleZh: string;
  bodyEn: string;
  bodyZh: string;
  category: string;
  date: string;
  nodes: string[];
};

const copy = {
  en: {
    nav: ["Explore", "Process maps", "Studio"],
    eyebrow: "THE BILINGUAL INTELLIGENCE JOURNAL",
    hero: "Ideas become\nintelligent experiences.",
    sub: "Publish AI thinking in English and Chinese, turn complex systems into visual process maps, and prepare every story for the machine-learning products ahead.",
    create: "Create a page", read: "Explore insights", signal: "LIVE CREATION STUDIO",
    studioTitle: "Paste an idea. Publish a modern experience.",
    studioSub: "Shape a bilingual story and its process map in one focused workspace.",
    details: "Story details", titleEn: "English title", titleZh: "中文标题",
    contentEn: "English story", contentZh: "中文内容", category: "Collection",
    publish: "Create page", preview: "Live structure", steps: "Process steps",
    recent: "Latest intelligence", recentSub: "Research, systems thinking, and practical AI—made clear in two languages.",
    all: "View all stories", local: "Saved on this device", back: "Back to journal",
    process: "Process map", bilingual: "Bilingual edition", empty: "Add numbered lines to shape the map automatically.",
  },
  zh: {
    nav: ["探索", "流程图", "创作室"],
    eyebrow: "双语智能期刊",
    hero: "让观点成为\n智能体验。",
    sub: "用中英文发布人工智能洞见，把复杂系统转化为可视化流程图，并为未来的机器学习产品做好准备。",
    create: "创建新页面", read: "浏览洞见", signal: "实时创作工作室",
    studioTitle: "粘贴一个想法，发布现代体验。",
    studioSub: "在同一个专注工作区中完成双语文章与流程图。",
    details: "文章信息", titleEn: "英文标题", titleZh: "中文标题",
    contentEn: "英文内容", contentZh: "中文内容", category: "内容栏目",
    publish: "创建页面", preview: "实时结构", steps: "流程步骤",
    recent: "最新洞见", recentSub: "研究、系统思维与实用 AI——用两种语言清晰呈现。",
    all: "查看全部文章", local: "已保存在此设备", back: "返回期刊",
    process: "流程图", bilingual: "双语版本", empty: "添加带编号的行即可自动生成流程图。",
  },
};

const featured: Story = {
  slug: "designing-trustworthy-ai-systems",
  titleEn: "Designing trustworthy AI systems",
  titleZh: "设计值得信赖的人工智能系统",
  bodyEn: "Trust is not a final review. It is a system designed from the first question through deployment.\n\nStart with a clear human outcome. Map the data and decisions. Test the boundaries. Observe what happens in the real world.",
  bodyZh: "信任不是最后一次审查，而是从第一个问题到部署全过程的系统设计。\n\n从清晰的人类目标出发，梳理数据与决策，测试边界，并持续观察真实世界中的结果。",
  category: "AI Systems",
  date: "JUL 2026",
  nodes: ["Intent", "Evidence", "Design", "Evaluate", "Observe"],
};

const samples: Story[] = [
  featured,
  {
    slug: "from-data-to-decision",
    titleEn: "From data to decision: a practical map",
    titleZh: "从数据到决策：一张实用路线图",
    bodyEn: "Modern data work becomes useful when every transformation leads to a visible decision.",
    bodyZh: "现代数据工作只有在每次转换都通向清晰决策时才真正有价值。",
    category: "Process Design", date: "JUN 2026", nodes: ["Collect", "Understand", "Model", "Decide"],
  },
  {
    slug: "the-interface-is-the-model",
    titleEn: "The interface is part of the model",
    titleZh: "界面也是模型的一部分",
    bodyEn: "The best AI products make uncertainty legible, action deliberate, and feedback continuous.",
    bodyZh: "优秀的 AI 产品让不确定性可理解、行动更审慎、反馈持续发生。",
    category: "Product Thinking", date: "MAY 2026", nodes: ["Signal", "Explain", "Act", "Learn"],
  },
];

const safeSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "").slice(0, 72) || `story-${Date.now()}`;

function deriveNodes(text: string) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const numbered = lines
    .filter((line) => /^(\d+[.)]|[-•→]|step\s+\d+)/i.test(line))
    .map((line) => line.replace(/^(\d+[.)]|[-•→]|step\s+\d+[:.]?)\s*/i, "").slice(0, 28));
  return (numbered.length >= 2 ? numbered : ["Frame", "Explore", "Shape", "Publish"]).slice(0, 6);
}

function Mark({ dark = false }: { dark?: boolean }) {
  return <span className={`brand-mark ${dark ? "dark" : ""}`} aria-hidden="true"><i /><i /><i /></span>;
}

export function AIMatterApp({ initialSlug }: { initialSlug?: string }) {
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [slug] = useState<string | null>(initialSlug ?? null);
  const [stories, setStories] = useState<Story[]>(samples);
  const [titleEn, setTitleEn] = useState("");
  const [titleZh, setTitleZh] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [bodyZh, setBodyZh] = useState("");
  const [category, setCategory] = useState("AI & Society");
  const [saved, setSaved] = useState(false);
  const t = copy[lang];

  useEffect(() => {
    const storedTheme = localStorage.getItem("aimatter-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      queueMicrotask(() => setTheme(storedTheme));
    }
    const stored = localStorage.getItem("aimatter-stories");
    if (stored) {
      try {
        const localStories = JSON.parse(stored) as Story[];
        queueMicrotask(() => setStories([...localStories, ...samples]));
      } catch { /* ignore invalid local data */ }
    }
  }, []);

  const activeStory = useMemo(() => stories.find((story) => story.slug === slug), [slug, stories]);
  const liveNodes = useMemo(() => deriveNodes(bodyEn || bodyZh), [bodyEn, bodyZh]);

  function changeTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    localStorage.setItem("aimatter-theme", nextTheme);
  }

  function publish() {
    if (!titleEn.trim() && !titleZh.trim()) return;
    const story: Story = {
      slug: safeSlug(titleEn || titleZh),
      titleEn: titleEn.trim() || titleZh.trim(), titleZh: titleZh.trim() || titleEn.trim(),
      bodyEn: bodyEn.trim() || bodyZh.trim(), bodyZh: bodyZh.trim() || bodyEn.trim(),
      category, date: new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date()).toUpperCase(),
      nodes: liveNodes,
    };
    const localStories = [story, ...stories.filter((item) => !samples.some((sample) => sample.slug === item.slug) && item.slug !== story.slug)];
    localStorage.setItem("aimatter-stories", JSON.stringify(localStories));
    setStories([story, ...stories.filter((item) => item.slug !== story.slug)]);
    setSaved(true);
    window.setTimeout(() => { window.location.href = `/insights/${story.slug}`; }, 450);
  }

  if (slug && !activeStory) return <main className="article-shell" data-theme={theme}><Header lang={lang} setLang={setLang} theme={theme} setTheme={changeTheme} /><section className="missing"><span>404</span><h1>Story not found</h1><Link href="/">{t.back}</Link></section></main>;
  if (activeStory) return <Article story={activeStory} lang={lang} setLang={setLang} theme={theme} setTheme={changeTheme} />;

  return (
    <main data-theme={theme}>
      <section className="hero-section">
        <Header lang={lang} setLang={setLang} theme={theme} setTheme={changeTheme} />
        <div className="ambient ambient-one" /><div className="ambient ambient-two" />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span />{t.eyebrow}</p>
            <h1>{t.hero.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
            <p className="hero-sub">{t.sub}</p>
            <div className="hero-actions"><a className="button primary" href="#studio">{t.create}<b>↗</b></a><a className="button ghost" href="#insights">{t.read}<b>↓</b></a></div>
          </div>
          <Link className="feature-card" href={`/insights/${featured.slug}`}>
            <div className="feature-orbit"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><Mark /></div>
            <div className="feature-info"><small>{featured.category} · 06 MIN</small><h2>{lang === "en" ? featured.titleEn : featured.titleZh}</h2><span>Read story <b>↗</b></span></div>
          </Link>
        </div>
        <div className="hero-foot"><span>{t.signal}</span><div className="pulse-line"><i /></div><span>01 — 03</span></div>
      </section>

      <section className="studio" id="studio">
        <div className="section-heading"><p className="kicker">01 / CREATE</p><h2>{t.studioTitle}</h2><p>{t.studioSub}</p></div>
        <div className="studio-grid">
          <div className="editor-panel">
            <div className="panel-top"><span>{t.details}</span><div className="status"><i /> DRAFT</div></div>
            <div className="field-row"><label>{t.titleEn}<input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder="A new intelligence…" /></label><label>{t.titleZh}<input value={titleZh} onChange={(e) => setTitleZh(e.target.value)} placeholder="一个新的智能观点……" /></label></div>
            <label>{t.category}<select value={category} onChange={(e) => setCategory(e.target.value)}><option>AI &amp; Society</option><option>Process Design</option><option>Machine Learning</option><option>Product Thinking</option></select></label>
            <div className="language-editors">
              <label><span><b>EN</b>{t.contentEn}</span><textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} placeholder={"Paste your thinking here…\n\n1. Frame the question\n2. Map the evidence\n3. Publish the insight"} /></label>
              <label><span><b>中</b>{t.contentZh}</span><textarea value={bodyZh} onChange={(e) => setBodyZh(e.target.value)} placeholder={"在这里粘贴中文内容……\n\n1. 明确问题\n2. 梳理证据\n3. 发布洞见"} /></label>
            </div>
            <div className="editor-footer"><span>{saved ? `✓ ${t.local}` : "Markdown-friendly · Auto-saved on publish"}</span><button onClick={publish} disabled={!titleEn.trim() && !titleZh.trim()}>{t.publish}<b>↗</b></button></div>
          </div>
          <aside className="map-panel">
            <div className="map-label"><span>{t.preview}</span><b>LIVE</b></div>
            <div className="map-canvas">
              <div className="map-glow" /><Mark dark />
              <p>{t.steps}</p>
              <div className="node-list">{liveNodes.map((node, index) => <div className="node" key={`${node}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i><span>{node}</span>{index < liveNodes.length - 1 && <b>↓</b>}</div>)}</div>
            </div>
            <div className="map-tip"><span>✦</span>{t.empty}</div>
          </aside>
        </div>
      </section>

      <section className="insights" id="insights">
        <div className="section-heading light"><p className="kicker">02 / DISCOVER</p><h2>{t.recent}</h2><p>{t.recentSub}</p></div>
        <div className="story-grid">{stories.slice(0, 3).map((story, index) => <StoryCard key={story.slug} story={story} lang={lang} index={index} />)}</div>
        <a className="all-stories" href="#studio">{t.all}<b>↗</b></a>
      </section>
      <Footer lang={lang} />
    </main>
  );
}

function Header({ lang, setLang, theme, setTheme }: { lang: Language; setLang: (lang: Language) => void; theme: Theme; setTheme: (theme: Theme) => void }) {
  const t = copy[lang];
  return <header><Link className="logo" href="/"><Mark /> <strong>AI Matter</strong><small>智能新知</small></Link><nav>{t.nav.map((item, index) => <a key={item} href={index === 2 ? "/#studio" : "/#insights"}>{item}</a>)}</nav><div className="header-tools"><button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"}><span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span><b>{theme === "dark" ? "LIGHT" : "DARK"}</b></button><div className="language"><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button><i /><button className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")}>中文</button></div></div></header>;
}

function StoryCard({ story, lang, index }: { story: Story; lang: Language; index: number }) {
  return <Link className={`story-card tone-${index % 3}`} href={`/insights/${story.slug}`}><div className="card-art"><span>{String(index + 1).padStart(2, "0")}</span><div className="data-lines">{story.nodes.slice(0, 4).map((node, i) => <i key={node} style={{ width: `${38 + i * 13}%` }} />)}</div><Mark dark={index === 1} /></div><small>{story.category} · {story.date}</small><h3>{lang === "en" ? story.titleEn : story.titleZh}</h3><p>{lang === "en" ? story.titleZh : story.titleEn}</p><b className="card-arrow">↗</b></Link>;
}

function Article({ story, lang, setLang, theme, setTheme }: { story: Story; lang: Language; setLang: (lang: Language) => void; theme: Theme; setTheme: (theme: Theme) => void }) {
  const t = copy[lang]; const body = lang === "en" ? story.bodyEn : story.bodyZh;
  return <main className="article-shell" data-theme={theme}><Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} /><article><Link className="back" href="/">← {t.back}</Link><div className="article-meta"><span>{story.category}</span><i />{story.date}<i />{t.bilingual}</div><h1>{lang === "en" ? story.titleEn : story.titleZh}</h1><p className="translation">{lang === "en" ? story.titleZh : story.titleEn}</p><div className="article-visual"><div className="visual-sun"><Mark dark /></div><div className="article-map">{story.nodes.map((node, index) => <div key={node}><b>{String(index + 1).padStart(2, "0")}</b><span>{node}</span></div>)}</div></div><div className="article-body">{body.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><section className="inline-map"><p className="kicker">{t.process}</p><div>{story.nodes.map((node, index) => <span key={node}><i>{index + 1}</i>{node}{index < story.nodes.length - 1 && <b>→</b>}</span>)}</div></section></article><Footer lang={lang} /></main>;
}

function Footer({ lang }: { lang: Language }) {
  return <footer><div><Link className="logo" href="/"><Mark dark /><strong>AI Matter</strong></Link><p>{lang === "en" ? "Intelligence, made visible." : "让智能清晰可见。"}</p></div><span>© 2026 AI Matter · Built for what comes next.</span></footer>;
}
