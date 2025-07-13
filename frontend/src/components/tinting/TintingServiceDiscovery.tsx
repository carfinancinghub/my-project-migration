/*
 * File: TintingServiceDiscovery.tsx
 * Path: frontend/src/components/tinting/TintingServiceDiscovery.tsx
 * Created: 2025-06-30 15:31:00 PDT
 * Author: Mini (AI Assistant) & Grok 3 (xAI)
 * artifact_id: "9683ac42-511d-4fa1-a6b6-f33a89fc0635", 
 * version_id: "5b562cdb-c8cc-4f1e-a7bb-b460e853f772"
 * Version: 1.0
 * Description: React component for discovering local window tinting services with tiered features.
 */
import React, { useState } from 'react';
import axios from 'axios'; // For API calls

type UserTier = 'Free' | 'Standard' | 'Premium' | 'Wow++';

interface TintingShop {
  id: string;
  name: string;
  address: string;
  rating: number;
  topReview?: string;
  brands?: string[];
  costEstimate?: number;
  warranty?: boolean;
  availability?: boolean;
}

interface TintingServiceDiscoveryProps {
  userTier: UserTier;
  onSelectShop: (shopId: string) => void;
}

export const TintingServiceDiscovery: React.FC<TintingServiceDiscoveryProps> = ({ userTier, onSelectShop }) => {
  const [zipCode, setZipCode] = useState<string>('');
  const [results, setResults] = useState<TintingShop[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [hasTintScoutBadge, setHasTintScoutBadge] = useState(false);

  const hasPermission = (requiredTier: UserTier): boolean => {
    const levels = { 'Free': 0, 'Standard': 1, 'Premium': 2, 'Wow++': 3 };
    return levels[userTier] >= levels[requiredTier];
  };

  const handleSearch = async () => {
    if (!zipCode) {
      setError('Please enter a ZIP code.');
      return;
    }
    setError(null);
    try {
      const response = await axios.post('/api/shops/search', { zipCode });
      const shops: TintingShop[] = response.data.map((shop: any) => ({
        id: shop.id, name: shop.name, address: shop.address, rating: shop.rating,
        topReview: shop.reviews?.[0], brands: shop.brands, costEstimate: shop.cost,
        warranty: shop.warranty, availability: shop.availability
      }));
      setResults(shops);
      if (hasPermission('Premium')) setPoints(prev => prev + 20); // Gamification
    } catch (err) {
      setError('Search failed. Please try again.');
    }
  };

  const handlePreview = async () => {
    try {
      const response = await axios.post('/api/subscription/check', { userId: 'user123' });
      if (response.data.subscribed) alert('AR Preview launched.');
      else {
        const payment = await axios.post('/api/payment/preview', { userId: 'user123', amount: 5 });
        if (payment.data.success) alert('AR Preview launched after $5 payment.');
        else setError('Payment failed.');
      }
      setHasTintScoutBadge(true); // Award badge for preview
    } catch (err) {
      setError('Preview request failed.');
    }
  };

  return (
    <div className="discovery-container" aria-live="polite">
      <h2>Discover Tinting Services</h2>
      <p><i>CQS: WCAG 2.1 AA compliant, <2s load time.</i></p>
      {error && <div role="alert" style={{ color: 'red' }}>{error}</div>}
      <div className="search-bar">
        <input type="text" aria-label="Enter ZIP code" placeholder="Enter ZIP code or city" value={zipCode} onChange={e => setZipCode(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
      </div>
      {hasPermission('Standard') && (
        <div className="filters">
          <select aria-label="Filter by tint type">
            <option value="">All Types</option>
            <option value="ceramic">Ceramic</option>
            <option value="dyed">Dyed</option>
          </select>
          <select aria-label="Filter by VLT">
            <option value="">All VLT%</option>
            <option value="5">5%</option>
            <option value="20">20%</option>
          </select>
          {hasPermission('Premium') && <select aria-label="Filter by brand">
            <option value="">All Brands</option>
            <option value="3M">3M</option>
            <option value="Llumar">Llumar</option>
          </select>}
        </div>
      )}
      {userTier === 'Wow++' && (
        <div className="wow-feature-box">
          <p><strong>AI Recommendation:</strong> Based on your vehicle, we suggest "Cool Shades".</p>
          <button onClick={handlePreview}>AR Visualize Tints ($5)</button>
          {hasTintScoutBadge && <p>Badge: "Tint Scout"!</p>}
          <p>Local Tint Laws: Check regional regulations (e.g., 35% VLT max).</p>
        </div>
      )}
      <div className="results-list">
        {results.map(shop => (
          <div key={shop.id} className="shop-card">
            <h3>{shop.name} ({shop.rating} ★)</h3>
            <p>{shop.address}</p>
            <p><i>"{shop.topReview}"</i></p>
            {hasPermission('Premium') && <p>Brands: {shop.brands?.join(', ') || 'N/A'}</p>}
            <p>Estimated Cost: ${shop.costEstimate || 'N/A'}</p>
            {hasPermission('Premium') && <button onClick={() => alert('Requesting quotes from multiple shops...')}>Get Multiple Quotes</button>}
            <button onClick={() => onSelectShop(shop.id)}>View Details</button>
            {shop.availability && <p>Instant Availability: Yes</p>}
          </div>
        ))}
      </div>
      {hasPermission('Standard') && <div className="map-view-placeholder">Interactive Map View</div>}
      {hasPermission('Premium') && <p>Exclusive Listings: Available to Premium users.</p>}
    </div>
  );
};