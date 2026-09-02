import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'span',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'code',
  'pre',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions['allowedAttributes'] = {
  '*': ['class'],
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height'],
};

const ALLOWED_CLASSES: sanitizeHtml.IOptions['allowedClasses'] = {
  '*': ['ql-align-justify', 'ql-align-center', 'ql-align-right'],
};

// Images have no legitimate use for mailto:/data:, unlike links.
const ALLOWED_SCHEMES_BY_TAG: sanitizeHtml.IOptions['allowedSchemesByTag'] = {
  img: ['http', 'https'],
};

export function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&');
}

export function isRichTextHtml(value?: string | null): boolean {
  if (!value?.trim()) return false;
  return /<\/?[a-z][\s\S]*>/i.test(decodeHtmlEntities(value));
}

export function sanitizeRichTextHtml(value?: string | null): string {
  if (!value?.trim()) return '';

  return sanitizeHtml(decodeHtmlEntities(value), {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedClasses: ALLOWED_CLASSES,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: ALLOWED_SCHEMES_BY_TAG,
    parseStyleAttributes: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
          target: attribs.target === '_blank' ? '_blank' : '_self',
        },
      }),
    },
  });
}

export function richTextToPlainText(value?: string | null): string {
  if (!value?.trim()) return '';

  return sanitizeHtml(decodeHtmlEntities(value), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, ' ')
    .trim();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Renders plain text with a small set of markdown-like conventions (headings,
 * lists, bold/italic/code, links) as HTML. Input is escaped first, so the
 * output only ever contains the tags this function itself introduces. */
export function markdownToHtml(value: string): string {
  const escaped = escapeHtml(value);
  const withBlocks = escaped
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>');

  const withInline = withBlocks
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

  const groupedLists = withInline.replace(/(?:<li>.*<\/li>\n?)+/g, (chunk) => `<ul>${chunk}</ul>`);
  const paragraphs = groupedLists
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith('<h') || block.startsWith('<ul>')) return block;
      return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');

  return paragraphs || (escaped ? `<p>${escaped}</p>` : '');
}

/** Renders a possibly-encoded, possibly-plain-text value as sanitized HTML:
 * decodes entities, converts markdown-like plain text to HTML when the value
 * isn't HTML already, then sanitizes the result. */
export function toRichTextHtml(value?: string | null): string {
  const raw = decodeHtmlEntities((value ?? '').trim());
  if (!raw) return '';

  const html = isRichTextHtml(raw) ? raw : markdownToHtml(raw);
  return sanitizeRichTextHtml(html);
}
