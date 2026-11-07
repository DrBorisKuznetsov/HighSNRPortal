import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '../router';
import articleSource from '../content/ai-design-methodology.md?raw';
import './MlccDistortionMeterArchitecture.css';
import './AiDesignMethodology.css';

const assetRoot = '/articles/ai-design-methodology';
const imageDimensions = {
  [`${assetRoot}/fig1_workflow_en.png`]: { width: 2460, height: 2516 },
  [`${assetRoot}/fig2_project_structure_en.png`]: { width: 2460, height: 3220 },
  [`${assetRoot}/fig3_board_v033_render_web.jpg`]: { width: 1600, height: 1063 },
};

// The source is the author's Markdown, including its original review preamble.
// The publication header below replaces that preamble; the article stays intact.
const bodySource = articleSource.split(/\r?\n---\r?\n/)[1].trim();

function inlineMarkup(text) {
  return text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      // Keep existing portal references in the local preview as well.
      const href = link[2].replace(/^https:\/\/highsnr\.org\//, '/');
      return <a key={index} href={href}>{link[1]}</a>;
    }
    if (part.startsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function parseArticle(source) {
  const preface = [];
  const sections = [];
  let blocks = preface;

  for (const paragraph of source.split(/\r?\n\s*\r?\n/)) {
    const text = paragraph.trim();
    const heading = text.match(/^## (.+)$/);
    const image = text.match(/^!\[([^\]]+)\]\(\.\.\/images\/([^/)]+)\)$/);
    if (heading) {
      const section = {
        id: heading[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        title: heading[1],
        blocks: [],
      };
      sections.push(section);
      blocks = section.blocks;
    } else if (image) {
      blocks.push({ type: 'figure', alt: image[1], src: `${assetRoot}/${image[2]}` });
    } else if (/^\*Figure \d\./.test(text) && blocks.at(-1)?.type === 'figure') {
      blocks.at(-1).caption = text.slice(1, -1);
    } else if (text) {
      blocks.push({ type: 'paragraph', text });
    }
  }

  return { preface, sections };
}

function ArticleBlocks({ blocks }) {
  return blocks.map((block, index) => block.type === 'figure' ? (
    <figure className="mlcc-architecture-figure ai-design-figure" key={block.src}>
      <a href={block.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image: ${block.alt}`}>
        <img src={block.src} alt={block.alt} {...imageDimensions[block.src]} loading="lazy" decoding="async" />
      </a>
      <figcaption>{block.caption}</figcaption>
    </figure>
  ) : <p key={index}>{inlineMarkup(block.text)}</p>);
}

const { preface, sections } = parseArticle(bodySource);

export default function AiDesignMethodology() {
  return (
    <article className="mlcc-architecture-page ai-design-page">
      <header className="mlcc-architecture-hero">
        <div className="container mlcc-architecture-hero-inner">
          <Link className="mlcc-architecture-back" to="/publications">
            <ArrowLeft size={15} /> Articles &amp; Papers
          </Link>
          <p className="mlcc-architecture-kicker">Engineering Methodology</p>
          <h1>How I Design Electronics with AI Agents</h1>
          <p className="mlcc-architecture-subtitle">The method behind the control board for my MLCC analyzer</p>
          <div className="mlcc-architecture-meta">
            <span>Boris Kuznetsov · HighSNR Lab</span>
            <time dateTime="2026-11-07">November 7, 2026</time>
          </div>
        </div>
      </header>

      <div className="container mlcc-architecture-layout">
        <aside className="mlcc-architecture-toc" aria-label="Article contents">
          <span>Contents</span>
          {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        </aside>
        <div className="mlcc-architecture-body">
          <ArticleBlocks blocks={preface} />
          {sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              <ArticleBlocks blocks={section.blocks} />
            </section>
          ))}
          <nav className="ai-design-related" aria-label="Related reading">
            <Link to="/publications">Articles &amp; Papers</Link>
            <Link to="/lab-notes">Research Log</Link>
          </nav>
        </div>
      </div>
    </article>
  );
}
