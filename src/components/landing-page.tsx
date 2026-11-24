import { useEffect, useRef, useState, type AnchorHTMLAttributes } from "react";
import {
  appendCampaignToUrl,
  captureCampaignAttribution,
  trackDemoCtaClick,
  type DemoCtaLocation,
} from "@/lib/campaign-attribution";
import { trackAnalyticsEvent } from "@/lib/analytics";
import "./landing-page.css";

const DEMO_URL = "https://calendly.com/mwayab/contiuous-sanity-demo";
const PILOT_URL = "https://app.continuoussanity.com";

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

function trackPilotClick() {
  const campaign = captureCampaignAttribution();
  trackAnalyticsEvent("pilot_cta_clicked", {
    source: campaign.utm_source ?? null,
    medium: campaign.utm_medium ?? null,
    campaign: campaign.utm_campaign ?? null,
    content: campaign.utm_content ?? null,
    location: "footer",
  });
}

function LandingHeader() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <header className="wrap">
      <a
        className="brand"
        href="#top"
        onClick={close}
        aria-label="Continuous Sanity home"
        data-testid="link-home"
      >
        <img
          src="/assets/continuous-sanity-mark-cropped-v1.png"
          width="38"
          height="38"
          alt=""
        />
        <span>Continuous Sanity</span>
      </a>
      <button
        ref={toggle}
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="landing-navigation"
        onClick={() => setOpen(!open)}
        data-testid="button-mobile-menu"
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="landing-navigation"
        className={open ? "is-open" : ""}
        aria-label="Primary"
      >
        <a href="#how-it-works" onClick={close}>
          How it works
        </a>
        <a href="#who-its-for" onClick={close}>
          Who it’s for
        </a>
        <DemoLink
          location="nav"
          className="button small"
          onClick={close}
          data-testid="link-book-demo-nav"
        >
          Book a demo <span aria-hidden="true">↗</span>
        </DemoLink>
      </nav>
    </header>
  );
}

function ProductExample() {
  return (
    <figure className="product-example">
      <figcaption>Illustrative product view · example data</figcaption>
      <div className="browser-bar">
        <span aria-hidden="true">● ● ●</span>
        <span>Example preview build / checkout</span>
      </div>
      <div className="product-body">
        <div className="host">
          <div className="host-title">
            Northstar <span>Example application</span>
          </div>
          <p className="mini">Checkout</p>
          <p className="host-product-title">Confirm your plan</p>
          <p>Review your plan and payment details.</p>
          <div className="fake-field">
            Payment method <span>Card ending 4242</span>
          </div>
          <div className="target-wrap">
            <span className="fake-button">Confirm and pay</span>
            <span className="pin" aria-hidden="true">
              01
            </span>
          </div>
          <div className="annotation-line" aria-hidden="true"></div>
          <p className="annotation">The element the user commented on.</p>
        </div>
        <div className="widget-example">
          <div className="widget-brand">
            <img
              src="/assets/continuous-sanity-mark-cropped-v1.png"
              width="24"
              height="24"
              alt=""
            />
            Continuous Sanity
          </div>
          <div className="participant">
            <span className="face puzzled" aria-hidden="true">
              <i></i>
            </span>
            <div>
              <strong>A user in the moment</strong>
              <span>Shared session · Checkout review</span>
            </div>
          </div>
          <blockquote>
            “I expected this to save the card, not charge me yet.”
          </blockquote>
          <div className="tags">
            <span>Confusion</span>
            <span>AI severity: medium</span>
          </div>
          <dl>
            <div>
              <dt>Page</dt>
              <dd>/checkout</dd>
            </div>
            <div>
              <dt>Element</dt>
              <dd>Confirm and pay</dd>
            </div>
            <div>
              <dt>Session task</dt>
              <dd>Review the checkout</dd>
            </div>
          </dl>
          <p className="quiet">
            Screenshots are optional. Widget capture requires browser
            permission.
          </p>
        </div>
      </div>
    </figure>
  );
}

export default function LandingPage() {
  return (
    <div className="human-landing">
      <a className="skip" href="#main-content">
        Skip to content
      </a>
      <LandingHeader />
      <main id="main-content" tabIndex={-1}>
        <section id="top" className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="signal" aria-hidden="true"></span> Guided and
              exploratory UAT
            </div>
            <h1>
              Turn real user testing into{" "}
              <span className="underline">structured product evidence.</span>
            </h1>
            <p className="intro">
              Users share what they think while using your web app. Continuous
              Sanity keeps their feedback with available product context, so
              your team can review the evidence and decide what needs attention.
            </p>
            <div className="actions">
              <DemoLink
                location="hero"
                className="button"
                data-testid="link-book-demo-hero"
              >
                Book a demo <span aria-hidden="true">↗</span>
              </DemoLink>
              <a className="text-link" href="#problem">
                From confusion to clarity <span aria-hidden="true">↓</span>
              </a>
            </div>
            <p className="quiet hero-note">
              An embedded widget or Chrome extension. Your web app.
            </p>
          </div>
          <ProductExample />
        </section>
        <div className="session-strip wrap">
          <span>For the moments a test result can’t explain.</span>
          <div>
            <span>Client UAT</span>
            <span>Stakeholder review</span>
            <span>Exploratory testing</span>
          </div>
        </div>
        <section id="problem" className="problem wrap">
          <div className="section-label">
            <span className="signal" aria-hidden="true"></span> From confusion
            to clarity
          </div>
          <div className="split">
            <h2>
              Keep the person
              <br />
              behind the ticket.
            </h2>
            <p className="body-copy">
              An email or issue report can become a dev ticket with the original
              context lost. Continuous Sanity keeps the tester’s words and
              available product context alongside proposed actions, so your team
              can return to the evidence.
            </p>
          </div>
          <div className="signal-journey">
            <article>
              <span className="journey-step">01 / The observation</span>
              <span className="face puzzled" aria-hidden="true">
                <i></i>
              </span>
              <h3>The user’s own words.</h3>
              <blockquote>
                “I expected this to save the card, not charge me yet.”
              </blockquote>
              <p>
                A deliberate report from a participant in the checkout session.
              </p>
            </article>
            <article>
              <span className="journey-step">02 / The context</span>
              <span className="context-symbol" aria-hidden="true">
                ⌖
              </span>
              <h3>The moment they mean.</h3>
              <dl>
                <div>
                  <dt>Page</dt>
                  <dd>/checkout</dd>
                </div>
                <div>
                  <dt>Element</dt>
                  <dd>Confirm and pay</dd>
                </div>
                <div>
                  <dt>Session task</dt>
                  <dd>Review the checkout</dd>
                </div>
              </dl>
              <p>Available context stays with the comment.</p>
            </article>
            <article>
              <span className="journey-step">03 / The proposed action</span>
              <span className="evidence-mark" aria-hidden="true">
                01
              </span>
              <h3>Something to review.</h3>
              <blockquote>
                Review whether the payment label and confirmation make the next
                step clear.
              </blockquote>
              <p>
                AI suggests a next step. Your team reviews it and can copy
                findings as Markdown for handover.
              </p>
            </article>
          </div>
          <p className="quiet example-caption">
            Illustrative product view · example data. Findings draw on reports
            within one shared session.
          </p>
        </section>
        <section id="how-it-works" className="workflow">
          <div className="wrap">
            <div className="section-label">
              <span className="signal" aria-hidden="true"></span> AI decision
              support for QA and product teams
            </div>
            <h2>
              One thread.
              <br />
              From feedback to review.
            </h2>
            <ol className="steps">
              <li>
                <span className="step-n">01</span>
                <h3>Set the scene.</h3>
                <p>
                  Create a guided or exploratory session. Supply a task and
                  persona for guided testing.
                </p>
              </li>
              <li>
                <span className="step-n">02</span>
                <h3>Let people speak.</h3>
                <p>
                  Testers choose when to submit feedback through the widget or
                  Chrome extension.
                </p>
              </li>
              <li>
                <span className="step-n">03</span>
                <h3>Keep the context.</h3>
                <p>
                  Bring comments together with available page, element and
                  optional screenshot context.
                </p>
              </li>
              <li>
                <span className="step-n">04</span>
                <h3>Decide what’s next.</h3>
                <p>
                  Review AI-assisted findings and proposed action items from
                  that shared session.
                </p>
              </li>
            </ol>
            <p className="footnote">
              Keep the evidence and use it to inform product decisions. AI helps
              surface patterns and points that need attention within a shared
              session. Your team reviews the findings and decides what to
              address.
            </p>
          </div>
        </section>
        <section id="product" className="example wrap">
          <div className="example-intro">
            <div className="section-label">
              <span className="signal" aria-hidden="true"></span> Two connected
              perspectives
            </div>
            <h2>
              A place to speak.
              <br />A place to make sense of it.
            </h2>
            <p className="body-copy">
              Testers need a way to share their experience. Your team needs
              evidence it can use to inform product decisions. Continuous Sanity
              connects those two moments.
            </p>
          </div>
          <div className="perspectives">
            <article>
              <div className="perspective-label">
                <span className="face puzzled" aria-hidden="true">
                  <i></i>
                </span>
                <span>For the user</span>
              </div>
              <h3>
                Say what felt off,
                <br />
                where it happened.
              </h3>
              <ul>
                <li>Submit feedback through the widget or Chrome extension.</li>
                <li>Add a comment with selected page and element context.</li>
                <li>Include an optional screenshot when capture succeeds.</li>
              </ul>
              <div className="perspective-example">
                <span className="pin" aria-hidden="true">
                  01
                </span>
                <p>“I expected this to save the card, not charge me yet.”</p>
              </div>
            </article>
            <article>
              <div className="perspective-label">
                <span className="face calm" aria-hidden="true">
                  <i></i>
                </span>
                <span>For the team</span>
              </div>
              <h3>
                Keep the evidence.
                <br />
                Decide what to address.
              </h3>
              <ul>
                <li>
                  Review attributed observations and available product context.
                </li>
                <li>
                  Use AI classification, suggested severity and findings within
                  a shared session.
                </li>
                <li>
                  Review proposed actions and copy findings as Markdown for
                  handover.
                </li>
              </ul>
              <div className="perspective-example">
                <span className="evidence-mark" aria-hidden="true">
                  01
                </span>
                <p>
                  Review the payment label and confirmation.
                  <span>Original observation stays in view.</span>
                </p>
              </div>
            </article>
          </div>
        </section>
        <section id="captures" className="context-section wrap">
          <div className="section-label">
            <span className="signal" aria-hidden="true"></span> What stays
            attached
          </div>
          <div className="split">
            <h2>
              More of the moment.
              <br />
              Less reconstruction.
            </h2>
            <p className="body-copy">
              Available context varies by observation. The tester’s contribution
              remains the starting point.
            </p>
          </div>
          <div className="context-grid">
            <article>
              <span className="context-symbol" aria-hidden="true">
                ⌖
              </span>
              <h3>Interaction context</h3>
              <p>Know which page and element the tester was commenting on.</p>
            </article>
            <article>
              <span className="face puzzled" aria-hidden="true">
                <i></i>
              </span>
              <h3>Tester perspective</h3>
              <p>
                Keep the tester’s own words and follow-up answers alongside
                their observation.
              </p>
            </article>
            <article>
              <span className="context-symbol" aria-hidden="true">
                ▧
              </span>
              <h3>Screenshots</h3>
              <p>Attach a screenshot to show what the tester saw.</p>
            </article>
            <article>
              <span className="context-symbol" aria-hidden="true">
                ◷
              </span>
              <h3>Session context</h3>
              <p>
                Review submitted observations together, with tester attribution
                and page context.
              </p>
            </article>
            <article>
              <span className="context-symbol" aria-hidden="true">
                ≡
              </span>
              <h3>Structured feedback</h3>
              <p>
                AI-assisted classification and severity, alongside the original
                feedback.
              </p>
            </article>
            <article>
              <span className="evidence-mark" aria-hidden="true">
                01
              </span>
              <h3>Synthesis</h3>
              <p>
                Turn observations from a shared session into findings your team
                can review.
              </p>
            </article>
          </div>
        </section>
        <section id="who-its-for" className="people">
          <div className="wrap">
            <div className="section-label">
              <span className="signal" aria-hidden="true"></span> For the people
              running UAT
            </div>
            <h2>
              A shared session.
              <br />
              Different perspectives.
            </h2>
            <div className="people-grid">
              <article>
                <span className="face calm" aria-hidden="true">
                  <i></i>
                </span>
                <h3>Product teams</h3>
                <p>
                  Review feedback from the people testing your product before
                  release.
                </p>
              </article>
              <article>
                <span className="face puzzled" aria-hidden="true">
                  <i></i>
                </span>
                <h3>QA and UAT teams</h3>
                <p>
                  Bring submitted observations into guided or exploratory
                  testing rounds.
                </p>
              </article>
              <article>
                <span className="face smiling" aria-hidden="true">
                  <i></i>
                </span>
                <h3>Agencies and delivery teams</h3>
                <p>
                  Bring client and business testers into a shared UAT session.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section id="comparison" className="category wrap">
          <div className="section-label">
            <span className="signal" aria-hidden="true"></span> A clear category
          </div>
          <div className="split">
            <h2>
              The operating
              <br />
              system for UAT.
            </h2>
            <p className="large">
              Capture how users think and feel about the product you’ve built,
              and use that context to answer the question: what do you still
              need to address to serve them better?
            </p>
          </div>
          <div className="category-rows">
            <div>
              <span>Automated testing</span>
              <p>Does the software behave as expected?</p>
            </div>
            <div>
              <span>Session replay</span>
              <p>What happened during use?</p>
            </div>
            <div>
              <span>Bug tracking</span>
              <p>What work needs resolving?</p>
            </div>
            <div className="our-row">
              <span>
                <img
                  src="/assets/continuous-sanity-mark-cropped-v1.png"
                  width="27"
                  height="27"
                  alt=""
                />
                Continuous Sanity
              </span>
              <p>
                How does the product serve its users,
                <br />
                and what should we address?
              </p>
              <span className="face calm" aria-hidden="true">
                <i></i>
              </span>
            </div>
          </div>
          <p className="quiet">
            Different questions, complementary workflows. Capabilities vary by
            tool.
          </p>
        </section>
        <section id="book-demo" className="closing">
          <div className="wrap">
            <div className="closing-top">
              <div className="faces" aria-hidden="true">
                <span className="face puzzled">
                  <i></i>
                </span>
                <span className="face calm">
                  <i></i>
                </span>
                <span className="face smiling">
                  <i></i>
                </span>
              </div>
              <span>Start with a few people and one real session.</span>
            </div>
            <h2>
              Let’s hear
              <br />
              what they think.
            </h2>
            <div className="closing-bottom">
              <p>
                Choose a staging or preview build. Invite a small group of
                testers. Review their observations and draft findings together.
              </p>
              <div className="actions">
                <DemoLink
                  location="footer"
                  className="button"
                  data-testid="link-book-demo-final"
                >
                  Book a demo <span aria-hidden="true">↗</span>
                </DemoLink>
                <a
                  className="text-link"
                  href={PILOT_URL}
                  onClick={trackPilotClick}
                  data-testid="link-run-pilot-final"
                >
                  Run a pilot <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="wrap">
        <div>
          <a className="brand" href="#top" aria-label="Continuous Sanity home">
            <img
              src="/assets/continuous-sanity-mark-cropped-v1.png"
              width="38"
              height="38"
              alt=""
            />
            <span>Continuous Sanity</span>
          </a>
          <p>Built in Blantyre, Malawi.</p>
        </div>
        <nav aria-label="Footer">
          <a href="/privacy">Privacy</a>
          <a href="mailto:hello@continuoussanity.com">Contact</a>
          <a href="#product">Product</a>
        </nav>
        <span>© 2026 Continuous Sanity</span>
      </footer>
    </div>
  );
}
