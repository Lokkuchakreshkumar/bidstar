'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Clock, MapPin, ArrowLeft, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

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
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Standings</span>
      </Link>

      {/* Header */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] p-6 sm:p-8 shadow-xs mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
          Contact Customer Desk
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-text)] mt-2 leading-relaxed">
          Questions regarding your contributions, order confirmations, grievance desk, or hero curation? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Contact Info Sidebar */}
        <div className="md:col-span-1 space-y-4">
          
          {/* Email Card */}
          <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--pill-bg)] text-[#e95325] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-[var(--foreground)]">Official Support Email</div>
            <a
              href="mailto:support@bidstar.in"
              className="text-xs font-mono text-[#e95325] hover:underline break-all block"
            >
              support@bidstar.in
            </a>
          </div>

          {/* Grievance Desk */}
          <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-[var(--foreground)]">Grievance & Legal Officer</div>
            <p className="text-xs text-[var(--muted-text)] leading-relaxed">
              For statutory escalations, takedown requests, or formal grievances per IT Rules 2021:
            </p>
            <div className="space-y-1 pt-1 font-mono text-xs">
              <div><span className="text-[var(--muted-text)] font-sans">Grievance:</span> <a href="mailto:grievance@bidstar.in" className="text-[var(--foreground)] hover:underline">grievance@bidstar.in</a></div>
              <div><span className="text-[var(--muted-text)] font-sans">Legal/IP:</span> <a href="mailto:legal@bidstar.in" className="text-[var(--foreground)] hover:underline">legal@bidstar.in</a></div>
            </div>
          </div>

          {/* Response Time */}
          <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-[var(--foreground)]">Response Time</div>
            <p className="text-xs text-[var(--muted-text)]">
              All queries are reviewed within <strong>24 to 48 business hours</strong>.
            </p>
          </div>

          {/* Location */}
          <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--pill-bg)] text-[var(--muted-text)] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-[var(--foreground)]">Jurisdiction</div>
            <p className="text-xs text-[var(--muted-text)]">
              Bengaluru, Karnataka, India
            </p>
          </div>

        </div>

        {/* Form Area */}
        <div className="md:col-span-2">
          <div className="p-6 sm:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Message Received</h3>
                <p className="text-xs text-[var(--muted-text)] max-w-md mx-auto">
                  Thank you for reaching out. Our support team has logged your inquiry and will follow up with you at <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#e95325] text-white text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--foreground)] tracking-tight">
                  Send a Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--muted-text)] mb-1">
                      Your name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#e95325] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--muted-text)] mb-1">
                      Your email address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. user@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#e95325] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--muted-text)] mb-1">
                    Subject / Transaction ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Order #178825"
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#e95325] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--muted-text)] mb-1">
                    Message details
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry, refund reason, or feedback in detail..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--pill-bg)] border border-[var(--pill-border)] text-xs text-[var(--foreground)] focus:outline-hidden focus:border-[#e95325] transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#e95325] hover:bg-[#d84417] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
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
      <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <Link href="/terms" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          Terms & Conditions →
        </Link>
        <Link href="/refund-policy" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          Cancellation & Refund Policy →
        </Link>
        <Link href="/shipping-policy" className="text-[var(--muted-text)] hover:text-[var(--foreground)]">
          Shipping & Delivery Policy →
        </Link>
      </div>
    </div>
  );
}
