import Logo from './Logo';
import UserInfo from './UserInfo';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User | null;
  textIsDisplayed: boolean;
  userIsDisplayed: boolean;
}

export default function Header({ user, textIsDisplayed, userIsDisplayed }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <Logo className="w-12 h-12 mr-4" />
        {textIsDisplayed && (
          <h1 className="text-4xl font-bold text-white font-adversecase">Brain Pods</h1>
        )}
      </div>
      {userIsDisplayed && user && <UserInfo user={user} />}
    </header>
  );
}

