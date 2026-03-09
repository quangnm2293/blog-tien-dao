'use client';

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex gap-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-lg bg-ink-200 text-ink-700 text-sm hover:bg-ink-300"
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-lg bg-ink-200 text-ink-700 text-sm hover:bg-ink-300"
      >
        Twitter
      </a>
      <button
        type="button"
        className="px-4 py-2 rounded-lg bg-ink-200 text-ink-700 text-sm hover:bg-ink-300"
        onClick={() => {
          navigator.clipboard.writeText(url);
        }}
      >
        Sao chép link
      </button>
    </div>
  );
}
