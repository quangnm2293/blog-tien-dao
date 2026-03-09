/** Add id to h2/h3 in HTML string for anchor links and TOC */
export function addHeadingIds(html: string): string {
  let counter = 0;
  return html.replace(/<h([23])>([^<]*)<\/h\1>/gi, (_, level, text) => {
    const slug = slugify(text) || `h-${counter++}`;
    return `<h${level} id="${slug}">${text}</h${level}>`;
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}
