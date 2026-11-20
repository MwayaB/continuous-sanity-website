import { useEffect, useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  CheckCircle2,
  CircleAlert,
  CircleDot,
  Clock3,
  ExternalLink,
  Flag,
  Layers3,
  ListChecks,
  Menu,
  MessageSquare,
  MousePointer2,
  PanelRight,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  appendCampaignToUrl,
  captureCampaignAttribution,
  trackDemoCtaClick,
  type DemoCtaLocation,
} from '@/lib/campaign-attribution';
import NotFound from '@/pages/not-found';
import { AnalyticsPreferences } from '@/components/analytics-consent';
import { trackAnalyticsEvent } from '@/lib/analytics';

const queryClient = new QueryClient();

// Destinations for demo bookings and pilot sessions.
const DEMO_URL = 'https://calendly.com/mwayab/contiuous-sanity-demo';
const PILOT_URL = 'https://app.continuoussanity.com';

function DemoLink({
  location,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { location: DemoCtaLocation }) {
  const [campaign] = useState(captureCampaignAttribution);

  return (
    <a
      {...props}
      href={appendCampaignToUrl(DEMO_URL, campaign)}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) trackDemoCtaClick(campaign, location);
      }}
    />
  );
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  className = '',
  delay = '',
}: {
  children: ReactNode;
  className?: string;
  delay?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${delay} ${className}`}>
      {children}
    </div>
  );
}

function BrandMark({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap" data-testid="brand-continuous-sanity">
      <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
        <img
          src="/assets/continuous-sanity-mark-cropped-v1.png"
          alt=""
          className="block size-full object-contain"
        />
      </span>
      {!compact && (
        <span className={`text-[15px] font-bold leading-none tracking-[-0.04em] ${light ? 'text-[var(--cs-muted)]' : 'text-[var(--cs-navy)]'}`}>
          Continuous Sanity
        </span>
      )}
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cs-border)] bg-[var(--cs-surface)] backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#top" onClick={close} aria-label="Continuous Sanity home" data-testid="link-home"><BrandMark /></a>
        <button ref={trigger} type="button" onClick={() => setOpen(value => !value)} className="flex size-11 items-center justify-center rounded-lg border border-[var(--cs-control-border)] text-[var(--cs-navy)] md:hidden" aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-menu">
          {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
        </button>
        <nav id="primary-navigation" className={`site-navigation ${open ? 'is-open' : ''}`} aria-label="Primary" onKeyDown={event => { if (event.key === 'Escape') { close(); trigger.current?.focus(); } }}>
          <a href="#how-it-works" onClick={close} data-testid="link-how-it-works">How it works</a>
          <a href="#who-its-for" onClick={close} data-testid="link-who-its-for">Who it&apos;s for</a>
          <DemoLink location="nav" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-3" data-testid="link-book-demo-nav">Book a demo <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" /></DemoLink>
        </nav>
      </div>
    </header>
  );
}

function BrowserDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full bg-[var(--cs-surface)]" />
      <span className="size-2 rounded-full bg-[var(--cs-surface)]" />
      <span className="size-2 rounded-full bg-[var(--cs-surface)]" />
    </div>
  );
}

function BrowserMockup() {
  return (
    <div className="browser-shadow relative overflow-hidden rounded-[14px] border border-[var(--cs-border)] bg-[var(--cs-surface)]" data-testid="mockup-hero-browser">
      <p className="mb-3 px-3 pt-2 font-mono text-[10px] leading-4 text-[var(--cs-muted)]">Illustrative product view · example data</p>
      <div className="flex h-10 items-center gap-3 border-b border-[var(--cs-border)] bg-[var(--cs-surface)] px-4">
        <BrowserDots />
        <div className="flex h-6 min-w-0 flex-1 items-center rounded-md border border-[var(--cs-border)] bg-[var(--cs-surface)] cs-illustration-tint px-3 text-[9px] text-[var(--cs-muted)]">
          app.northstar.co / checkout
        </div>
        <div className="flex size-5 items-center justify-center rounded bg-[var(--cs-surface)] cs-illustration-icon text-[var(--cs-navy)]"><Plus size={11} /></div>
      </div>
      <div className="flex h-8 items-center justify-between border-b border-[var(--cs-border)] bg-[var(--cs-surface)] px-4 text-[8px] text-[var(--cs-muted)]">
        <div className="flex items-center gap-4"><span className="font-bold text-[var(--cs-navy)]">NORTHSTAR</span><span>Overview</span><span className="text-[var(--cs-navy)]">Checkout</span><span>Customers</span></div>
        <div className="flex items-center gap-2"><Search size={10} /><span className="size-4 rounded-full bg-[var(--cs-surface)]" /></div>
      </div>
      <div className="grid min-h-[315px] grid-cols-[1fr_194px] sm:min-h-[380px] sm:grid-cols-[1fr_226px]">
        <div className="relative bg-[var(--cs-surface)] px-5 py-6 sm:px-8">
          <div className="mb-5 flex items-start justify-between">
            <div><p className="text-[9px] font-medium text-[var(--cs-muted)]">CHECKOUT / STEP 2 OF 3</p><h3 className="mt-1 text-[17px] font-bold tracking-[-0.04em] text-[var(--cs-navy)] sm:text-[22px]">Confirm your plan</h3></div>
            <span className="rounded-full bg-[var(--cs-surface)] px-2 py-1 text-[8px] font-bold text-[var(--cs-muted)]">Pro</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--cs-border)] bg-white p-3">
              <div className="mb-3 flex items-center justify-between"><span className="text-[9px] font-bold text-[var(--cs-navy)]">Billing details</span><Check size={12} className="text-[var(--cs-muted)] cs-success-icon" /></div>
              <div className="space-y-2"><div className="h-2 w-4/5 rounded bg-[var(--cs-surface)] cs-illustration-tint" /><div className="h-2 w-full rounded bg-[var(--cs-surface)] cs-illustration-tint" /><div className="h-2 w-3/5 rounded bg-[var(--cs-surface)] cs-illustration-tint" /></div>
            </div>
            <div className="rounded-lg border border-[var(--cs-border)] bg-white p-3">
              <div className="mb-3 flex items-center justify-between"><span className="text-[9px] font-bold text-[var(--cs-navy)]">Payment method</span><span className="text-[8px] text-[var(--cs-muted)]">Edit</span></div>
              <div className="flex items-center gap-2 rounded border border-[var(--cs-border)] p-2"><span className="size-4 rounded bg-[var(--cs-surface)]" /><span className="text-[8px] text-[var(--cs-muted)]">••••  4242</span></div>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-[var(--cs-border)] bg-white p-3">
            <div className="mb-3 flex justify-between"><span className="text-[9px] font-bold text-[var(--cs-navy)]">Order summary</span><span className="font-mono text-[9px] text-[var(--cs-muted)]">$148.00 / mo</span></div>
            <div className="flex justify-between border-t border-[var(--cs-border)] pt-2 text-[8px] text-[var(--cs-muted)]"><span>Northstar Pro plan</span><span>$148.00</span></div>
          </div>
          <span className="mt-4 rounded-md bg-[var(--cs-surface)] px-5 py-2 text-[9px] font-bold text-white" data-testid="illustration-mockup-confirm">Confirm and pay</span>
          <div className="pointer-events-none absolute left-[56%] top-[57%] hidden sm:block">
            <div className="absolute -left-2 -top-2 size-4 rounded-full border-2 border-[var(--cs-border)] cs-context-pin-border bg-[var(--cs-surface)] shadow-[0_0_0_5px_rgba(223,123,93,.14)]" />
            <div className="absolute left-4 top-1 h-px w-16 bg-[var(--cs-surface)] cs-context-pin" />
            <div className="absolute left-[78px] -top-3 whitespace-nowrap rounded bg-[var(--cs-surface)] px-2 py-1 text-[8px] font-bold text-[var(--cs-navy)] shadow-sm">Selected for context</div>
          </div>
        </div>
        <div className="border-l border-[var(--cs-border)] bg-[var(--cs-surface)] cs-illustration-tint p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[var(--cs-surface)] cs-active-indicator" /><span className="text-[10px] font-bold text-[var(--cs-navy)]">Continuous Sanity</span></div><PanelRight size={13} className="text-[var(--cs-muted)]" /></div>
          <div className="rounded-lg border border-[var(--cs-border)] bg-white p-3">
            <p className="font-mono text-[7px] uppercase tracking-[.12em] text-[var(--cs-muted)]">Guided session</p>
            <p className="mt-1 text-[11px] font-bold tracking-[-.02em] text-[var(--cs-navy)]">Checkout redesign</p>
            <div className="mt-2 flex items-center gap-1.5 text-[8px] text-[var(--cs-muted)]"><Users size={10} /> First-time customer</div>
          </div>
          <div className="mt-2.5 rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] p-3">
            <div className="flex items-center justify-between"><span className="text-[9px] font-bold text-[var(--cs-navy)]">Submitted observation</span><CircleDot size={12} className="text-[var(--cs-muted)] cs-context-pin-text" /></div>
            <p className="mt-2 text-[9px] leading-[1.45] text-[var(--cs-muted)]">&quot;I expected this to save the card, not charge me yet.&quot;</p>
            <div className="mt-3 flex gap-1.5"><span className="rounded bg-[var(--cs-surface)] cs-feedback-tag px-1.5 py-1 text-[7px] font-bold text-[var(--cs-muted)]">Confusion</span><span className="rounded bg-[var(--cs-surface)] cs-feedback-tag px-1.5 py-1 text-[7px] font-bold text-[var(--cs-muted)]">AI: medium</span></div>
          </div>
          <span className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-[var(--cs-surface)] py-2 text-[9px] font-bold text-white" data-testid="illustration-mockup-capture"><CircleDot size={11} /> Send feedback</span>
          <p className="mt-2 text-[8px] leading-4 text-[var(--cs-muted)]">Widget screenshots: optional, with browser permission.</p>
          <div className="mt-4 border-t border-[var(--cs-border)] pt-3 text-[8px] text-[var(--cs-muted)]"><span className="font-bold text-[var(--cs-muted)]">Available context</span><div className="mt-1.5 grid grid-cols-2 gap-y-1"><span>Page</span><span className="text-right font-mono">/checkout</span><span>Element</span><span className="text-right">Confirm and pay</span><span>Session task</span><span className="text-right">Complete purchase</span></div></div>
        </div>
      </div>
    </div>
  );
}

function SectionKicker({ children }: { children: ReactNode }) {
  return <p className="mb-5 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[.2em] text-[var(--cs-muted)]"><span className="size-1.5 rounded-full bg-[var(--cs-surface)] cs-context-pin" /> {children}</p>;
}

function ProblemSection() {
  const fragments = [
    { label: 'Slack', icon: MessageSquare, tone: 'bg-[var(--cs-surface)]' },
    { label: 'Screenshots', icon: Camera, tone: 'bg-[var(--cs-surface)] cs-feedback-tag' },
    { label: 'Email', icon: ExternalLink, tone: 'bg-[var(--cs-surface)]' },
    { label: 'Spreadsheets', icon: ListChecks, tone: 'bg-[var(--cs-surface)]' },
    { label: 'Calls', icon: Activity, tone: 'bg-[var(--cs-surface)]' },
    { label: 'Jira tickets', icon: Flag, tone: 'bg-[var(--cs-surface)]' },
  ];
  return (
    <section id="problem" className="border-y border-[var(--cs-border)] bg-[var(--cs-surface)]">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:gap-24 lg:px-10 lg:py-32">
        <Reveal>
          <SectionKicker>The familiar gap</SectionKicker>
          <h2 className="max-w-[480px] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.02] tracking-[-.065em] text-[var(--cs-navy)]">Testing happens in the product. <em className="font-serif font-normal text-[var(--cs-muted)]">Keep feedback close to it.</em></h2>
          <p className="mt-7 max-w-[440px] text-[15px] leading-7 text-[var(--cs-muted)]">A tester reports that something feels wrong. Your team still needs to establish which page they meant, what they were commenting on and whether other participants reported something similar.</p>
        </Reveal>
        <Reveal delay="reveal-delay-1">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {fragments.map(({ label, icon: Icon, tone }, index) => (
              <div key={label} className={`group relative flex min-h-[118px] flex-col justify-between rounded-xl border border-[var(--cs-border)] ${tone} p-4 transition-transform duration-300 hover:-translate-y-1`} data-testid={`card-fragment-${index}`}>
                <div className="flex items-center justify-between"><Icon size={17} strokeWidth={1.7} className="text-[var(--cs-muted)]" /><span className="font-mono text-[9px] text-[var(--cs-muted)]">0{index + 1}</span></div>
                <span className="text-[12px] font-bold text-[var(--cs-navy)]">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-4 text-[12px] leading-5 text-[var(--cs-navy)]"><CircleAlert size={16} className="mt-0.5 shrink-0 text-[var(--cs-muted)]" /><p>Continuous Sanity keeps submitted observations and available context together for that review.</p></div>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { number: '01', title: 'Start a session', copy: 'Create a guided or exploratory session. For guided testing, supply a task and persona to frame the exercise.', detail: 'Checkout redesign — first-time customer', icon: Target },
    { number: '02', title: 'Test the actual product', copy: 'Testers use a staging or preview build and deliberately submit observations through the widget or Chrome extension.', detail: 'Embedded widget or Chrome extension', icon: MousePointer2 },
    { number: '03', title: 'Capture feedback in context', copy: 'Keep submitted comments alongside available page and selected-element context, with an optional screenshot.', detail: 'Comment · page · selected element · optional screenshot', icon: CircleDot },
    { number: '04', title: 'Review product evidence', copy: 'AI classifies feedback, suggests severity and can ask one optional clarification question. Review draft findings based on reports within that session.', detail: 'One shared session · findings for human review', icon: Sparkles },
  ];
  return (
    <section id="how-it-works" className="bg-[var(--cs-surface)]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <Reveal className="max-w-2xl"><SectionKicker>From session to signal</SectionKicker><h2 className="text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.03] tracking-[-.065em] text-[var(--cs-navy)]">From tester feedback to team review.</h2><p className="mt-6 text-[15px] leading-7 text-[var(--cs-muted)]">Set up a testing round, collect observations and review what needs attention.</p></Reveal>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-surface)] lg:grid-cols-4">
          {steps.map(({ number, title, copy, detail, icon: Icon }, index) => (
            <Reveal key={number} delay={`reveal-delay-${Math.min(index + 1, 3)}`}>
              <article className="group flex min-h-[305px] flex-col bg-[var(--cs-surface)] p-6 transition-colors duration-300 hover:bg-[var(--cs-tint)] sm:p-7">
                <div className="flex items-center justify-between"><span className="font-mono text-[11px] text-[var(--cs-muted)]">{number}</span><Icon size={19} strokeWidth={1.5} className="text-[var(--cs-muted)] transition-transform duration-300 group-hover:scale-110" /></div>
                <div className="mt-auto"><h3 className="text-[19px] font-bold tracking-[-.04em] text-[var(--cs-navy)]">{title}</h3><p className="mt-3 text-[13px] leading-6 text-[var(--cs-muted)]">{copy}</p><p className="mt-5 border-t border-[var(--cs-border)] pt-3 font-mono text-[9px] leading-4 text-[var(--cs-muted)]">{detail}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-[13px] leading-6 text-[var(--cs-muted)]">AI findings are suggestions for human review, not confirmed causes, guaranteed fixes or formal acceptance decisions.</p>
      </div>
    </section>
  );
}

function SidePanelMockup() {
  return (
    <div className="rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-3 shadow-[0_15px_35px_rgba(28,60,49,.1)]" data-testid="mockup-side-panel">
      <p className="mb-3 px-3 pt-2 font-mono text-[10px] leading-4 text-[var(--cs-muted)]">Illustrative product view · example data</p>
      <div className="flex items-center justify-between border-b border-[var(--cs-border)] pb-3"><div className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-md bg-[var(--cs-surface)] cs-illustration-icon text-[var(--cs-muted)]"><CircleDot size={13} /></span><div><p className="text-[10px] font-bold text-[var(--cs-navy)]">Continuous Sanity</p><p className="text-[8px] text-[var(--cs-muted)]">Shared session</p></div></div><SlidersHorizontal size={14} className="text-[var(--cs-muted)]" /></div>
      <div className="mt-3 rounded-lg border border-[var(--cs-border)] bg-white p-3"><p className="font-mono text-[8px] uppercase tracking-[.12em] text-[var(--cs-muted)]">Session</p><p className="mt-1 text-[12px] font-bold text-[var(--cs-navy)]">New onboarding flow</p><p className="mt-2 font-mono text-[8px] uppercase tracking-[.12em] text-[var(--cs-muted)]">Session task</p><p className="mt-1 text-[10px] leading-4 text-[var(--cs-muted)]">Create an account and invite a teammate.</p><div className="mt-3 flex items-center gap-2 border-t border-[var(--cs-border)] pt-2"><span className="flex size-5 items-center justify-center rounded-full bg-[var(--cs-surface)] text-[8px] font-bold text-[var(--cs-navy)]">OM</span><span className="text-[9px] font-semibold text-[var(--cs-muted)]">Session persona: Operations Manager</span></div></div>
      <div className="mt-2 rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] p-3"><div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[var(--cs-navy)]">Captured feedback</span><span className="rounded bg-[var(--cs-surface)] cs-feedback-tag px-1.5 py-0.5 font-mono text-[7px] text-[var(--cs-muted)]">01</span></div><p className="mt-2 text-[10px] leading-4 text-[var(--cs-muted)]">&quot;I&apos;m not sure whether this will invite the user immediately or just save the email.&quot;</p><div className="mt-3 flex gap-1.5"><span className="rounded bg-[var(--cs-surface)] cs-feedback-tag px-1.5 py-1 text-[7px] font-bold text-[var(--cs-muted)]">Confusion</span><span className="rounded bg-[var(--cs-surface)] cs-feedback-tag px-1.5 py-1 text-[7px] font-bold text-[var(--cs-muted)]">AI: medium</span></div></div>
      <div className="mt-3 grid gap-1.5"><span className="flex items-center justify-center gap-1.5 rounded-md bg-[var(--cs-surface)] cs-illustration-action py-2.5 text-[9px] font-bold text-white" data-testid="illustration-panel-capture"><CircleDot size={11} /> Send feedback</span><span className="py-1 text-[8px] text-[var(--cs-muted)]" data-testid="illustration-panel-end-session">Widget screenshots: optional, with permission</span></div>
    </div>
  );
}

function PinMockup() {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-5 shadow-[0_15px_35px_rgba(28,60,49,.1)]" data-testid="mockup-context-pin">
      <p className="mb-3 px-3 pt-2 font-mono text-[10px] leading-4 text-[var(--cs-muted)]">Illustrative product view · example data</p>
      <div className="flex items-center justify-between border-b border-[var(--cs-border)] pb-3"><div className="h-2 w-24 rounded bg-[var(--cs-surface)]" /><div className="flex gap-1"><span className="size-4 rounded-full bg-[var(--cs-surface)]" /><span className="size-4 rounded-full bg-[var(--cs-surface)]" /></div></div>
      <div className="mt-6 max-w-[180px]"><div className="h-3 w-28 rounded bg-[var(--cs-surface)]" /><div className="mt-2 h-2 w-full rounded bg-[var(--cs-surface)]" /><div className="mt-1 h-2 w-4/5 rounded bg-[var(--cs-surface)]" /></div>
      <div className="mt-6 flex items-center justify-between rounded-lg border border-[var(--cs-border)] bg-white p-3"><div><p className="text-[9px] font-bold text-[var(--cs-navy)]">Invite teammate</p><p className="mt-1 text-[8px] text-[var(--cs-muted)]">Send an email invite</p></div><div className="rounded-md bg-[var(--cs-surface)] cs-illustration-action px-3 py-2 text-[8px] font-bold text-white">Invite</div></div>
      <div className="absolute left-[58%] top-[59%]"><div className="relative flex size-5 items-center justify-center rounded-full bg-[var(--cs-surface)] cs-context-pin text-white shadow-[0_0_0_5px_rgba(223,123,93,.16)]"><CircleDot size={11} /></div><div className="absolute left-2 top-5 h-10 w-px bg-[var(--cs-surface)] cs-context-pin" /><div className="absolute left-3 top-14 w-[190px] rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] p-3 shadow-lg"><p className="text-[10px] leading-4 text-[var(--cs-navy)]">&quot;I&apos;m not sure whether this will invite the user immediately or just save the email.&quot;</p><div className="mt-2 flex items-center gap-2 font-mono text-[7px] text-[var(--cs-muted)]"><span>CONFUSION</span><span>·</span><span>AI: MEDIUM</span></div></div></div>
      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between font-mono text-[8px] text-[var(--cs-muted)]"><span>Page: /team/invite</span><span>Selected element</span></div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--cs-border)] bg-[var(--cs-surface)] shadow-[0_15px_35px_rgba(28,60,49,.1)]" data-testid="mockup-dashboard">
      <p className="mb-3 px-3 pt-2 font-mono text-[10px] leading-4 text-[var(--cs-muted)]">Illustrative product view · example data</p>
      <div className="flex h-10 items-center justify-between border-b border-[var(--cs-border)] bg-white px-4"><div className="flex items-center gap-2"><span className="flex size-5 items-center justify-center rounded bg-[var(--cs-surface)] cs-illustration-icon text-[var(--cs-muted)]"><CircleDot size={11} /></span><span className="text-[10px] font-bold text-[var(--cs-navy)]">Evidence / Shared session</span></div><div className="flex items-center gap-2"><Search size={12} className="text-[var(--cs-muted)]" /><span className="size-5 rounded-full bg-[var(--cs-surface)]" /></div></div>
      <div className="grid grid-cols-[106px_1fr] sm:grid-cols-[132px_1fr]"><aside className="border-r border-[var(--cs-border)] bg-[var(--cs-surface)] cs-illustration-tint p-3"><p className="font-mono text-[7px] uppercase tracking-wider text-[var(--cs-muted)]">This session</p><p className="mt-2 rounded bg-[var(--cs-surface)] cs-illustration-tint px-2 py-1.5 text-[8px] font-bold text-[var(--cs-muted)]">Observations</p><p className="mt-1 px-2 py-1.5 text-[8px] text-[var(--cs-muted)]">Findings</p><p className="px-2 py-1.5 text-[8px] text-[var(--cs-muted)]">Participants</p></aside><div className="p-4 sm:p-5"><div className="flex items-end justify-between"><div><p className="text-[8px] font-mono uppercase tracking-wider text-[var(--cs-muted)]">Example session summary</p><p className="mt-1 text-[15px] font-bold tracking-[-.04em] text-[var(--cs-navy)]">New onboarding flow</p></div><span className="rounded-full bg-[var(--cs-surface)] cs-success-badge px-2 py-1 text-[7px] font-bold text-[var(--cs-muted)]">Synthesis ready</span></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[['6','Participants'],['24','Observations'],['3','Draft findings'],['1','Shared session']].map(([value,label]) => <div key={label} className="rounded border border-[var(--cs-border)] bg-white p-2.5"><p className="font-mono text-[17px] text-[var(--cs-navy)]">{value}</p><p className="mt-1 text-[7px] leading-3 text-[var(--cs-muted)]">{label}</p></div>)}</div><div className="mt-4 rounded border border-[var(--cs-border)] bg-white p-3"><div className="flex items-center gap-2"><Sparkles size={12} className="text-[var(--cs-muted)]" /><p className="text-[9px] font-bold text-[var(--cs-navy)]">AI suggestions · review required</p></div><div className="mt-3 space-y-3"><div className="flex gap-2"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--cs-surface)]" /><p className="text-[8px] leading-4 text-[var(--cs-muted)]">Several participants reported uncertainty about sending an invitation.</p></div><div className="flex gap-2"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-[var(--cs-surface)] cs-context-pin" /><p className="text-[8px] leading-4 text-[var(--cs-muted)]">Example: 4 of 6 participants said they expected to save before sending.</p></div><div className="border-t border-[var(--cs-border)] pt-2 text-[8px] font-bold text-[var(--cs-muted)]">Suggested follow-up: review the reports and test clearer button wording.</div></div></div></div></div>
    </div>
  );
}

function ProductSurfaces() {
  return (
    <section id="product" className="bg-[var(--cs-surface)]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <Reveal><SectionKicker>From capture to review</SectionKicker><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><h2 className="max-w-[600px] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.03] tracking-[-.065em] text-[var(--cs-navy)]">See the feedback alongside its context.</h2><p className="max-w-[310px] text-[14px] leading-6 text-[var(--cs-muted)]">A widget or Chrome extension for testers. A dashboard for reviewing the session’s observations and draft findings.</p></div></Reveal>
        <div className="mt-16 grid gap-4 lg:grid-cols-[.72fr_1fr]">
          <Reveal className="flex flex-col gap-4"><div className="flex-1 rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-5 sm:p-7"><div className="mb-5 flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-[var(--cs-surface)] cs-illustration-icon text-[var(--cs-muted)]"><PanelRight size={15} /></span><div><p className="font-mono text-[9px] uppercase tracking-[.15em] text-[var(--cs-muted)]">Surface 01</p><p className="text-sm font-bold text-[var(--cs-navy)]">Tester side panel</p></div></div><p className="mb-3 text-[12px] leading-5 text-[var(--cs-muted)]">Illustrative product view · example data</p><SidePanelMockup /></div><div className="rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-5 sm:p-7"><div className="mb-5 flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-[var(--cs-surface)] text-[var(--cs-muted)]"><CircleDot size={15} /></span><div><p className="font-mono text-[9px] uppercase tracking-[.15em] text-[var(--cs-muted)]">Surface 02</p><p className="text-sm font-bold text-[var(--cs-navy)]">Contextual pin</p></div></div><p className="mb-3 text-[12px] leading-5 text-[var(--cs-muted)]">Illustrative product view · example data</p><PinMockup /></div></Reveal>
          <Reveal delay="reveal-delay-1" className="rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-5 sm:p-7"><div className="mb-5 flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-[var(--cs-surface)] cs-illustration-icon text-[var(--cs-muted)]"><Layers3 size={15} /></span><div><p className="font-mono text-[9px] uppercase tracking-[.15em] text-[var(--cs-muted)]">Surface 03</p><p className="text-sm font-bold text-[var(--cs-navy)]">Product-team dashboard</p></div></div><p className="mb-3 text-[12px] leading-5 text-[var(--cs-muted)]">Illustrative product view · example data</p><DashboardMockup /><div className="mt-5 grid grid-cols-3 gap-2 text-center font-mono text-[8px] text-[var(--cs-muted)]"><span>Submitted reports</span><span>Shared-session findings</span><span>Human review</span></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function CaptureGrid() {
  const items = [
    ['Interaction context', 'Know which page and element the tester was commenting on.', MousePointer2],
    ['Tester perspective', 'Keep the tester’s own words and follow-up answers alongside their observation.', Target],
    ['Screenshots', 'Attach a screenshot to show what the tester saw.', Camera],
    ['Session context', 'Review submitted observations together, with tester attribution and page context.', Clock3],
    ['Structured feedback', 'AI-assisted classification and severity, alongside the original feedback.', ListChecks],
    ['Synthesis', 'Turn observations from a shared session into findings your team can review.', Sparkles],
  ] as const;
  return (
    <section id="captures" className="bg-[var(--cs-surface)]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <Reveal><SectionKicker>What stays attached</SectionKicker><h2 className="max-w-[620px] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.03] tracking-[-.065em] text-[var(--cs-navy)]">Not just a comment. The moment around it.</h2></Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-surface)] sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, copy, Icon], index) => <Reveal key={title} delay={`reveal-delay-${index % 3}`}><article className="group min-h-[190px] bg-[var(--cs-surface)] p-6 transition-colors duration-300 hover:bg-[var(--cs-tint)] sm:p-7" data-testid={`card-capture-${index}`}><Icon size={20} strokeWidth={1.5} className="text-[var(--cs-muted)] transition-transform duration-300 group-hover:translate-x-1" /><h3 className="mt-12 text-[16px] font-bold tracking-[-.03em] text-[var(--cs-navy)]">{title}</h3><p className="mt-2 max-w-[240px] text-[12px] leading-5 text-[var(--cs-muted)]">{copy}</p></article></Reveal>)}
        </div>
        <p className="mt-6 text-[13px] leading-6 text-[var(--cs-muted)]">Widget screenshots are optional and require browser permission. Testers can submit feedback without a screenshot. Continuous Sanity does not currently capture navigation history or every click. Session replay and video recording are not currently supported.</p>
      </div>
    </section>
  );
}

function PersonaSection() {
  const personas = [
    ['Product teams', 'Review tester feedback on a staging or preview build before release.', '01', Users],
    ['QA / UAT teams', 'Bring submitted observations into guided or exploratory UAT sessions.', '02', CheckCircle2],
    ['Agencies and delivery teams', 'Bring client and business-tester feedback into a shared UAT session.', '03', MessageSquare],
  ] as const;
  return (
    <section id="who-its-for" className="border-y border-[var(--cs-border)] bg-[var(--cs-surface)]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <Reveal><SectionKicker>Built for the people in the loop</SectionKicker><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><h2 className="max-w-[570px] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.03] tracking-[-.065em] text-[var(--cs-navy)]">For the people running UAT.</h2><p className="max-w-[320px] text-[14px] leading-6 text-[var(--cs-muted)]">For product, QA and delivery teams reviewing feedback from the people testing their web apps.</p></div></Reveal>
        <div className="mt-14 grid gap-3 lg:grid-cols-3">{personas.map(([title, copy, number, Icon], index) => <Reveal key={title} delay={`reveal-delay-${index}`}><article className="group min-h-[255px] rounded-2xl border border-[var(--cs-border)] bg-[var(--cs-surface)] p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7"><div className="flex items-center justify-between"><Icon size={20} strokeWidth={1.5} className="text-[var(--cs-muted)]" /><span className="font-mono text-[10px] text-[var(--cs-muted)]">{number}</span></div><div className="mt-24"><h3 className="text-[18px] font-bold tracking-[-.04em] text-[var(--cs-navy)]">{title}</h3><p className="mt-2 text-[13px] leading-6 text-[var(--cs-muted)]">{copy}</p></div></article></Reveal>)}</div>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    ['Understand how users think and feel through their feedback', true, false, false, false],
    ['Issue tracking and resolution', false, true, false, false],
    ['Review what happened during use', false, false, true, false],
    ['Checks against expected behaviour', false, false, false, true],
    ['Turn UAT feedback into proposed action items', true, false, false, false],
  ] as const;
  const headings = ['Current workflow focus', 'Continuous Sanity', 'Bug tracker', 'Session replay', 'Automated testing'];
  const renderCell = (focused: boolean) => focused
    ? <><Check size={16} strokeWidth={2.5} className="mx-auto text-[var(--cs-navy)]" aria-hidden="true" /><span className="sr-only">Highlighted focus</span></>
    : <><span aria-hidden="true">—</span><span className="sr-only">Not highlighted in this focus comparison; capabilities vary by tool</span></>;
  return (
    <section id="comparison" className="bg-[var(--cs-surface)]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <Reveal><SectionKicker>A clear category</SectionKicker><h2 className="max-w-[660px] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.03] tracking-[-.065em] text-[var(--cs-navy)]">The operating system for UAT.</h2><p className="mt-6 max-w-[480px] text-[14px] leading-6 text-[var(--cs-muted)]">Capture how users think and feel about the product you’ve built, and use that context to answer the question: what do you still need to address to serve them better?</p></Reveal>
        <Reveal delay="reveal-delay-1" className="mt-14 rounded-2xl border border-[var(--cs-border)]"><div tabIndex={0} role="region" aria-labelledby="category-table-caption" className="overflow-x-auto rounded-2xl"><table className="w-full min-w-[680px] border-collapse bg-[var(--cs-surface)] text-left" data-testid="comparison-table"><caption id="category-table-caption" className="sr-only">Continuous Sanity alongside bug tracking, session replay and automated testing</caption><thead><tr className="border-b border-[var(--cs-border)]">{headings.map(heading => <th key={heading} scope="col" className="px-4 py-4 text-center text-[10px] font-bold text-[var(--cs-navy)]">{heading}</th>)}</tr></thead><tbody>{rows.map(([label, ...values]) => <tr key={label} className="border-b border-[var(--cs-border)] last:border-0"><th scope="row" className="px-5 py-5 text-[11px] font-semibold text-[var(--cs-navy)]">{label}</th>{values.map((value, index) => <td key={index} className="px-3 py-5 text-center text-[10px] leading-5 text-[var(--cs-muted)]">{renderCell(value)}</td>)}</tr>)}</tbody></table></div></Reveal><p className="mt-4 text-[12px] leading-5 text-[var(--cs-muted)]">These workflows can complement one another. Checks highlight current focus, not exclusive capabilities. Dashes do not mean a feature is absent; capabilities vary by tool.</p>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section id="top" className="noise relative overflow-hidden bg-[var(--cs-surface)]">
      <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-28 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[.86fr_1.14fr] lg:gap-14">
          <Reveal className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[var(--cs-border)] bg-[var(--cs-surface)] px-3 py-1.5 font-mono text-[10px] text-[var(--cs-muted)]"><span className="signal-dot size-1.5 rounded-full bg-[var(--cs-surface)]" /> Guided and exploratory UAT</div>
            <h1 className="max-w-[590px] text-[clamp(3.15rem,6.2vw,5.9rem)] font-semibold leading-[.95] tracking-[-.08em] text-[var(--cs-navy)]">Turn real user testing into <em className="font-serif font-normal text-[var(--cs-muted)]">structured product evidence.</em></h1>
            <p className="mt-7 max-w-[500px] text-[16px] leading-7 text-[var(--cs-muted)]">Give testers a simple way to report feedback while testing your web app. Review their comments with available page, element and screenshot context, then use AI-assisted findings from that session to help decide what needs attention.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><DemoLink location="hero" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cs-surface)] px-5 py-3 text-[13px] font-bold text-[var(--cs-muted)] transition-transform duration-200 hover:-translate-y-0.5" data-testid="link-book-demo-hero">Book a demo <ArrowUpRight size={15} /></DemoLink><a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--cs-border)] bg-[var(--cs-surface)] px-5 py-3 text-[13px] font-bold text-[var(--cs-navy)] transition-colors hover:bg-[var(--cs-tint)]" data-testid="link-see-how-it-works">See how it works <ArrowRight size={15} /></a></div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[.11em] text-[var(--cs-muted)]">Built for UAT · beta testing · stakeholder review · exploratory testing</p>
          </Reveal>
          <Reveal delay="reveal-delay-1" className="relative z-10 lg:pt-8"><BrowserMockup /><div className="mt-4 flex items-center justify-between px-1 font-mono text-[12px] text-[var(--cs-muted)]"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[var(--cs-surface)]" /> Illustrative product view · example data</span><span className="hidden sm:block">/ staging example</span></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="book-demo" className="relative overflow-hidden bg-[var(--cs-surface)]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32"><Reveal className="relative z-10 max-w-[760px]"><SectionKicker>See it in the work</SectionKicker><h2 className="text-[clamp(2.5rem,5vw,5.1rem)] font-semibold leading-[.98] tracking-[-.075em] text-[var(--cs-muted)]">Try it on one real <em className="font-serif font-normal text-[var(--cs-muted)]">UAT session.</em></h2><p className="mt-7 max-w-[480px] text-[15px] leading-7 text-[var(--cs-muted)]">Choose a staging or preview build, invite a small group of testers and review the resulting observations and draft findings with your team.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><DemoLink location="footer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--cs-surface)] px-5 py-3 text-[13px] font-bold text-[var(--cs-navy)] transition-transform hover:-translate-y-0.5" data-testid="link-book-demo-final">Book a demo <ArrowUpRight size={15} /></DemoLink><a href={PILOT_URL} onClick={() => { const campaign = captureCampaignAttribution(); trackAnalyticsEvent('pilot_cta_clicked', { source: campaign.utm_source ?? null, medium: campaign.utm_medium ?? null, campaign: campaign.utm_campaign ?? null, content: campaign.utm_content ?? null, location: 'footer' }); }} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--cs-border)] px-5 py-3 text-[13px] font-bold text-[var(--cs-muted)] transition-colors hover:bg-[var(--cs-tint)]" data-testid="link-run-pilot-final">Run a pilot <ArrowRight size={15} /></a></div></Reveal></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[var(--cs-surface)]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 border-t border-[var(--cs-border)] px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10"><div><BrandMark light /><p className="mt-3 text-[12px] text-[var(--cs-muted)]">Human feedback, kept in context.</p><p className="mt-1 font-mono text-[9px] text-[var(--cs-muted)]">Built in Blantyre, Malawi</p></div><nav className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] text-[var(--cs-muted)]" aria-label="Footer navigation"><a href="#product" className="transition-colors hover:text-white" data-testid="link-footer-product">Product</a><a href="/privacy" className="transition-colors hover:text-white" data-testid="link-footer-privacy">Privacy</a><a href="mailto:hello@continuoussanity.com" className="transition-colors hover:text-white" data-testid="link-footer-contact">Contact</a></nav><p className="font-mono text-[9px] text-[var(--cs-muted)]">© 2026 Continuous Sanity</p></div>
    </footer>
  );
}

function Home() {
  useEffect(() => {
    // Preserve the full illustration at narrow widths rather than clipping its UI.
    const illustrations = Array.from(document.querySelectorAll<HTMLElement>('[data-testid^="mockup-"]'));
    const widths: Record<string, number> = {
      'mockup-hero-browser': 600,
      'mockup-dashboard': 560,
      'mockup-side-panel': 350,
      'mockup-context-pin': 400,
    };
    const resize = () => {
      for (const element of illustrations) {
        const parent = element.parentElement;
        if (!parent) continue;
        const style = getComputedStyle(parent);
        const available = Math.min(window.innerWidth - 40, parent.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight));
        const width = widths[element.dataset.testid ?? ''];
        if (window.innerWidth < 640 && width && available > 0 && available < width) {
          element.style.width = `${width}px`;
          const scale = available / width;
          element.style.transform = `scale(${scale})`;
          element.style.transformOrigin = 'top left';
          element.style.marginBottom = `${-element.offsetHeight * (1 - scale)}px`;
        } else {
          element.style.width = '';
          element.style.transform = '';
          element.style.marginBottom = '';
        }
      }
    };
    const observer = new ResizeObserver(resize);
    illustrations.forEach(element => element.parentElement && observer.observe(element.parentElement));
    window.addEventListener('resize', resize);
    resize();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <div className="cs-brand min-h-[100dvh] overflow-x-hidden bg-[var(--cs-surface)]">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <ProductSurfaces />
        <CaptureGrid />
        <PersonaSection />
        <Comparison />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Privacy() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Landing-page privacy | Continuous Sanity';
    return () => { document.title = previous; };
  }, []);
  return (
    <div className="cs-brand min-h-screen bg-[var(--cs-canvas)]">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <a href="/" className="underline underline-offset-4">Back to Continuous Sanity</a>
        <h1 className="mt-10 text-4xl font-semibold">Landing-page privacy</h1>
        <div className="mt-8 space-y-6 leading-7 text-[var(--cs-muted)]">
          <p>This notice describes optional analytics and campaign attribution on the Continuous Sanity landing page.</p>
          <h2 className="text-xl font-semibold">Campaign attribution</h2>
          <p>When analytics is accepted, we retain utm_source, utm_medium, utm_campaign and utm_content in session storage for the current browser tab. Current-link campaign parameters can still be passed to Calendly without accepting analytics.</p>
          <p>With permission, demo-click events are sent to our first-party campaign endpoint and Google Analytics. They contain the campaign source, medium, campaign, content and button location.</p>
          <h2 className="text-xl font-semibold">Google Analytics and your choice</h2>
          <p>Google Analytics loads only after you accept analytics. It measures page views, device and usage information and demo or pilot clicks, and may use analytics cookies. Advertising consent remains denied. We do not enable Google Signals or ad personalisation in our tag configuration.</p>
          <p>We remember your choice locally for up to 180 days. You can change it using Analytics preferences at the bottom of the page. Rejecting stops our analytics events, clears tab attribution and accessible Google Analytics cookies, and reloads the page if analytics was already loaded. It does not delete previously collected server-side data.</p>
          <p>Google Analytics retention is controlled in our Analytics property. See <a href="https://policies.google.com/privacy" className="underline underline-offset-4">Google's privacy policy</a> for Google's processing, or contact us about retained data.</p>
          <h2 className="text-xl font-semibold">External services and contact</h2>
          <p>Bookings take place on Calendly, where its privacy terms apply. Run a pilot opens the separate Continuous Sanity application; this notice does not describe data collected during product testing sessions.</p>
          <p>For privacy questions, email <a className="underline underline-offset-4" href="mailto:hello@continuoussanity.com">hello@continuoussanity.com</a>.</p>
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
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
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
          <AnalyticsPreferences />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
