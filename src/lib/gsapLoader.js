/**
 * Centralized GSAP dynamic loader utility
 * Provides consistent GSAP import pattern across the application
 */

let gsapInstance = null;

/**
 * Load and return the GSAP instance
 * Caches the instance after first load for reuse
 * @returns {Promise<object>} - The GSAP instance
 */
export async function loadGsap() {
  if (gsapInstance) {
    return gsapInstance;
  }

  const { gsap } = await import('gsap');
  gsapInstance = gsap;
  return gsap;
}
