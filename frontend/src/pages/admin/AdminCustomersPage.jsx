import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLanguageStore } from '../../store/useLanguageStore';
import { 
  Users, Search, Filter, RefreshCw, UserCheck, Smartphone, 
  Globe, MessageSquare, Plus, Calendar, DollarSign, ShoppingBag, 
  MapPin, Phone, Mail, Award, XCircle, Send
} from 'lucide-react';

const TAG_MAP = {
  new: { labelAr: 'عميل جديد', labelEn: 'New', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  loyal: { labelAr: 'عميل وفيّ', labelEn: 'Loyal', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  vip: { labelAr: 'عميل VIP متميز', labelEn: 'VIP', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  inactive: { labelAr: 'غير نشط', labelEn: 'Inactive', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  business: { labelAr: 'شركات ومؤسسات', labelEn: 'Business', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export default function AdminCustomersPage() {
  const { isRtl } = useLanguageStore();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tagFilter, setTagFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Note state
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [noteSuccess, setNoteSuccess] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (tagFilter !== 'all') params.tag = tagFilter;
      if (originFilter !== 'all') params.origin = originFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/crm/customers/', { params });
      setCustomers(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [tagFilter, originFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleViewCustomer = async (customerId) => {
    try {
      const res = await api.get(`/crm/customers/${customerId}/`);
      setSelectedCustomer(res.data);
      setNewNote('');
      setNoteSuccess('');
    } catch (err) {
      console.error('Failed to load customer details', err);
    }
  };

  const handleAddNote = async (e) => {
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
          <h1 className="text-2xl font-bold text-odora-dark font-serif">
            {isRtl ? 'إدارة علاقات العملاء (CRM)' : 'Customer Relationship Management'}
          </h1>
          <p className="text-sm text-odora-dark/60 mt-1">
            {isRtl ? 'بيانات عملاء المتجر الإلكتروني وتطبيق الهاتف، تصنيف الولاء، وسجل التواصل' : 'Unified customer profiles across web store & mobile app with CRM notes'}
          </p>
        </div>
        <button 
          onClick={fetchCustomers}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-odora-dark/15 rounded-xl text-sm font-medium hover:bg-white transition shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>{isRtl ? 'تحديث السجلات' : 'Refresh'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-odora-dark/5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Tag & Channel filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tag selector */}
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-odora-dark/15 text-xs bg-odora-canvas/40 font-medium text-odora-dark focus:outline-none focus:border-odora-olive"
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
              className="px-3 py-1.5 rounded-xl border border-odora-dark/15 text-xs bg-odora-canvas/40 font-medium text-odora-dark focus:outline-none focus:border-odora-olive"
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
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-odora-dark/15 text-sm focus:outline-none focus:border-odora-olive bg-odora-canvas/30"
              />
              <Search size={16} className={`absolute top-2.5 ${isRtl ? 'left-3' : 'right-3'} text-odora-dark/40`} />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-odora-dark text-white rounded-xl text-sm font-medium hover:bg-odora-dark/90 transition"
            >
              {isRtl ? 'بحث' : 'Search'}
            </button>
          </form>

        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-odora-dark/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[780px] w-full text-start text-sm">
            <thead className="bg-odora-canvas/50 text-odora-dark/70 text-xs uppercase font-semibold border-b border-odora-dark/10">
              <tr>
                <th className="px-5 py-4 text-start">{isRtl ? 'العميل' : 'Customer'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'الهاتف' : 'Phone'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'المدينة' : 'City'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'القناة' : 'Origin'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'التصنيف' : 'Segment'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'عدد الطلبات' : 'Orders'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'إجمالي المشتريات' : 'Total Spent'}</th>
                <th className="px-5 py-4 text-end">{isRtl ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-odora-dark/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-odora-dark/50">
                    <RefreshCw className="animate-spin inline-block mx-auto mb-2 text-odora-olive" size={24} />
                    <p>{isRtl ? 'جاري تحميل ملفات العملاء...' : 'Loading customers...'}</p>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-odora-dark/50">
                    <Users className="inline-block mx-auto mb-2 text-odora-dark/30" size={32} />
                    <p>{isRtl ? 'لا يوجد عملاء مطابقين للبحث' : 'No customers found'}</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => {
                  const tagInfo = TAG_MAP[customer.tag] || { labelAr: customer.tag, labelEn: customer.tag, color: 'bg-gray-100 text-gray-700' };
                  return (
                    <tr key={customer.id} className="hover:bg-odora-canvas/20 transition group">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-odora-dark">{customer.name}</div>
                        {customer.email && (
                          <div className="text-xs text-odora-dark/50">{customer.email}</div>
                        )}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-odora-dark/80">
                        {customer.phone_number || '—'}
                      </td>
                      <td className="px-5 py-4 text-odora-dark/80">
                        {customer.city || '—'}
                      </td>
                      <td className="px-5 py-4">
                        {customer.origin === 'mobile' ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                            <Smartphone size={12} />
                            <span>{isRtl ? 'تطبيق' : 'App'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                            <Globe size={12} />
                            <span>{isRtl ? 'ويب' : 'Web'}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tagInfo.color}`}>
                          {isRtl ? tagInfo.labelAr : tagInfo.labelEn}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono font-medium text-odora-dark">
                        {customer.orders_count}
                      </td>
                      <td className="px-5 py-4 font-bold text-odora-dark font-mono">
                        {Number(customer.total_spent).toFixed(2)} د.ل
                      </td>
                      <td className="px-5 py-4 text-end">
                        <button
                          onClick={() => handleViewCustomer(customer.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-odora-canvas hover:bg-odora-olive hover:text-white text-odora-dark rounded-lg text-xs font-medium transition"
                        >
                          <MessageSquare size={14} />
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
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-odora-dark/10 p-6 md:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-odora-dark/10 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-odora-dark font-serif">
                    {selectedCustomer.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${TAG_MAP[selectedCustomer.tag]?.color}`}>
                    {isRtl ? TAG_MAP[selectedCustomer.tag]?.labelAr : TAG_MAP[selectedCustomer.tag]?.labelEn}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-odora-dark/60 mt-1">
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
                className="p-2 border border-odora-dark/15 rounded-xl hover:bg-odora-canvas transition text-odora-dark/70"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Metrics overview cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-odora-canvas/40 p-4 rounded-2xl border border-odora-dark/5 text-center">
                <div className="text-xs text-odora-dark/60 mb-1">{isRtl ? 'إجمالي المشتريات' : 'Total Spent'}</div>
                <div className="text-lg font-bold font-mono text-odora-olive">
                  {Number(selectedCustomer.total_spent).toFixed(2)} د.ل
                </div>
              </div>
              <div className="bg-odora-canvas/40 p-4 rounded-2xl border border-odora-dark/5 text-center">
                <div className="text-xs text-odora-dark/60 mb-1">{isRtl ? 'عدد الطلبات' : 'Orders Count'}</div>
                <div className="text-lg font-bold font-mono text-odora-dark">
                  {selectedCustomer.orders_count}
                </div>
              </div>
              <div className="bg-odora-canvas/40 p-4 rounded-2xl border border-odora-dark/5 text-center col-span-2 sm:col-span-1">
                <div className="text-xs text-odora-dark/60 mb-1">{isRtl ? 'قناة التسجيل' : 'Origin Channel'}</div>
                <div className="text-sm font-semibold text-odora-dark mt-1 flex items-center justify-center gap-1">
                  {selectedCustomer.origin === 'mobile' ? <Smartphone size={14} /> : <Globe size={14} />}
                  <span>{selectedCustomer.origin === 'mobile' ? (isRtl ? 'تطبيق الهاتف' : 'Mobile App') : (isRtl ? 'المتجر الإلكتروني' : 'Web Store')}</span>
                </div>
              </div>
            </div>

            {/* Add CRM Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 bg-odora-canvas/30 p-4 rounded-2xl border border-odora-dark/10">
              <label className="block text-xs font-bold text-odora-dark uppercase">
                {isRtl ? 'إضافة ملاحظة إدارية / تواصل CRM' : 'Add Administrative Note'}
              </label>
              {noteSuccess && (
                <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                  {noteSuccess}
                </div>
              )}
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={isRtl ? 'مثال: تم التواصل هاتفياً مع العميل، يفضل روائح الصنوبر والخزامى...' : 'e.g. Customer prefers pine & lavender fragrances...'}
                className="w-full px-3 py-2 rounded-xl border border-odora-dark/15 text-sm bg-white focus:outline-none focus:border-odora-olive"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  className="px-4 py-2 bg-odora-olive text-white rounded-xl text-xs font-semibold hover:bg-odora-olive/90 transition disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Send size={12} />
                  <span>{addingNote ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'إضافة الملاحظة' : 'Add Note')}</span>
                </button>
              </div>
            </form>

            {/* Previous Notes Timeline */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-odora-dark/70 uppercase">
                {isRtl ? 'سجل الملاحظات الإدارية وتاريخ العميل' : 'CRM Notes History'}
              </h3>
              {(!selectedCustomer.admin_notes || selectedCustomer.admin_notes.length === 0) ? (
                <p className="text-xs text-odora-dark/50 italic text-center py-4 bg-odora-canvas/20 rounded-xl">
                  {isRtl ? 'لا توجد ملاحظات مسجلة لهذا العميل بعد' : 'No CRM notes recorded yet'}
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedCustomer.admin_notes.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-odora-dark/10 space-y-1 text-xs">
                      <div className="flex justify-between items-center text-odora-dark/50">
                        <span className="font-semibold text-odora-dark">{item.author_name || (isRtl ? 'المشرف' : 'Admin')}</span>
                        <span className="font-mono">{new Date(item.created_at).toLocaleDateString('ar-LY')}</span>
                      </div>
                      <p className="text-odora-dark/80 whitespace-pre-wrap">{item.note}</p>
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
}
