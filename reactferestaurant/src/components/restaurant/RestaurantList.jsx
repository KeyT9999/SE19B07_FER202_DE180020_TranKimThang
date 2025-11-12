/**
 * RestaurantList Component
 * Displays a list of restaurant cards with new design
 */

import React from 'react';
import RestaurantCard from './RestaurantCard';
import './RestaurantList.css';

function RestaurantList({ restaurants, loading, error }) {
  console.log('[RestaurantList] Rendering with:', {
    restaurantsCount: restaurants?.length,
    loading,
    error,
    restaurants: restaurants?.slice(0, 2) // Log first 2 for debugging
  });

  // Error and empty state are handled in parent component
  if (error || !restaurants || restaurants.length === 0) {
    console.log('[RestaurantList] Returning null because:', { error, hasRestaurants: !!restaurants, length: restaurants?.length });
    return null;
  }

  console.log('[RestaurantList] Rendering', restaurants.length, 'restaurants');
  return (
    <div className="restaurant-grid">
      {restaurants.map((restaurant) => {
        const key = restaurant.id || restaurant.restaurantId;
        console.log('[RestaurantList] Rendering restaurant:', key, restaurant.restaurantName);
        return (
          <RestaurantCard key={key} restaurant={restaurant} />
        );
      })}
    </div>
  );
}

export default RestaurantList;

