'use client';
import { Link } from 'react-router-dom'

export default function SocialIcon({ to, children }) {
  return (
    <Link
      to={to}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center
      border rounded-lg bg-transparent
      hover:bg-base-300 transition-colors duration-300"
    >
      {children}
    </Link>
  );
}