import React, { useState } from 'react';

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: 'Charity Foundation',
    email: 'contact@charityfoundation.org',
    phone: '(555) 123-4567',
    currency: 'USD'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    donationAlerts: true,
    weeklyReports: true,
    monthlyReports: true
  });

  const [userPreferences, setUserPreferences] = useState({
    theme: 'light',
    dashboardView: 'detailed',
    language: 'en'
  });

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value
    });
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handleUserPreferenceChange = (e) => {
    const { name, value } = e.target;
    setUserPreferences({
      ...userPreferences,
      [name]: value
    });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    // Here you would normally save settings to backend
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
        <form onSubmit={handleSaveSettings}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                name="organizationName"
                value={generalSettings.organizationName}
                onChange={handleGeneralSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="email"
                value={generalSettings.email}
                onChange={handleGeneralSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                name="phone"
                value={generalSettings.phone}
                onChange={handleGeneralSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Currency
              </label>
              <select
                name="currency"
                value={generalSettings.currency}
                onChange={handleGeneralSettingsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
          </div>
          
          <hr className="my-6" />
          
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notificationSettings.emailNotifications}
                  onChange={() => handleNotificationToggle('emailNotifications')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Donation Alerts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notificationSettings.donationAlerts}
                  onChange={() => handleNotificationToggle('donationAlerts')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Weekly Reports</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notificationSettings.weeklyReports}
                  onChange={() => handleNotificationToggle('weeklyReports')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Monthly Reports</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notificationSettings.monthlyReports}
                  onChange={() => handleNotificationToggle('monthlyReports')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <hr className="my-6" />
          
          <h2 className="text-xl font-semibold mb-4">User Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                name="theme"
                value={userPreferences.theme}
                onChange={handleUserPreferenceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dashboard View
              </label>
              <select
                name="dashboardView"
                value={userPreferences.dashboardView}
                onChange={handleUserPreferenceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="simple">Simple</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={userPreferences.language}
                onChange={handleUserPreferenceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">System Maintenance</h2>
        <div className="space-y-4">
          <div>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Clear Cache
            </button>
            <p className="text-sm text-gray-500 mt-1">
              Clear the system cache to resolve potential display issues.
            </p>
          </div>
          
          <div>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
              Backup Database
            </button>
            <p className="text-sm text-gray-500 mt-1">
              Create a backup of your donation system database.
            </p>
          </div>
          
          <div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Reset Settings
            </button>
            <p className="text-sm text-gray-500 mt-1">
              Reset all settings to default values. This cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;