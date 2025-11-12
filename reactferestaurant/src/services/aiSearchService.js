/**
 * AI Search Service
 * Handles AI-powered restaurant search using JSON Server
 * Note: This is a simplified version that filters restaurants based on keywords
 */

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Perform AI search
 * Simple keyword-based search that filters restaurants
 */
export const performAISearch = async (query) => {
  try {
    // Get all restaurants
    const response = await api.get(API_ENDPOINTS.AI_SEARCH);
    const allRestaurants = response.data;
    
    if (!query || query.trim() === '') {
      return {
        restaurants: allRestaurants.slice(0, 6),
        interpretation: 'Hiển thị tất cả nhà hàng',
        suggestedFoods: [],
      };
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Extract keywords from query
    const keywords = lowerQuery.split(/\s+/).filter(word => word.length > 2);
    
    // Simple keyword matching
    const matchedRestaurants = allRestaurants.filter((restaurant) => {
      const name = restaurant.restaurantName?.toLowerCase() || '';
      const description = restaurant.description?.toLowerCase() || '';
      const cuisine = restaurant.cuisineType?.toLowerCase() || '';
      const address = restaurant.address?.toLowerCase() || '';
      
      // Check if any keyword matches
      return keywords.some(keyword => 
        name.includes(keyword) ||
        description.includes(keyword) ||
        cuisine.includes(keyword) ||
        address.includes(keyword)
      );
    });
    
    // Extract suggested foods from cuisine types
    const suggestedFoods = [...new Set(matchedRestaurants.map(r => r.cuisineType).filter(Boolean))];
    
    // Create interpretation
    const interpretation = matchedRestaurants.length > 0
      ? `Tìm thấy ${matchedRestaurants.length} nhà hàng phù hợp với "${query}"`
      : `Không tìm thấy nhà hàng phù hợp với "${query}"`;
    
    return {
      restaurants: matchedRestaurants.slice(0, 6),
      interpretation,
      suggestedFoods: suggestedFoods.slice(0, 5),
    };
  } catch (error) {
    console.error('Error performing AI search:', error);
    // Return empty result on error
    return {
      restaurants: [],
      interpretation: 'Có lỗi xảy ra khi tìm kiếm',
      suggestedFoods: [],
    };
  }
};

