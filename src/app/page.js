/**
 * @file page.js
 * @description Home page component for the password generator application.
 *
 * This is the main entry point page that renders the PasswordGenerator component.
 * It implements a client-side hydration pattern to prevent hydration mismatches
 * between server and client renders.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/page
 */

'use client';

import { useState, useEffect } from 'react';
import PasswordGenerator from '../components/PasswordGenerator';

/**
 * Home Page Component
 *
 * Renders the password generator application with proper hydration handling.
 *
 * ## Hydration Pattern Explanation
 *
 * This component uses a "mounted" state pattern to handle React hydration:
 *
 * 1. **Initial Server Render**: The component returns `null` because `mounted`
 *    starts as `false`. This means no HTML is generated on the server.
 *
 * 2. **Client Hydration**: When React hydrates on the client, the useEffect
 *    runs and sets `mounted` to `true`, causing a re-render.
 *
 * 3. **Client Render**: Now `mounted` is `true`, so the PasswordGenerator
 *    component renders with full client-side functionality.
 *
 * ### Why This Pattern?
 *
 * The PasswordGenerator component uses:
 * - `localStorage` for persisting preferences (not available on server)
 * - `crypto.getRandomValues` for password generation (server/client mismatch)
 * - Dynamic GSAP imports (client-only animations)
 *
 * Without this pattern, the server-rendered HTML would differ from the
 * client-rendered version, causing React hydration warnings and potential
 * UI inconsistencies.
 *
 * @component
 * @returns {JSX.Element|null} The PasswordGenerator component or null during SSR
 */
export default function Home() {
  /**
   * Tracks whether the component has mounted on the client.
   * False during SSR, true after the first client-side render.
   * @type {[boolean, Function]}
   */
  const [mounted, setMounted] = useState(false);

  /**
   * Effect to mark the component as mounted after initial client render.
   * This runs only once after the component mounts on the client.
   * Empty dependency array ensures it only runs on mount.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null during server-side rendering to prevent hydration mismatch
  // The page will appear blank momentarily until client-side rendering completes
  if (!mounted) return null;

  // Render the password generator only on the client
  return <PasswordGenerator />;
}
