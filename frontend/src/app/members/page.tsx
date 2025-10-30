'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Loading from '@/components/Loading';
import Card, { CardContent } from '@/components/Card';
import { Users, Mail } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  studentId: string;
  email?: string;
  department?: string;
  year?: number;
  position?: string;
  avatar?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      
      if (data.success) {
        setMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <PageLayout title="สมาชิก">
      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <Card key={member.id}>
              <CardContent className="p-6 text-center">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
                    <Users size={40} className="text-gray-400" />
                  </div>
                )}
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.studentId}</p>
                {member.department && (
                  <p className="text-sm text-gray-500 mt-1">{member.department}</p>
                )}
                {member.position && (
                  <p className="text-sm font-medium text-blue-600 mt-2">{member.position}</p>
                )}
                {member.email && (
                  <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                    <Mail size={14} className="mr-1" />
                    {member.email}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">ยังไม่มีสมาชิก</p>
        </div>
      )}
    </PageLayout>
  );
}
