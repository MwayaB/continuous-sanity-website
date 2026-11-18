# Landing-page analytics

GA4 measurement ID: `G-ZECW06BNSX`. The Google tag is loaded directly, only after
analytics acceptance. The provided GTM container `GTM-NCTDBP5Z` is deliberately not
loaded, avoiding a second installation of the same Analytics tag. No Clarity script
is installed.

## Events

- `page_view`: Google's configuration event, after acceptance.
- `demo_cta_clicked`: source, medium, campaign, content, location (hero/nav/footer).
- `pilot_cta_clicked`: same properties, location footer.

Demo events continue using the existing first-party endpoint after acceptance.
Pilot events go only to GA4; the backend's allowlist has not been changed.
Campaign values must never contain names, email addresses or other personal data.
Our page-view configuration sends only the pathname, four allowed UTM parameters
and referring origin, omitting other query strings and referrer paths.

## Consent

Before acceptance there are no Google Analytics requests, first-party analytics
events or campaign session-storage writes. Current URL attribution still reaches
Calendly. Accept/Reject have equal prominence; the choice is remembered for 180 days.
If local storage is blocked, the preference works in memory for the page lifetime.
Analytics preferences remain available at the bottom of every page.

Advertising consent defaults to denied and remains denied. Google Signals and ad
personalisation signals are disabled in the tag configuration. Analytics cookies
are configured with a 180-day lifetime. Withdrawal removes readable `_ga` cookies
for the hostname and parent domains, clears tab attribution and reloads to stop
the running Google tag. It cannot erase previously collected data or inaccessible
cookies.

## GA4 property checks before production

1. Verify this stream belongs to Continuous Sanity, not Chikwama.
2. In Realtime/DebugView, verify page views and both CTA events after consent.
3. Register event-scoped custom dimensions for `location`, `source`, `medium`,
   `campaign` and `content` if needed in reports. Built-in campaign dimensions are separate.
4. Review Enhanced Measurement; disable form interaction and other unneeded
   automatic events. Keep Google Signals and advertising features disabled.
5. Select the minimum required retention period and update the privacy notice with
   the actual property setting. Retention of first-party backend records is separate.
6. Do not add the GTM/GA snippets elsewhere: that could bypass consent or double-count.

The frontend does not certify the remote property's settings or backend log retention.
