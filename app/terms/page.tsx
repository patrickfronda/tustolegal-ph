import Link from "next/link";

export const metadata = { title: "Terms of Service — Torny AI" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-1 bg-gradient-to-r from-[#0038a8] via-[#fcd116] to-[#ce1126]" />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-[#1e3a7b] hover:underline mb-6 inline-block">← Back to Torny AI</Link>
        <h1 className="text-3xl font-extrabold text-[#1e3a7b] mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-10">Effective date: June 19, 2026 · Last updated: June 19, 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-gray-700">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. About Torny AI</h2>
            <p>Torny AI (&quot;Torny&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is an AI-powered legal information service operated in the Philippines. Torny AI is accessible at this website and provides users with general information about Philippine law.</p>
            <p className="mt-2">Torny AI is <strong>not a law firm</strong> and does not provide legal advice. Torny AI is not affiliated with the Integrated Bar of the Philippines (IBP), the Public Attorney&apos;s Office (PAO), or any government agency.</p>
          </section>

          <section>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
              <h2 className="text-lg font-bold text-amber-900 mb-2">2. Important Disclaimer — Please Read</h2>
              <ul className="space-y-2 text-amber-800 text-sm">
                <li>🚫 <strong>Torny AI is NOT a lawyer and cannot give legal advice.</strong></li>
                <li>📚 All content provided by Torny AI is <strong>general legal information only</strong> — it explains what the law generally says, not what you should do in your specific situation.</li>
                <li>⚖️ <strong>Nothing on this platform creates an attorney-client relationship</strong> between you and Torny AI or its operators.</li>
                <li>🔴 <strong>Do not rely on Torny AI for decisions in active legal cases.</strong> Always consult a licensed Philippine attorney for advice on your specific circumstances.</li>
                <li>📞 For free legal assistance, contact the <strong>Public Attorney&apos;s Office (PAO) at 8524-2100</strong> (Mon–Fri, business hours).</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Acceptance of Terms</h2>
            <p>By accessing or using Torny AI, you confirm that:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>You are at least 18 years old, or are accessing the service with parental consent.</li>
              <li>You have read, understood, and agree to these Terms of Service.</li>
              <li>You understand that Torny AI provides general legal information, not legal advice.</li>
              <li>You will not use Torny AI as a substitute for consulting a licensed attorney in serious legal matters.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. The Service</h2>
            <p>Torny AI provides:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>General information about Philippine laws, statutes, and legal procedures.</li>
              <li>Explanations of legal concepts in plain language (Filipino and English).</li>
              <li>References to relevant laws, agencies, and contact information for legal resources.</li>
            </ul>
            <p className="mt-3">Torny AI does <strong>not</strong> provide:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>Legal advice tailored to your specific situation.</li>
              <li>Representation in any legal proceeding.</li>
              <li>Guaranteed accuracy of legal information (laws change; always verify with a licensed attorney).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Paid Sessions</h2>
            <p>Torny AI offers a paid session option at <strong>₱99 per 24-hour session</strong> processed via PayMongo and GCash. By purchasing a session:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>You are paying for access to an AI-powered legal information tool — not for legal advice from a licensed attorney.</li>
              <li>Sessions are non-refundable once activated.</li>
              <li>Conversation history is stored in your browser only. Closing the browser tab ends your session history. Your 24-hour access remains active on the same device.</li>
              <li>Torny AI reserves the right to refuse service at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Acceptable Use</h2>
            <p>You agree not to use Torny AI to:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>Engage in any activity that violates Philippine law or the rights of third parties.</li>
              <li>Attempt to extract legal advice that you present to others as coming from a licensed attorney.</li>
              <li>Use the service for any commercial purpose without written consent.</li>
              <li>Attempt to reverse-engineer, scrape, or abuse the platform.</li>
              <li>Submit false, fraudulent, or misleading information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>All content, branding, and design on Torny AI — including the Torny name, logo, and interface — are owned by or licensed to Torny AI. The underlying Philippine laws and statutes referenced are public domain.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by Philippine law:</p>
            <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
              <li>Torny AI is provided &quot;as is&quot; without warranties of any kind.</li>
              <li>We are not liable for any damages arising from your reliance on information provided by Torny AI.</li>
              <li>We are not responsible for outcomes in any legal matter where you used Torny AI as a reference.</li>
              <li>Our total liability to you shall not exceed the amount you paid for your current session (₱99).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Changes to These Terms</h2>
            <p>We may update these Terms at any time. Continued use of Torny AI after changes are posted constitutes your acceptance of the updated Terms. The effective date at the top of this page will reflect the latest revision.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Governing Law</h2>
            <p>These Terms are governed by the laws of the Republic of the Philippines. Any disputes arising from the use of Torny AI shall be subject to the jurisdiction of Philippine courts.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">11. Contact</h2>
            <p>For questions about these Terms, contact us at: <strong>support@torny.ai</strong></p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
          <Link href="/privacy" className="text-[#1e3a7b] hover:underline">Privacy Policy →</Link>
          <Link href="/" className="hover:underline">Back to Torny AI →</Link>
        </div>
      </div>
    </div>
  );
}
