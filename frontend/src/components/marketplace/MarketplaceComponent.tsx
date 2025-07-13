/*
 * File: MarketplaceComponent.tsx
 * Path: C:\CFH\frontend\src\components\marketplace\MarketplaceComponent.tsx
 * Purpose: Search for vehicles and services in the CFH Marketplace
 * Author: CFH Dev Team
 * Date: 2025-06-22T20:30:00.000Z
 * Batch ID: Marketplace-062225
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../i18n';
import { analyticsApi } from '../../services/analyticsApi';

type UserTier = 'Free' | 'Standard' | 'Premium' | 'Wow++';

interface SearchFilters {
  keywords?: string;
  category?: 'Vehicles' | 'Services';
  make?: string;
  model?: string;
  year?: string;
  zipCode?: string;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  bodyStyle?: string;
  engine?: string;
  color?: string;
}

interface Listing {
  listingId: string;
  title: string;
  price: number;
  imageUrl: string;
  location: string;
  providerRating: number;
  type: 'Vehicle' | 'Service';
}

interface MarketplaceComponentProps {
  userTier: UserTier;
}

const MarketplaceComponent: React.FC<MarketplaceComponentProps> = ({ userTier }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<SearchFilters>({ category: 'Vehicles' });
  const [results, setResults] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'distance'>('price');
  const [savedSearches, setSavedSearches] = useState<number>(0);

  const hasPermission = (requiredTier: UserTier): boolean => {
    const tierLevels = { Free: 0, Standard: 1, Premium: 2, 'Wow++': 3 };
    return tierLevels[userTier] >= tierLevels[requiredTier];
  };

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyticsApi.searchMarketplace({ ...filters, sortBy });
      if (!response.data.length) {
        setError(t('marketplace.error.noResults'));
      }
      setResults(response.data || []);
    } catch (err) {
      setError(t('marketplace.error.searchFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy, t]);

  const handleSaveSearch = async () => {
    if (savedSearches >= 3 && !hasPermission('Premium')) {
      setError(t('marketplace.error.maxSearches'));
      return;
    }
    try {
      await analyticsApi.saveSearch({ ...filters });
      setSavedSearches(savedSearches + 1);
    } catch (err) {
      setError(t('marketplace.error.saveSearch'));
    }
  };

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="marketplace-container" role="main" aria-label={t('marketplace.title')}>
      <h1>{t('marketplace.title')}</h1>
      <div className="search-bar">
        <input
          type="text"
          name="keywords"
          value={filters.keywords || ''}
          onChange={handleFilterChange}
          placeholder={hasPermission('Standard') ? t('marketplace.searchUnified') : t('marketplace.searchPlaceholder')}
          aria-label={t('marketplace.searchLabel')}
          onKeyDown={(e) => e.key === 'Enter' && performSearch()}
        />
        <select
          name="category"
          value={filters.category || 'Vehicles'}
          onChange={handleFilterChange}
          aria-label={t('marketplace.categoryLabel')}
        >
          <option value="Vehicles">{t('marketplace.category.vehicles')}</option>
          <option value="Services">{t('marketplace.category.services')}</option>
        </select>
        <button
          onClick={performSearch}
          aria-label={t('marketplace.searchButton')}
          onKeyDown={(e) => e.key === 'Enter' && performSearch()}
        >
          {t('marketplace.searchButton')}
        </button>
        <button
          onClick={handleSaveSearch}
          aria-label={t('marketplace.saveSearch')}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveSearch()}
        >
          {t('marketplace.saveSearch')}
        </button>
      </div>
      <div className="filters">
        <input
          type="text"
          name="make"
          value={filters.make || ''}
          onChange={handleFilterChange}
          placeholder={t('marketplace.filter.make')}
          aria-label={t('marketplace.filter.make')}
        />
        <input
          type="text"
          name="model"
          value={filters.model || ''}
          onChange={handleFilterChange}
          placeholder={t('marketplace.filter.model')}
          aria-label={t('marketplace.filter.model')}
        />
        <input
          type="text"
          name="year"
          value={filters.year || ''}
          onChange={handleFilterChange}
          placeholder={t('marketplace.filter.year')}
          aria-label={t('marketplace.filter.year')}
        />
        <input
          type="text"
          name="zipCode"
          value={filters.zipCode || ''}
          onChange={handleFilterChange}
          placeholder={t('marketplace.filter.zip')}
          aria-label={t('marketplace.filter.zip')}
        />
        {hasPermission('Standard') && (
          <>
            <input
              type="number"
              name="priceMin"
              value={filters.priceMin || ''}
              onChange={handleFilterChange}
              placeholder={t('marketplace.filter.priceMin')}
              aria-label={t('marketplace.filter.priceMin')}
            />
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax || ''}
              onChange={handleFilterChange}
              placeholder={t('marketplace.filter.priceMax')}
              aria-label={t('marketplace.filter.priceMax')}
            />
            <input
              type="number"
              name="mileageMax"
              value={filters.mileageMax || ''}
              onChange={handleFilterChange}
              placeholder={t('marketplace.filter.mileageMax')}
              aria-label={t('marketplace.filter.mileageMax')}
            />
            <input
              type="text"
              name="bodyStyle"
              value={filters.bodyStyle || ''}
              onChange={handleFilterChange}
              placeholder={t('marketplace.filter.bodyStyle')}
              aria-label={t('marketplace.filter.bodyStyle')}
            />
          </>
        )}
        {hasPermission('Premium') && (
          <>
            <input
              type="text"
              name="engine"
              value={filters.engine || ''}
              onChange={handleFilterChange}
              placeholder={t('marketplace.filter.engine')}
              aria-label={t('marketplace.filter.engine')}
            />
            <input
              type="text"
              name="color"
              value={filters.color || ''}
              onChange={handleFilterChange}
              placeholder={t('marketplace.filter.color')}
              aria-label={t('marketplace.filter.color')}
            />
          </>
        )}
      </div>
      <div className="sort-options">
        <label>{t('marketplace.sortBy')}</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'price' | 'distance')}
          aria-label={t('marketplace.sortBy')}
        >
          <option value="price">{t('marketplace.sort.price')}</option>
          <option value="distance">{t('marketplace.sort.distance')}</option>
        </select>
      </div>
      {isLoading && <div>{t('loading')}</div>}
      {error && <div className="error-message">{error}</div>}
      {!isLoading && !error && results.length === 0 && <div>{t('marketplace.error.noResults')}</div>}
      <div className="results-grid" aria-label={t('marketplace.results')}>
        {results.map((item) => (
          <div key={item.listingId} className="result-card">
            <img src={item.imageUrl} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{t('marketplace.price')}: ${item.price.toLocaleString()}</p>
            <p>{t('marketplace.location')}: {item.location}</p>
            <p>{t('marketplace.rating')}: {item.providerRating} / 5</p>
          </div>
        ))}
      </div>
      {hasPermission('Standard') && (
        <div className="map-view">
          <p>{t('marketplace.mapViewPlaceholder')}</p>
        </div>
      )}
      {hasPermission('Wow++') && (
        <button
          onClick={() => console.log('Image search placeholder')}
          aria-label={t('marketplace.imageSearch')}
        >
          {t('marketplace.imageSearch')}
        </button>
      )}
    </div>
  );
};

export default MarketplaceComponent;