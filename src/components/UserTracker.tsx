import React, { useState } from 'react';
import { UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserTrackerProps {
  podId: string;
  userCount: number;
}

const UserTracker: React.FC<UserTrackerProps> = ({ podId, userCount }) => {
  const [copyStatus, setCopyStatus] = useState('');

  const copyInvitation = () => {
    const inviteLink = `${window.location.origin}/pod/${podId}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    });
  };

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-2">
      <div className="bg-gray-800 rounded-full p-2 flex items-center">
        <UserIcon className="text-white w-5 h-5 mr-1" />
        <span className="text-white font-semibold">{userCount}</span>
      </div>
      <div className="relative">
        <Button onClick={copyInvitation} variant="outline" size="sm">
          Invite
        </Button>
        {copyStatus && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded">
            {copyStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTracker;
