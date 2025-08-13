import React from 'react';
import { ProductCardsConfig } from '@/types/theme/productCards';

interface ProductCardsSectionProps {
  localProductCards: ProductCardsConfig;
  setLocalProductCards: React.Dispatch<React.SetStateAction<ProductCardsConfig>>;
  setIsEditing?: (value: boolean) => void;
}

export function ProductCardsSection({ localProductCards, setLocalProductCards, setIsEditing }: ProductCardsSectionProps) {
  return (
    <div className="space-y-4">
      {/* Relación de imagen */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Relación de imagen predeterminada
        </label>
        <select 
          className="w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={localProductCards?.image?.defaultRatio || 'square-1-1-fill'}
          onChange={(e) => {
            setIsEditing?.(true);
            setLocalProductCards(prev => ({
              ...prev,
              image: { ...prev.image, defaultRatio: e.target.value as any }
            }));
          }}
        >
          <option value="square-1-1-fill">Cuadrado (1:1) - Llenar</option>
          <option value="portrait-large-2-3-fill">Retrato grande (2:3) - Llenar</option>
          <option value="portrait-3-4-fill">Retrato (3:4) - Llenar</option>
          <option value="portrait-large-2-3-fit">Retrato grande (2:3) - Ajustar</option>
          <option value="horizontal-4-3-fill">Horizontal (4:3) - Llenar</option>
          <option value="square-1-1-fit">Cuadrado (1:1) - Ajustar</option>
          <option value="portrait-3-4-fit">Retrato (3:4) - Ajustar</option>
          <option value="horizontal-4-3-fit">Horizontal (4:3) - Ajustar</option>
        </select>
      </div>

      {/* Toggles de visibilidad */}
      {[
        { key: 'showVendor', label: 'Mostrar proveedor' },
        { key: 'showCurrencyCode', label: 'Mostrar código de moneda' },
        { key: 'showColorCount', label: 'Mostrar cantidad de colores' },
        { key: 'colorizeCardBackground', label: 'Colorear fondo de tarjeta' },
        { key: 'darkenImageBackground', label: 'Oscurecer fondo de imagen' }
      ].map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">{label}</label>
          <button
            onClick={() => {
              setIsEditing?.(true);
              setLocalProductCards(prev => ({
                ...prev,
                visibility: { 
                  ...prev.visibility, 
                  [key]: !prev.visibility[key as keyof typeof prev.visibility] 
                }
              }));
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              localProductCards?.visibility?.[key as keyof typeof localProductCards.visibility] 
                ? 'bg-green-500' 
                : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              localProductCards?.visibility?.[key as keyof typeof localProductCards.visibility]
                ? 'translate-x-5' 
                : 'translate-x-1'
            }`} />
          </button>
        </div>
      ))}

      {/* Calificación del producto */}
      <div className="pt-2 border-t border-gray-200">
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Calificación del producto
        </label>
        <select 
          className="w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={localProductCards?.rating?.productRating || 'average-and-stars'}
          onChange={(e) => {
            setIsEditing?.(true);
            setLocalProductCards(prev => ({
              ...prev,
              rating: { ...prev.rating, productRating: e.target.value as any }
            }));
          }}
        >
          <option value="average-and-stars">Calificación promedio y estrellas</option>
          <option value="none">Ninguno</option>
          <option value="stars-only">Solo estrellas</option>
          <option value="reviews-count-only">Solo conteo de reseñas</option>
          <option value="average-only">Solo calificación promedio</option>
          <option value="reviews-and-stars">Conteo de reseñas y estrellas</option>
        </select>
      </div>

      {/* Tamaño de etiqueta de precio */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Tamaño de etiqueta de precio
        </label>
        <select 
          className="w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={localProductCards?.price?.labelSize || 'large'}
          onChange={(e) => {
            setIsEditing?.(true);
            setLocalProductCards(prev => ({
              ...prev,
              price: { ...prev.price, labelSize: e.target.value as any }
            }));
          }}
        >
          <option value="extra-small">Extra pequeño</option>
          <option value="small">Pequeño</option>
          <option value="medium">Mediano</option>
          <option value="large">Grande</option>
        </select>
      </div>

      {/* Efecto de imagen al pasar el cursor */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Efecto de imagen al pasar el cursor
        </label>
        <select 
          className="w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={localProductCards?.effects?.hoverEffect || 'none'}
          onChange={(e) => {
            setIsEditing?.(true);
            setLocalProductCards(prev => ({
              ...prev,
              effects: { ...prev.effects, hoverEffect: e.target.value as any }
            }));
          }}
        >
          <option value="none">Ninguno</option>
          <option value="zoom">Zoom</option>
          <option value="show-all-media">Mostrar todos los medios</option>
          <option value="show-second-media">Mostrar segundo medio</option>
        </select>
      </div>

      {/* Sección de Muestras */}
      <div className="pt-3 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Muestras
        </h4>
        
        {/* Qué mostrar */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Qué mostrar
          </label>
          <select 
            className="w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={localProductCards?.swatches?.whatToShow || 'color-swatches'}
            onChange={(e) => {
              setIsEditing?.(true);
              setLocalProductCards(prev => ({
                ...prev,
                swatches: { ...prev.swatches, whatToShow: e.target.value as any }
              }));
            }}
          >
            <option value="color-swatches">Muestras de color</option>
            <option value="variant-images">Imágenes de variantes</option>
            <option value="both">Ambos</option>
          </select>
        </div>

        {/* Posición en escritorio */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Posición en escritorio
          </label>
          <select 
            className="w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={localProductCards?.swatches?.desktopPosition || 'below-image'}
            onChange={(e) => {
              setIsEditing?.(true);
              setLocalProductCards(prev => ({
                ...prev,
                swatches: { ...prev.swatches, desktopPosition: e.target.value as any }
              }));
            }}
          >
            <option value="on-image">En la imagen</option>
            <option value="below-image">Debajo de la imagen</option>
            <option value="above-title">Encima del título</option>
          </select>
        </div>

        {/* Posición en móvil */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Posición en móvil
          </label>
          <select 
            className="w-full px-2 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={localProductCards?.swatches?.mobilePosition || 'below-image'}
            onChange={(e) => {
              setIsEditing?.(true);
              setLocalProductCards(prev => ({
                ...prev,
                swatches: { ...prev.swatches, mobilePosition: e.target.value as any }
              }));
            }}
          >
            <option value="on-image">En la imagen</option>
            <option value="below-image">Debajo de la imagen</option>
            <option value="above-title">Encima del título</option>
          </select>
        </div>

        {/* Ocultar para productos de un solo color */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">
            Ocultar para productos de un solo color
          </label>
          <button
            onClick={() => {
              setIsEditing?.(true);
              setLocalProductCards(prev => ({
                ...prev,
                swatches: { 
                  ...prev.swatches, 
                  hideForSingleColor: !prev.swatches.hideForSingleColor 
                }
              }));
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              localProductCards?.swatches?.hideForSingleColor ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              localProductCards?.swatches?.hideForSingleColor ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Sección de Botones */}
      <div className="pt-3 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Botones de compra rápida
        </h4>

        {/* Quick Buy */}
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">
            Compra rápida
          </label>
          <button
            onClick={() => {
              setIsEditing?.(true);
              setLocalProductCards(prev => ({
                ...prev,
                buttons: { ...prev.buttons, quickBuy: !prev.buttons.quickBuy }
              }));
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              localProductCards?.buttons?.quickBuy ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              localProductCards?.buttons?.quickBuy ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Vista rápida */}
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">
            Mostrar "Vista rápida"
          </label>
          <button
            onClick={() => {
              setIsEditing?.(true);
              setLocalProductCards(prev => ({
                ...prev,
                buttons: { ...prev.buttons, showQuickView: !prev.buttons.showQuickView }
              }));
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              localProductCards?.buttons?.showQuickView ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              localProductCards?.buttons?.showQuickView ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Agregar al carrito */}
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">
            Mostrar "Agregar al carrito"
          </label>
          <button
            onClick={() => {
              setIsEditing?.(true);
              setLocalProductCards(prev => ({
                ...prev,
                buttons: { ...prev.buttons, showAddToCart: !prev.buttons.showAddToCart }
              }));
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              localProductCards?.buttons?.showAddToCart ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              localProductCards?.buttons?.showAddToCart ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Estilo de botón en escritorio */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Estilo de botón en escritorio
          </label>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setIsEditing?.(true);
                setLocalProductCards(prev => ({
                  ...prev,
                  buttons: { ...prev.buttons, desktopStyle: 'labels' }
                }));
              }}
              className={`flex-1 px-3 py-1.5 text-xs rounded-md ${
                localProductCards?.buttons?.desktopStyle === 'labels' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Etiquetas
            </button>
            <button 
              onClick={() => {
                setIsEditing?.(true);
                setLocalProductCards(prev => ({
                  ...prev,
                  buttons: { ...prev.buttons, desktopStyle: 'icons' }
                }));
              }}
              className={`flex-1 px-3 py-1.5 text-xs rounded-md ${
                localProductCards?.buttons?.desktopStyle === 'icons' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Íconos
            </button>
          </div>
        </div>

        {/* Mostrar botones al pasar el cursor */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">
            Mostrar botones al pasar el cursor
          </label>
          <button
            onClick={() => {
              setIsEditing?.(true);
              setLocalProductCards(prev => ({
                ...prev,
                buttons: { ...prev.buttons, showOnHover: !prev.buttons.showOnHover }
              }));
            }}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              localProductCards?.buttons?.showOnHover ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              localProductCards?.buttons?.showOnHover ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}