/**
 * AISearch Component
 * AI-powered restaurant search
 */

import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { performAISearch } from '../../services/aiSearchService';
import { useApp } from '../../contexts/AppContext';
import './AISearch.css';

function AISearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const { setErrorWithTimeout } = useApp();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Vui lòng nhập mô tả của bạn');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await performAISearch(query);
      setResults(data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.';
      setError(errorMessage);
      setErrorWithTimeout(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ai-search-section" id="ai-search">
      <Container>
        <div className="ai-search-wrapper">
          <div className="ai-search-card">
            <div className="ai-search-heading">
              <i className="fas fa-magic"></i>
              <h2 className="ai-search-title">Trợ lý AI gợi ý nhà hàng</h2>
            </div>
            <p className="ai-search-subtitle">
              Mô tả mong muốn của bạn và để Book Eat AI đề xuất những lựa chọn phù hợp nhất dựa trên dữ liệu nhà hàng thực tế.
            </p>
            <form onSubmit={handleSearch} noValidate>
              <div className="mb-3">
                <label htmlFor="aiSearchQuery">Bạn muốn ăn gì hôm nay?</label>
                <textarea
                  id="aiSearchQuery"
                  className="ai-query-input"
                  placeholder="Ví dụ: Tôi muốn ăn phở bò cho 2 người ở quận 1, tầm 150k mỗi người"
                  minLength={5}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="ai-form-footer">
                <div className="ai-max-results">
                  <i className="fas fa-list-ol"></i>
                  <span>Số kết quả:</span>
                  <input type="number" id="aiMaxResults" min="1" max="10" defaultValue="5" aria-label="Số kết quả mong muốn" />
                </div>
                <button type="submit" className="btn-ai-search" disabled={loading || !query.trim()}>
                  <i className="fas fa-wand-magic-sparkles"></i>
                  Tìm nhà hàng bằng AI
                </button>
              </div>
              <div className="ai-status" id="aiSearchStatus" role="status" aria-live="polite">
                {error && <span className="error">{error}</span>}
                {loading && <span className="ai-loading-spinner">Đang tìm kiếm...</span>}
              </div>
            </form>
          </div>

          {results && (
            <div className="ai-result-card" id="aiResultsPanel">
              <div className="ai-summary" id="aiResultsSummary">
                <strong>Tìm thấy {results.restaurants?.length || 0} nhà hàng</strong>
              </div>
              
              {/* AI Interpretation Box */}
              {results.interpretation && (
                <div className="ai-interpretation-box" style={{ 
                  display: 'block', 
                  background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)', 
                  borderRadius: '15px', 
                  padding: '20px', 
                  margin: '20px 0', 
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '15px' }}>
                    <i className="fas fa-lightbulb" style={{ fontSize: '1.8rem', color: '#ffd700', marginTop: '5px' }}></i>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-robot"></i>
                        Gợi ý của AI
                      </h5>
                      <p id="aiInterpretationText" style={{ color: 'white', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 0 }}>
                        {results.interpretation}
                      </p>
                      {results.suggestedFoods && results.suggestedFoods.length > 0 && (
                        <div id="aiSuggestedFoods" style={{ marginTop: '15px', display: 'block' }}>
                          <small style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                            Món ăn được đề xuất:
                          </small>
                          <div id="aiSuggestedFoodsList" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {results.suggestedFoods.map((food, index) => (
                              <span key={index} style={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.875rem'
                              }}>
                                {food}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {results.restaurants && results.restaurants.length > 0 ? (
                <div className="ai-recommendations" id="aiRecommendations">
                  {results.restaurants.map((restaurant) => (
                    <div key={restaurant.id || restaurant.restaurantId} className="ai-recommendation-card">
                      <div className="ai-rec-header">
                        <h3 className="ai-rec-name">{restaurant.restaurantName}</h3>
                        {restaurant.averageRating && (
                          <span className="ai-rec-rating">
                            <FaStar /> {restaurant.averageRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="ai-rec-meta">
                        <span>{restaurant.cuisineType}</span>
                        <span>{restaurant.address}</span>
                      </div>
                      <div className="ai-rec-actions">
                        <Link
                          to={`/restaurants/${restaurant.id || restaurant.restaurantId}`}
                          className="primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ai-empty-state" id="aiEmptyState">
                  <i className="fas fa-info-circle me-2"></i>
                  <span>Chưa tìm thấy nhà hàng phù hợp với yêu cầu này. Bạn có thể thử mô tả cụ thể hơn.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default AISearch;

