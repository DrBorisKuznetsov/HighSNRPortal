import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '../router';
import articleSource from '../content/fixture-validation.md?raw';
import './MlccDistortionMeterArchitecture.css';
import './FixtureValidationNote.css';

const assetRoot = '/lab-notes/fixture-validation';

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

function parseTableRow(line) {
  return line.split('|').slice(1, -1).map((cell) => cell.trim());
}

function parseMarkdown(source) {
  const preface = [];
  const sections = [];
  let current = null;
  let paragraph = [];
  let list = [];
  let table = [];

  const target = () => current ? current.blocks : preface;
  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(' ');
    const isNote = text.startsWith('*') && text.endsWith('*');
    target().push({ type: isNote ? 'note' : 'paragraph', text: isNote ? text.slice(1, -1) : text });
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    target().push({ type: 'list', items: list });
    list = [];
  };
  const flushTable = () => {
    if (!table.length) return;
    const rows = table.map(parseTableRow);
    target().push({ type: 'table', headers: rows[0], rows: rows.slice(2) });
    table = [];
  };
  const flushBlocks = () => {
    flushParagraph();
    flushList();
    flushTable();
  };

  source.split(/\r?\n/).forEach((line) => {
    const heading = line.match(/^##\s+(.+)$/);
    const image = line.match(/^!\[([^\]]+)]\(([^)]+)\)$/);
    if (/^#\s+/.test(line) || line === '*HighSNR Lab — Lab Note, September 2026*' || /^---+$/.test(line)) return;
    if (heading) {
      flushBlocks();
      current = { id: slugify(heading[1]), title: heading[1], blocks: [] };
      sections.push(current);
      return;
    }
    if (image) {
      flushBlocks();
      target().push({ type: 'image', alt: image[1], src: `${assetRoot}/${image[2].replace(/^figures\//, '')}` });
      return;
    }
    if (/^\|.*\|$/.test(line)) {
      flushParagraph();
      flushList();
      table.push(line);
      return;
    }
    if (/^-\s+/.test(line)) {
      flushParagraph();
      flushTable();
      list.push(line.replace(/^-\s+/, ''));
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
    if (block.type === 'table') {
      return (
        <div className="fixture-table-wrap" key={`${prefix}-table-${index}`}>
          <table className="fixture-table">
            <thead><tr>{block.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (block.type === 'image') {
      return (
        <figure className="mlcc-architecture-figure fixture-figure" key={`${prefix}-image-${index}`}>
          <img src={block.src} alt={block.alt} />
        </figure>
      );
    }
    if (block.type === 'note') {
      return <p className="fixture-caption" key={`${prefix}-note-${index}`} dangerouslySetInnerHTML={inlineMarkup(block.text)} />;
    }
    return <p key={`${prefix}-paragraph-${index}`} dangerouslySetInnerHTML={inlineMarkup(block.text)} />;
  });
}

const { preface, sections } = parseMarkdown(articleSource);

export default function FixtureValidationNote() {
  return (
    <article className="mlcc-architecture-page">
      <header className="mlcc-architecture-hero fixture-hero">
        <div className="container mlcc-architecture-hero-inner">
          <Link className="mlcc-architecture-back" to="/lab-notes">
            <ArrowLeft size={15} /> Research Log
          </Link>
          <p className="mlcc-architecture-kicker">Research Note · Measurement Validation</p>
          <h1>Proving the Fixture Before Trusting the Capacitor</h1>
          <p className="mlcc-architecture-subtitle">Instrument floor, contact control, repeatability, drive dependence, and the 50 Hz problem</p>
          <p className="mlcc-architecture-lede">
            Before capacitor distortion data can be trusted, the analyzer, contacts, wiring, and environmental pickup must be measured as part of the experiment.
          </p>
          <div className="mlcc-architecture-meta">
            <span>Boris Kuznetsov</span>
            <span>September 20, 2026</span>
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
            <strong>What this series establishes</strong>
            <p>The resistor control remains at the residual floor, removal and refitting are repeatable, and single-point shielding reduces 50 Hz pickup by 18.66 dB.</p>
          </div>
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
            <p className="mlcc-architecture-kicker">Next measurement series</p>
            <h2>From fixture validation to controlled capacitor comparison</h2>
            <p>The next runs add controlled DC bias, final shielding, and enough parts to separate contact spread from part-to-part variation.</p>
          </div>
          <div className="mlcc-architecture-cta-actions">
            <Link className="btn btn-primary" to="/research">Capacitor research <ArrowRight size={17} /></Link>
            <Link className="btn btn-secondary" to="/lab-notes">Research Log <ArrowRight size={17} /></Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
