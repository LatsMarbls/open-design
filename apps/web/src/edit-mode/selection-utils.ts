export const EDIT_DISCOVERY_SELECTOR =
  'main, nav, section, article, aside, header, footer, div, h1, h2, h3, h4, h5, h6, p, a, button, img, ul, ol, li, dl, dt, dd, table, thead, tbody, tfoot, tr, td, th, caption, blockquote, figure, figcaption, label, summary, pre, code, strong, em, b, i, small, mark, span';

export const EDIT_HOST_NODE_SELECTOR = [
  '[data-od-sandbox-shim]',
  '[data-od-deck-bridge]',
  '[data-od-comment-bridge]',
  '[data-od-edit-bridge]',
  '[data-od-comment-bridge-style]',
  '[data-od-edit-bridge-style]',
  '[data-od-deck-fix]',
].join(',');

export const EDIT_SOURCE_PATH_ATTR = 'data-od-source-path';

/**
 * Determine whether an element is a "visible target" — not a script/style
 * tag, has dimensions, and is not display:none / visibility:hidden.
 * TypeScript version of the embedded JS `visibleTarget()`.
 */
export function isVisibleTarget(el: Element): boolean {
  if (!el || !el.getBoundingClientRect) return false;
  if (el === document.documentElement || el === document.body) return false;
  const tag = el.tagName ? el.tagName.toLowerCase() : '';
  if (/^(script|style|template|meta|link|title|noscript)$/.test(tag)) return false;
  try {
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;
    const cs = window.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.pointerEvents === 'none') return false;
  } catch {
    return false;
  }
  return true;
}

/**
 * Heuristic: is this element "meaningful" enough to be a fallback selection
 * target when no explicit data-od-id / data-od-source-path annotation exists?
 *
 * Mirrors the embedded JS `meaningfulDomFallbackTarget()` in srcdoc.ts.
 */
export function meaningfulDomFallbackTarget(el: Element): boolean {
  if (!isVisibleTarget(el)) return false;

  const tag = el.tagName ? el.tagName.toLowerCase() : '';

  // Interactive / semantic / heading elements are always meaningful
  if (/^(a|button|input|textarea|select|label|img|video|canvas|h1|h2|h3|h4|h5|h6|p|li|td|th)$/.test(tag)) {
    return true;
  }

  // Elements with ARIA / accessibility annotations
  if (el.getAttribute && (el.getAttribute('role') || el.getAttribute('aria-label') || el.getAttribute('title'))) {
    return true;
  }

  // SVG elements need a role or label
  if (tag === 'svg') {
    return !!(el.getAttribute && (el.getAttribute('role') || el.getAttribute('aria-label') || el.getAttribute('title')));
  }

  const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
  if (!text) return false;

  // Inline text containers
  if (/^(span|strong|em|b|i|small|code|mark)$/.test(tag)) return true;

  // Elements with at most one meaningful child
  let meaningfulChildren = 0;
  for (let child = el.firstElementChild; child; child = child.nextElementSibling) {
    const childTag = child.tagName ? child.tagName.toLowerCase() : '';
    if (/^(script|style|template|meta|link|title|noscript)$/.test(childTag)) continue;
    if (
      (child.textContent || '').replace(/\s+/g, ' ').trim() ||
      /^(img|video|canvas|svg|input|textarea|select)$/.test(childTag)
    ) {
      meaningfulChildren++;
      if (meaningfulChildren > 1) return false;
    }
  }

  return true;
}

/**
 * Build a CSS selector path from `body` down to `el` using `:nth-of-type`.
 * Returns something like `body > div:nth-of-type(3) > p:nth-of-type(1)`.
 * Returns null for body/html or elements with unsupported tags.
 *
 * Mirrors the embedded JS `domSelectorFor()` in srcdoc.ts.
 */
export function domSelectorFor(el: Element): string | null {
  if (!el || !el.tagName || el === document.documentElement || el === document.body) return null;
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== document.documentElement && node !== document.body) {
    const tag = node.tagName ? node.tagName.toLowerCase() : '';
    if (!tag || /^(script|style|template|meta|link|title|noscript)$/.test(tag)) return null;
    const parent: Element | null = node.parentElement;
    if (!parent) return null;
    let index = 1;
    let sibling: Element | null = node.previousElementSibling;
    while (sibling) {
      if (sibling.tagName && sibling.tagName.toLowerCase() === tag) index++;
      sibling = sibling.previousElementSibling;
    }
    parts.unshift(tag + ':nth-of-type(' + index + ')');
    node = parent;
  }
  if (!parts.length) return null;
  return 'body > ' + parts.join(' > ');
}

/**
 * Check if an element has an explicit annotation that source-maps it back
 * to the original artifact source.
 */
export function isSourceMappable(el: Element): boolean {
  if (!el || !el.hasAttribute) return false;
  return el.hasAttribute('data-od-id') || el.hasAttribute(EDIT_SOURCE_PATH_ATTR);
}

/**
 * Check if an element is a meaningful discovery target (matches the standard
 * discovery selector). This mirrors the `MANUAL_EDIT_DISCOVERY_SELECTOR`
 * check used in edit-mode bridges. Pass a custom selector for non-standard uses.
 */
export function isDiscoveryTarget(el: Element, selector?: string): boolean {
  return !!(el && el.matches && el.matches(selector || EDIT_DISCOVERY_SELECTOR));
}

/**
 * Check if an element is a host/internal node that should be excluded from
 * selection (bridge injection elements, etc.).
 */
export function isHostNode(el: Element): boolean {
  return !!(el && el.matches && el.matches(EDIT_HOST_NODE_SELECTOR));
}

/**
 * Build a DOM path index string like "path-0-2-1" for an element,
 * excluding host nodes.
 */
export function domPathForElement(el: Element): string {
  const parts: number[] = [];
  let node: Element | null = el;
  while (node && node !== node.ownerDocument.body) {
    const parentEl: Element | null = node.parentElement;
    if (!parentEl) break;
    const children = Array.from(parentEl.children).filter((child) => !isHostNode(child));
    parts.unshift(children.indexOf(node));
    node = parentEl;
  }
  return parts.length ? `path-${parts.join('-')}` : '';
}

/**
 * Generate a stable ID for an element. Tries explicit attributes first,
 * then falls back to the DOM path.
 */
export function stableIdForElement(el: Element): string {
  const explicit = el.getAttribute('data-od-id');
  if (explicit) return explicit;
  const generated = el.getAttribute(EDIT_SOURCE_PATH_ATTR) || el.getAttribute('data-od-runtime-id') || domPathForElement(el);
  if (generated) el.setAttribute('data-od-runtime-id', generated);
  return generated || 'unknown';
}

/**
 * Embedded JavaScript source: `meaningfulDomFallbackTarget()` function.
 * Inlined by both bridge builders so the sandboxed iframe can use DOM
 * heuristics to find targets without data-od-id annotations.
 */
export function buildMeaningfulDomFallbackJs(): string {
  return `function meaningfulDomFallbackTarget(el){
  if(!el || !el.getBoundingClientRect) return false;
  if(el===document.documentElement||el===document.body) return false;
  var t=(el.tagName?el.tagName.toLowerCase():'');
  if(/^(script|style|template|meta|link|title|noscript)$/.test(t)) return false;
  try{
    var r=el.getBoundingClientRect();
    if(r.width<1||r.height<1) return false;
    var cs=window.getComputedStyle(el);
    if(cs.display==='none'||cs.visibility==='hidden'||cs.pointerEvents==='none') return false;
  }catch(e){return false}
  if(/^(a|button|input|textarea|select|label|img|video|canvas|h1|h2|h3|h4|h5|h6|p|li|td|th)$/.test(t)) return true;
  if(el.getAttribute&&(el.getAttribute('role')||el.getAttribute('aria-label')||el.getAttribute('title'))) return true;
  if(t==='svg') return !!(el.getAttribute&&(el.getAttribute('role')||el.getAttribute('aria-label')||el.getAttribute('title')));
  var text=(el.textContent||'').replace(/\\s+/g,' ').trim();
  if(!text) return false;
  if(/^(span|strong|em|b|i|small|code|mark)$/.test(t)) return true;
  var mc=0;
  for(var c=el.firstElementChild;c;c=c.nextElementSibling){
    var ct=c.tagName?c.tagName.toLowerCase():'';
    if(/^(script|style|template|meta|link|title|noscript)$/.test(ct)) continue;
    if((c.textContent||'').replace(/\\s+/g,' ').trim()||/^(img|video|canvas|svg|input|textarea|select)$/.test(ct)){mc++;if(mc>1) return false}
  }
  return true;
}`;
}

/**
 * Embedded JavaScript source: `domSelectorFor()` function.
 * Generates a CSS path like `body > div:nth-of-type(3) > p:nth-of-type(1)`.
 */
export function buildDomSelectorForJs(): string {
  return `function domSelectorFor(el){
  if(!el||!el.tagName||el===document.documentElement||el===document.body) return null;
  var parts=[],node=el;
  while(node&&node!==document.documentElement&&node!==document.body){
    var tag=(node.tagName?node.tagName.toLowerCase():'');
    if(!tag||/^(script|style|template|meta|link|title|noscript)$/.test(tag)) return null;
    var p=node.parentElement;if(!p) return null;
    var idx=1,sib=node.previousElementSibling;
    while(sib){if(sib.tagName&&sib.tagName.toLowerCase()===tag) idx++;sib=sib.previousElementSibling}
    parts.unshift(tag+':nth-of-type('+idx+')');
    node=p;
  }
  return parts.length?'body > '+parts.join(' > '):null;
}`;
}
