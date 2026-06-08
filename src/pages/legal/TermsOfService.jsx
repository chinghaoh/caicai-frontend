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

export default function TermsOfService() {
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
            <p className="text-sm text-green font-medium mb-1">Caicai</p>
            <h1 className="text-lg font-bold text-text-primary mb-2">Terms of Service</h1>
            <p className="text-sm text-text-muted">Last updated: June 2026</p>
          </div>

          {/* Intro */}
          <p className="text-sm text-text-secondary leading-relaxed mb-8">
            By using Caicai, you agree to these terms. They're written to be straightforward.
            If something isn't clear, contact us.
          </p>

          <Section title="What Caicai is">
            <p>
              Caicai is a personal nutrition and weight tracking tool. It helps you log meals,
              track macros, monitor your weight, and set daily goals. It is not a medical product
              and does not provide medical advice.
            </p>
            <p>
              Nothing in the app — including AI-generated goal suggestions — should be treated as
              a substitute for advice from a qualified health professional. If you have a medical
              condition, consult a doctor before making significant changes to your diet.
            </p>
          </Section>

          <Section title="Your account">
            <p>
              You are responsible for keeping your account credentials secure. Do not share your
              password. If you believe your account has been compromised, change your password
              immediately via the Settings page or use the forgot-password flow.
            </p>
            <p>
              You must be at least 16 years old to use Caicai. By creating an account, you confirm
              you meet this requirement.
            </p>
          </Section>

          <Section title="Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>Use the service to store or transmit unlawful content</li>
              <li>Attempt to gain unauthorised access to other users' data</li>
              <li>Reverse-engineer or scrape the application</li>
              <li>Use automated tools to make requests at a rate that degrades the service for others</li>
            </ul>
          </Section>

          <Section title="Your data">
            <p>
              You own your data. We don't claim any rights over the content you log. See the{' '}
              <Link to="/privacy" className="text-green hover:opacity-80">
                Privacy Policy
              </Link>{' '}
              for full details on how your data is stored and used.
            </p>
            <p>
              You can delete your account and all associated data at any time from the Settings
              page. Deletion is permanent.
            </p>
          </Section>

          <Section title="Demo accounts">
            <p>
              Demo accounts are ephemeral. They are seeded with sample data and automatically
              deleted after 24 hours. Do not use a demo account to store data you want to keep.
            </p>
          </Section>

          <Section title="Availability">
            <p>
              Caicai is provided as-is. We aim for high availability but do not guarantee
              uninterrupted access. The service may be temporarily unavailable due to maintenance,
              infrastructure issues, or events outside our control.
            </p>
          </Section>

          <Section title="Changes to the service">
            <p>
              Features may be added, changed, or removed over time. We'll do our best to avoid
              breaking changes that affect your data. If we need to shut the service down, we'll
              give reasonable notice so you can export your data.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              If we make material changes, we'll update the date at the top of this page. Continued
              use of Caicai after changes are posted constitutes acceptance of the updated terms.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              Caicai is a personal project provided free of charge. To the extent permitted by
              law, the creator is not liable for any indirect, incidental, or consequential damages
              arising from your use of the service.
            </p>
          </Section>



        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">© 2026 Caicai. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="text-sm text-text-muted hover:text-text-secondary">Privacy Policy</Link>
          <Link to="/terms" className="text-sm text-green">Terms of Service</Link>
        </div>
      </footer>
    </div>
  )
}