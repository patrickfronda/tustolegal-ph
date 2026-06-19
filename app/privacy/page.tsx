import Link from "next/link";

export const metadata = { title: "Privacy Policy — Torny AI" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-1 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126]" />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-[#1e3a7b] hover:underline mb-6 inline-block">← Back to Torny AI</Link>
        <h1 className="text-3xl font-extrabold text-[#1e3a7b] mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-10">Effective date: June 19, 2026 · Last updated: June 19, 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-gray-700">

          <section>
            <div className="bg-blue-50 border-l-4 border-[#1e3a7b] p-4 rounded-r-xl text-sm text-[#1e3a7b]">
              <strong>Summary:</strong> Torny AI does not sell your data. We do not store your conversation history on our servers. Your chats exist only in your browser. We only collect what we need to operate the service and comply with Philippine law.
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Who We Are</h2>
            <p>Torny AI is a Philippine-based AI legal information service. This Privacy Policy explains how we collect, use, and protect your personal information in accordance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> and its Implementing Rules and Regulations.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. What Information We Collect</h2>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li><strong>Chat messages</strong> — the questions you type to Torny AI. These are sent to our AI provider (Anthropic) to generate responses and are <strong>not stored on our servers</strong> after your session ends.</li>
              <li><strong>Payment information</strong> — processed entirely by PayMongo and GCash. We never see or store your card number, GCash PIN, or banking credentials.</li>
            </ul>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li><strong>Anonymous session ID</strong> — a randomly generated identifier stored in your browser (localStorage) to track your question count and session access. It contains no personal information.</li>
              <li><strong>Usage analytics</strong> — anonymous visit counts and question counts stored in our database (no personal identifiers attached).</li>
              <li><strong>IP address and location</strong> — collected by our hosting provider (Vercel) for security and analytics purposes. We see only aggregate country/city data, not individual IP addresses.</li>
            </ul>

            <h3 className="font-semibold text-gray-800 mt-4 mb-2">2.3 What We Do NOT Collect</h3>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>Your name, email address, or phone number (unless you contact us directly)</li>
              <li>Your conversation history — chats are not saved to our servers</li>
              <li>Sensitive personal information as defined under RA 10173 (health, financial account details, biometrics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li>To provide the Torny AI service and generate responses to your questions</li>
              <li>To enforce the free question limit and validate paid session access</li>
              <li>To understand aggregate usage patterns and improve the service</li>
              <li>To process payments through PayMongo (we receive only a payment confirmation, not your payment details)</li>
              <li>To comply with Philippine law and respond to lawful requests from authorities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Third-Party Services</h2>
            <p>Torny AI uses the following third-party services. Each has its own privacy policy:</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 border border-gray-200 font-semibold">Service</th>
                    <th className="text-left p-2 border border-gray-200 font-semibold">Purpose</th>
                    <th className="text-left p-2 border border-gray-200 font-semibold">Data Shared</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-200">Anthropic (Claude AI)</td>
                    <td className="p-2 border border-gray-200">AI response generation</td>
                    <td className="p-2 border border-gray-200">Your chat messages</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-200">PayMongo</td>
                    <td className="p-2 border border-gray-200">Payment processing</td>
                    <td className="p-2 border border-gray-200">Payment amount only</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200">Vercel</td>
                    <td className="p-2 border border-gray-200">Website hosting</td>
                    <td className="p-2 border border-gray-200">IP address, request logs</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-200">Upstash Redis</td>
                    <td className="p-2 border border-gray-200">Session and analytics storage</td>
                    <td className="p-2 border border-gray-200">Anonymous session IDs, counts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Data Retention</h2>
            <ul className="list-disc list-outside ml-5 space-y-1">
              <li><strong>Chat messages</strong> — not retained on our servers. Once a response is generated, messages are not stored.</li>
              <li><strong>Session data</strong> (question count, access token) — stored in your browser&apos;s localStorage and expires after 24 hours automatically.</li>
              <li><strong>Anonymous analytics</strong> — retained for up to 12 months, then deleted.</li>
              <li><strong>Payment records</strong> — retained by PayMongo per their policy and Philippine financial regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Your Rights Under RA 10173</h2>
            <p>As a data subject under the Data Privacy Act of 2012, you have the right to:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li><strong>Be informed</strong> — know what personal data we collect and how we use it (this policy)</li>
              <li><strong>Access</strong> — request a copy of any personal data we hold about you</li>
              <li><strong>Correction</strong> — request correction of inaccurate data</li>
              <li><strong>Erasure</strong> — request deletion of your personal data</li>
              <li><strong>Object</strong> — object to processing of your personal data</li>
              <li><strong>Complain</strong> — lodge a complaint with the <strong>National Privacy Commission (NPC)</strong> at privacy.gov.ph</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <strong>support@torny.ai</strong>. We will respond within 15 business days.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your information, including:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>HTTPS encryption for all data in transit</li>
              <li>No storage of conversation history on our servers</li>
              <li>Signed, time-limited access tokens for paid sessions</li>
              <li>No storage of payment credentials</li>
            </ul>
            <p className="mt-3">However, no system is 100% secure. Do not share highly sensitive personal information (e.g., ID numbers, account passwords) in your chat messages.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Children</h2>
            <p>Torny AI is not intended for users under 18 years of age. We do not knowingly collect personal information from minors. If you believe a minor has used our service, contact us at <strong>support@torny.ai</strong> and we will take appropriate action.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. The effective date at the top of this page reflects the most recent revision. Continued use of Torny AI after changes are posted constitutes your acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Contact Us</h2>
            <p>For privacy-related inquiries or to exercise your rights under RA 10173:</p>
            <div className="mt-2 bg-gray-100 rounded-xl p-4 text-sm">
              <p><strong>Torny AI</strong></p>
              <p>Email: <strong>support@torny.ai</strong></p>
              <p>For NPC complaints: <a href="https://www.privacy.gov.ph" className="text-[#1e3a7b] underline">privacy.gov.ph</a></p>
            </div>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
          <Link href="/terms" className="text-[#1e3a7b] hover:underline">Terms of Service →</Link>
          <Link href="/" className="hover:underline">Back to Torny AI →</Link>
        </div>
      </div>
    </div>
  );
}
