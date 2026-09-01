import React from 'react';
import Link from 'next/link';
import { Shield, FileText, ArrowLeft, Scale, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Cinebid',
  description: 'Terms and conditions governing the access, transactions, and usage of the Cinebid platform.',
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Standings</span>
      </Link>

      {/* Header */}
      <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-10 shadow-xs mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ff5722]/10 text-[#ff5722] border border-[#ff5722]/20 mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-2 leading-relaxed">
          Please read these Terms and Conditions carefully before accessing or using the Platform. By accessing or using this website, you agree to be bound by these Terms in a legally binding agreement.
        </p>
        <div className="mt-4 pt-4 border-t border-[var(--card-border)] flex items-center gap-4 text-[11px] text-[var(--muted-text)]">
          <span>Last Updated: September 2026</span>
          <span>•</span>
          <span>Jurisdiction: Bengaluru, India</span>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        
        {/* Intro */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            By accessing this webpage, you are agreeing to be bound by these Terms and Conditions (&ldquo;Terms&rdquo;) in a legally binding agreement between us (&ldquo;Merchant&rdquo; or &ldquo;us&rdquo; or &ldquo;we&rdquo; or &ldquo;our&rdquo;) and the User (&ldquo;you&rdquo; or &ldquo;your&rdquo;). Please read these Terms carefully before accessing or using the Website. If you do not agree to the Terms, you may not access the Platform.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            We reserve the right to update and change the Terms and Conditions by posting updates and changes to the Platform. You are advised to check the Terms and Conditions from time to time for any updates or changes that may impact you. If at any point such amendments are not acceptable to you, we advise you to cease using the Platform at such time.
          </p>
        </section>

        {/* Eligibility */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <CheckCircle className="w-4 h-4 text-[#ff5722]" />
            <h2>1. ELIGIBILITY</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            You hereby represent and warrant that you have the right, power, and authority to agree to the Terms, to become a party to a legally binding agreement and to perform your obligations hereunder.
          </p>
        </section>

        {/* Definitions */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <Scale className="w-4 h-4 text-[#ff5722]" />
            <h2>2. DEFINITIONS</h2>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed list-disc list-inside">
            <li>
              <strong className="text-[var(--foreground)]">&ldquo;Payment Instrument&rdquo;</strong> includes credit card, debit card, bank account, prepaid payment instrument, Unified Payment Interface (UPI), Immediate Payment Service (IMPS) or any other methods of payments which shall be developed or added or deployed by banks and financial institutions from time to time.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">&ldquo;Platform&rdquo;</strong> refers to the website or platform where the Merchant offers its products or services and where the Transaction may be initiated.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">&ldquo;Transaction&rdquo;</strong> shall refer to the order or request placed by the User with the Merchant to purchase the products and/or services listed on the Platform by paying the Transaction Amount to the Merchant.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">&ldquo;Transaction Amount&rdquo;</strong> shall mean the amount paid by the User in connection with a Transaction.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">&ldquo;User/Users&rdquo;</strong> means any person availing the products and/or services offered on the Platform.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">&ldquo;Website&rdquo;</strong> shall mean the Cinebid platform, www.instamojo.com, or the mobile application.
            </li>
          </ul>
        </section>

        {/* Merchant's Rights */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <Shield className="w-4 h-4 text-[#ff5722]" />
            <h2>3. MERCHANT&apos;S RIGHTS</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            You agree that we may collect, store, and share the information provided by you in order to deliver the products and/or services availed by you on our Platform and/or contact you in relation to the same.
          </p>
        </section>

        {/* Your Responsibilities */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <CheckCircle className="w-4 h-4 text-[#ff5722]" />
            <h2>4. YOUR RESPONSIBILITIES</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            You agree to provide us with true, complete and up-to-date information about yourself as may be required for the purpose of completing the Transactions. This information includes but is not limited to personal details such as name, email address, phone number, delivery address, age, and gender (or any other information that we may deem necessary for us to fulfil the Transaction) as well as the accurate payment information required for the transaction.
          </p>
        </section>

        {/* Prohibited Actions */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <h2>5. PROHIBITED ACTIONS</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            You may not access or use the Platform for any purpose other than that for which we make the Platform available. The Platform may not be used in connection with any commercial endeavors except those specifically endorsed or approved by us. As a User of the Platform, you agree not to:
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed list-disc list-inside">
            <li>Systematically retrieve data or other content from the Platform to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>Make any unauthorized use of the Platform, including collecting usernames and/or email addresses of users by electronic or other means for sending unsolicited communications, or creating accounts by automated means.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the Platform.</li>
            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information.</li>
            <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
            <li>Engage in any automated use of the system, such as using scripts, data mining, robots, or similar data extraction tools.</li>
            <li>Interfere with, disrupt, or create an undue burden on the Platform or connected networks.</li>
            <li>Attempt to impersonate another user or person.</li>
            <li>Decipher, decompile, disassemble, or reverse engineer any software comprising the Platform.</li>
            <li>Upload or transmit viruses, Trojan horses, or repetitive spamming materials.</li>
            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Platform.</li>
            <li>Use the Platform in a manner inconsistent with any applicable laws or regulations.</li>
          </ul>
        </section>

        {/* Limitation of Liability */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <Shield className="w-4 h-4 text-[#ff5722]" />
            <h2>6. LIMITATION OF LIABILITY</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            The User agrees that the only recourse that the User has in the event of receiving a defective product and/or deficiency in service or a product and/or service which does not match the provided description is to initiate the refund process which will be subject to the terms for refund under this agreement. We hereby expressly disclaim any liability for any losses.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            The User shall indemnify and hold harmless the Merchant and its affiliates, agents and representatives from and against any and all claims, demands, causes of action, obligations, liabilities, losses, damages, injuries, costs and expenses incurred or sustained by reason of or arising out of any breach or alleged breach of any of the terms herein by the User.
          </p>
        </section>

        {/* Guidelines for Reviews */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <FileText className="w-4 h-4 text-[#ff5722]" />
            <h2>7. GUIDELINES FOR REVIEWS</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            When posting reviews, shoutouts, or cheer comments on the Platform, you must comply with the following criteria:
          </p>
          <ul className="space-y-1 text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed list-disc list-inside">
            <li>You should have firsthand experience with the person/entity being reviewed.</li>
            <li>Your reviews should not contain offensive profanity, or abusive, racist, offensive, or hate language.</li>
            <li>Your reviews should not contain discriminatory references based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability.</li>
            <li>Your reviews should not contain references to illegal activity.</li>
            <li>You should not be affiliated with competitors if posting negative reviews.</li>
            <li>You may not post any false or misleading statements or organize review campaigns.</li>
          </ul>
        </section>

        {/* Governing Laws & Dispute Resolution */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <Scale className="w-4 h-4 text-[#ff5722]" />
            <h2>8. GOVERNING LAWS & DISPUTE RESOLUTION</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Please note that these terms of use, their subject matter and their formation, are governed by the laws of India. You and we both agree that the courts of India will have exclusive jurisdiction over any dispute.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            Any dispute or claim arising out of or in connection with or relating to these Terms or their breach, termination or invalidity hereof (&ldquo;Dispute&rdquo;) shall be referred to and finally resolved by arbitration in Bengaluru in accordance with the Arbitration and Conciliation Act, 1996 for the time being in force. The seat of arbitration shall be India and the arbitration proceedings shall be conducted in the English language.
          </p>
        </section>

        {/* Grievance Redressal */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <Mail className="w-4 h-4 text-[#ff5722]" />
            <h2>9. GRIEVANCE REDRESSAL</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            You agree that if you have any question or complaint with regard to any product and/or service availed on our Platform, or pertaining to the Transaction, including but not limited to double debit of Transaction Amount, fraudulent Transaction, unauthorized Transaction, refund requests, etc., you may reach out to our grievance desk at:
          </p>
          <div className="p-3 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] font-mono text-xs text-[#ff5722] break-all">
            seller+fe2339eeffd542f990157042fd0b13eb@instamojo.com
          </div>
        </section>

        {/* Disclaimer */}
        <section className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)]">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h2>10. DISCLAIMER</h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            That upon initiating a Transaction, you as a User are entering into a legally binding and enforceable contract with us to purchase the products and/or services, and you shall pay the price as listed on the Platform through legitimate and legal sources of funds and through the accepted Payment Instruments.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            That all payments undertaken by you are subject to your own risk and volition. We shall not be liable for any loss or damage occurred to you arising directly or indirectly due to the decline of authorization for any Transaction, malfunction, errors and/or unscrupulous activities.
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
            The content on our Platform is provided for general information only. The views expressed by other Users on our Platform do not represent our views or values. We do not guarantee that our Platform will be secure or free from bugs or viruses.
          </p>
        </section>

      </div>

      {/* Footer Navigation Strip */}
      <div className="mt-8 pt-6 border-t border-[var(--card-border)] flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        <Link href="/refund-policy" className="text-[#ff5722] hover:underline">
          Cancellation & Refund Policy →
        </Link>
        <Link href="/shipping-policy" className="text-[#ff5722] hover:underline">
          Shipping & Delivery Policy →
        </Link>
        <Link href="/contact" className="text-[#ff5722] hover:underline">
          Contact Customer Desk →
        </Link>
      </div>
    </div>
  );
}
