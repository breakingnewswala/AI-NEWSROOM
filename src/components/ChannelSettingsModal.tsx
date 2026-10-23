import React from 'react';
import { AdminProfileModal } from './AdminProfileModal';
import type { UserProfile } from '../lib/firebase';
import type { User } from 'firebase/auth';

interface ChannelSettingsModalProps {
  userProfile: UserProfile | null;
  currentUser: User | null;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => Promise<void>;
  initialTab?: 'personal' | 'branding' | 'social' | 'captions' | 'security' | 'notifications';
}

export const ChannelSettingsModal: React.FC<ChannelSettingsModalProps> = ({
  userProfile,
  currentUser,
  onClose,
  onSave,
  initialTab = 'branding'
}) => {
  return (
    <AdminProfileModal
      userProfile={userProfile}
      currentUser={currentUser}
      onClose={onClose}
      onSave={onSave}
      initialTab={initialTab}
    />
  );
};
