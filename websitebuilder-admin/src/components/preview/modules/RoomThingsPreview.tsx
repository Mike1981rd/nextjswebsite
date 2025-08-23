'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import IconRenderer from '@/components/ui/IconRenderer';
import useThemeConfigStore from '@/stores/useThemeConfigStore';
import { useConfigOptions } from '@/hooks/useConfigOptions';
// import { useI18n } from '@/contexts/I18nContext';

interface RoomThingsConfig {
  enabled: boolean;
  title: string;
  houseRules: string[];
  safetyProperty: string[];
  cancellationPolicy: string[];
  showMoreButton: boolean;
  colorScheme?: string;
}

// For richer rendering with optional icon metadata
interface ResolvedItem {
  key: string;
  label: string;
  icon?: string;
  iconType?: string;
}

interface RoomThingsPreviewProps {
  config?: RoomThingsConfig;
  settings?: RoomThingsConfig;
  deviceView?: 'mobile' | 'desktop';
  isEditor?: boolean;
  theme?: any;
}

// No hardcoded data - only use what comes from the editor
const defaultConfig: RoomThingsConfig = {
  enabled: true,
  title: 'Things to know',
  houseRules: [],
  safetyProperty: [],
  cancellationPolicy: [],
  showMoreButton: true,
  colorScheme: '1'
};

export default function RoomThingsPreview({ 
  config,
  settings,
  deviceView,
  isEditor = false,
  theme
}: RoomThingsPreviewProps) {
  // Support both config and settings props for compatibility
  const actualConfig = config || settings || defaultConfig;
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<any>(null);

  // Catalog options for mapping boolean flags to labels
  const { options: houseRulesOptions } = useConfigOptions('house_rules');
  const { options: safetyOptions } = useConfigOptions('safety_property');
  const { options: cancellationOptions } = useConfigOptions('cancellation_policies');
  
  // Get theme config from store if not passed as prop
  const { config: themeConfigFromStore } = useThemeConfigStore();
  const themeConfig = theme || themeConfigFromStore;
  
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });

  useEffect(() => {
    if (deviceView !== undefined) {
      setIsMobile(deviceView === 'mobile');
      return;
    }
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [deviceView]);

  // Load real room data when syncing is enabled (default true in editor)
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5266/api';
        const token = localStorage.getItem('token');
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

        // Try to resolve a room id to load
        let roomId = localStorage.getItem('selectedRoomId') || undefined;
        if (!roomId) {
          const companyId = parseInt(localStorage.getItem('companyId') || '1');
          if (companyId) {
            const resp = await fetch(`${API_URL}/rooms/company/${companyId}/public`, {
              headers: authHeaders
            });
            if (resp.ok) {
              const rooms = await resp.json();
              if (Array.isArray(rooms) && rooms.length > 0 && rooms[0]?.id) {
                roomId = String(rooms[0].id);
                localStorage.setItem('selectedRoomId', roomId);
              }
            }
          }
        }

        if (!roomId) return;

        const response = await fetch(`${API_URL}/rooms/${roomId}`, {
          headers: authHeaders
        });
        if (response.ok) {
          const data = await response.json();
          setRoomData(data);
        }
      } catch (err) {
        console.error('RoomThingsPreview: error loading room data', err);
      }
    };

    if (actualConfig.enabled && ((actualConfig as any).syncWithRoom ?? true)) {
      fetchRoomData();
    }
  }, [actualConfig.enabled, (actualConfig as any).syncWithRoom]);

  // Get the selected color scheme
  const colorScheme = useMemo(() => {
    if (!themeConfig?.colorSchemes?.schemes) {
      // Fallback colors if no theme config
      return {
        text: '#000000',
        background: '#FFFFFF',
        solidButton: '#000000',
        solidButtonText: '#FFFFFF',
        outlineButton: '#000000',
        outlineButtonText: '#000000',
        link: '#0066CC',
        border: '#E5E5E5',
        foreground: '#F5F5F5',
        textSecondary: '#666666'
      };
    }
    
    // actualConfig.colorScheme is "1", "2", etc. - convert to index
    const schemeIndex = parseInt(actualConfig.colorScheme || '1') - 1;
    const selectedScheme = themeConfig.colorSchemes.schemes[schemeIndex];
    
    return selectedScheme || themeConfig.colorSchemes.schemes[0];
  }, [themeConfig, actualConfig.colorScheme]);
  
  if (!actualConfig.enabled) return null;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderSection = (title: string, items: (string | ResolvedItem)[], sectionKey: string) => {
    const isExpanded = expandedSection === sectionKey;
    const displayItems = isExpanded ? items : items.slice(0, 3);
    
    // Don't render section if no items
    if (!items || items.length === 0) return null;
    
    return (
      <div className="space-y-3">
        <h3 
          className="font-semibold text-base"
          style={{ color: colorScheme.text || '#000000' }}
        >
          {title}
        </h3>
        <ul className="space-y-2">
          {displayItems.map((item, index) => {
            const isObject = typeof item === 'object' && item !== null;
            const label = isObject ? (item as ResolvedItem).label : (item as string);
            const icon = isObject ? (item as ResolvedItem).icon : undefined;
            const iconType = isObject ? (item as ResolvedItem).iconType : undefined;
            return (
              <li 
                key={index} 
                className="text-sm flex items-center gap-2"
                style={{ color: colorScheme.textSecondary || colorScheme.text || '#666666' }}
              >
                {icon && (
                  <IconRenderer icon={icon} iconType={iconType as any} className="h-4 w-4" />
                )}
                <span>{label}</span>
              </li>
            );
          })}
        </ul>
        {items.length > 3 && actualConfig.showMoreButton && (
          <button
            onClick={() => toggleSection(sectionKey)}
            className="text-sm font-medium underline hover:no-underline flex items-center gap-1"
            style={{ color: colorScheme.link || '#0066CC' }}
          >
            {isExpanded ? 'Show less' : `Show more`}
            <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>
    );
  };

  // Build House Rules from room data if available
  const resolvedHouseRules = useMemo(() => {
    const rules: (string | ResolvedItem)[] = [];
    let hr = roomData?.houseRules as any;
    if (hr) {
      // Log available keys to help diagnose mismatches
      if (typeof hr === 'object' && !Array.isArray(hr)) {
        try { console.debug('[RoomThingsPreview] houseRules keys:', Object.keys(hr)); } catch {}
      }

      // Helper to read boolean flags using several key variants
      const readFlag = (obj: any, key: string) => {
        if (!obj) return undefined;
        const snake = key.replace(/([A-Z])/g, '_$1').toLowerCase(); // smokingAllowed -> smoking_allowed
        const pascal = key.charAt(0).toUpperCase() + key.slice(1);   // SmokingAllowed
        const lower = key.toLowerCase();
        const candidates = [key, snake, pascal, lower];
        for (const k of candidates) {
          if (Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
        }
        return undefined;
      };

      if (typeof hr === 'string') {
        const trimmed = hr.trim();
        // If the string looks like JSON, parse it first
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try {
            const parsed = JSON.parse(trimmed);
            hr = parsed;
          } catch {
            // Fallback to CSV splitting if not valid JSON
            rules.push(
              ...trimmed
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
            );
          }
        } else {
          // Plain CSV string
          rules.push(
            ...trimmed
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean)
          );
        }
      } else if (Array.isArray(hr)) {
        rules.push(...hr.filter((s: any) => typeof s === 'string' && s.trim()).map((s: string) => s.trim()));
      } else if (typeof hr === 'object') {
        // Order-aware iteration of rule toggles using houseRulesOrder if present
        // Order from localStorage override (live editor) or backend
        let order: string[] = [];
        try {
          const ls = localStorage.getItem('room_houseRulesOrder');
          if (ls) order = JSON.parse(ls);
        } catch {}
        if (!Array.isArray(order) || order.length === 0) {
          order = Array.isArray((roomData as any)?.houseRulesOrder)
            ? ((roomData as any).houseRulesOrder as string[])
            : [];
        }
        const orderedValues = [
          ...order.filter((v) => houseRulesOptions.some(o => o.value === v)),
          ...houseRulesOptions.map(o => o.value).filter(v => !order.includes(v))
        ];
        orderedValues.forEach((valueKey) => {
          const opt = houseRulesOptions.find(o => o.value === valueKey) as any;
          const value = readFlag(hr, String(valueKey));
          if (value === true) {
            rules.push({ key: String(valueKey), label: opt?.label || String(valueKey), icon: opt?.icon, iconType: opt?.iconType });
          } else if (value === false && String(valueKey).includes('Allowed')) {
            const noLabel = (opt?.label || String(valueKey))
              .replace('Se permite', 'No se permite')
              .replace('Se permiten', 'No se permiten')
              .replace('Allowed', 'not allowed')
              .replace('allowed', 'not allowed');
            rules.push({ key: `no_${String(valueKey)}`, label: noLabel, icon: opt?.icon, iconType: opt?.iconType });
          }
        });
      }
    }
    // Debug current resolution path
    if (typeof window !== 'undefined') {
      try { console.debug('[RoomThingsPreview] Resolved house rules:', rules); } catch {}
    }
    return rules.length > 0 ? rules : (actualConfig.houseRules || []);
  }, [roomData, houseRulesOptions, actualConfig.houseRules]);

  // Build Safety & Property from room data if available
  const resolvedSafetyProperty = useMemo(() => {
    const safety: (string | ResolvedItem)[] = [];
    const sp = roomData?.safetyAndProperty;
    if (sp) {
      if (typeof sp === 'string') {
        const trimmed = sp.trim();
        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
              safety.push(...parsed.filter((s: any) => typeof s === 'string' && s.trim()).map((s: string) => s.trim()));
            }
          } catch {
            safety.push(...trimmed.split(',').map(s => s.trim()).filter(Boolean));
          }
        } else {
          safety.push(...trimmed.split(',').map(s => s.trim()).filter(Boolean));
        }
      } else if (Array.isArray(sp)) {
        safety.push(...sp.filter((s: any) => typeof s === 'string' && s.trim()).map((s: string) => s.trim()));
      } else if (typeof sp === 'object') {
        let order: string[] = [];
        try {
          const ls = localStorage.getItem('room_safetyAndPropertyOrder');
          if (ls) order = JSON.parse(ls);
        } catch {}
        if (!Array.isArray(order) || order.length === 0) {
          order = Array.isArray((roomData as any)?.safetyAndPropertyOrder)
            ? ((roomData as any).safetyAndPropertyOrder as string[])
            : [];
        }
        const orderedValues = [
          ...order.filter((v) => safetyOptions.some(o => o.value === v)),
          ...safetyOptions.map(o => o.value).filter(v => !order.includes(v))
        ];
        orderedValues.forEach((valueKey) => {
          const opt = safetyOptions.find(o => o.value === valueKey) as any;
          const value = (sp as any)[valueKey as keyof typeof sp];
          if (value === true) safety.push({ key: String(valueKey), label: opt?.label || String(valueKey), icon: opt?.icon, iconType: opt?.iconType });
        });
      }
    }
    // Additional custom safety text
    if (roomData?.safetyFeatures) {
      if (typeof roomData.safetyFeatures === 'string') safety.push(roomData.safetyFeatures);
      else if (Array.isArray(roomData.safetyFeatures)) safety.push(...roomData.safetyFeatures);
    }
    return safety.length > 0 ? safety : (actualConfig.safetyProperty || []);
  }, [roomData, safetyOptions, actualConfig.safetyProperty]);

  // Build Cancellation Policy from room data if available
  const resolvedCancellationPolicy = useMemo(() => {
    const policies: (string | ResolvedItem)[] = [];
    const cp = roomData?.cancellationPolicy;
    if (cp && typeof cp === 'object') {
      // Ignore legacy cp.type select; we now rely solely on catalog toggles and optional description
      if (cp.description) policies.push(cp.description);
      let order: string[] = [];
      try {
        const ls = localStorage.getItem('room_cancellationPolicyOrder');
        if (ls) order = JSON.parse(ls);
      } catch {}
      if (!Array.isArray(order) || order.length === 0) {
        order = Array.isArray((roomData as any)?.cancellationPolicyOrder)
          ? ((roomData as any).cancellationPolicyOrder as string[])
          : [];
      }
      const orderedValues = [
        ...order.filter((v) => cancellationOptions.some(o => o.value === v)),
        ...cancellationOptions.map(o => o.value).filter(v => !order.includes(v))
      ];
      orderedValues.forEach((valueKey) => {
        const opt = cancellationOptions.find(o => o.value === valueKey) as any;
        const value = (cp as any)[valueKey as keyof typeof cp];
        if (value === true) policies.push({ key: String(valueKey), label: opt?.label || String(valueKey), icon: opt?.icon, iconType: opt?.iconType });
      });
    }
    return policies.length > 0 ? policies : (actualConfig.cancellationPolicy || []);
  }, [roomData, cancellationOptions, actualConfig.cancellationPolicy]);

  // Check if any section has data
  const hasAnyData = (resolvedHouseRules && resolvedHouseRules.length > 0) ||
                     (resolvedSafetyProperty && resolvedSafetyProperty.length > 0) ||
                     (resolvedCancellationPolicy && resolvedCancellationPolicy.length > 0);

  if (!hasAnyData && !isEditor) {
    // Don't render anything if there's no data and we're not in editor
    return null;
  }

  return (
    <div 
      className="py-12 px-4 md:px-6 lg:px-8"
      style={{
        borderTop: `1px solid ${colorScheme.border || '#E5E5E5'}`,
        backgroundColor: colorScheme.background || '#FFFFFF'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 
          className="text-2xl font-semibold mb-8"
          style={{ color: colorScheme.text || '#000000' }}
        >
          {actualConfig.title}
        </h2>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-1 md:grid-cols-3 gap-8 md:gap-12'}`}>
          {/* House Rules */}
          {resolvedHouseRules && resolvedHouseRules.length > 0 && (
            <div>
              {renderSection('House rules', resolvedHouseRules, 'houseRules')}
            </div>
          )}

          {/* Safety & Property */}
          {resolvedSafetyProperty && resolvedSafetyProperty.length > 0 && (
            <div>
              {renderSection('Safety & property', resolvedSafetyProperty, 'safetyProperty')}
            </div>
          )}

          {/* Cancellation Policy */}
          {resolvedCancellationPolicy && resolvedCancellationPolicy.length > 0 && (
            <div>
              {renderSection('Cancellation policy', resolvedCancellationPolicy, 'cancellationPolicy')}
            </div>
          )}
        </div>

        {/* Additional info - only show if there are sections with data */}
        {hasAnyData && (
          <div 
            className="mt-8 p-4 rounded-lg"
            style={{ backgroundColor: colorScheme.foreground || '#F5F5F5' }}
          >
            <div className="flex items-start gap-2">
              <Info 
                className="w-5 h-5 mt-0.5"
                style={{ color: colorScheme.textSecondary || '#666666' }}
              />
              <p 
                className="text-sm"
                style={{ color: colorScheme.textSecondary || '#666666' }}
              >
                Our community is committed to reliability. Hosts are required to disclose known cameras, 
                and are never permitted in private spaces like bathrooms or sleeping areas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}