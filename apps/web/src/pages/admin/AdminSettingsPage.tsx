import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Save, Store, CreditCard, Truck, Mail } from 'lucide-react';
import { api } from '../../services/api';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'E-Commerce Store',
    storeEmail: 'store@example.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Main St, City, State 12345',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: false,
    stripePublicKey: '',
    stripeSecretKey: '',
    paypalClientId: '',
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 100,
    standardShippingRate: 9.99,
    expressShippingRate: 19.99,
  });

  const [shippingZones, setShippingZones] = useState([
    { id: 1, name: 'Domestic', rate: 5.99 },
    { id: 2, name: 'International', rate: 15.99 },
  ]);

  const [showZoneModal, setShowZoneModal] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', rate: '' });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => api.put('/admin/settings', data),
    onSuccess: () => {
      toast.success('Settings updated successfully');
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({ type: 'general', data: generalSettings });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({ type: 'payment', data: paymentSettings });
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({ type: 'shipping', data: shippingSettings });
  };
  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingZones([...shippingZones, { id: Date.now(), ...newZone, rate: parseFloat(newZone.rate) }]);
    setShowZoneModal(false);
    setNewZone({ name: '', rate: '' });
  };
  return (
    <div data-testid="admin-settings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <nav className="bg-white rounded-lg shadow-sm p-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                activeTab === 'general' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Store className="h-5 w-5" />
              General
            </button>
            <button
              data-testid="payment-settings"
              onClick={() => setActiveTab('payment')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                activeTab === 'payment' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              Payment
            </button>
            <button
              data-testid="shipping-settings"
              onClick={() => setActiveTab('shipping')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                activeTab === 'shipping' ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Truck className="h-5 w-5" />
              Shipping
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
              <form onSubmit={handleGeneralSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    data-testid="store-name"
                    value={generalSettings.storeName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, storeName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Email
                  </label>
                  <input
                    type="email"
                    data-testid="store-email"
                    value={generalSettings.storeEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, storeEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Phone
                  </label>
                  <input
                    type="tel"
                    value={generalSettings.storePhone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, storePhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Address
                  </label>
                  <textarea
                    value={generalSettings.storeAddress}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, storeAddress: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  data-testid="save-settings"
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Settings</h2>
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div data-testid="payment-providers" className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">Stripe</h3>
                        <p className="text-sm text-gray-500">Accept credit card payments</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      data-testid="toggle-stripe"
                      onClick={() => setPaymentSettings({ ...paymentSettings, stripeEnabled: !paymentSettings.stripeEnabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        paymentSettings.stripeEnabled ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          paymentSettings.stripeEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-8 w-8 text-blue-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">PayPal</h3>
                        <p className="text-sm text-gray-500">Accept PayPal payments</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      data-testid="toggle-paypal"
                      onClick={() => setPaymentSettings({ ...paymentSettings, paypalEnabled: !paymentSettings.paypalEnabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        paymentSettings.paypalEnabled ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          paymentSettings.paypalEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipping Settings</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div data-testid="shipping-zones" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Free Shipping Threshold
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={shippingSettings.freeShippingThreshold}
                        onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: parseFloat(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Orders above this amount ship free</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Standard Shipping Rate
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={shippingSettings.standardShippingRate}
                        onChange={(e) => setShippingSettings({ ...shippingSettings, standardShippingRate: parseFloat(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Express Shipping Rate
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={shippingSettings.expressShippingRate}
                        onChange={(e) => setShippingSettings({ ...shippingSettings, expressShippingRate: parseFloat(e.target.value) })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {shippingZones.map((zone) => (
                      <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{zone.name}</span>
                        <span className="text-gray-600">${zone.rate.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    data-testid="add-shipping-zone"
                    onClick={() => setShowZoneModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Add Shipping Zone
                  </button>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
              </form>

              {/* Shipping Zone Modal */}
              {showZoneModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowZoneModal(false)}></div>
                    <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Shipping Zone</h3>
                        <form onSubmit={handleAddZone} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Zone Name</label>
                            <input
                              data-testid="zone-name"
                              type="text"
                              required
                              value={newZone.name}
                              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Rate</label>
                            <input
                              data-testid="zone-rate"
                              type="number"
                              step="0.01"
                              required
                              value={newZone.rate}
                              onChange={(e) => setNewZone({ ...newZone, rate: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>
                          <div className="flex gap-3 pt-4">
                            <button
                              type="submit"
                              data-testid="save-zone"
                              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                            >
                              Add Zone
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowZoneModal(false)}
                              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
