import React from 'react';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const getFirstName = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const firstName = getFirstName();
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="flex items-center bg-[#D9D9D9] rounded-lg p-2">
      <span className="text-black font-semibold mr-2">{firstName}</span>
      {avatarUrl ? (
        <Image src={avatarUrl} alt={firstName} width={32} height={32} className="rounded-full" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          {firstName[0].toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default UserInfo;
