'use client';

import React from 'react';

interface PreviewFooterProps {
  config: any;
  theme: any;
}

export default function PreviewFooter({ config, theme }: PreviewFooterProps) {
  // Footer will be implemented when FooterEditor is ready
  // For now, return a placeholder
  
  const footerConfig = {
    backgroundColor: config?.backgroundColor || '#111111',
    textColor: config?.textColor || '#ffffff',
    copyright: config?.copyright || `© ${new Date().getFullYear()} Todos los derechos reservados`,
    showSocialLinks: config?.showSocialLinks !== false,
    showPaymentIcons: config?.showPaymentIcons !== false,
  };

  return (
    <footer 
      className="mt-auto border-t"
      style={{ 
        backgroundColor: footerConfig.backgroundColor,
        color: footerConfig.textColor 
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-sm opacity-75">
            {footerConfig.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}