export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
] as const;

const STORAGE_KEY = 'continuous_sanity_campaign';

export type CampaignAttribution = Partial<Record<(typeof UTM_KEYS)[number], string>>;
export type DemoCtaLocation = 'hero' | 'nav' | 'footer';

function readCampaign(search: string): CampaignAttribution {
  const params = new URLSearchParams(search);

  return Object.fromEntries(
    UTM_KEYS.flatMap((key) => {
      const value = params.get(key)?.trim();
      return value ? [[key, value]] : [];
    }),
  );
}

export function captureCampaignAttribution(): CampaignAttribution {
  const campaign = readCampaign(window.location.search);

  try {
    if (Object.keys(campaign).length > 0) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
      return campaign;
    }

    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CampaignAttribution) : {};
  } catch {
    // Attribution should never interfere with navigation if storage is unavailable.
    return campaign;
  }
}

export function appendCampaignToUrl(url: string, campaign: CampaignAttribution): string {
  const destination = new URL(url);

  for (const key of UTM_KEYS) {
    const value = campaign[key];
    if (value) destination.searchParams.set(key, value);
  }

  return destination.toString();
}

export function trackDemoCtaClick(
  campaign: CampaignAttribution,
  location: DemoCtaLocation,
): void {
  const detail = {
    source: campaign.utm_source ?? null,
    medium: campaign.utm_medium ?? null,
    campaign: campaign.utm_campaign ?? null,
    content: campaign.utm_content ?? null,
    location,
  };

  window.dispatchEvent(new CustomEvent('demo_cta_clicked', { detail }));

  const endpoint = import.meta.env.VITE_CAMPAIGN_EVENT_ENDPOINT;
  if (!endpoint) return;

  const body = JSON.stringify({ event: 'demo_cta_clicked', properties: detail });
  if (navigator.sendBeacon?.(endpoint, new Blob([body], { type: 'application/json' }))) return;

  void fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics failure must not block the Calendly navigation.
  });
}
