'use client';


export default function SocialIcon({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center border border-brand-fg rounded-lg bg-transparent text-brand-fg hover:bg-brand-fg hover:text-brand-bg transition-colors duration-300"
    >
      {children}
    </a>
  );
}