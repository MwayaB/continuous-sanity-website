import { useEffect, type ReactNode } from "react";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnalyticsPreferences } from "@/components/analytics-consent";
import LandingPage from "@/components/landing-page";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Privacy() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Landing-page privacy | Continuous Sanity";
    return () => {
      document.title = previous;
    };
  }, []);
  return (
    <div className="cs-brand min-h-screen bg-[var(--cs-canvas)]">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <a href="/" className="underline underline-offset-4">
          Back to Continuous Sanity
        </a>
        <h1 className="mt-10 text-4xl font-semibold">Landing-page privacy</h1>
        <div className="mt-8 space-y-6 leading-7 text-[var(--cs-muted)]">
          <p>
            This notice describes optional analytics and campaign attribution on
            the Continuous Sanity landing page.
          </p>
          <h2 className="text-xl font-semibold">Campaign attribution</h2>
          <p>
            When analytics is accepted, we retain utm_source, utm_medium,
            utm_campaign and utm_content in session storage for the current
            browser tab. Current-link campaign parameters can still be passed to
            Calendly without accepting analytics.
          </p>
          <p>
            With permission, demo-click events are sent to our first-party
            campaign endpoint and Google Analytics. They contain the campaign
            source, medium, campaign, content and button location.
          </p>
          <h2 className="text-xl font-semibold">
            Google Analytics and your choice
          </h2>
          <p>
            Google Analytics loads only after you accept analytics. It measures
            page views, device and usage information and demo or pilot clicks,
            and may use analytics cookies. Advertising consent remains denied.
            We do not enable Google Signals or ad personalisation in our tag
            configuration.
          </p>
          <p>
            We remember your choice locally for up to 180 days. You can change
            it using Analytics preferences at the bottom of the page. Rejecting
            stops our analytics events, clears tab attribution and accessible
            Google Analytics cookies, and reloads the page if analytics was
            already loaded. It does not delete previously collected server-side
            data.
          </p>
          <p>
            Google Analytics retention is controlled in our Analytics property.
            See{" "}
            <a
              href="https://policies.google.com/privacy"
              className="underline underline-offset-4"
            >
              Google's privacy policy
            </a>{" "}
            for Google's processing, or contact us about retained data.
          </p>
          <h2 className="text-xl font-semibold">
            External services and contact
          </h2>
          <p>
            Bookings take place on Calendly, where its privacy terms apply. Run
            a pilot opens the separate Continuous Sanity application; this
            notice does not describe data collected during product testing
            sessions.
          </p>
          <p>
            For privacy questions, email{" "}
            <a
              className="underline underline-offset-4"
              href="mailto:hello@continuoussanity.com"
            >
              hello@continuoussanity.com
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <AnalyticsPreferences />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
