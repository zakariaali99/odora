import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { 
  Users, Search, RefreshCw, Smartphone, 
  Globe, MessageSquare, Phone, Mail, MapPin, XCircle, Send
} from 'lucide-react';

interface AdminNote {
  id?: number;
  note: string;
  author_name?: string;
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  city?: string;
  origin: 'mobile' | 'web' | string;
  tag: string;
  orders_count: number;
  total_spent: number | string;
  admin_notes?: AdminNote[];
}

interface TagConfig {
  labelAr: string;
  labelEn: string;
  color: string;
}

const TAG_MAP: Record<string, TagConfig> = {
  new: { labelAr: 'عميل جديد', labelEn: 'New', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  loyal: { labelAr: 'عميل وفيّ', labelEn: 'Loyal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  vip: { labelAr: 'عميل VIP متميز', labelEn: 'VIP', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  inactive: { labelAr: 'غير نشط', labelEn: 'Inactive', color: 'bg-stone-100 text-stone-700 border-stone-200' },
  business: { labelAr: 'شركات ومؤسسات', labelEn: 'Business', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export const AdminCustomersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || 'ar').startsWith('ar');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Note state
  const [newNote, setNewNote] = useState<string>('');
  const [addingNote, setAddingNote] = useState<boolean>(false);
  const [noteSuccess, setNoteSuccess] = useState<string>('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (tagFilter !== 'all') params.tag = tagFilter;
      if (originFilter !== 'all') params.origin = originFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/crm/customers/', { params });
      setCustomers(res.data.results || res.data || []);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [tagFilter, originFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleViewCustomer = async (customerId: number) => {
    try {
      const res = await api.get(`/crm/customers/${customerId}/`);
      setSelectedCustomer(res.data);
      setNewNote('');
      setNoteSuccess('');
    } catch (err) {
      console.error('Failed to load customer details', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newNote.trim()) return;
    setAddingNote(true);
    setNoteSuccess('');
    try {
      const res = await api.post(`/crm/customers/${selectedCustomer.id}/add_note/`, {
        note: newNote.trim()
      });
      setSelectedCustomer({
        ...selectedCustomer,
        admin_notes: [res.data, ...(selectedCustomer.admin_notes || [])]
      });
      setNewNote('');
      setNoteSuccess(isRtl ? 'تم حفظ الملاحظة بنجاح' : 'Note added successfully');
      fetchCustomers();
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setAddingNote(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink-primary font-cairo">
            {isRtl ? 'إدارة علاقات العملاء (CRM)' : 'Customer Relationship Management'}
          </h1>
          <p className="text-xs text-ink-muted mt-0.5 font-cairo">
            {isRtl ? 'بيانات عملاء المتجر الإلكتروني وتطبيق الهاتف، تصنيف الولاء، وسجل التواصل' : 'Unified customer profiles across web store & mobile app with CRM notes'}
          </p>
        </div>
        <button 
          onClick={fetchCustomers}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-ink-primary hover:bg-stone-50 transition shadow-sm bg-white"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{isRtl ? 'تحديث السجلات' : 'Refresh'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Tag & Channel filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tag selector */}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-canvas-subtle/50 font-bold text-ink-primary focus:outline-none focus:border-brand-sage"
            >
              <option value="all">{isRtl ? 'كافة التصنيفات' : 'All Tags'}</option>
              <option value="vip">VIP</option>
              <option value="loyal">{isRtl ? 'وفيّ' : 'Loyal'}</option>
              <option value="new">{isRtl ? 'جديد' : 'New'}</option>
              <option value="business">{isRtl ? 'شركات' : 'Business'}</option>
              <option value="inactive">{isRtl ? 'غير نشط' : 'Inactive'}</option>
            </select>

            {/* Origin selector */}
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-canvas-subtle/50 font-bold text-ink-primary focus:outline-none focus:border-brand-sage"
            >
              <option value="all">{isRtl ? 'كافة القنوات (ويب + تطبيق)' : 'All Channels'}</option>
              <option value="web">{isRtl ? 'المتجر الإلكتروني (ويب)' : 'Web Store'}</option>
              <option value="mobile">{isRtl ? 'تطبيق الهاتف (أودورا)' : 'Mobile App'}</option>
            </select>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'اسم العميل، رقم الهاتف، البريد...' : 'Search by name, phone, email...'}
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-brand-sage bg-canvas-subtle/50 text-ink-primary"
              />
              <Search size={15} className={`absolute top-2.5 ${isRtl ? 'left-3' : 'right-3'} text-ink-muted`} />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-ink-primary text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition"
            >
              {isRtl ? 'بحث' : 'Search'}
            </button>
          </form>

        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[780px] w-full text-start text-xs">
            <thead className="bg-canvas-subtle text-ink-muted text-[11px] uppercase font-bold border-b border-stone-200 font-cairo">
              <tr>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'العميل' : 'Customer'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'الهاتف' : 'Phone'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'المدينة' : 'City'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'القناة' : 'Origin'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'التصنيف' : 'Segment'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'عدد الطلبات' : 'Orders'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'إجمالي المشتريات' : 'Total Spent'}</th>
                <th className="px-4 py-3.5 text-end">{isRtl ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-ink-primary">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-ink-muted">
                    <RefreshCw className="animate-spin inline-block mx-auto mb-2 text-brand-sage" size={20} />
                    <p>{isRtl ? 'جاري تحميل ملفات العملاء...' : 'Loading customers...'}</p>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-ink-muted">
                    <Users className="inline-block mx-auto mb-2 text-stone-300" size={32} />
                    <p>{isRtl ? 'لا يوجد عملاء مطابقين للبحث' : 'No customers found'}</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const tagInfo = TAG_MAP[customer.tag] || { labelAr: customer.tag, labelEn: customer.tag, color: 'bg-stone-100 text-stone-700' };
                  return (
                    <tr key={customer.id} className="hover:bg-canvas-subtle/50 transition group">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-ink-primary">{customer.name}</div>
                        {customer.email && (
                          <div className="text-[11px] text-ink-muted">{customer.email}</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-ink-muted">
                        {customer.phone_number || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-ink-muted">
                        {customer.city || '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        {customer.origin === 'mobile' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200 font-semibold">
                            <Smartphone size={11} />
                            <span>{isRtl ? 'تطبيق' : 'App'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-semibold">
                            <Globe size={11} />
                            <span>{isRtl ? 'ويب' : 'Web'}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${tagInfo.color}`}>
                          {isRtl ? tagInfo.labelAr : tagInfo.labelEn}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-ink-primary">
                        {customer.orders_count}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-brand-amber font-mono">
                        {Number(customer.total_spent).toFixed(2)} د.ل
                      </td>
                      <td className="px-4 py-3.5 text-end">
                        <button
                          onClick={() => handleViewCustomer(customer.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-canvas-subtle hover:bg-brand-sage hover:text-white text-ink-primary rounded-lg text-xs font-semibold transition border border-stone-200"
                        >
                          <MessageSquare size={13} />
                          <span>{isRtl ? 'ملف وملاحظات' : 'Profile & Notes'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail & CRM Notes Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 md:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-ink-primary font-cairo">
                    {selectedCustomer.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${TAG_MAP[selectedCustomer.tag]?.color}`}>
                    {isRtl ? TAG_MAP[selectedCustomer.tag]?.labelAr : TAG_MAP[selectedCustomer.tag]?.labelEn}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-ink-muted mt-1">
                  <span className="flex items-center gap-1">
                    <Phone size={12} />
                    <span className="font-mono">{selectedCustomer.phone_number || '—'}</span>
                  </span>
                  {selectedCustomer.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={12} />
                      <span>{selectedCustomer.email}</span>
                    </span>
                  )}
                  {selectedCustomer.city && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{selectedCustomer.city}</span>
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 border border-stone-200 rounded-xl hover:bg-stone-50 transition text-ink-muted"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Metrics overview cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-canvas-subtle p-3.5 rounded-2xl border border-stone-200 text-center">
                <div className="text-xs text-ink-muted mb-0.5">{isRtl ? 'إجمالي المشتريات' : 'Total Spent'}</div>
                <div className="text-base font-bold font-mono text-brand-amber">
                  {Number(selectedCustomer.total_spent).toFixed(2)} د.ل
                </div>
              </div>
              <div className="bg-canvas-subtle p-3.5 rounded-2xl border border-stone-200 text-center">
                <div className="text-xs text-ink-muted mb-0.5">{isRtl ? 'عدد الطلبات' : 'Orders Count'}</div>
                <div className="text-base font-bold font-mono text-ink-primary">
                  {selectedCustomer.orders_count}
                </div>
              </div>
              <div className="bg-canvas-subtle p-3.5 rounded-2xl border border-stone-200 text-center col-span-2 sm:col-span-1">
                <div className="text-xs text-ink-muted mb-0.5">{isRtl ? 'قناة التسجيل' : 'Origin Channel'}</div>
                <div className="text-xs font-bold text-ink-primary mt-1 flex items-center justify-center gap-1">
                  {selectedCustomer.origin === 'mobile' ? <Smartphone size={13} /> : <Globe size={13} />}
                  <span>{selectedCustomer.origin === 'mobile' ? (isRtl ? 'تطبيق الهاتف' : 'Mobile App') : (isRtl ? 'المتجر الإلكتروني' : 'Web Store')}</span>
                </div>
              </div>
            </div>

            {/* Add CRM Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 bg-canvas-subtle p-4 rounded-2xl border border-stone-200">
              <label className="block text-xs font-bold text-ink-primary uppercase font-cairo">
                {isRtl ? 'إضافة ملاحظة إدارية / تواصل CRM' : 'Add Administrative Note'}
              </label>
              {noteSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                  {noteSuccess}
                </div>
              )}
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={isRtl ? 'مثال: تم التواصل هاتفياً مع العميل، يفضل روائح الصنوبر والخزامى...' : 'e.g. Customer prefers pine & lavender fragrances...'}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-brand-sage text-ink-primary"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  className="px-4 py-2 bg-brand-sage text-white rounded-xl text-xs font-bold hover:bg-brand-olive transition disabled:opacity-50 inline-flex items-center gap-2 shadow-sm"
                >
                  <Send size={12} />
                  <span>{addingNote ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'إضافة الملاحظة' : 'Add Note')}</span>
                </button>
              </div>
            </form>

            {/* Previous Notes Timeline */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-ink-muted uppercase font-cairo">
                {isRtl ? 'سجل الملاحظات الإدارية وتاريخ العميل' : 'CRM Notes History'}
              </h3>
              {(!selectedCustomer.admin_notes || selectedCustomer.admin_notes.length === 0) ? (
                <p className="text-xs text-ink-muted italic text-center py-4 bg-canvas-subtle rounded-xl border border-stone-200">
                  {isRtl ? 'لا توجد ملاحظات مسجلة لهذا العميل بعد' : 'No CRM notes recorded yet'}
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedCustomer.admin_notes.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-stone-200 space-y-1 text-xs">
                      <div className="flex justify-between items-center text-ink-muted">
                        <span className="font-bold text-ink-primary">{item.author_name || (isRtl ? 'المشرف' : 'Admin')}</span>
                        <span className="font-mono text-[11px]">{new Date(item.created_at).toLocaleDateString(isRtl ? 'ar-LY' : 'en-US')}</span>
                      </div>
                      <p className="text-ink-primary whitespace-pre-wrap">{item.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;
