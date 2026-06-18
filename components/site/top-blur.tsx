// A progressive backdrop blur behind the fixed nav: eight stacked layers with
// increasing blur and offset gradient masks so the blur is strongest at the top
// (behind the bar) and fades smoothly to nothing below — no hard edge, content
// stays readable as it scrolls under. Pointer-transparent and purely decorative.
const LAYERS = Array.from({ length: 8 }, (_, i) => {
  const a = i * 12.5;
  const clamp = (n: number) => Math.min(n, 100);
  return {
    blur: 0.0781 * 2 ** i,
    mask: `linear-gradient(to top, rgba(0,0,0,0) ${a}%, rgba(0,0,0,1) ${clamp(a + 12.5)}%, rgba(0,0,0,1) ${clamp(a + 25)}%, rgba(0,0,0,0) ${clamp(a + 37.5)}%)`,
  };
});

export function TopBlur() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 h-[clamp(88px,12vh,136px)]"
    >
      {LAYERS.map((l) => (
        <div
          className="absolute inset-0"
          key={l.blur}
          style={{
            backdropFilter: `blur(${l.blur}px)`,
            WebkitBackdropFilter: `blur(${l.blur}px)`,
            maskImage: l.mask,
            WebkitMaskImage: l.mask,
          }}
        />
      ))}
    </div>
  );
}
