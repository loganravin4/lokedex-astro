// Decorative speaker grille — bottom-right detail of the right half.
// 4 columns × 3 rows of dots (Section 6.8). Self-positioned so RightHalf
// stays readable.
export default function SpeakerGrille() {
  const dots = Array.from({ length: 12 });

  return (
    <div className="absolute bottom-[20px] right-[20px] grid grid-cols-[repeat(4,5px)] gap-[5px]">
      {dots.map((_, i) => (
        <div key={i} className="speaker-dot" />
      ))}
    </div>
  );
}
