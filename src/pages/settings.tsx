import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your system preferences</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gray-100 rounded-lg">
            <SettingsIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
            <p className="text-sm text-gray-500">Configure your system preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-gray-600">Settings page content coming soon...</p>
        </div>
      </div>
    </div>
  );
}