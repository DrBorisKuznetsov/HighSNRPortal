import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '../router';
import articleSource from '../content/measurement-board-designed.md?raw';
import './MlccDistortionMeterArchitecture.css';

const assetRoot = '/lab-notes/measurement-board-designed';

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inlineMarkup(value) {
  let html = escapeHtml(value);
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  return { __html: html };
}

function slugify(value) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseMarkdown(source) {
  const preface = [];
  const sections = [];
  let current = null;
  let paragraph = [];
  let list = [];

  const target = () => current ? current.blocks : preface;
  const flushParagraph = () => {
    if (paragraph.length) {
      target().push({ type: 'paragraph', text: paragraph.join(' ') });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      target().push({ type: 'list', items: list });
      list = [];
    }
  };
  const flushBlocks = () => {
    flushParagraph();
    flushList();
  };

  source.split(/\r?\n/).forEach((line) => {
    const heading = line.match(/^##\s+(.+)$/);
    if (/^#\s+/.test(line)) return;
    if (heading) {
      flushBlocks();
      current = { id: slugify(heading[1]), title: heading[1], blocks: [] };
      sections.push(current);
      return;
    }
    if (/^\*\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^\*\s+/, ''));
      return;
    }
    if (!line.trim()) {
      flushBlocks();
      return;
    }
    paragraph.push(line.trim());
  });
  flushBlocks();
  return { preface, sections };
}

function renderBlocks(blocks, prefix) {
  return blocks.map((block, index) => {
    if (block.type === 'list') {
      return (
        <ul className="mlcc-architecture-list" key={`${prefix}-list-${index}`}>
          {block.items.map((item, itemIndex) => <li key={itemIndex} dangerouslySetInnerHTML={inlineMarkup(item)} />)}
        </ul>
      );
    }
    return <p key={`${prefix}-paragraph-${index}`} dangerouslySetInnerHTML={inlineMarkup(block.text)} />;
  });
}

const { preface, sections } = parseMarkdown(articleSource);

export default function MeasurementBoardDesigned() {
  return (
    <article className="mlcc-architecture-page">
      <header className="mlcc-architecture-hero">
        <div className="container mlcc-architecture-hero-inner">
          <Link className="mlcc-architecture-back" to="/lab-notes">
            <ArrowLeft size={15} /> Research Log
          </Link>
          <p className="mlcc-architecture-kicker">Research Note · Measurement Infrastructure</p>
          <h1>From Simulation to Hardware: The Measurement Board Is Finally Designed</h1>
          <p className="mlcc-architecture-subtitle">The measurement platform is ready to move from PCB design to experimental validation</p>
          <p className="mlcc-architecture-lede">
            The schematic and PCB layout are complete, the board has been fabricated, and the next phase is to validate a controlled platform for measuring MLCC distortion under DC bias.
          </p>
          <div className="mlcc-architecture-meta">
            <span>Boris Kuznetsov</span>
            <span>September 15, 2026</span>
            <span>Research note</span>
          </div>
        </div>
      </header>

      <div className="container mlcc-architecture-layout">
        <aside className="mlcc-architecture-toc" aria-label="Article contents">
          <span>Contents</span>
          {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        </aside>

        <div className="mlcc-architecture-body">
          <div className="mlcc-architecture-status">
            <strong>Current design stage</strong>
            <p>
              The schematic and PCB layout are complete, the board has been fabricated, and the remaining components are awaited before assembly and validation.
            </p>
          </div>

          <figure className="mlcc-architecture-figure">
            <img
              src={`${assetRoot}/measurement-board-render.png`}
              alt="Rendered measurement board for the HighSNR Lab MLCC distortion test platform"
            />
            <figcaption>
              Render of the fully assembled measurement-board design. The fabricated PCB is ready for the next bring-up and validation stage.
            </figcaption>
          </figure>

          {renderBlocks(preface, 'preface')}
          {sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.title}</h2>
              {renderBlocks(section.blocks, section.id)}
            </section>
          ))}
        </div>
      </div>

      <footer className="mlcc-architecture-cta">
        <div className="container mlcc-architecture-cta-inner">
          <div>
            <p className="mlcc-architecture-kicker">Research transition</p>
            <h2>From a finished board to measured behavior</h2>
            <p>The next note will document hardware bring-up, the system floor, and the first capacitor comparison measurements.</p>
          </div>
          <div className="mlcc-architecture-cta-actions">
            <Link className="btn btn-primary" to="/research">
              Capacitor research <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-secondary" to="/lab-notes">
              Research Log <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
