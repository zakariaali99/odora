import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || 'ar').startsWith('ar');
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch {
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
    <div className="py-12 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 bg-brand-cream min-h-screen">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white text-brand-sage border border-stone-200 shadow-xs">
          <MessageSquare size={14} />
          <span>{isRtl ? 'خدمة العملاء والاستشارات' : 'Customer Service & Consultation'}</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-brand-ink tracking-tight">
          {isRtl ? 'يسعدنا دائماً تواصلك معنا' : 'We Would Love to Hear From You'}
        </h1>
        <p className="text-base text-brand-muted font-normal">
          {isRtl 
            ? 'سواء كنت ترغب في تجربة أجهزة التعطير، استشارة مخصصة لمساحتك، أو الاستفسار عن الشحن والدعم.'
            : 'Whether you need a bespoke scenting consultation for your space or support with your device.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info & Showrooms */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-brand-ink">
              {isRtl ? 'قنوات الاتصال المباشرة' : 'Direct Channels'}
            </h2>
            <div className="space-y-3">
              <a 
                href="tel:+218910000000" 
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-brand-sage transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-brand-sage group-hover:bg-brand-sage group-hover:text-white transition">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs text-brand-muted font-medium">{isRtl ? 'الهاتف الموحد / واتساب' : 'Phone / WhatsApp'}</div>
                  <div className="font-sans font-bold text-sm text-brand-ink" dir="ltr">+218 91 000 0000</div>
                </div>
              </a>

              <a 
                href="mailto:care@odora.ly" 
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs hover:border-brand-sage transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-brand-sage group-hover:bg-brand-sage group-hover:text-white transition">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-brand-muted font-medium">{isRtl ? 'البريد الإلكتروني' : 'Customer Care Email'}</div>
                  <div className="font-bold text-sm text-brand-ink">care@odora.ly</div>
                </div>
              </a>

              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-brand-sage">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs text-brand-muted font-medium">{isRtl ? 'أوقات العمل' : 'Business Hours'}</div>
                  <div className="font-bold text-sm text-brand-ink">
                    {isRtl ? 'السبت - الخميس: 9:00 ص إلى 9:00 م' : 'Sat - Thu: 9:00 AM - 9:00 PM'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Showroom Locations in Libya */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-brand-ink">
              {isRtl ? 'فروعنا وصالات العرض في ليبيا' : 'Showrooms in Libya'}
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-brand-ink">
                  <MapPin size={16} className="text-brand-sage" />
                  <span>{isRtl ? 'فرع طرابلس الرئيسي' : 'Tripoli Flagship'}</span>
                </div>
                <p className="text-xs text-brand-muted font-normal">
                  {isRtl ? 'طريق الشط - بالقرب من حي الأندلس، طرابلس' : 'Al Shatt Road, Near Hay Al Andalus, Tripoli'}
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm text-brand-ink">
                  <MapPin size={16} className="text-brand-sage" />
                  <span>{isRtl ? 'فرع مصراتة' : 'Misrata Hub'}</span>
                </div>
                <p className="text-xs text-brand-muted font-normal">
                  {isRtl ? 'شارع طرابلس - المجمع التجاري، مصراتة' : 'Tripoli Street, Commercial Center, Misrata'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div>
            <h2 className="text-2xl font-light text-brand-ink">
              {isRtl ? 'أرسل لنا رسالة أو طلب استشارة' : 'Send a Message or Consultation Request'}
            </h2>
            <p className="text-xs text-brand-muted font-medium mt-1">
              {isRtl ? 'املأ النموذج وسنقوم بالرد عليك في أقرب وقت ممكن' : 'Fill out the form below and our team will get back to you promptly'}
            </p>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 text-emerald-800 text-sm rounded-2xl border border-emerald-200 flex items-start gap-3">
              <CheckCircle size={20} className="shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-rose-50 text-rose-800 text-sm rounded-2xl border border-rose-200 flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  {isRtl ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isRtl ? 'مثال: محمد الفيتوري' : 'e.g. John Doe'}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-brand-sage text-brand-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  {isRtl ? 'رقم الهاتف *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="091 000 0000"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-brand-sage font-sans text-brand-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-brand-sage text-brand-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  {isRtl ? 'موضوع الرسالة *' : 'Subject *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={isRtl ? 'استفسار عن جهاز، طلب جملة، صيانة...' : 'e.g. Consultation inquiry'}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-brand-sage text-brand-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1">
                {isRtl ? 'نص الرسالة أو تفاصيل طلبك *' : 'Message Details *'}
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={isRtl ? 'اكتب استفسارك هنا، أو اذكر مساحة المكان الذي ترغب في تعطيره...' : 'Tell us about your space or questions...'}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-brand-sage text-brand-ink"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-brand-ink hover:bg-stone-800 text-white rounded-full font-bold text-sm transition shadow-sm disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <Send size={16} />
              <span>{submitting ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : (isRtl ? 'إرسال الرسالة الآن' : 'Send Message')}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
