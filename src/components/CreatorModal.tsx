import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Mail, Globe, Users, DollarSign, User, Calendar, ExternalLink } from 'lucide-react';
import type { Creator } from '@/types';
import { formatTZS, getAvatarUrl } from '@/lib/utils';

interface CreatorModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CreatorModal({ creator, isOpen, onClose }: CreatorModalProps) {
  if (!creator) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                {/* Header Image/Avatar */}
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600">
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 text-white bg-black/20 p-2 rounded-lg hover:bg-black/30 transition-colors z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute -bottom-12 left-6">
                    <div className="h-24 w-24 rounded-xl overflow-hidden ring-4 ring-white shadow-lg">
                      {creator.avatar_url ? (
                        <img
                          src={getAvatarUrl(creator.avatar_url)}
                          alt={creator.display_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-medium">
                          {creator.display_name?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="px-6 py-4 pt-16 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{creator.display_name}</h2>
                      <p className="text-gray-500">@{creator.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Creator ID</p>
                      <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg border border-gray-200">
                        {creator.user_id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Earnings</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatTZS(creator.total_earnings)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Supporters</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {creator.total_supporters}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {creator.bio && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
                      <p className="text-gray-600 bg-gray-50 rounded-xl p-4">
                        {creator.bio}
                      </p>
                    </div>
                  )}

                  {/* Links & Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="text-gray-900">{creator.category || 'Uncategorized'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900">{creator.email}</p>
                        <span
                          className={`text-xs ${
                            creator.email_verified
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {creator.email_verified ? 'Verified' : 'Not verified'}
                        </span>
                      </div>
                    </div>

                    {creator.website && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Website</p>
                          <a
                            href={creator.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {creator.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <a
                    href={`https://nisapoti.com/${creator.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <Globe className="w-5 h-5" />
                    Visit Profile
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
