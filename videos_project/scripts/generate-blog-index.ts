import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src', 'data', 'blog');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'blog-index.json');

function generateIndex() {
  console.log('Generating blog index...');
  
  if (!fs.existsSync(BLOG_DIR)) {
    console.log(`Blog directory does not exist at ${BLOG_DIR}. Creating it...`);
    fs.mkdirSync(BLOG_DIR, { recursive: true });
    
    // Create a default welcome post if empty
    const welcomePath = path.join(BLOG_DIR, 'welcome-to-high-snr.md');
    fs.writeFileSync(welcomePath, `---
title: Welcome to High SNR Channel
date: 2026-05-31T12:00:00Z
excerpt: Introducing the brand new High SNR website and our goals for technical content delivery.
author: Boris Kuznetsov
---

# Welcome to High SNR Channel

Hello and welcome! This is the official home page for **High SNR Channel**. 

Our primary mission is to explore high-precision electronics, hardware development, signal processing, and visual animations using Manim. Here, we prioritize high signal quality, low noise, and clean engineering.

## What is "High SNR"?
In engineering, **Signal-to-Noise Ratio (SNR)** compares the level of a desired signal to the level of background noise. A high SNR means the signal is clear and free from distortion. We apply this philosophy to our content:
- **High Signal:** Rich, informative, and mathematically rigorous content.
- **Low Noise:** Clean visuals, direct presentation, and no fluff.

Stay tuned for articles, video updates, and interactive design tools!
`, 'utf-8');
    console.log(`Created default blog post: welcome-to-high-snr.md`);
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  
  const posts = files.map(filename => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      slug: filename.replace('.md', ''),
      title: data.title || 'Untitled Post',
      date: data.date || new Date().toISOString(),
      excerpt: data.excerpt || content.slice(0, 150).trim() + '...',
      author: data.author || 'Boris Kuznetsov',
      content: content
    };
  });

  // Sort posts: newest first
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`Successfully generated index with ${posts.length} posts!`);
}

generateIndex();
