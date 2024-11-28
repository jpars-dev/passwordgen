'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PasswordGenerator from '../components/PasswordGenerator';

export default function Home() {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const footerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Create a timeline for sequential animations
    const tl = gsap.timeline();

    // Title animation first
    tl.fromTo(titleRef.current, 
      { y: -50, opacity: 0 },
      { duration: 1, y: 0, opacity: 1, ease: 'power3.out' }
    )
    // Then trigger content animation
    .to(contentRef.current, {
      duration: 0,
      onComplete: () => {
        contentRef.current.style.setProperty('--can-animate', 'true');
      }
    })
    // Finally animate the footer
    .fromTo(footerRef.current,
      { y: 20, opacity: 0 },
      { duration: 0.5, y: 0, opacity: 1, ease: 'power2.out' }
    );
  }, []);

  return (
    <main className="min-h-screen p-8 relative overflow-hidden">
      <div 
        className="pointer-events-none absolute inset-0 transition-transform duration-200"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 50%)`,
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <h1 ref={titleRef} className="text-4xl font-bold mb-12 mt-8 text-center" style={{ opacity: 0 }}>
          THE PASSWORD CREATOR <span className="text-2xl">by jp</span>
        </h1>
        
        <div ref={contentRef}>
          <PasswordGenerator />
        </div>
        
        <footer ref={footerRef} className="mt-12 text-center text-sm text-gray-500" style={{ opacity: 0 }}>
          An experiment by <a href="https://justinparsons.com" target="_blank" rel="noopener noreferrer" className="link link-hover underline">Justin Parsons</a>
        </footer>
      </div>
    </main>
  );
}
