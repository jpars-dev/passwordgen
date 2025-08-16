'use client';

import { useState, useEffect, useRef } from 'react';
import Toggle from './Toggle';
import Slider from './Slider';
import { trackPasswordGeneration, trackCopyToClipboard } from '../lib/gtag';

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: `!@#$%^&*()-_=+[]{}|;:'",./<>?`,
};

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });
  const [copyStatus, setCopyStatus] = useState('idle');

  const cardRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordInputRef = useRef(null);
  const controlsRef = useRef(null);
  const gsapRef = useRef(null);

  useEffect(() => {
    import('gsap').then((mod) => {
      gsapRef.current = mod.gsap || mod.default || mod;
    });
  }, []);

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
    const prefs = {
      length,
      options,
    };
    localStorage.setItem('passwordPrefs', JSON.stringify(prefs));
  }, [length, options]);

  useEffect(() => {
    // Create a MutationObserver to watch for the --can-animate property
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const canAnimate = mutation.target.style.getPropertyValue('--can-animate');
          if (canAnimate === 'true') {
            // Start animations after title animation
            gsapRef.current?.fromTo(cardRef.current,
              { y: 50, opacity: 0 },
              { duration: 0.8, y: 0, opacity: 1, ease: 'power3.out' }
            );

            gsapRef.current?.fromTo(controlsRef.current.children,
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
    const activeSets = Object.entries(options)
      .filter(([, enabled]) => enabled)
      .map(([key]) => CHAR_SETS[key]);

    if (activeSets.length === 0) {
      setPassword('Please select at least one character type');
      return;
    }

    const passwordChars = [];

    // Ensure at least one character from each active set
    activeSets.forEach((set) => {
      const randIndex = crypto.getRandomValues(new Uint32Array(1))[0] % set.length;
      passwordChars.push(set[randIndex]);
    });

    const allChars = activeSets.join('');
    const remainingLength = length - passwordChars.length;
    const randomValues = new Uint32Array(remainingLength);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = randomValues[i] % allChars.length;
      passwordChars.push(allChars[randomIndex]);
    }

    // Shuffle the result to avoid predictable positions
    for (let i = passwordChars.length - 1; i > 0; i--) {
      const randIndex = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
      [passwordChars[i], passwordChars[randIndex]] = [
        passwordChars[randIndex],
        passwordChars[i],
      ];
    }

    const generatedPassword = passwordChars.join('');

    setPassword(generatedPassword);
    setCopyStatus('idle');

    trackPasswordGeneration({
      length,
      options,
    });

    // Animation for password change
    gsapRef.current?.fromTo(
      passwordRef.current,
      { scale: 0.95, opacity: 0.5 },
      { duration: 0.3, scale: 1, opacity: 1, ease: 'power2.out' }
    );
  };

  const copyToClipboard = async () => {
    if (!password || password === 'Please select at least one character type') return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(password);
      } else {
        const input = passwordInputRef.current;
        input.focus();
        input.select();
        const successful = document.execCommand('copy');
        window.getSelection().removeAllRanges();
        if (!successful) {
          throw new Error('Fallback copy command failed');
        }
      }

      setCopyStatus('success');

      trackCopyToClipboard();

      // Animation for copy success
      gsapRef.current?.fromTo(passwordRef.current,
        { scale: 1 },
        { duration: 0.2, scale: 1.05, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
    } catch (err) {
      console.error('Failed to copy password:', err);
      setCopyStatus('error');
    }

    setTimeout(() => setCopyStatus('idle'), 2000);
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
            ref={passwordInputRef}
          />
          <button
            className={`btn btn-sm absolute right-1 top-1 ${
              copyStatus === 'success'
                ? 'btn-success'
                : copyStatus === 'error'
                ? 'btn-error'
                : 'btn-primary'
            }`}
            onClick={copyToClipboard}
          >
            {copyStatus === 'success'
              ? 'Copied!'
              : copyStatus === 'error'
              ? 'Failed'
              : 'Copy'}
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
              checked={options.lowercase}
              onChange={(e) =>
                setOptions({ ...options, lowercase: e.target.checked })
              }
            />

            <Toggle
              label="Include Uppercase"
              checked={options.uppercase}
              onChange={(e) =>
                setOptions({ ...options, uppercase: e.target.checked })
              }
            />

            <Toggle
              label="Include Numbers"
              checked={options.numbers}
              onChange={(e) =>
                setOptions({ ...options, numbers: e.target.checked })
              }
            />

            <Toggle
              label="Include Symbols"
              checked={options.symbols}
              onChange={(e) =>
                setOptions({ ...options, symbols: e.target.checked })
              }
            />
          </div>
        </div>

        <button
          className="btn btn-primary mt-6 text-lg"
          onClick={generatePassword}
          disabled={
            !options.lowercase &&
            !options.uppercase &&
            !options.numbers &&
            !options.symbols
          }
        >
          Generate Password
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
