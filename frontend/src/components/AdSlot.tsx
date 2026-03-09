type Position =
  | 'top_banner'
  | 'article_after_first_paragraph'
  | 'article_middle'
  | 'sidebar'
  | 'footer';

interface AdSlotProps {
  position: Position;
  className?: string;
}

const LABELS: Record<Position, string> = {
  top_banner: 'Quảng cáo (Top Banner)',
  article_after_first_paragraph: 'Quảng cáo (Sau đoạn đầu)',
  article_middle: 'Quảng cáo (Giữa bài)',
  sidebar: 'Quảng cáo (Sidebar)',
  footer: 'Quảng cáo (Footer)',
};

export default function AdSlot({ position, className = '' }: AdSlotProps) {
  return (
    <div
      className={`ad-slot ${className}`}
      data-ad-position={position}
      role="presentation"
      aria-label="Vị trí quảng cáo"
    >
      {LABELS[position]}
    </div>
  );
}
