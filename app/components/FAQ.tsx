"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Paano mag-file ng annulment ng kasal sa Pilipinas?",
    a: "Ang annulment sa Pilipinas ay isang legal na proseso na nagpapawalang-bisa ng kasal. Ang mga basehan ay kinabibilangan ng: kawalan ng sapat na pahintulot (Art. 45, Family Code), pagka-baliw, pandaraya, dahas, o hindi pa 18 taong gulang sa oras ng kasal. Kailangan mong mag-file ng petisyon sa Regional Trial Court (RTC) ng iyong lugar. Inirerekomenda ang pagkuha ng abogado. Para sa mga walang kakayahang magbayad, makipag-ugnayan sa PAO.",
  },
  {
    q: "Ano ang aking mga karapatan kapag inaresto ng pulis?",
    a: "Sa ilalim ng Sec. 12, Art. III ng 1987 Konstitusyon (Miranda Rights): (1) Karapatan mong manatiling tahimik; (2) Karapatan sa abogado; (3) Dapat ipaalam sa iyo ang iyong mga karapatan. Hindi maaaring pilitin kang magbigay ng salaysay. Kung aresto nang walang warrant, ang aresto ay dapat isagawa lamang: sa in flagrante delicto (nahuli sa gawa), kapag mayroon probable cause, o kapag tumakas ang akusado. Agad na humingi ng tulong sa abogado o PAO.",
  },
  {
    q: "Paano mag-file ng illegal dismissal complaint laban sa employer?",
    a: "Kung pinaalis ka nang walang makatwirang dahilan at/o tamang proseso, maaari kang mag-file ng illegal dismissal complaint sa National Labor Relations Commission (NLRC). Ang mga hakbang: (1) Kumonsulta sa DOLE o NLRC; (2) Mag-file ng verified complaint sa NLRC Regional Arbitration Branch ng iyong lugar sa loob ng 4 na taon; (3) Dumaan sa mandatory conciliation-mediation (SEnA). Maaari mong handa ang: employment contract, payslips, termination notice, at mga patunay ng paggawa.",
  },
  {
    q: "Ano ang PAO at paano makakakuha ng libreng abogado?",
    a: "Ang Public Attorney's Office (PAO) ay nagbibigay ng libreng legal na serbisyo sa mga indigent na mamamayan. Para maging karapat-dapat, dapat ang iyong gross monthly income ay hindi hihigit sa doble ng monthly minimum wage sa iyong rehiyon. Maaaring makipag-ugnayan sa pinakamalapit na PAO office, o tawagan ang PAO Hotline: 8524-2100 / 1-800-10-524-2100 (libre mula sa Pilipinas). Araw-araw silang nagbubukas mula Lunes hanggang Biyernes.",
  },
  {
    q: "Paano mag-file ng small claims case sa korte?",
    a: "Ang Small Claims Court (A.M. No. 08-8-7-SC) ay para sa mga money claims na hindi hihigit sa P1,000,000. Hindi kailangan ng abogado. Ang mga hakbang: (1) Mag-file ng Statement of Claim sa Metropolitan/Municipal Trial Court ng lugar ng defendant; (2) Bayaran ang filing fee; (3) Mag-attach ng lahat ng ebidensya (kontrata, resibo, sulat); (4) Dumalo sa hearing. Ang desisyon ay karaniwang ibinibigay sa araw ng hearing.",
  },
  {
    q: "Paano mag-report ng VAWC (Violence Against Women and their Children)?",
    a: "Ang RA 9262 (Anti-VAWC Act) ay nagpoprotekta sa mga babae at kanilang mga anak mula sa pisikal, sikolohikal, at ekonomikong karahasan. Para mag-report: (1) Pumunta sa pinakamalapit na pulis (Women and Children Protection Desk); (2) Makipag-ugnayan sa DSWD; (3) Humingi ng Barangay Protection Order (BPO) sa iyong barangay; (4) Mag-file ng criminal complaint sa prosecutor's office. Emergency hotlines: 911, DSWD 8951-2803, o Bantay Bata 163.",
  },
  {
    q: "Ano ang mga karapatan ng OFW sa ilalim ng batas ng Pilipinas?",
    a: "Ang mga OFW ay may karapatang: (1) Makakuha ng tamang kontrata bago umalis; (2) Ang POEA-Standard Employment Contract; (3) Libreng repatriation kung may emergency; (4) OWWA benefits (insurance, education assistance, livelihood); (5) Legal na tulong mula sa DFA/DOLE sa ibang bansa. Kung nilabag ang iyong kontrata, mag-file ng reklamo sa POEA (POEA Hotline: 8722-1144) o sa NLRC. Ang Migrant Workers Act (RA 10022) ay nagbibigay ng karagdagang proteksyon.",
  },
  {
    q: "Paano makukuha o papalitanin ang titulo ng lupa (land title)?",
    a: "Para sa Land Title (TCT/OCT), makipag-ugnayan sa Register of Deeds ng iyong lugar. Para sa mga isyu: (1) Pagkawala ng titulo: Mag-file ng petition for reconstitution sa RTC; (2) Pagbabago ng pangalan: Mag-file ng Deed of Sale o Extrajudicial Settlement; (3) Paghahati ng mana: Mag-file ng Extrajudicial Settlement of Estate (kung walang testamento at lahat ng tagapagmana ay pumayag). Para sa mga public lands, makipag-ugnayan sa DENR-LMB (Land Management Bureau).",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#1e3a7b]/10 text-[#1e3a7b] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Mga Madalas na Tanong
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Narito ang mga sagot sa mga pinakakaraniwang legal na katanungan ng mga Pilipino.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start gap-4 px-6 py-5 text-left hover:bg-gray-50 transition"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#1e3a7b]/10 text-[#1e3a7b] text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="flex-1 font-semibold text-gray-900 text-sm sm:text-base">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 w-5 h-5 text-gray-400 transition-transform mt-0.5 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 pt-0">
                  <div className="ml-11 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-10">
          Hindi mo nakita ang iyong tanong?{" "}
          <a href="#inquiry" className="text-[#1e3a7b] font-semibold hover:underline">
            Magtanong nang direkta sa amin
          </a>
          .
        </p>
      </div>
    </section>
  );
}
