/**
 * RestaurantsPage Component
 * Page displaying all restaurants with search and filter
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RestaurantList from '../components/restaurant/RestaurantList';
import { getAllRestaurants } from '../services/restaurantService';
import { useApp } from '../contexts/AppContext';
import Loading from '../components/common/Loading';
import './RestaurantsPage.css';

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('restaurantName-asc');
  const { setErrorWithTimeout } = useApp();

  // Helper function that returns filtered results (doesn't set state)
  // Defined before useEffect so it can be used inside
  const applyFiltersImmediate = useCallback((data, search, cuisine, priceRange, sort) => {
    console.log('[applyFiltersImmediate] Starting with:', {
      dataLength: data?.length,
      search,
      cuisine,
      priceRange,
      sort
    });
    
    if (!data || !Array.isArray(data)) {
      console.warn('[applyFiltersImmediate] Invalid data:', data);
      return [];
    }
    
    let results = [...data];
    console.log('[applyFiltersImmediate] Initial results:', results.length);

    // Apply search filter
    if (search && search.trim()) {
      const lowerSearch = search.toLowerCase();
      results = results.filter((r) =>
        r.restaurantName?.toLowerCase().includes(lowerSearch) ||
        r.address?.toLowerCase().includes(lowerSearch) ||
        r.cuisineType?.toLowerCase().includes(lowerSearch) ||
        r.description?.toLowerCase().includes(lowerSearch)
      );
      console.log('[applyFiltersImmediate] After search filter:', results.length);
    }

    // Apply cuisine filter
    if (cuisine) {
      results = results.filter((r) => r.cuisineType === cuisine);
      console.log('[applyFiltersImmediate] After cuisine filter:', results.length);
    }

    // Apply price range filter
    if (priceRange) {
      results = results.filter((r) => {
        const price = r.averagePrice || 0;
        switch (priceRange) {
          case 'low':
            return price < 200000;
          case 'medium':
            return price >= 200000 && price <= 500000;
          case 'high':
            return price > 500000;
          default:
            return true;
        }
      });
      console.log('[applyFiltersImmediate] After price filter:', results.length);
    }

    // Apply sorting
    const [sortField, sortDir] = sort.split('-');
    results.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'restaurantName') {
        aVal = (aVal || '').toLowerCase();
        bVal = (bVal || '').toLowerCase();
      } else {
        aVal = aVal || 0;
        bVal = bVal || 0;
      }

      if (sortDir === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    console.log('[applyFiltersImmediate] Final results:', results.length);
    return results;
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        console.log('[RestaurantsPage] Starting to fetch restaurants...');
        setLoading(true);
        setError(null);
        
        const data = await getAllRestaurants();
        console.log('[RestaurantsPage] Data received:', {
          type: typeof data,
          isArray: Array.isArray(data),
          length: Array.isArray(data) ? data.length : 'N/A',
          sample: Array.isArray(data) && data.length > 0 ? data[0] : null
        });
        
        // Check if data is valid
        if (!data || !Array.isArray(data)) {
          console.error('[RestaurantsPage] Invalid data format:', data);
          throw new Error('Invalid data format received from server');
        }
        
        if (data.length === 0) {
          console.warn('[RestaurantsPage] No restaurants found in database');
          // Empty data is not an error, just set empty array
          setRestaurants([]);
          setFilteredRestaurants([]);
        } else {
          console.log(`[RestaurantsPage] Setting ${data.length} restaurants`);
          setRestaurants(data);
          // Apply filters immediately with the new data
          console.log('[RestaurantsPage] Applying filters...');
          const filtered = applyFiltersImmediate(data, searchTerm, selectedCuisine, selectedPriceRange, sortBy);
          setFilteredRestaurants(filtered);
          console.log('[RestaurantsPage] Filters applied, filtered count:', filtered.length);
        }
      } catch (err) {
        console.error('=== [RestaurantsPage] Error ===');
        console.error('Error details:', {
          message: err.message,
          code: err.code,
          response: err.response,
          request: err.request,
          config: err.config
        });
        
        // Clear restaurants on error
        setRestaurants([]);
        setFilteredRestaurants([]);
        
        // Provide more specific error messages
        let errorMessage = 'Không thể tải danh sách nhà hàng. ';
        let detailedError = '';
        
        if (err.code === 'ECONNREFUSED') {
          errorMessage += 'Không thể kết nối đến server. ';
          detailedError = 'Vui lòng đảm bảo json-server đang chạy trên port 3001.';
        } else if (err.message?.includes('Network Error') || err.message?.includes('ERR_NETWORK') || err.code === 'ERR_NETWORK') {
          errorMessage += 'Lỗi kết nối mạng. ';
          detailedError = 'Kiểm tra xem json-server có đang chạy không: http://localhost:3001/restaurants';
        } else if (err.response) {
          // Server responded with error status
          if (err.response.status === 404) {
            errorMessage += 'Endpoint không tồn tại. ';
            detailedError = `URL: ${err.config?.baseURL}${err.config?.url}`;
          } else if (err.response.status === 0) {
            errorMessage += 'Lỗi CORS hoặc kết nối bị chặn. ';
            detailedError = 'Kiểm tra CORS settings trên json-server.';
          } else if (err.response.status >= 500) {
            errorMessage += 'Lỗi server. ';
            detailedError = `Status: ${err.response.status}`;
          } else {
            errorMessage += `Lỗi ${err.response.status}. `;
            detailedError = err.response.data?.message || err.response.statusText;
          }
        } else if (err.request) {
          errorMessage += 'Không nhận được phản hồi từ server. ';
          detailedError = 'Kiểm tra xem json-server có đang chạy không.';
        } else if (err.message?.includes('timeout')) {
          errorMessage += 'Request timeout. ';
          detailedError = 'Server mất quá nhiều thời gian để phản hồi.';
        } else {
          errorMessage += 'Lỗi không xác định. ';
          detailedError = err.message || 'Vui lòng thử lại.';
        }
        
        const fullErrorMessage = errorMessage + (detailedError ? `\n${detailedError}` : '');
        console.error('[RestaurantsPage] Setting error:', fullErrorMessage);
        setError(fullErrorMessage);
        setErrorWithTimeout(fullErrorMessage);
      } finally {
        console.log('[RestaurantsPage] Fetch completed, setting loading to false');
        setLoading(false);
      }
    };

    fetchRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setErrorWithTimeout, applyFiltersImmediate]);

  const applyFilters = useCallback((data, search, cuisine, priceRange, sort) => {
    const filtered = applyFiltersImmediate(data, search, cuisine, priceRange, sort);
    setFilteredRestaurants(filtered);
  }, [applyFiltersImmediate]);

  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      applyFilters(restaurants, term, selectedCuisine, selectedPriceRange, sortBy);
    },
    [restaurants, selectedCuisine, selectedPriceRange, sortBy, applyFilters]
  );

  const handleFilterChange = useCallback(
    ({ cuisine, priceRange, sort }) => {
      if (cuisine !== undefined) setSelectedCuisine(cuisine);
      if (priceRange !== undefined) setSelectedPriceRange(priceRange);
      if (sort !== undefined) setSortBy(sort);
      
      applyFilters(
        restaurants,
        searchTerm,
        cuisine !== undefined ? cuisine : selectedCuisine,
        priceRange !== undefined ? priceRange : selectedPriceRange,
        sort !== undefined ? sort : sortBy
      );
    },
    [restaurants, searchTerm, selectedCuisine, selectedPriceRange, sortBy, applyFilters]
  );

  if (loading) {
    return (
      <section className="restaurants-section">
        <Container>
          <Loading message="Đang tải danh sách nhà hàng..." />
        </Container>
      </section>
    );
  }

  return (
    <main>
      <section className="ds-bg-gray-50" style={{ padding: 'var(--ds-space-4) 0' }}>
        <Container>
          <nav className="ds-breadcrumb" aria-label="breadcrumb" style={{ margin: 0, padding: '0.5rem 0' }}>
            <ol className="ds-breadcrumb-list" style={{ margin: 0, padding: 0 }}>
              <li className="ds-breadcrumb-item">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="ds-breadcrumb-item active">
                <span>Nhà hàng</span>
              </li>
            </ol>
          </nav>
        </Container>
      </section>

      <section className="restaurants-section" style={{ padding: '48px 0' }}>
        <div className="restaurants-page-container">
          <Card className="ds-card ds-mb-4">
            <Card.Body className="ds-card-body ds-flex ds-flex-col ds-gap-2" style={{ padding: '1rem' }}>
              <div className="filter-container">
                <div className="filter-row">
                  <div className="ds-form-group filter-item">
                    <label className="ds-form-label" htmlFor="searchInput">Tìm kiếm</label>
                    <input
                      type="text"
                      id="searchInput"
                      className="ds-form-input"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSearch(e.target.value);
                        }
                      }}
                      placeholder="Tên nhà hàng..."
                    />
                  </div>
                  <div className="ds-form-group filter-item">
                    <label className="ds-form-label" htmlFor="cuisineFilter">Loại ẩm thực</label>
                    <select
                      id="cuisineFilter"
                      className="ds-form-select"
                      value={selectedCuisine}
                      onChange={(e) => handleFilterChange({ cuisine: e.target.value })}
                    >
                      <option value="">Tất cả</option>
                      <option value="Vietnamese">Việt Nam</option>
                      <option value="Italian">Ý</option>
                      <option value="Japanese">Nhật Bản</option>
                      <option value="Seafood">Hải sản</option>
                      <option value="BBQ">BBQ</option>
                      <option value="European">Châu Âu</option>
                      <option value="Chinese">Trung Quốc</option>
                      <option value="Korean">Hàn Quốc</option>
                      <option value="American">Mỹ</option>
                    </select>
                  </div>
                  <div className="ds-form-group filter-item">
                    <label className="ds-form-label" htmlFor="priceFilter">Khoảng giá</label>
                    <select
                      id="priceFilter"
                      className="ds-form-select"
                      value={selectedPriceRange}
                      onChange={(e) => handleFilterChange({ priceRange: e.target.value })}
                    >
                      <option value="">Tất cả</option>
                      <option value="low">Dưới 200k</option>
                      <option value="medium">200k - 500k</option>
                      <option value="high">Trên 500k</option>
                    </select>
                  </div>
                  <div className="ds-form-group filter-item">
                    <label className="ds-form-label" htmlFor="sortSelect">Sắp xếp</label>
                    <select
                      id="sortSelect"
                      className="ds-form-select"
                      value={sortBy}
                      onChange={(e) => handleFilterChange({ sort: e.target.value })}
                    >
                      <option value="restaurantName-asc">Tên (A-Z)</option>
                      <option value="restaurantName-desc">Tên (Z-A)</option>
                      <option value="averageRating-desc">Đánh giá cao nhất</option>
                      <option value="averagePrice-asc">Giá thấp nhất</option>
                      <option value="averagePrice-desc">Giá cao nhất</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              padding: '1rem', 
              background: '#F3F4F6', 
              marginBottom: '1rem', 
              fontSize: '0.875rem',
              borderRadius: '4px'
            }}>
              <strong>Debug Info:</strong> 
              {' '}Loading: {loading ? 'Yes' : 'No'}, 
              {' '}Error: {error ? 'Yes' : 'No'}, 
              {' '}Restaurants: {restaurants.length}, 
              {' '}Filtered: {filteredRestaurants.length}
            </div>
          )}

          {error ? (
            <div className="empty-state-new" style={{ background: '#FEF2F2', border: '1px solid #FECACA', marginTop: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#991B1B', marginBottom: '1rem' }}></i>
                <h3 style={{ color: '#991B1B', marginBottom: '0.5rem' }}>Lỗi tải dữ liệu</h3>
                <p style={{ color: '#991B1B', marginBottom: '1rem', whiteSpace: 'pre-line' }}>{error}</p>
                <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '8px', marginTop: '1rem', textAlign: 'left', maxWidth: '600px', margin: '1rem auto' }}>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                    <strong>Hướng dẫn khắc phục:</strong>
                  </p>
                  <ol style={{ color: '#6B7280', fontSize: '0.875rem', paddingLeft: '1.5rem', margin: 0 }}>
                    <li>Mở terminal trong thư mục <code>reactferestaurant</code></li>
                    <li>Chạy lệnh: <code style={{ background: '#F3F4F6', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>npx json-server --watch db.json --port 3001</code></li>
                    <li>Đợi thông báo "Resources" và "Home" từ json-server</li>
                    <li>Refresh trang web (Ctrl+Shift+R hoặc Cmd+Shift+R)</li>
                    <li>Kiểm tra console (F12) để xem lỗi chi tiết</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : restaurants.length === 0 && !loading ? (
            <div className="empty-state-new">
              <h3>Chưa có nhà hàng</h3>
              <p>Hiện tại chưa có nhà hàng nào trong hệ thống. Vui lòng quay lại sau.</p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem' }}>
                Kiểm tra console để xem thông tin chi tiết.
              </p>
            </div>
          ) : filteredRestaurants.length === 0 && restaurants.length > 0 ? (
            <div className="empty-state-new">
              <h3>Không tìm thấy nhà hàng</h3>
              <p>Không có nhà hàng nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh các tiêu chí tìm kiếm.</p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem' }}>
                Tổng số nhà hàng: {restaurants.length}
              </p>
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <>
              <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
                Tìm thấy {filteredRestaurants.length} nhà hàng
              </div>
              <RestaurantList
                restaurants={filteredRestaurants}
                loading={false}
                error={null}
              />
            </>
          ) : (
            <div className="empty-state-new">
              <h3>Đang tải...</h3>
              <p>Vui lòng đợi trong giây lát.</p>
            </div>
          )}

          <div className="ds-flex ds-justify-center ds-gap-4 ds-flex-wrap ds-mt-8">
            <Link to="/" className="ds-btn ds-btn-secondary ds-btn-lg">
              <i className="fas fa-home"></i>
              Về trang chủ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RestaurantsPage;

