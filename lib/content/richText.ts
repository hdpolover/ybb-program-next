import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  'span',
  'ul',
  'ol',
  'li',
  'a',
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
};

const ALLOWED_CLASSES: sanitizeHtml.IOptions['allowedClasses'] = {
  '*': ['ql-align-justify', 'ql-align-center', 'ql-align-right'],
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
