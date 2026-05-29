/**
 * Lightweight, zero-dependency router for SEO-friendly SPA navigation.
 */
export function navigate(path: string) {
  window.history.pushState(null, '', path);
  // Dispatch popstate event so App.tsx knows the URL changed
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function handleSEOAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, path: string) {
  e.preventDefault();
  navigate(path);
}
