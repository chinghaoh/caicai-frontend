import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const GRADIENT = 'radial-gradient(ellipse 80% 60% at 0% 0%, #052e16 0%, #0f0f0f 60%)'

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-text-primary mb-3">{title}</h2>
      <div className="text-sm text-text-secondary leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: GRADIENT }}>
      <div className="flex-1 px-4 py-10">
        <div className="w-full max-w-2xl mx-auto">

          {/* Back link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-secondary mb-8 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back
          </Link>

          {/* Header */}
          <div className="mb-10">
            <p className="text-sm text-green font-medium mb-1">Caicai Nutrition</p>
            <h1 className="text-lg font-bold text-text-primary mb-2">Privacy Policy</h1>
            <p className="text-sm text-text-muted">Last updated: June 2026</p>
          </div>

          {/* Intro */}
          <p className="text-sm text-text-secondary leading-relaxed mb-8">
            This policy explains what information Caicai collects, why we collect it, and how it's
            used. We've written it to be readable — not to bury anything in legal language.
          </p>

          <Section title="What we collect">
            <p>
              When you create an account, we collect your name and email address. During onboarding,
              you optionally provide physical stats (age, weight, height, gender, activity level) so
              we can calculate calorie and macro targets. You control what you enter.
            </p>
            <p>
              As you use the app, we store the data you log: meals, water intake, and weight entries.
              This is the core of what Caicai does — it cannot work without it.
            </p>
            <p>
              We do not collect payment information, device identifiers, or browsing history.
            </p>
          </Section>

          <Section title="How we use it">
            <p>
              Your data is used exclusively to power your personal nutrition tracking. We use your
              physical stats to generate AI-assisted goal suggestions. We use your log history to
              show your progress over time.
            </p>
            <p>
              We do not sell your data. We do not use it for advertising. We do not share it with
              third parties except where strictly necessary to operate the service (see below).
            </p>
          </Section>

          <Section title="Third-party services">
            <p>
              Caicai uses the following services to function:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>
                <span className="text-text-secondary">Anthropic Claude API</span> — used only to
                generate nutrition goal suggestions. We send your anonymised physical stats
                (no name, no email). Anthropic's privacy policy applies to data sent to their API.
              </li>
              <li>
                <span className="text-text-secondary">FatSecret</span> — used for food search.
                Search queries may be sent to their API. No personal data is included.
              </li>
              <li>
                <span className="text-text-secondary">AWS</span> — our infrastructure runs on Amazon
                Web Services (EC2, RDS, S3). Your data is stored in the EU (Frankfurt region).
              </li>
            </ul>
          </Section>

          <Section title="Authentication and cookies">
            <p>
              When you log in, we set a single HttpOnly cookie containing a signed JWT (JSON Web
              Token). This cookie is used to authenticate your requests — it cannot be read by
              JavaScript, which protects against common cross-site scripting attacks.
            </p>
            <p>
              We do not use tracking cookies, analytics cookies, or any third-party cookies.
            </p>
          </Section>

          <Section title="Data retention">
            <p>
              Your data is retained for as long as your account is active. If you delete your
              account, all personal data — including your profile, logs, goals, and any uploaded
              content — is permanently deleted within 30 days.
            </p>
            <p>
              Demo accounts are automatically deleted after 24 hours.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You have the right to access, correct, or delete your personal data at any time.
              You can delete your account from the Settings page. If you need a copy of your data
              or have questions, contact us at the address below.
            </p>
          </Section>

          <Section title="Security">
            <p>
              Passwords are hashed using BCrypt and are never stored in plain text. All data in
              transit is encrypted via HTTPS. We apply rate limiting to authentication endpoints
              to mitigate brute-force attacks.
            </p>
            <p>
              No system is perfectly secure. If you discover a vulnerability, please report it
              to us directly rather than disclosing it publicly.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we make material changes to this policy, we'll update the date at the top of
              this page. We won't silently change things that affect how your data is used.
            </p>
          </Section>



        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">© 2025 Caicai Nutrition. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="text-sm text-green">Privacy Policy</Link>
          <Link to="/terms" className="text-sm text-text-muted hover:text-text-secondary">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}