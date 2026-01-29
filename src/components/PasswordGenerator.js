'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateSecurePassword } from '../lib/passwordGenerator';
import { loadGsap } from '../lib/gsapLoader';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });
  const [copyStatus, setCopyStatus] = useState('idle');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const passwordRef = useRef(null);
  const gsapRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('passwordPrefs');
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        if (typeof prefs.length === 'number') setLength(prefs.length);
        if (prefs.options && typeof prefs.options === 'object') {
          setOptions((prev) => ({ ...prev, ...prefs.options }));
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const prefs = { length, options };
    localStorage.setItem('passwordPrefs', JSON.stringify(prefs));
  }, [length, options]);

  useEffect(() => {
    const runAnimation = async () => {
      const gsap = await loadGsap();
      gsapRef.current = gsap;

      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: 'power2.out' }
        );
      }
    };
    runAnimation();
  }, []);

  const generatePassword = useCallback((skipAnimation = false) => {
    const newPassword = generateSecurePassword(length, options);

    if (!newPassword) return;

    if (skipAnimation) {
      setPassword(newPassword);
      setCopyStatus('idle');
      return;
    }

    setIsGenerating(true);

    if (gsapRef.current && passwordRef.current) {
      gsapRef.current.fromTo(
        passwordRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', onComplete: () => setIsGenerating(false) }
      );
    } else {
      setIsGenerating(false);
    }

    setPassword(newPassword);
    setCopyStatus('idle');
  }, [length, options]);

  // Regenerate password when length changes (if password exists)
  useEffect(() => {
    if (password) {
      const newPassword = generateSecurePassword(length, options);
      if (newPassword) {
        setPassword(newPassword);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length]);

  const copyToClipboard = async () => {
    if (!password || isGenerating) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopyStatus('success');

      if (gsapRef.current && passwordRef.current) {
        gsapRef.current.to(passwordRef.current, {
          scale: 1.01,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
      }
    } catch {
      setCopyStatus('error');
    }

    setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const getLengthClass = () => {
    if (length <= 8) return 'length-xs';
    if (length <= 14) return 'length-sm';
    if (length <= 20) return 'length-md';
    if (length <= 26) return 'length-lg';
    return 'length-xl';
  };

  const isDisabled = !options.lowercase && !options.uppercase && !options.numbers && !options.symbols;

  return (
    <div ref={containerRef} className="generator-container" style={{ opacity: 0 }}>
      {/* Mouse gradient glow */}
      <div
        className="mouse-glow"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />
      {/* Header */}
      <header className="site-header">
        <div className="site-brand">
          <img src="/favicon.svg" alt="Password Generator" className="site-logo" />
          <span className="site-brand-text">jpars-dev</span>
        </div>
        <button className="site-about" onClick={() => setShowAbout(true)}>
          About
        </button>
      </header>

      {/* About Modal */}
      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAbout(false)}>
              &times;
            </button>
            <div className="modal-header">
              <img src="/favicon.svg" alt="Password Generator Logo" className="modal-logo" />
              <span className="modal-brand">jpars-dev</span>
            </div>
            <p className="modal-text">
              A refined password generator with no memory. Your passwords are generated locally in your browser and never stored or sent anywhere. Something useful, thoughtfully made.
            </p>
            <p className="modal-credit">
              Created by <a href="https://justinparsons.com" target="_blank" rel="noopener noreferrer">Justin Parsons</a>
            </p>
            <div className="modal-links">
              <a href="https://github.com/jpars-dev" target="_blank" rel="noopener noreferrer" title="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/justinctparsons/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://justinparsons.com" target="_blank" rel="noopener noreferrer" title="Website">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Password Display - Full Screen Hero */}
      <div
        className="password-hero"
        onClick={() => password && !isGenerating && copyToClipboard()}
      >
        {password ? (
          <>
            <div ref={passwordRef} className={`password-display ${getLengthClass()}`}>
              {password}
            </div>
            <div className={`copy-indicator ${copyStatus === 'success' ? 'success' : ''}`}>
              {copyStatus === 'success' ? 'Copied' : 'Click anywhere to copy'}
            </div>
          </>
        ) : (
          <div className="password-placeholder" onClick={(e) => { e.stopPropagation(); generatePassword(); }}>
            <span className="placeholder-text">Generate Password</span>
          </div>
        )}
      </div>

      {/* Minimal Bottom Controls */}
      <div className="controls-bar">
        <div className="controls-left">
          <button
            className="generate-btn"
            onClick={generatePassword}
            disabled={isDisabled || isGenerating}
          >
            {password ? 'New' : 'Generate'}
          </button>
        </div>

        <div className="controls-center">
          <div className="length-control">
            <span className="control-label">Length</span>
            <input
              type="range"
              min={4}
              max={32}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="length-slider"
            />
            <span className="length-value">{length}</span>
          </div>
        </div>

        <div className="controls-right">
          <span className="control-label">Include</span>
          <button
            className={`option-btn ${options.lowercase ? 'active' : ''}`}
            onClick={() => setOptions({ ...options, lowercase: !options.lowercase })}
            title="Lowercase"
          >
            az
          </button>
          <button
            className={`option-btn ${options.uppercase ? 'active' : ''}`}
            onClick={() => setOptions({ ...options, uppercase: !options.uppercase })}
            title="Uppercase"
          >
            AZ
          </button>
          <button
            className={`option-btn ${options.numbers ? 'active' : ''}`}
            onClick={() => setOptions({ ...options, numbers: !options.numbers })}
            title="Numbers"
          >
            09
          </button>
          <button
            className={`option-btn ${options.symbols ? 'active' : ''}`}
            onClick={() => setOptions({ ...options, symbols: !options.symbols })}
            title="Symbols"
          >
            #$
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
