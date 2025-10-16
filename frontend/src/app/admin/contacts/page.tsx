'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Eye, 
  Trash2, 
  ArrowLeft,
  Filter,
  Mail,
  Phone,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminContacts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const categories = [
    { value: 'general', label: 'ทั่วไป' },
    { value: 'admission', label: 'การสมัคร' },
    { value: 'academic', label: 'วิชาการ' },
    { value: 'technical', label: 'เทคนิค' },
    { value: 'complaint', label: 'ร้องเรียน' },
    { value: 'suggestion', label: 'ข้อเสนอแนะ' }
  ];

  const priorities = [
    { value: 'LOW', label: 'ต่ำ', color: 'bg-green-100 text-green-800' },
    { value: 'MEDIUM', label: 'ปานกลาง', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'HIGH', label: 'สูง', color: 'bg-orange-100 text-orange-800' },
    { value: 'URGENT', label: 'เร่งด่วน', color: 'bg-red-100 text-red-800' }
  ];

  const statuses = [
    { value: 'PENDING', label: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'IN_PROGRESS', label: 'กำลังดำเนินการ', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
    { value: 'RESOLVED', label: 'แก้ไขแล้ว', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'CLOSED', label: 'ปิด', color: 'bg-gray-100 text-gray-800', icon: X }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchContacts();
  }, [session, status, router]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts');
      const result = await response.json();
      
      if (result.success) {
        setContacts(result.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contacts?id=${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchContacts();
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('เกิดข้อผิดพลาดในการอัพเดทสถานะ');
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข้อความติดต่อนี้?')) return;

    try {
      const response = await fetch(`/api/contacts?id=${contactId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchContacts();
        if (selectedContact && selectedContact.id === contactId) {
          setSelectedContact(null);
        }
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('เกิดข้อผิดพลาดในการลบข้อความติดต่อ');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || contact.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || contact.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || contact.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const getPriorityConfig = (priority: string) => {
    return priorities.find(p => p.value === priority) || priorities[1];
  };

  const getStatusConfig = (status: string) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="bg-white bg-opacity-20 p-3 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <MessageSquare size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">จัดการข้อความติดต่อ</h1>
                <p className="opacity-90">ข้อความทั้งหมด {filteredContacts.length} ข้อความ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ค้นหาข้อความติดต่อ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="ALL">หมวดหมู่ทั้งหมด</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="ALL">สถานะทั้งหมด</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">ความสำคัญทั้งหมด</option>
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>{priority.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Contacts List */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => {
                  const priorityConfig = getPriorityConfig(contact.priority);
                  const statusConfig = getStatusConfig(contact.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {contact.subject}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${priorityConfig.color}`}>
                                {priorityConfig.label}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {contact.name}
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                            {contact.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {categories.find(cat => cat.value === contact.category)?.label}
                            </span>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(contact.createdAt).toLocaleDateString('th-TH')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredContacts.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบข้อความติดต่อ</h3>
                  <p className="text-gray-500">ยังไม่มีข้อความติดต่อในระบบ หรือลองเปลี่ยนเงื่อนไขการค้นหา</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Detail */}
          {selectedContact && (
            <div className="w-1/2">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    รายละเอียดข้อความ
                  </h3>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedContact.subject}
                    </h4>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        getPriorityConfig(selectedContact.priority).color
                      }`}>
                        {getPriorityConfig(selectedContact.priority).label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {categories.find(cat => cat.value === selectedContact.category)?.label}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-2">ข้อมูลผู้ติดต่อ</h5>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{selectedContact.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                          {selectedContact.email}
                        </a>
                      </div>
                      {selectedContact.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                            {selectedContact.phone}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{new Date(selectedContact.createdAt).toLocaleString('th-TH')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-2">ข้อความ</h5>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-medium text-gray-900 mb-3">สถานะ</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {statuses.map((status) => {
                        const StatusIcon = status.icon;
                        return (
                          <button
                            key={status.value}
                            onClick={() => handleUpdateStatus(selectedContact.id, status.value)}
                            className={`flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                              selectedContact.status === status.value
                                ? `${status.color} border-current`
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <button
                      onClick={() => handleDeleteContact(selectedContact.id)}
                      className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      ลบข้อความนี้
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}