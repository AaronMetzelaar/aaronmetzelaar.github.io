// One-shot client signal that hands off from the homepage preloader to the
// hero portrait: the hero waits to assemble until the loader fires this, so the
// dots only "form the portrait" once, at reveal. Module state lives for the JS
// session — it persists across client navigations (so the loader doesn't
// re-run when navigating back to home) and resets on a full page reload.
let revealed = false;
const subscribers = new Set<() => void>();

export function triggerReveal() {
  if (revealed) {
    return;
  }
  revealed = true;
  for (const cb of subscribers) {
    cb();
  }
  subscribers.clear();
}

// Run `cb` once the page is revealed — immediately if it already happened.
export function onReveal(cb: () => void): () => void {
  if (revealed) {
    cb();
    return () => undefined;
  }
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export function isRevealed() {
  return revealed;
}
