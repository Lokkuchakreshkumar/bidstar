'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, Clock, MapPin, ArrowLeft, Send, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;
    setSubmitted(true);
  };

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
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Support & Helpdesk</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
          Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-2 leading-relaxed">
          Have questions about your contributions, refund requests, transaction status, or hero listings? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Contact Info Sidebar */}
        <div className="md:col-span-1 space-y-4">
          
          {/* Email Card */}
          <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#ff5722]/10 text-[#ff5722] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-[var(--foreground)]">Official Support Email</div>
            <a
              href="mailto:seller+fe2339eeffd542f990157042fd0b13eb@instamojo.com"
              className="text-xs font-mono text-[#ff5722] hover:underline break-all block"
            >
              seller+fe2339eeffd542f990157042fd0b13eb@instamojo.com
            </a>
          </div>

          {/* Grievance Desk */}
          <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-[var(--foreground)]">Grievance Officer</div>
            <p className="text-[11px] text-[var(--muted-text)] leading-relaxed">
              For transaction escalations, chargebacks, or formal grievances, reach out directly with your Order ID.
            </p>
          </div>

          {/* Response Time */}
          <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-[var(--foreground)]">Response Time</div>
            <p className="text-[11px] text-[var(--muted-text)]">
              All queries and tickets are reviewed within <strong>24 to 48 business hours</strong>.
            </p>
          </div>

          {/* Location */}
          <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-[var(--foreground)]">Jurisdiction</div>
            <p className="text-[11px] text-[var(--muted-text)]">
              Bengaluru, Karnataka, India
            </p>
          </div>

        </div>

        {/* Form Area */}
        <div className="md:col-span-2">
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-[var(--foreground)]">Message Received!</h3>
                <p className="text-xs text-[var(--muted-text)] max-w-md mx-auto">
                  Thank you for reaching out. Our support team has logged your inquiry and will follow up with you at <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#ff5722] text-white text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-sm font-black text-[var(--foreground)] tracking-tight">
                  Send a Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted-text)] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted-text)] mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. user@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted-text)] mb-1">
                    Subject / Transaction ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Refund Request for Bid #178825"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted-text)] mb-1">
                    Message Details
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, refund reason, or feedback in detail..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#ff5722] transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#ff5722]/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-[var(--card-border)] flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        <Link href="/terms" className="text-[#ff5722] hover:underline">
          Terms & Conditions →
        </Link>
        <Link href="/refund-policy" className="text-[#ff5722] hover:underline">
          Cancellation & Refund Policy →
        </Link>
        <Link href="/shipping-policy" className="text-[#ff5722] hover:underline">
          Shipping & Delivery Policy →
        </Link>
      </div>
    </div>
  );
}
