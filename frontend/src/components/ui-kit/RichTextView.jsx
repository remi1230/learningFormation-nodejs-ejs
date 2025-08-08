// src/components/RichTextView.jsx
import DOMPurify from 'dompurify';

export default function RichTextView({ html = '' }) {
  const safe = DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ['class', 'style', 'href', 'target', 'src', 'alt'],
  });
  return (
    <div
      className="[&>img]:mx-auto [&>img]:block"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}