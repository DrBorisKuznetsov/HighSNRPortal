import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../router';
import labIllustration from '../assets/highsnr-lab-hero-inward.webp';

export default function Home() {
  return (
    <section className="home-hero">
      <img className="home-hero-art" src={labIllustration} alt="" width="1774" height="887" />
      <div className="container home-hero-inner">
        <h1><span>HighSNR</span> Engineering Lab</h1>
        <p className="home-hero-summary">
          Independent research on how real electronic components affect precision circuits.
          Our application notes turn measurements and physical models into practical design guidance.
        </p>
        <Link to="/publications" className="btn btn-primary" analyticsContext="home_application_notes">
          Explore Application Notes <ArrowRight size={16} />
        </Link>

        <section className="home-featured-note" aria-labelledby="featured-note-title">
          <p className="home-note-label">Application Note AN-002 · Rev A</p>
          <h2 id="featured-note-title">X7R distortion at zero applied DC bias</h2>
          <p>
            Measurements on ten 10 µF X7R capacitors and a circuit model for estimating distortion in an RC filter.
          </p>
          <Link to="/application-notes/an-002" className="link-arrow" analyticsContext="home_application_notes">
            Read AN-002 <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </section>
  );
}
