export type AnalyticsConsent = 'accepted' | 'rejected';
const CONSENT_KEY = 'cs_analytics_consent_v1';
const MEASUREMENT_ID = 'G-ZECW06BNSX';
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
let choice: AnalyticsConsent | null | undefined;
let started = false;

declare global {
  interface Window { dataLayer?: unknown[]; }
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  if (choice !== undefined) return choice;
  try {
    const value = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null');
    choice = value && (value.choice === 'accepted' || value.choice === 'rejected') &&
      typeof value.at === 'number' && Date.now() - value.at < MAX_AGE ? value.choice : null;
  } catch { choice = null; }
  return choice ?? null;
}

function command(..._args: unknown[]) {
  // Google consent commands use an Arguments object, not an event object.
  (window.dataLayer ??= []).push(arguments);
}

export function startAnalytics() {
  if (getAnalyticsConsent() !== 'accepted' || started) return;
  started = true;
  command('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  });
  command('consent', 'update', { analytics_storage: 'granted' });
  const page = new URL(location.origin + location.pathname);
  const current = new URLSearchParams(location.search);
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
    const value = current.get(key);
    if (value) page.searchParams.set(key, value.slice(0, 200));
  }
  let referrer = '';
  try { if (document.referrer) referrer = new URL(document.referrer).origin; } catch { /* Ignore invalid referrers. */ }
  command('js', new Date());
  command('config', MEASUREMENT_ID, {
    page_location: page.toString(), page_referrer: referrer,
    allow_google_signals: false, allow_ad_personalization_signals: false,
    cookie_expires: 60 * 60 * 24 * 180,
  });
  const script = document.createElement('script');
  script.id = 'cs-google-analytics';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function saveAnalyticsConsent(value: AnalyticsConsent) {
  choice = value;
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice: value, at: Date.now() })); } catch { /* Use the choice in memory if storage is blocked. */ }
  if (value === 'accepted') startAnalytics();
  else {
    try { sessionStorage.removeItem('continuous_sanity_campaign'); } catch { /* Storage may be blocked. */ }
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) continue;
      const host = location.hostname.split('.');
      document.cookie = `${name}=; Max-Age=0; path=/`;
      while (host.length > 1) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${host.join('.')}`;
        host.shift();
      }
    }
    // Reload to stop an already loaded container and its listeners.
    if (started) location.reload();
  }
}

export function trackAnalyticsEvent(event: string, properties: Record<string, unknown>) {
  if (getAnalyticsConsent() !== 'accepted') return;
  startAnalytics();
  command('event', event, properties);
}
