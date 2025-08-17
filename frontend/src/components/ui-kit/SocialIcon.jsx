'use client';


export default function SocialIcon({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center
      border rounded-lg bg-transparent
      hover:bg-base-300 transition-colors duration-300"
    >
      {children}
    </a>
  );
}