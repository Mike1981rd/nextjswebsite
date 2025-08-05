'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

interface SelectOptionProps {
  value: string;
  children: ReactNode;
}

function SelectOption({ value, children }: SelectOptionProps) {
  return <div data-value={value}>{children}</div>;
}

export function Select({ 
  value, 
  onValueChange, 
  placeholder = 'Select an option',
  children,
  disabled = false,
  className 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const selectRef = useRef<HTMLDivElement>(null);

  // Extract options from children
  const options = Array.isArray(children) ? children : [children];

  // Find selected label
  useEffect(() => {
    const selectedOption = options.find((child: any) => {
      return child?.props?.value === value;
    });
    
    if (selectedOption) {
      setSelectedLabel(selectedOption.props.children);
    } else {
      setSelectedLabel('');
    }
  }, [value, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={cn('relative', className)}>
      {/* Select Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-3 text-left text-gray-900 shadow-sm transition-all duration-200',
          'hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
          'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
          isOpen && 'border-blue-500 ring-4 ring-blue-500/10'
        )}
      >
        <span className={cn(
          'block truncate',
          !selectedLabel && 'text-gray-500'
        )}>
          {selectedLabel || placeholder}
        </span>
        
        <ChevronDown className={cn(
          'h-5 w-5 text-gray-400 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="max-h-60 overflow-auto py-2">
            {options.map((child: any, index) => {
              const optionValue = child?.props?.value;
              const isSelected = optionValue === value;
              
              return (
                <button
                  key={optionValue || index}
                  type="button"
                  onClick={() => handleOptionClick(optionValue)}
                  className={cn(
                    'flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors duration-150',
                    'hover:bg-blue-50 hover:text-blue-700',
                    isSelected && 'bg-blue-100 text-blue-700 font-medium'
                  )}
                >
                  <span className="block truncate">
                    {child?.props?.children}
                  </span>
                  
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

Select.Option = SelectOption;

export { SelectOption };