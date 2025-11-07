/**
 * Filter.jsx - Component hiển thị bộ lọc và tìm kiếm sản phẩm
 * 
 * MỤC ĐÍCH:
 * - Cung cấp các input để filter và sort danh sách sản phẩm
 * - Search box: Tìm kiếm theo tên sản phẩm
 * - Sort dropdown: Sắp xếp theo tên, giá
 * - Brand filter: Lọc theo category/brand
 * - Clear filters button: Xóa tất cả filters
 * 
 * PROPS:
 * @param {Array} products - Danh sách sản phẩm (để lấy unique brands)
 * @param {string} searchTerm - Từ khóa tìm kiếm
 * @param {Function} setSearchTerm - Setter cho searchTerm
 * @param {string} sortOption - Option sắp xếp (name-asc, price-asc, etc.)
 * @param {Function} setSortOption - Setter cho sortOption
 * @param {string} brandFilter - Brand được chọn để filter
 * @param {Function} setBrandFilter - Setter cho brandFilter
 * @param {string} tagFilter - Tag được chọn để filter
 * @param {Function} setTagFilter - Setter cho tagFilter
 * @param {number} itemsPerPage - Số items mỗi trang
 * @param {Function} setItemsPerPage - Setter cho itemsPerPage
 * @param {Function} onClearFilters - Hàm xóa tất cả filters
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. User nhập từ khóa vào search box → setSearchTerm() được gọi
 * 2. User chọn sort option → setSortOption() được gọi
 * 3. User chọn brand → setBrandFilter() được gọi
 * 4. ProductList nhận các giá trị này và filter/sort products
 * 5. User click icon clear (X) → onClearFilters() được gọi → Reset tất cả filters
 * 
 * ĐƯỢC SỬ DỤNG Ở:
 * - ProductList.jsx: Render Filter component phía trên danh sách sản phẩm
 */

// src/components/products/Filter.js

import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import config from "../../config";

/**
 * Filter - Component hiển thị bộ lọc và tìm kiếm
 */
const Filter = ({
  products,
  searchTerm,
  setSearchTerm,
  sortOption,
  setSortOption,
  brandFilter,
  setBrandFilter,
  tagFilter,
  setTagFilter,
  itemsPerPage,
  setItemsPerPage,
  onClearFilters,
}) => {
  /**
   * uniqueBrands - Lấy danh sách các brand/category duy nhất từ products
   * 
   * Logic:
   * - Map qua products để lấy productBrand của mỗi sản phẩm
   * - Sử dụng Set để loại bỏ duplicate
   * - Convert Set về Array bằng spread operator
   * - Dùng để populate dropdown "All Categories"
   */
  const uniqueBrands = [
    ...new Set(products.map((p) => config.getField("productBrand", p))),
  ];

  /**
   * isFilterActive - Kiểm tra xem có filter nào đang active không
   * 
   * Logic:
   * - Return true nếu có bất kỳ filter nào được set (searchTerm, sortOption, brandFilter, tagFilter)
   * - Dùng để hiển thị nút clear filters (icon X)
   */
  const isFilterActive = searchTerm || sortOption || brandFilter || tagFilter;

  return (
    <div className="filter-container">
      <Row className="g-3 align-items-center">
        {/* Search box: Tìm kiếm theo tên sản phẩm */}
        <Col xs={12} md={6} lg={4}>
          <Form.Control
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}  // Cập nhật searchTerm khi user nhập
          />
        </Col>

        {/* Sort dropdown: Sắp xếp sản phẩm */}
        <Col xs={12} md={6} lg={4}>
          <Form.Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}  // Cập nhật sortOption khi user chọn
          >
            <option value="name-asc">Name A-Z</option>
            <option value="price-asc">Price Ascending</option>
            <option value="price-desc">Price Descending</option>
          </Form.Select>
        </Col>

        {/* Brand/Category filter: Lọc theo category */}
        <Col xs={12} md={6} lg={4}>
          <Form.Select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}  // Cập nhật brandFilter khi user chọn
          >
            <option value="">All Categories</option>
            {/* Render các option từ uniqueBrands */}
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Form.Select>
        </Col>

        {/* Clear filters button: Hiển thị khi có filter active */}
        <Col
          xs={1}
          className="d-flex align-items-center justify-content-center"
        >
          {/* Chỉ hiển thị icon X khi có filter active */}
          {isFilterActive && (
            <FaTimesCircle
              role="button"
              size={24}
              className="clear-filter-icon"
              title="Clear filters"
              onClick={onClearFilters}  // Gọi hàm xóa tất cả filters
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Filter;
