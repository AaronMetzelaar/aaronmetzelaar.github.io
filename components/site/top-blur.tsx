// A progressive backdrop blur behind the fixed nav. Each layer blurs more than
// the last and is masked to cover a shorter band measured FROM THE TOP, so every
// layer is opaque at the top edge (strongest blur there) and they taper to
// nothing lower down — no hard edge, content stays readable as it scrolls under.
// Masking from the top is deliberate: it guarantees the top edge is always
// covered, which fixes a Safari bug where a strip at the very top rendered
// unblurred. Pointer-transparent and purely decorative.
const N = 6;
const LAYERS = Array.from({ length: N }, (_, i) => {
  const blur = 0.5 * 2 ** i; // 0.5 → 16px
  // each higher (blurrier) layer reaches less far down the band
  const end = 100 - (i * 100) / N; // 100, 83, 66, 50, 33, 16 (% from top)
  const solid = Math.max(0, end - 16);
  const mask = `linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${solid}%, rgba(0,0,0,0) ${end}%)`;
  return { blur, mask };
});

export function TopBlur() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 h-[clamp(120px,20vh,190px)]"
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
