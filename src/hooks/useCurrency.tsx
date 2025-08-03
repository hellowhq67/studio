'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

type Currency = 'USD' | 'BDT';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const BDT_EXCHANGE_RATE = 117.50; // 1 USD = 117.50 BDT (example rate)

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  const setCurrency = (newCurrency: Currency) => {
    if (newCurrency !== currency) {
        setCurrencyState(newCurrency);
    }
  };

  const formatPrice = useCallback((price: number) => {
    if (currency === 'BDT') {
      const convertedPrice = price * BDT_EXCHANGE_RATE;
      return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
      }).format(convertedPrice);
    }
    // Default to USD
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }, [currency]);

  const value = useMemo(() => ({
    currency,
    setCurrency,
    formatPrice,
    exchangeRate: BDT_EXCHANGE_RATE,
  }), [currency, formatPrice]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
