'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Toggle from './Toggle';
import Slider from './Slider';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeLowercase, setIncludeLowercase] = useState(false);
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardRef = useRef(null);
  const passwordRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    // Create a MutationObserver to watch for the --can-animate property
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const canAnimate = mutation.target.style.getPropertyValue('--can-animate');
          if (canAnimate === 'true') {
            // Start animations after title animation
            gsap.fromTo(cardRef.current,
              { y: 50, opacity: 0 },
              { duration: 0.8, y: 0, opacity: 1, ease: 'power3.out' }
            );

            gsap.fromTo(controlsRef.current.children,
              { y: 20, opacity: 0 },
              { 
                duration: 0.5,
                y: 0,
                opacity: 1,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.4
              }
            );

            // Disconnect the observer as we don't need it anymore
            observer.disconnect();
          }
        }
      });
    });

    // Start observing the parent element for style changes
    observer.observe(cardRef.current.parentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => observer.disconnect();
  }, []);

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:\'",./<>?';

    let chars = '';
    if (includeLowercase) chars += lowercase;
    if (includeUppercase) chars += uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === '') {
      setPassword('Please select at least one character type');
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      generatedPassword += chars[randomIndex];
    }

    setPassword(generatedPassword);
    setCopied(false);

    // Animation for password change
    gsap.fromTo(passwordRef.current,
      { scale: 0.95, opacity: 0.5 },
      { duration: 0.3, scale: 1, opacity: 1, ease: 'power2.out' }
    );
  };

  const copyToClipboard = async () => {
    if (!password || password === 'Please select at least one character type') return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      
      // Animation for copy success
      gsap.fromTo(passwordRef.current,
        { scale: 1 },
        { 
          duration: 0.2,
          scale: 1.02,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out'
        }
      );
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  return (
    <div ref={cardRef} className="card bg-base-100 shadow-xl w-full max-w-2xl mx-auto" style={{ opacity: 0 }}>
      <div className="card-body">
        <div className="relative" ref={passwordRef}>
          <input
            type="text"
            className="input input-bordered w-full pr-20 text-lg"
            value={password}
            readOnly
            placeholder="Generated password"
          />
          <button
            className={`btn btn-sm absolute right-1 top-1 ${
              copied ? 'btn-success' : 'btn-primary'
            }`}
            onClick={copyToClipboard}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div ref={controlsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Slider
              label="Password Length"
              value={length}
              onChange={setLength}
              min={4}
              max={75}
            />
          </div>

          <div className="space-y-4">
            <Toggle
              label="Include Lowercase"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
            />

            <Toggle
              label="Include Uppercase"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
            />

            <Toggle
              label="Include Numbers"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />

            <Toggle
              label="Include Symbols"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
          </div>
        </div>

        <button
          className="btn btn-primary mt-6 text-lg"
          onClick={generatePassword}
        >
          Generate Password
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
