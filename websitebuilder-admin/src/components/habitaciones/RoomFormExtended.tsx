'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import Toggle from '@/components/ui/Toggle';
import { 
  MapPinIcon,
  HomeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface ExtendedFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
  primaryColor: string;
}

export default function RoomFormExtended({ formData, setFormData, primaryColor }: ExtendedFieldsProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'location' | 'policies' | 'sleeping' | 'fees' | 'seo'>('location');

  // Initialize complex JSON fields if they don't exist
  useEffect(() => {
    if (!formData.houseRules) {
      setFormData({
        ...formData,
        houseRules: {
          checkInTime: '15:00',
          checkOutTime: '11:00',
          smokingAllowed: false,
          petsAllowed: false,
          eventsAllowed: false,
          quietHours: '22:00 - 08:00',
          additionalRules: []
        }
      });
    }
    if (!formData.cancellationPolicy) {
      setFormData({
        ...formData,
        cancellationPolicy: {
          type: 'flexible',
          description: '',
          fullRefundDays: 1,
          partialRefundPercent: 50
        }
      });
    }
    if (!formData.additionalFees) {
      setFormData({
        ...formData,
        additionalFees: {
          cleaningFee: 0,
          serviceFee: 0,
          securityDeposit: 0,
          petFee: 0,
          extraGuestFee: 0,
          extraGuestAfter: 2,
          weeklyDiscount: 0,
          monthlyDiscount: 0
        }
      });
    }
  }, []);

  const updateNestedField = (field: string, key: string, value: any) => {
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [key]: value
      }
    });
  };

  return (
    <div className="mt-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('location');
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'location'
                ? `border-[${primaryColor}] text-[${primaryColor}]`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MapPinIcon className="w-5 h-5 inline mr-2" />
            {t('rooms.location', 'Ubicación')}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('policies');
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'policies'
                ? `border-[${primaryColor}] text-[${primaryColor}]`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DocumentTextIcon className="w-5 h-5 inline mr-2" />
            {t('rooms.policies', 'Políticas')}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('sleeping');
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sleeping'
                ? `border-[${primaryColor}] text-[${primaryColor}]`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <HomeIcon className="w-5 h-5 inline mr-2" />
            {t('rooms.sleeping', 'Habitaciones')}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('fees');
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'fees'
                ? `border-[${primaryColor}] text-[${primaryColor}]`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CurrencyDollarIcon className="w-5 h-5 inline mr-2" />
            {t('rooms.fees', 'Tarifas')}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('seo');
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'seo'
                ? `border-[${primaryColor}] text-[${primaryColor}]`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MagnifyingGlassIcon className="w-5 h-5 inline mr-2" />
            SEO
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.streetAddress', 'Dirección')}
              </label>
              <input
                type="text"
                value={formData.streetAddress || ''}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                placeholder="Calle Principal 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.city', 'Ciudad')}
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.state', 'Estado/Provincia')}
              </label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.country', 'País')}
              </label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.postalCode', 'Código Postal')}
              </label>
              <input
                type="text"
                value={formData.postalCode || ''}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.neighborhood', 'Barrio/Vecindario')}
              </label>
              <input
                type="text"
                value={formData.neighborhood || ''}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.latitude', 'Latitud')}
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.latitude || ''}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.longitude', 'Longitud')}
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.longitude || ''}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Policies Tab */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-4">{t('rooms.houseRules', 'Reglas de la Casa')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.checkInTime', 'Hora de Check-in')}
                  </label>
                  <input
                    type="time"
                    value={formData.houseRules?.checkInTime || '15:00'}
                    onChange={(e) => updateNestedField('houseRules', 'checkInTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.checkOutTime', 'Hora de Check-out')}
                  </label>
                  <input
                    type="time"
                    value={formData.houseRules?.checkOutTime || '11:00'}
                    onChange={(e) => updateNestedField('houseRules', 'checkOutTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <Toggle
                    checked={formData.houseRules?.smokingAllowed || false}
                    onChange={(checked) => updateNestedField('houseRules', 'smokingAllowed', checked)}
                    label={t('rooms.smokingAllowed', 'Se permite fumar')}
                    size="medium"
                  />
                </div>

                <div className="col-span-2">
                  <Toggle
                    checked={formData.houseRules?.petsAllowed || false}
                    onChange={(checked) => updateNestedField('houseRules', 'petsAllowed', checked)}
                    label={t('rooms.petsAllowed', 'Se permiten mascotas')}
                    size="medium"
                  />
                </div>

                <div className="col-span-2">
                  <Toggle
                    checked={formData.houseRules?.eventsAllowed || false}
                    onChange={(checked) => updateNestedField('houseRules', 'eventsAllowed', checked)}
                    label={t('rooms.eventsAllowed', 'Se permiten eventos')}
                    size="medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.quietHours', 'Horas de silencio')}
                  </label>
                  <input
                    type="text"
                    value={formData.houseRules?.quietHours || '22:00 - 08:00'}
                    onChange={(e) => updateNestedField('houseRules', 'quietHours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-4">{t('rooms.cancellationPolicy', 'Política de Cancelación')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.policyType', 'Tipo de Política')}
                  </label>
                  <select
                    value={formData.cancellationPolicy?.type || 'flexible'}
                    onChange={(e) => updateNestedField('cancellationPolicy', 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="flexible">Flexible</option>
                    <option value="moderate">Moderada</option>
                    <option value="strict">Estricta</option>
                    <option value="super_strict">Súper Estricta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.policyDescription', 'Descripción')}
                  </label>
                  <textarea
                    value={formData.cancellationPolicy?.description || ''}
                    onChange={(e) => updateNestedField('cancellationPolicy', 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Safety and Property Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-4">{t('rooms.safetyAndProperty', 'Seguridad y Propiedad')}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.safetyInformation', 'Información de Seguridad')}
                  </label>
                  <textarea
                    value={formData.safetyAndProperty?.content || ''}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        safetyAndProperty: {
                          ...formData.safetyAndProperty,
                          content: e.target.value
                        }
                      });
                    }}
                    rows={5}
                    placeholder={t('rooms.safetyPlaceholder', 'Describe las medidas de seguridad, detectores de humo, extintores, salidas de emergencia, etc.')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Toggle
                    checked={formData.safetyAndProperty?.smokeDetector || false}
                    onChange={(checked) => {
                      setFormData({
                        ...formData,
                        safetyAndProperty: {
                          ...formData.safetyAndProperty,
                          smokeDetector: checked
                        }
                      });
                    }}
                    label={t('rooms.smokeDetector', 'Detector de humo')}
                    size="small"
                  />

                  <Toggle
                    checked={formData.safetyAndProperty?.carbonMonoxideDetector || false}
                    onChange={(checked) => {
                      setFormData({
                        ...formData,
                        safetyAndProperty: {
                          ...formData.safetyAndProperty,
                          carbonMonoxideDetector: checked
                        }
                      });
                    }}
                    label={t('rooms.carbonMonoxideDetector', 'Detector de monóxido')}
                    size="small"
                  />

                  <Toggle
                    checked={formData.safetyAndProperty?.fireExtinguisher || false}
                    onChange={(checked) => {
                      setFormData({
                        ...formData,
                        safetyAndProperty: {
                          ...formData.safetyAndProperty,
                          fireExtinguisher: checked
                        }
                      });
                    }}
                    label={t('rooms.fireExtinguisher', 'Extintor')}
                    size="small"
                  />

                  <Toggle
                    checked={formData.safetyAndProperty?.firstAidKit || false}
                    onChange={(checked) => {
                      setFormData({
                        ...formData,
                        safetyAndProperty: {
                          ...formData.safetyAndProperty,
                          firstAidKit: checked
                        }
                      });
                    }}
                    label={t('rooms.firstAidKit', 'Botiquín')}
                    size="small"
                  />
                </div>
              </div>
            </div>

            {/* Guest Maximum Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-4">{t('rooms.guestMaximum', 'Límites de Huéspedes')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.maxAdults', 'Máximo de adultos')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.guestMaximum?.maxAdults || formData.maxOccupancy || 2}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        guestMaximum: {
                          ...formData.guestMaximum,
                          maxAdults: parseInt(e.target.value)
                        }
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.maxChildren', 'Máximo de niños')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.guestMaximum?.maxChildren || 0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        guestMaximum: {
                          ...formData.guestMaximum,
                          maxChildren: parseInt(e.target.value)
                        }
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.maxInfants', 'Máximo de infantes')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.guestMaximum?.maxInfants || 0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        guestMaximum: {
                          ...formData.guestMaximum,
                          maxInfants: parseInt(e.target.value)
                        }
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.maxPets', 'Máximo de mascotas')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.guestMaximum?.maxPets || 0}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        guestMaximum: {
                          ...formData.guestMaximum,
                          maxPets: parseInt(e.target.value)
                        }
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('rooms.additionalGuestInfo', 'Información adicional sobre huéspedes')}
                </label>
                <textarea
                  value={formData.guestMaximum?.additionalInfo || ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      guestMaximum: {
                        ...formData.guestMaximum,
                        additionalInfo: e.target.value
                      }
                    });
                  }}
                  rows={3}
                  placeholder={t('rooms.guestInfoPlaceholder', 'Ej: Los niños menores de 2 años se hospedan gratis en cunas.')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sleeping Arrangements Tab */}
        {activeTab === 'sleeping' && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-4">{t('rooms.sleepingArrangements', 'Distribución de Habitaciones')}</h3>
              
              {/* Resumen General */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.totalBedrooms', 'Total de Habitaciones')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sleepingArrangements?.totalBedrooms || 1}
                    onChange={(e) => updateNestedField('sleepingArrangements', 'totalBedrooms', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.totalBeds', 'Total de Camas')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sleepingArrangements?.totalBeds || 1}
                    onChange={(e) => updateNestedField('sleepingArrangements', 'totalBeds', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('rooms.totalBathrooms', 'Total de Baños')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.sleepingArrangements?.totalBathrooms || 1}
                    onChange={(e) => updateNestedField('sleepingArrangements', 'totalBathrooms', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Detalle de Habitaciones */}
              <div className="space-y-4">
                <h4 className="font-medium text-md">{t('rooms.bedroomDetails', 'Detalle de Habitaciones')}</h4>
                
                {/* Habitación Principal */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h5 className="font-medium mb-3">{t('rooms.masterBedroom', 'Habitación Principal')}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Toggle
                      checked={formData.sleepingArrangements?.masterBedroom?.kingBed || false}
                      onChange={(checked) => {
                        const current = formData.sleepingArrangements?.masterBedroom || {};
                        setFormData({
                          ...formData,
                          sleepingArrangements: {
                            ...formData.sleepingArrangements,
                            masterBedroom: {
                              ...current,
                              kingBed: checked
                            }
                          }
                        });
                      }}
                      label={t('rooms.kingBed', 'Cama King')}
                      size="small"
                    />

                    <Toggle
                      checked={formData.sleepingArrangements?.masterBedroom?.queenBed || false}
                      onChange={(checked) => {
                        const current = formData.sleepingArrangements?.masterBedroom || {};
                        setFormData({
                          ...formData,
                          sleepingArrangements: {
                            ...formData.sleepingArrangements,
                            masterBedroom: {
                              ...current,
                              queenBed: checked
                            }
                          }
                        });
                      }}
                      label={t('rooms.queenBed', 'Cama Queen')}
                      size="small"
                    />

                    <Toggle
                      checked={formData.sleepingArrangements?.masterBedroom?.doubleBed || false}
                      onChange={(checked) => {
                        const current = formData.sleepingArrangements?.masterBedroom || {};
                        setFormData({
                          ...formData,
                          sleepingArrangements: {
                            ...formData.sleepingArrangements,
                            masterBedroom: {
                              ...current,
                              doubleBed: checked
                            }
                          }
                        });
                      }}
                      label={t('rooms.doubleBed', 'Cama Doble')}
                      size="small"
                    />

                    <Toggle
                      checked={formData.sleepingArrangements?.masterBedroom?.privateBathroom || false}
                      onChange={(checked) => {
                        const current = formData.sleepingArrangements?.masterBedroom || {};
                        setFormData({
                          ...formData,
                          sleepingArrangements: {
                            ...formData.sleepingArrangements,
                            masterBedroom: {
                              ...current,
                              privateBathroom: checked
                            }
                          }
                        });
                      }}
                      label={t('rooms.privateBathroom', 'Baño Privado')}
                      size="small"
                    />
                  </div>
                </div>

                {/* Habitaciones Adicionales */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h5 className="font-medium mb-3">{t('rooms.additionalRooms', 'Habitaciones Adicionales')}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('rooms.singleBeds', 'Camas Individuales')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.sleepingArrangements?.singleBeds || 0}
                        onChange={(e) => updateNestedField('sleepingArrangements', 'singleBeds', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('rooms.bunkBeds', 'Literas')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.sleepingArrangements?.bunkBeds || 0}
                        onChange={(e) => updateNestedField('sleepingArrangements', 'bunkBeds', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('rooms.sofaBeds', 'Sofá Cama')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.sleepingArrangements?.sofaBeds || 0}
                        onChange={(e) => updateNestedField('sleepingArrangements', 'sofaBeds', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('rooms.cribs', 'Cunas')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.sleepingArrangements?.cribs || 0}
                        onChange={(e) => updateNestedField('sleepingArrangements', 'cribs', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Espacios Comunes */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h5 className="font-medium mb-3">{t('rooms.commonSpaces', 'Espacios Comunes')}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Toggle
                      checked={formData.sleepingArrangements?.commonSpaces?.livingRoom || false}
                      onChange={(checked) => {
                        const current = formData.sleepingArrangements?.commonSpaces || {};
                        setFormData({
                          ...formData,
                          sleepingArrangements: {
                            ...formData.sleepingArrangements,
                            commonSpaces: {
                              ...current,
                              livingRoom: checked
                            }
                          }
                        });
                      }}
                      label={t('rooms.livingRoom', 'Sala de Estar')}
                      size="small"
                    />

                    <Toggle
                      checked={formData.sleepingArrangements?.commonSpaces?.kitchen || false}
                      onChange={(checked) => {
                        const current = formData.sleepingArrangements?.commonSpaces || {};
                        setFormData({
                          ...formData,
                          sleepingArrangements: {
                            ...formData.sleepingArrangements,
                            commonSpaces: {
                              ...current,
                              kitchen: checked
                            }
                          }
                        });
                      }}
                      label={t('rooms.kitchen', 'Cocina')}
                      size="small"
                    />

                    <Toggle
                      checked={formData.sleepingArrangements?.commonSpaces?.diningRoom || false}
                      onChange={(checked) => {
                        const current = formData.sleepingArrangements?.commonSpaces || {};
                        setFormData({
                          ...formData,
                          sleepingArrangements: {
                            ...formData.sleepingArrangements,
                            commonSpaces: {
                              ...current,
                              diningRoom: checked
                            }
                          }
                        });
                      }}
                      label={t('rooms.diningRoom', 'Comedor')}
                      size="small"
                    />

                    <Toggle
                      checked={formData.sleepingArrangements?.commonSpaces?.balcony || false}
                      onChange={(checked) => {
                        const current = formData.sleepingArrangements?.commonSpaces || {};
                        setFormData({
                          ...formData,
                          sleepingArrangements: {
                            ...formData.sleepingArrangements,
                            commonSpaces: {
                              ...current,
                              balcony: checked
                            }
                          }
                        });
                      }}
                      label={t('rooms.balcony', 'Balcón')}
                      size="small"
                    />

                    <Toggle
                      checked={formData.sleepingArrangements?.commonSpaces?.terrace || false}
                      onChange={(checked) => {
                        const current = formData.sleepingArrangements?.commonSpaces || {};
                        setFormData({
                          ...formData,
                          sleepingArrangements: {
                            ...formData.sleepingArrangements,
                            commonSpaces: {
                              ...current,
                              terrace: checked
                            }
                          }
                        });
                      }}
                      label={t('rooms.terrace', 'Terraza')}
                      size="small"
                    />

                    <Toggle
                      checked={formData.sleepingArrangements?.commonSpaces?.garden || false}
                      onChange={(checked) => {
                        const current = formData.sleepingArrangements?.commonSpaces || {};
                        setFormData({
                          ...formData,
                          sleepingArrangements: {
                            ...formData.sleepingArrangements,
                            commonSpaces: {
                              ...current,
                              garden: checked
                            }
                          }
                        });
                      }}
                      label={t('rooms.garden', 'Jardín')}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Fees Tab */}
        {activeTab === 'fees' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.cleaningFee', 'Tarifa de Limpieza')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.additionalFees?.cleaningFee || 0}
                onChange={(e) => updateNestedField('additionalFees', 'cleaningFee', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.serviceFee', 'Tarifa de Servicio')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.additionalFees?.serviceFee || 0}
                onChange={(e) => updateNestedField('additionalFees', 'serviceFee', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.securityDeposit', 'Depósito de Seguridad')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.additionalFees?.securityDeposit || 0}
                onChange={(e) => updateNestedField('additionalFees', 'securityDeposit', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.petFee', 'Tarifa por Mascota')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.additionalFees?.petFee || 0}
                onChange={(e) => updateNestedField('additionalFees', 'petFee', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.weeklyDiscount', 'Descuento Semanal (%)')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.additionalFees?.weeklyDiscount || 0}
                onChange={(e) => updateNestedField('additionalFees', 'weeklyDiscount', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.monthlyDiscount', 'Descuento Mensual (%)')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.additionalFees?.monthlyDiscount || 0}
                onChange={(e) => updateNestedField('additionalFees', 'monthlyDiscount', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.slug', 'URL Amigable (Slug)')}
              </label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                placeholder="habitacion-deluxe-vista-mar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.metaTitle', 'Título Meta (SEO)')}
              </label>
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                maxLength={70}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.metaTitle?.length || 0}/70 caracteres
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('rooms.metaDescription', 'Descripción Meta (SEO)')}
              </label>
              <textarea
                value={formData.metaDescription || ''}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                maxLength={160}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.metaDescription?.length || 0}/160 caracteres
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}