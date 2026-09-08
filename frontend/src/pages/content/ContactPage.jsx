import React, { useState } from 'react';
import api from '../../services/api';
import { useLanguageStore } from '../../store/useLanguageStore';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const { isRtl } = useLanguageStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await api.post('/cms/contact/', formData);
      setSuccessMsg(
        isRtl 
          ? 'شكراً لتواصلك معنا! استلمنا رسالتك وسيقوم مستشار أودورا بالتواصل معك خلال ساعات قليلة.'
          : 'Thank you for reaching out! Our fragrance consultant will contact you shortly.'
      );
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Contact submission error', err);
      setErrorMsg(
        isRtl 
          ? 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.'
          : 'Failed to send message. Please try again or call us directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-odora-sage/15 text-odora-olive border border-odora-sage/30">
          <MessageSquare size={14} />
          <span>{isRtl ? 'خدمة العملاء والاستشارات' : 'Customer Service & Consultation'}</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-odora-dark tracking-tight">
          {isRtl ? 'يسعدنا دائماً تواصلك معنا' : 'We Would Love to Hear From You'}
        </h1>
        <p className="text-base text-odora-dark/70">
          {isRtl 
            ? 'سواء كنت ترغب في تجربة أجهزة التعطير، استشارة مخصصة لمساحتك، أو الاستفسار عن الشحن والدعم.'
            : 'Whether you need a bespoke scenting consultation for your space or support with your device.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info & Showrooms */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-odora-dark">
              {isRtl ? 'قنوات الاتصال المباشرة' : 'Direct Channels'}
            </h2>
            <div className="space-y-3">
              <a 
                href="tel:+218910000000" 
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-odora-dark/5 shadow-sm hover:border-odora-olive transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-odora-canvas flex items-center justify-center text-odora-olive group-hover:bg-odora-olive group-hover:text-white transition">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs text-odora-dark/50">{isRtl ? 'الهاتف الموحد / واتساب' : 'Phone / WhatsApp'}</div>
                  <div className="font-mono font-semibold text-sm text-odora-dark" dir="ltr">+218 91 000 0000</div>
                </div>
              </a>

              <a 
                href="mailto:care@odora.ly" 
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-odora-dark/5 shadow-sm hover:border-odora-olive transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-odora-canvas flex items-center justify-center text-odora-olive group-hover:bg-odora-olive group-hover:text-white transition">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-odora-dark/50">{isRtl ? 'البريد الإلكتروني' : 'Customer Care Email'}</div>
                  <div className="font-medium text-sm text-odora-dark">care@odora.ly</div>
                </div>
              </a>

              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-odora-dark/5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-odora-canvas flex items-center justify-center text-odora-olive">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs text-odora-dark/50">{isRtl ? 'أوقات العمل' : 'Business Hours'}</div>
                  <div className="font-medium text-sm text-odora-dark">
                    {isRtl ? 'السبت - الخميس: 9:00 ص إلى 9:00 م' : 'Sat - Thu: 9:00 AM - 9:00 PM'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Showroom Locations in Libya */}
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-odora-dark">
              {isRtl ? 'فروعنا وصالات العرض في ليبيا' : 'Showrooms in Libya'}
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-odora-dark/5 shadow-sm space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-odora-dark">
                  <MapPin size={16} className="text-odora-olive" />
                  <span>{isRtl ? 'فرع طرابلس الرئيسي' : 'Tripoli Flagship'}</span>
                </div>
                <p className="text-xs text-odora-dark/70">
                  {isRtl ? 'طريق الشط - بالقرب من حي الأندلس، طرابلس' : 'Al Shatt Road, Near Hay Al Andalus, Tripoli'}
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-odora-dark/5 shadow-sm space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-odora-dark">
                  <MapPin size={16} className="text-odora-olive" />
                  <span>{isRtl ? 'فرع مصراتة' : 'Misrata Hub'}</span>
                </div>
                <p className="text-xs text-odora-dark/70">
                  {isRtl ? 'شارع طرابلس - المجمع التجاري، مصراتة' : 'Tripoli Street, Commercial Center, Misrata'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-odora-dark/5 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-odora-dark">
              {isRtl ? 'أرسل لنا رسالة أو طلب استشارة' : 'Send a Message or Consultation Request'}
            </h2>
            <p className="text-xs text-odora-dark/60 mt-1">
              {isRtl ? 'املأ النموذج وسنقوم بالرد عليك في أقرب وقت ممكن' : 'Fill out the form below and our team will get back to you promptly'}
            </p>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-sm rounded-2xl border border-emerald-200 flex items-start gap-3">
              <CheckCircle size={20} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 text-rose-800 text-sm rounded-2xl border border-rose-200 flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-odora-dark/70 mb-1">
                  {isRtl ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isRtl ? 'مثال: محمد الفيتوري' : 'e.g. John Doe'}
                  className="w-full px-4 py-3 rounded-xl border border-odora-dark/15 text-sm bg-odora-canvas/20 focus:outline-none focus:border-odora-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-odora-dark/70 mb-1">
                  {isRtl ? 'رقم الهاتف *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="091 000 0000"
                  className="w-full px-4 py-3 rounded-xl border border-odora-dark/15 text-sm bg-odora-canvas/20 focus:outline-none focus:border-odora-olive font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-odora-dark/70 mb-1">
                  {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 rounded-xl border border-odora-dark/15 text-sm bg-odora-canvas/20 focus:outline-none focus:border-odora-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-odora-dark/70 mb-1">
                  {isRtl ? 'موضوع الرسالة *' : 'Subject *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={isRtl ? 'استفسار عن جهاز، طلب جملة، صيانة...' : 'e.g. Consultation inquiry'}
                  className="w-full px-4 py-3 rounded-xl border border-odora-dark/15 text-sm bg-odora-canvas/20 focus:outline-none focus:border-odora-olive"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-odora-dark/70 mb-1">
                {isRtl ? 'نص الرسالة أو تفاصيل طلبك *' : 'Message Details *'}
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={isRtl ? 'اكتب استفسارك هنا، أو اذكر مساحة المكان الذي ترغب في تعطيره...' : 'Tell us about your space or questions...'}
                className="w-full px-4 py-3 rounded-xl border border-odora-dark/15 text-sm bg-odora-canvas/20 focus:outline-none focus:border-odora-olive"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-odora-olive hover:bg-odora-olive/90 text-white rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Send size={16} />
              <span>{submitting ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : (isRtl ? 'إرسال الرسالة الآن' : 'Send Message')}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
