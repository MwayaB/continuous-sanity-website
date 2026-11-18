import { useEffect, useRef, useState } from 'react';
import { getAnalyticsConsent, saveAnalyticsConsent, startAnalytics, type AnalyticsConsent } from '@/lib/analytics';
import { captureCampaignAttribution } from '@/lib/campaign-attribution';

export function AnalyticsPreferences() {
  const [visible, setVisible] = useState(() => getAnalyticsConsent() === null);
  const opener = useRef<HTMLButtonElement>(null);
  const reject = useRef<HTMLButtonElement>(null);
  useEffect(() => { startAnalytics(); }, []);
  const choose = (value: AnalyticsConsent) => {
    saveAnalyticsConsent(value);
    if (value === 'accepted') captureCampaignAttribution();
    setVisible(false);
    opener.current?.focus();
  };
  return <div className="cs-brand">
    <div className="analytics-settings"><button ref={opener} type="button" aria-controls="analytics-preferences" aria-expanded={visible} onClick={() => { setVisible(true); requestAnimationFrame(() => reject.current?.focus()); }}>Analytics preferences</button></div>
    {visible && <section id="analytics-preferences" className="analytics-banner" aria-labelledby="analytics-heading">
      <h2 id="analytics-heading">Optional analytics</h2>
      <p>With your permission, Google Analytics helps us measure visits and demo or pilot clicks. It may use cookies and process device and usage data. Booking and pilot links work either way. <a href="/privacy">Privacy details</a>.</p>
      <div className="analytics-actions"><button ref={reject} type="button" onClick={() => choose('rejected')}>Reject analytics</button><button type="button" onClick={() => choose('accepted')}>Accept analytics</button></div>
    </section>}
  </div>;
}
