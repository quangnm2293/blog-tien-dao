'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const el = document.createElement('div');
    el.innerHTML = content;
    const nodes = el.querySelectorAll('h2, h3');
    const list: Heading[] = [];
    nodes.forEach((node, i) => {
      const id = node.id || `heading-${i}`;
      if (!node.id) node.id = id;
      list.push({
        id,
        text: node.textContent || '',
        level: node.tagName === 'H2' ? 2 : 3,
      });
    });
    setHeadings(list);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="rounded-lg bg-ink-100 p-4 border border-ink-200" aria-label="Mục lục">
      <h2 className="font-semibold text-ink-900 mb-3 text-sm uppercase tracking-wide">Mục lục</h2>
      <ul className="space-y-1 text-sm">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: h.level === 3 ? '1rem' : 0 }}
            className={activeId === h.id ? 'text-primary-600 font-medium' : 'text-ink-600'}
          >
            <a href={`#${h.id}`} className="hover:text-primary-600">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
