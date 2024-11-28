// Google Analytics measurement ID
export const GA_MEASUREMENT_ID = 'G-80XDK2LWK0'

// Log page views
export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Log specific events
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Track password generation events
export const trackPasswordGeneration = (options) => {
  event({
    action: 'generate_password',
    category: 'engagement',
    label: JSON.stringify(options),
  })
}

// Track copy to clipboard events
export const trackCopyToClipboard = () => {
  event({
    action: 'copy_password',
    category: 'engagement',
    label: 'clipboard',
  })
}