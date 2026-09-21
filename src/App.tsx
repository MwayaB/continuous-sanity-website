import { useEffect, useRef, useState, type ReactNode } from 'react';
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
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

// Replace these placeholders with the final Calendly and pilot email destinations.
const DEMO_URL = 'https://calendly.com/mwayab/contiuous-sanity-demo';
const PILOT_URL = 'mailto:mwayab@gmail.com?subject=Continuous%20Sanity%20pilot';

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

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" data-testid="brand-continuous-sanity">
      <span className="relative flex size-8 items-center justify-center rounded-[10px] bg-[#183b34] text-[#e9f7ef]">
        <img
          src="/assets/continuous-sanity-mark-cropped-v1.png"
          alt="Continuous Sanity Logo"
          className="size-full rounded-[10px] object-cover"
        />
      </span>
      {!compact && (
        <span className="text-[15px] font-bold tracking-[-0.04em] text-[#18312e]">
          Continuous Sanity
        </span>
      )}
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="sticky top-0 z-50 border-b border-[#dfe5e1]/80 bg-[#faf9f5]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#top" onClick={close} aria-label="Continuous Sanity home" data-testid="link-home">
          <BrandMark />
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <a href="#how-it-works" className="nav-link" data-testid="link-how-it-works">How it works</a>
          <a href="#who-its-for" className="nav-link" data-testid="link-who-its-for">Who it&apos;s for</a>
          <a href={DEMO_URL} className="nav-cta" data-testid="link-book-demo-nav">Book a demo <ArrowUpRight size={14} /></a>
        </nav>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex size-10 items-center justify-center rounded-lg border border-[#d9e1dd] text-[#18312e] md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          data-testid="button-mobile-menu"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-[#dfe5e1] bg-[#faf9f5] px-5 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            <a href="#how-it-works" onClick={close} className="rounded-lg px-3 py-3 text-sm font-semibold text-[#42514d]" data-testid="link-mobile-how-it-works">How it works</a>
            <a href="#who-its-for" onClick={close} className="rounded-lg px-3 py-3 text-sm font-semibold text-[#42514d]" data-testid="link-mobile-who-its-for">Who it&apos;s for</a>
            <a href={DEMO_URL} className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#183b34] px-4 py-3 text-sm font-bold text-[#f8faf5]" data-testid="link-mobile-book-demo">Book a demo <ArrowUpRight size={15} /></a>
          </div>
        </nav>
      )}
    </header>
  );
}

function BrowserDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="size-2 rounded-full bg-[#e2a291]" />
      <span className="size-2 rounded-full bg-[#d7bc82]" />
      <span className="size-2 rounded-full bg-[#9dc5aa]" />
    </div>
  );
}

function BrowserMockup() {
  return (
    <div className="browser-shadow relative overflow-hidden rounded-[14px] border border-[#cbd6d1] bg-[#eff3ef]" data-testid="mockup-hero-browser">
      <div className="flex h-10 items-center gap-3 border-b border-[#d4ddd8] bg-[#f8faf7] px-4">
        <BrowserDots />
        <div className="flex h-6 min-w-0 flex-1 items-center rounded-md border border-[#dbe4df] bg-[#eef2ef] px-3 text-[9px] text-[#879590]">
          app.northstar.co / checkout
        </div>
        <div className="flex size-5 items-center justify-center rounded bg-[#dcebe2] text-[#356a53]"><Plus size={11} /></div>
      </div>
      <div className="flex h-8 items-center justify-between border-b border-[#d8e1dc] bg-[#f6f8f5] px-4 text-[8px] text-[#75817c]">
        <div className="flex items-center gap-4"><span className="font-bold text-[#42605a]">NORTHSTAR</span><span>Overview</span><span className="text-[#42605a]">Checkout</span><span>Customers</span></div>
        <div className="flex items-center gap-2"><Search size={10} /><span className="size-4 rounded-full bg-[#d7e4dc]" /></div>
      </div>
      <div className="grid min-h-[315px] grid-cols-[1fr_194px] sm:min-h-[380px] sm:grid-cols-[1fr_226px]">
        <div className="relative bg-[#fbfcfa] px-5 py-6 sm:px-8">
          <div className="mb-5 flex items-start justify-between">
            <div><p className="text-[9px] font-medium text-[#8a9691]">CHECKOUT / STEP 2 OF 3</p><h3 className="mt-1 text-[17px] font-bold tracking-[-0.04em] text-[#243c37] sm:text-[22px]">Confirm your plan</h3></div>
            <span className="rounded-full bg-[#eaf4ed] px-2 py-1 text-[8px] font-bold text-[#4b7b61]">Pro</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-[#dce6e0] bg-white p-3">
              <div className="mb-3 flex items-center justify-between"><span className="text-[9px] font-bold text-[#4c5d57]">Billing details</span><Check size={12} className="text-[#6f9b7d]" /></div>
              <div className="space-y-2"><div className="h-2 w-4/5 rounded bg-[#edf1ee]" /><div className="h-2 w-full rounded bg-[#edf1ee]" /><div className="h-2 w-3/5 rounded bg-[#edf1ee]" /></div>
            </div>
            <div className="rounded-lg border border-[#dce6e0] bg-white p-3">
              <div className="mb-3 flex items-center justify-between"><span className="text-[9px] font-bold text-[#4c5d57]">Payment method</span><span className="text-[8px] text-[#8c9993]">Edit</span></div>
              <div className="flex items-center gap-2 rounded border border-[#e5ebe7] p-2"><span className="size-4 rounded bg-[#274e44]" /><span className="text-[8px] text-[#68756f]">••••  4242</span></div>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-[#dce6e0] bg-white p-3">
            <div className="mb-3 flex justify-between"><span className="text-[9px] font-bold text-[#4c5d57]">Order summary</span><span className="font-mono text-[9px] text-[#73817a]">$148.00 / mo</span></div>
            <div className="flex justify-between border-t border-[#edf0ed] pt-2 text-[8px] text-[#8a9691]"><span>Northstar Pro plan</span><span>$148.00</span></div>
          </div>
          <button type="button" className="mt-4 rounded-md bg-[#274e44] px-5 py-2 text-[9px] font-bold text-white" data-testid="button-mockup-confirm">Confirm and pay</button>
          <div className="pointer-events-none absolute left-[56%] top-[57%] hidden sm:block">
            <div className="absolute -left-2 -top-2 size-4 rounded-full border-2 border-[#df7b5d] bg-[#fdf8f3]/80 shadow-[0_0_0_5px_rgba(223,123,93,.14)]" />
            <div className="absolute left-4 top-1 h-px w-16 bg-[#df7b5d]" />
            <div className="absolute left-[78px] -top-3 whitespace-nowrap rounded bg-[#fff4ed] px-2 py-1 text-[8px] font-bold text-[#9d553f] shadow-sm">Selected for context</div>
          </div>
        </div>
        <div className="border-l border-[#d5dfda] bg-[#f5f8f5] p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#6eb28b]" /><span className="text-[10px] font-bold text-[#274e44]">Continuous Sanity</span></div><PanelRight size={13} className="text-[#87968e]" /></div>
          <div className="rounded-lg border border-[#dce6df] bg-white p-3">
            <p className="font-mono text-[7px] uppercase tracking-[.12em] text-[#8d9a93]">Active session</p>
            <p className="mt-1 text-[11px] font-bold tracking-[-.02em] text-[#27433c]">Checkout redesign</p>
            <div className="mt-2 flex items-center gap-1.5 text-[8px] text-[#76857d]"><Users size={10} /> First-time customer</div>
          </div>
          <div className="mt-2.5 rounded-lg border border-[#e4d7cb] bg-[#fffaf5] p-3">
            <div className="flex items-center justify-between"><span className="text-[9px] font-bold text-[#4e5c56]">Capture feedback</span><CircleDot size={12} className="text-[#df7b5d]" /></div>
            <p className="mt-2 text-[9px] leading-[1.45] text-[#6e7772]">&quot;I expected this to save the card, not charge me yet.&quot;</p>
            <div className="mt-3 flex gap-1.5"><span className="rounded bg-[#f2e8df] px-1.5 py-1 text-[7px] font-bold text-[#9d654d]">Clarity</span><span className="rounded bg-[#f2e8df] px-1.5 py-1 text-[7px] font-bold text-[#9d654d]">Medium</span></div>
          </div>
          <button type="button" className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-[#274e44] py-2 text-[9px] font-bold text-white" data-testid="button-mockup-capture"><CircleDot size={11} /> Capture feedback</button>
          <button type="button" className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-md border border-[#d8e1dc] bg-white py-2 text-[9px] font-bold text-[#4f655d]" data-testid="button-mockup-comment"><MessageSquare size={11} /> Add comment</button>
          <div className="mt-4 border-t border-[#dfe7e1] pt-3 text-[8px] text-[#8a9790]"><span className="font-bold text-[#62716b]">Context attached</span><div className="mt-1.5 grid grid-cols-2 gap-y-1"><span>Page</span><span className="text-right font-mono">/checkout</span><span>Element</span><span className="text-right">Confirm and pay</span><span>Intent</span><span className="text-right">Complete purchase</span></div></div>
        </div>
      </div>
    </div>
  );
}

function SectionKicker({ children }: { children: ReactNode }) {
  return <p className="mb-5 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[.2em] text-[#5b8870]"><span className="size-1.5 rounded-full bg-[#df7b5d]" /> {children}</p>;
}

function ProblemSection() {
  const fragments = [
    { label: 'Slack', icon: MessageSquare, tone: 'bg-[#e9eff1]' },
    { label: 'Screenshots', icon: Camera, tone: 'bg-[#f2e8df]' },
    { label: 'Email', icon: ExternalLink, tone: 'bg-[#edf0e7]' },
    { label: 'Spreadsheets', icon: ListChecks, tone: 'bg-[#e8eef2]' },
    { label: 'Calls', icon: Activity, tone: 'bg-[#f0e8eb]' },
    { label: 'Jira tickets', icon: Flag, tone: 'bg-[#e8ede9]' },
  ];
  return (
    <section id="problem" className="border-y border-[#dfe5e1] bg-[#f4f5f0]">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:gap-24 lg:px-10 lg:py-32">
        <Reveal>
          <SectionKicker>The familiar gap</SectionKicker>
          <h2 className="max-w-[480px] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.02] tracking-[-.065em] text-[#1f3531]">Testing happens in the product. <em className="font-serif font-normal text-[#55836c]">Feedback usually doesn&apos;t.</em></h2>
          <p className="mt-7 max-w-[440px] text-[15px] leading-7 text-[#64736d]">A Slack thread starts after the moment. A screenshot loses the click. A spreadsheet has no idea what the tester intended.</p>
        </Reveal>
        <Reveal delay="reveal-delay-1">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {fragments.map(({ label, icon: Icon, tone }, index) => (
              <div key={label} className={`group relative flex min-h-[118px] flex-col justify-between rounded-xl border border-[#d9e2dc] ${tone} p-4 transition-transform duration-300 hover:-translate-y-1`} data-testid={`card-fragment-${index}`}>
                <div className="flex items-center justify-between"><Icon size={17} strokeWidth={1.7} className="text-[#60756d]" /><span className="font-mono text-[9px] text-[#87948e]">0{index + 1}</span></div>
                <span className="text-[12px] font-bold text-[#485b54]">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#d8b9a9] bg-[#fff7f1] p-4 text-[12px] leading-5 text-[#795e50]"><CircleAlert size={16} className="mt-0.5 shrink-0 text-[#c97858]" /><p>Context gets separated from the interaction that produced it. Teams spend the next day reconstructing what happened.</p></div>
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { number: '01', title: 'Start a session', copy: 'Create a guided or exploratory test with the task, persona, and context already in place.', detail: 'Checkout redesign — first-time customer', icon: Target },
    { number: '02', title: 'Test the actual product', copy: 'Your tester uses the product as they normally would, with a lightweight browser layer at hand.', detail: 'The real interface. No sandbox. No script to learn.', icon: MousePointer2 },
    { number: '03', title: 'Capture feedback in context', copy: 'Comments stay connected to the page, element, screenshot, intent, and session state.', detail: 'Page · element · intent · device · timestamp', icon: CircleDot },
    { number: '04', title: 'Review product evidence', copy: 'See organized observations and AI-assisted synthesis instead of a pile of disconnected notes.', detail: 'Patterns your team can discuss and act on', icon: Sparkles },
  ];
  return (
    <section id="how-it-works" className="bg-[#faf9f5]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <Reveal className="max-w-2xl"><SectionKicker>From session to signal</SectionKicker><h2 className="text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.03] tracking-[-.065em] text-[#1f3531]">A better layer over the work your team already does.</h2><p className="mt-6 text-[15px] leading-7 text-[#64736d]">Continuous Sanity gives human testing a place to leave a trail — so every observation arrives with enough context to be useful.</p></Reveal>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[#dce4de] bg-[#dce4de] lg:grid-cols-4">
          {steps.map(({ number, title, copy, detail, icon: Icon }, index) => (
            <Reveal key={number} delay={`reveal-delay-${Math.min(index + 1, 3)}`}>
              <article className="group flex min-h-[305px] flex-col bg-[#faf9f5] p-6 transition-colors duration-300 hover:bg-[#f0f6f1] sm:p-7">
                <div className="flex items-center justify-between"><span className="font-mono text-[11px] text-[#9aa8a1]">{number}</span><Icon size={19} strokeWidth={1.5} className="text-[#56866c] transition-transform duration-300 group-hover:scale-110" /></div>
                <div className="mt-auto"><h3 className="text-[19px] font-bold tracking-[-.04em] text-[#28443c]">{title}</h3><p className="mt-3 text-[13px] leading-6 text-[#718079]">{copy}</p><p className="mt-5 border-t border-[#e0e7e1] pt-3 font-mono text-[9px] leading-4 text-[#71937e]">{detail}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SidePanelMockup() {
  return (
    <div className="rounded-xl border border-[#d6e0da] bg-[#f7faf7] p-3 shadow-[0_15px_35px_rgba(28,60,49,.1)]" data-testid="mockup-side-panel">
      <div className="flex items-center justify-between border-b border-[#e0e8e1] pb-3"><div className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-md bg-[#d9eee0] text-[#397357]"><CircleDot size={13} /></span><div><p className="text-[10px] font-bold text-[#29463d]">Continuous Sanity</p><p className="text-[8px] text-[#8b9892]">Session active</p></div></div><SlidersHorizontal size={14} className="text-[#81918a]" /></div>
      <div className="mt-3 rounded-lg border border-[#dfe7e0] bg-white p-3"><p className="font-mono text-[8px] uppercase tracking-[.12em] text-[#93a099]">Session</p><p className="mt-1 text-[12px] font-bold text-[#2e4a40]">New onboarding flow</p><p className="mt-2 font-mono text-[8px] uppercase tracking-[.12em] text-[#93a099]">Task</p><p className="mt-1 text-[10px] leading-4 text-[#687871]">Create an account and invite a teammate.</p><div className="mt-3 flex items-center gap-2 border-t border-[#edf1ed] pt-2"><span className="flex size-5 items-center justify-center rounded-full bg-[#d7e8de] text-[8px] font-bold text-[#426c58]">OM</span><span className="text-[9px] font-semibold text-[#66756e]">Operations Manager</span></div></div>
      <div className="mt-2 rounded-lg border border-[#ead8cc] bg-[#fffaf5] p-3"><div className="flex items-center justify-between"><span className="text-[10px] font-bold text-[#42574f]">Captured feedback</span><span className="rounded bg-[#f5e2d6] px-1.5 py-0.5 font-mono text-[7px] text-[#a6644b]">01</span></div><p className="mt-2 text-[10px] leading-4 text-[#68746e]">&quot;I&apos;m not sure whether this will invite the user immediately or just save the email.&quot;</p><div className="mt-3 flex gap-1.5"><span className="rounded bg-[#f0e6dd] px-1.5 py-1 text-[7px] font-bold text-[#a46650]">Clarity</span><span className="rounded bg-[#f0e6dd] px-1.5 py-1 text-[7px] font-bold text-[#a46650]">Medium</span></div></div>
      <div className="mt-3 grid gap-1.5"><button type="button" className="flex items-center justify-center gap-1.5 rounded-md bg-[#31594d] py-2.5 text-[9px] font-bold text-white" data-testid="button-panel-capture"><CircleDot size={11} /> Capture feedback</button><button type="button" className="flex items-center justify-center gap-1.5 rounded-md border border-[#d9e4dc] bg-white py-2 text-[9px] font-bold text-[#526a60]" data-testid="button-panel-observation"><Plus size={11} /> Add observation</button><button type="button" className="py-1 text-[8px] text-[#89968f]" data-testid="button-panel-end-session">End session</button></div>
    </div>
  );
}

function PinMockup() {
  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-xl border border-[#d7e1db] bg-[#fbfcfa] p-5 shadow-[0_15px_35px_rgba(28,60,49,.1)]" data-testid="mockup-context-pin">
      <div className="flex items-center justify-between border-b border-[#e8ede8] pb-3"><div className="h-2 w-24 rounded bg-[#e1e9e3]" /><div className="flex gap-1"><span className="size-4 rounded-full bg-[#e2eee5]" /><span className="size-4 rounded-full bg-[#e2eee5]" /></div></div>
      <div className="mt-6 max-w-[180px]"><div className="h-3 w-28 rounded bg-[#dfe8e1]" /><div className="mt-2 h-2 w-full rounded bg-[#edf1ed]" /><div className="mt-1 h-2 w-4/5 rounded bg-[#edf1ed]" /></div>
      <div className="mt-6 flex items-center justify-between rounded-lg border border-[#dfe7e1] bg-white p-3"><div><p className="text-[9px] font-bold text-[#42564e]">Invite teammate</p><p className="mt-1 text-[8px] text-[#8b9791]">Send an email invite</p></div><div className="rounded-md bg-[#31594d] px-3 py-2 text-[8px] font-bold text-white">Invite</div></div>
      <div className="absolute left-[58%] top-[59%]"><div className="relative flex size-5 items-center justify-center rounded-full bg-[#df7b5d] text-white shadow-[0_0_0_5px_rgba(223,123,93,.16)]"><CircleDot size={11} /></div><div className="absolute left-2 top-5 h-10 w-px bg-[#df7b5d]" /><div className="absolute left-3 top-14 w-[190px] rounded-lg border border-[#ecd4c7] bg-[#fffaf5] p-3 shadow-lg"><p className="text-[10px] leading-4 text-[#6c5e57]">&quot;I&apos;m not sure whether this will invite the user immediately or just save the email.&quot;</p><div className="mt-2 flex items-center gap-2 font-mono text-[7px] text-[#9c735f]"><span>CLARITY</span><span>·</span><span>MEDIUM</span></div></div></div>
      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between font-mono text-[8px] text-[#94a099]"><span>Page: /team/invite</span><span>Element anchored</span></div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#d5dfd9] bg-[#f8faf7] shadow-[0_15px_35px_rgba(28,60,49,.1)]" data-testid="mockup-dashboard">
      <div className="flex h-10 items-center justify-between border-b border-[#dfe7e1] bg-white px-4"><div className="flex items-center gap-2"><span className="flex size-5 items-center justify-center rounded bg-[#d9eee0] text-[#397357]"><CircleDot size={11} /></span><span className="text-[10px] font-bold text-[#375348]">Evidence / Sessions</span></div><div className="flex items-center gap-2"><Search size={12} className="text-[#91a099]" /><span className="size-5 rounded-full bg-[#dce9e0]" /></div></div>
      <div className="grid grid-cols-[106px_1fr] sm:grid-cols-[132px_1fr]"><aside className="border-r border-[#e0e8e1] bg-[#f2f6f2] p-3"><p className="font-mono text-[7px] uppercase tracking-wider text-[#99a59f]">Workspace</p><p className="mt-2 rounded bg-[#dfeee3] px-2 py-1.5 text-[8px] font-bold text-[#47715a]">All sessions</p><p className="mt-1 px-2 py-1.5 text-[8px] text-[#7e8d85]">Findings</p><p className="px-2 py-1.5 text-[8px] text-[#7e8d85]">Testers</p></aside><main className="p-4 sm:p-5"><div className="flex items-end justify-between"><div><p className="text-[8px] font-mono uppercase tracking-wider text-[#94a19a]">Session summary</p><p className="mt-1 text-[15px] font-bold tracking-[-.04em] text-[#29463d]">New onboarding flow</p></div><span className="rounded-full bg-[#e4f1e7] px-2 py-1 text-[7px] font-bold text-[#4d7c5d]">Synthesized</span></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{[['6','Testers'],['24','Observations'],['3','Recurring themes'],['2','High priority']].map(([value,label]) => <div key={label} className="rounded border border-[#e0e8e1] bg-white p-2.5"><p className="font-mono text-[17px] text-[#31594d]">{value}</p><p className="mt-1 text-[7px] leading-3 text-[#88968f]">{label}</p></div>)}</div><div className="mt-4 rounded border border-[#e0e8e1] bg-white p-3"><div className="flex items-center gap-2"><Sparkles size={12} className="text-[#6b9f7c]" /><p className="text-[9px] font-bold text-[#3c574c]">Synthesized findings</p></div><div className="mt-3 space-y-3"><div className="flex gap-2"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#6eaa80]" /><p className="text-[8px] leading-4 text-[#64736d]">Users consistently hesitated at the invite confirmation step.</p></div><div className="flex gap-2"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#df7b5d]" /><p className="text-[8px] leading-4 text-[#64736d]">4 of 6 testers expected the button to save rather than immediately send the invitation.</p></div><div className="border-t border-[#edf1ed] pt-2 text-[8px] font-bold text-[#4b7b61]">Recommended follow-up: clarify button language and confirmation state.</div></div></div></main></div>
    </div>
  );
}

function ProductSurfaces() {
  return (
    <section id="product" className="bg-[#eaf1eb]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <Reveal><SectionKicker>Believable by design</SectionKicker><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><h2 className="max-w-[600px] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.03] tracking-[-.065em] text-[#1f3531]">The right context, at the right scale.</h2><p className="max-w-[310px] text-[14px] leading-6 text-[#64736d]">A small browser layer for testers. A clear evidence surface for the team behind the product.</p></div></Reveal>
        <div className="mt-16 grid gap-4 lg:grid-cols-[.72fr_1fr]">
          <Reveal className="flex flex-col gap-4"><div className="flex-1 rounded-2xl border border-[#d1dfd4] bg-[#f1f6f1] p-5 sm:p-7"><div className="mb-5 flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-[#d6ebdc] text-[#3e7557]"><PanelRight size={15} /></span><div><p className="font-mono text-[9px] uppercase tracking-[.15em] text-[#789382]">Surface 01</p><p className="text-sm font-bold text-[#2b493e]">Tester side panel</p></div></div><SidePanelMockup /></div><div className="rounded-2xl border border-[#d1dfd4] bg-[#f1f6f1] p-5 sm:p-7"><div className="mb-5 flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-[#f0dfd5] text-[#aa6a52]"><CircleDot size={15} /></span><div><p className="font-mono text-[9px] uppercase tracking-[.15em] text-[#987b6d]">Surface 02</p><p className="text-sm font-bold text-[#2b493e]">Contextual pin</p></div></div><PinMockup /></div></Reveal>
          <Reveal delay="reveal-delay-1" className="rounded-2xl border border-[#d1dfd4] bg-[#f1f6f1] p-5 sm:p-7"><div className="mb-5 flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-[#d6ebdc] text-[#3e7557]"><Layers3 size={15} /></span><div><p className="font-mono text-[9px] uppercase tracking-[.15em] text-[#789382]">Surface 03</p><p className="text-sm font-bold text-[#2b493e]">Product-team dashboard</p></div></div><DashboardMockup /><div className="mt-5 grid grid-cols-3 gap-2 text-center font-mono text-[8px] text-[#779083]"><span>Session trail</span><span>Observed patterns</span><span>Actionable follow-up</span></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function CaptureGrid() {
  const items = [
    ['Interaction context', 'Know what screen and element generated the feedback.', MousePointer2],
    ['Tester intent', 'Understand what the user was trying to accomplish.', Target],
    ['Screenshots', 'Keep visual evidence tied to the observation.', Camera],
    ['Session history', 'See the path through the test, not just isolated comments.', Clock3],
    ['Structured feedback', 'Classification and severity without forcing a bug tracker.', ListChecks],
    ['Synthesis', 'Turn multiple sessions into patterns and actionable findings.', Sparkles],
  ] as const;
  return (
    <section id="captures" className="bg-[#faf9f5]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <Reveal><SectionKicker>What stays attached</SectionKicker><h2 className="max-w-[620px] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.03] tracking-[-.065em] text-[#1f3531]">Not just a comment. The moment around it.</h2></Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[#dce4de] bg-[#dce4de] sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([title, copy, Icon], index) => <Reveal key={title} delay={`reveal-delay-${index % 3}`}><article className="group min-h-[190px] bg-[#faf9f5] p-6 transition-colors duration-300 hover:bg-[#f1f6f1] sm:p-7" data-testid={`card-capture-${index}`}><Icon size={20} strokeWidth={1.5} className="text-[#5d8d72] transition-transform duration-300 group-hover:translate-x-1" /><h3 className="mt-12 text-[16px] font-bold tracking-[-.03em] text-[#29443b]">{title}</h3><p className="mt-2 max-w-[240px] text-[12px] leading-5 text-[#7a8781]">{copy}</p></article></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function PersonaSection() {
  const personas = [
    ['Product teams', 'Validate features before release without chasing scattered stakeholder feedback.', '01', Users],
    ['QA / UAT teams', 'Standardize exploratory and acceptance testing without turning it into rigid scripted QA.', '02', CheckCircle2],
    ['Customer-facing teams', 'Capture useful beta feedback while customers are actually using the product.', '03', MessageSquare],
  ] as const;
  return (
    <section id="who-its-for" className="border-y border-[#dfe5e1] bg-[#f4f5f0]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <Reveal><SectionKicker>Built for the people in the loop</SectionKicker><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><h2 className="max-w-[570px] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.03] tracking-[-.065em] text-[#1f3531]">Human testing, without the scavenger hunt.</h2><p className="max-w-[320px] text-[14px] leading-6 text-[#64736d]">Continuous Sanity supports the people who know the product — it doesn&apos;t replace them.</p></div></Reveal>
        <div className="mt-14 grid gap-3 lg:grid-cols-3">{personas.map(([title, copy, number, Icon], index) => <Reveal key={title} delay={`reveal-delay-${index}`}><article className="group min-h-[255px] rounded-2xl border border-[#d6e0d8] bg-[#faf9f5] p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7"><div className="flex items-center justify-between"><Icon size={20} strokeWidth={1.5} className="text-[#5c8b70]" /><span className="font-mono text-[10px] text-[#9aa69f]">{number}</span></div><div className="mt-24"><h3 className="text-[18px] font-bold tracking-[-.04em] text-[#29443b]">{title}</h3><p className="mt-2 text-[13px] leading-6 text-[#738079]">{copy}</p></div></article></Reveal>)}</div>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    ['Human feedback', true, true, false, false],
    ['Captured in context', true, 'Sometimes', 'Passive', 'N/A'],
    ['Tester intent', true, 'Manual', false, false],
    ['Structured sessions', true, false, false, true],
    ['Synthesizes findings across testers', true, false, false, false],
  ] as const;
  const renderCell = (value: boolean | string) => value === true ? <Check size={15} className="mx-auto text-[#4d8a67]" strokeWidth={2.5} /> : value === false ? <span className="text-[#b0b9b3]">—</span> : <span className="font-mono text-[9px] text-[#7f8d86]">{value}</span>;
  return (
    <section id="comparison" className="bg-[#faf9f5]">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <Reveal><SectionKicker>A clear category</SectionKicker><h2 className="max-w-[660px] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[1.03] tracking-[-.065em] text-[#1f3531]">Human testing deserves more than a blank ticket.</h2><p className="mt-6 max-w-[480px] text-[14px] leading-6 text-[#718079]">Continuous Sanity sits between the product and the systems teams use to track it — preserving the human signal along the way.</p></Reveal>
        <Reveal delay="reveal-delay-1" className="mt-14 overflow-x-auto rounded-2xl border border-[#dbe4de]"><table className="w-full min-w-[680px] border-collapse bg-[#fdfcf9] text-left" data-testid="comparison-table"><thead><tr className="border-b border-[#dbe4de]"><th className="w-[38%] px-5 py-4 text-[10px] font-mono uppercase tracking-[.12em] text-[#829089] sm:px-7">Capability</th><th className="bg-[#edf6ef] px-3 py-4 text-center text-[10px] font-bold text-[#315e4a]">Continuous<br />Sanity</th><th className="px-3 py-4 text-center text-[10px] font-medium text-[#829089]">Bug tracker</th><th className="px-3 py-4 text-center text-[10px] font-medium text-[#829089]">Session replay</th><th className="px-3 py-4 text-center text-[10px] font-medium text-[#829089]">Automated testing</th></tr></thead><tbody>{rows.map(([label, ...values]) => <tr key={label} className="border-b border-[#e9eee9] last:border-0"><td className="px-5 py-5 text-[11px] font-semibold text-[#52645b] sm:px-7">{label}</td>{values.map((value, index) => <td key={`${label}-${index}`} className={`px-3 py-5 text-center ${index === 0 ? 'bg-[#f3f9f4]' : ''}`}>{renderCell(value)}</td>)}</tr>)}</tbody></table></Reveal>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section id="top" className="noise relative overflow-hidden bg-[#faf9f5]">
      <div className="pointer-events-none absolute -right-24 top-20 size-[330px] rounded-full border border-[#d5e7d9] opacity-70 sm:size-[500px]" />
      <div className="pointer-events-none absolute -right-8 top-52 size-[180px] rounded-full border border-[#e5d4ca] opacity-60 sm:size-[270px]" />
      <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-28 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[.86fr_1.14fr] lg:gap-14">
          <Reveal className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#cfe1d3] bg-[#f0f7f1] px-3 py-1.5 font-mono text-[10px] text-[#528066]"><span className="signal-dot size-1.5 rounded-full bg-[#6da980]" /> A browser layer for human UAT</div>
            <h1 className="max-w-[590px] text-[clamp(3.15rem,6.2vw,5.9rem)] font-semibold leading-[.95] tracking-[-.08em] text-[#1d3530]">Turn real user testing into <em className="font-serif font-normal text-[#56856c]">structured product evidence.</em></h1>
            <p className="mt-7 max-w-[500px] text-[16px] leading-7 text-[#64736d]">Continuous Sanity gives testers a lightweight browser layer for capturing feedback in context, then turns testing sessions into clear findings your product team can act on.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href={DEMO_URL} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#183b34] px-5 py-3 text-[13px] font-bold text-[#f9fbf7] transition-transform duration-200 hover:-translate-y-0.5" data-testid="link-book-demo-hero">Book a demo <ArrowUpRight size={15} /></a><a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#cddbd2] bg-[#faf9f5] px-5 py-3 text-[13px] font-bold text-[#3f6255] transition-colors hover:bg-[#edf5ee]" data-testid="link-see-how-it-works">See how it works <ArrowRight size={15} /></a></div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[.11em] text-[#8d9b94]">Built for UAT · beta testing · stakeholder review · exploratory testing</p>
          </Reveal>
          <Reveal delay="reveal-delay-1" className="relative z-10 lg:pt-8"><BrowserMockup /><div className="mt-4 flex items-center justify-between px-1 font-mono text-[9px] text-[#8c9b93]"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#70ad85]" /> Browser layer, not a replacement for automated testing</span><span className="hidden sm:block">/ live session</span></div></Reveal>
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="book-demo" className="relative overflow-hidden bg-[#183b34]">
      <div className="pointer-events-none absolute -right-20 -top-32 size-[450px] rounded-full border border-[#5d9274]/30" /><div className="pointer-events-none absolute -right-4 -top-12 size-[260px] rounded-full border border-[#d68468]/25" />
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 lg:px-10 lg:py-32"><Reveal className="relative z-10 max-w-[760px]"><SectionKicker>See it in the work</SectionKicker><h2 className="text-[clamp(2.5rem,5vw,5.1rem)] font-semibold leading-[.98] tracking-[-.075em] text-[#f5f8f2]">Run your next test with <em className="font-serif font-normal text-[#acdcb9]">Continuous Sanity.</em></h2><p className="mt-7 max-w-[480px] text-[15px] leading-7 text-[#b7c9bd]">Give a handful of testers a session, capture what happens in context, and see whether your team gets better evidence.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href={DEMO_URL} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e8f5e9] px-5 py-3 text-[13px] font-bold text-[#234c3d] transition-transform hover:-translate-y-0.5" data-testid="link-book-demo-final">Book a demo <ArrowUpRight size={15} /></a><a href={PILOT_URL} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#6b9980] px-5 py-3 text-[13px] font-bold text-[#e7f3e9] transition-colors hover:bg-[#2b5447]" data-testid="link-run-pilot-final">Run a pilot <ArrowRight size={15} /></a></div></Reveal></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#183b34]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 border-t border-[#487161] px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10"><div><div className="invert"><BrandMark /></div><p className="mt-3 text-[12px] text-[#a8c0b0]">Human testing, captured properly.</p></div><nav className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] text-[#b5c9bb]" aria-label="Footer navigation"><a href="#product" className="transition-colors hover:text-white" data-testid="link-footer-product">Product</a><a href="#comparison" className="transition-colors hover:text-white" data-testid="link-footer-privacy">Privacy</a><a href="mailto:mwayab@gmail.com?subject=Continuous%20Sanity%20pilot" className="transition-colors hover:text-white" data-testid="link-footer-contact">Contact</a></nav><p className="font-mono text-[9px] text-[#7ea18c]">© 2025 Continuous Sanity</p></div>
    </footer>
  );
}

function Home() {
  return (
    <div className="min-h-[100dvh] overflow-x-hidden bg-[#faf9f5]">
      <Header />
      <main>
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

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
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
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;