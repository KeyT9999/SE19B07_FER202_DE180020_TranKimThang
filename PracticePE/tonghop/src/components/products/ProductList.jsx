/**
 * ProductList.jsx - Component hiển thị danh sách sản phẩm với filter và pagination
 * 
 * MỤC ĐÍCH:
 * - Hiển thị danh sách sản phẩm dạng grid (ProductCard)
 * - Cung cấp filter, search, sort, pagination
 * - Render Filter component và nhiều ProductCard
 * 
 * PROPS:
 * @param {Array} products - Danh sách sản phẩm từ ProductContext
 * 
 * CHỨC NĂNG:
 * 1. Filter: Search theo tên, filter theo brand, filter theo tag
 * 2. Sort: Sắp xếp theo tên, giá, ngày
 * 3. Pagination: Phân trang danh sách sản phẩm
 * 4. Debounce: Delay search để tránh re-render quá nhiều
 * 
 * STATE:
 * - searchTerm: Từ khóa tìm kiếm
 * - sortOption: Option sắp xếp (name-asc, price-asc, etc.)
 * - brandFilter: Brand được chọn
 * - tagFilter: Tag được chọn
 * - currentPage: Trang hiện tại
 * - itemsPerPage: Số items mỗi trang
 * 
 * ĐƯỢC SỬ DỤNG Ở:
 * - ProductsPage.jsx: Render ProductList với products prop
 */

// src/components/products/ProductList.js

import React, { useState, useMemo, useCallback } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import ProductCard from "./ProductCard";
import Filter from "./Filter";
import useDebounce from "../../hooks/useDebounce";
import config from "../../config";

/**
 * ProductList - Component danh sách sản phẩm với filter
 */
const ProductList = ({ products }) => {
  // State quản lý filter và search
  const [searchTerm, setSearchTerm] = useState("");          // Từ khóa tìm kiếm
  const [sortOption, setSortOption] = useState("");          // Option sắp xếp
  const [brandFilter, setBrandFilter] = useState("");        // Brand filter
  const [tagFilter, setTagFilter] = useState("");            // Tag filter
  const [currentPage, setCurrentPage] = useState(1);         // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(
    config.app.ITEMS_PER_PAGE_OPTIONS[0]                     // Số items mỗi trang (mặc định: 8)
  );

  /**
   * debouncedSearchTerm - Search term được debounce để tránh re-render quá nhiều
   * Chỉ cập nhật sau khi user ngừng gõ 500ms (DEBOUNCE_DELAY)
   */
  const debouncedSearchTerm = useDebounce(
    searchTerm,
    config.app.DEBOUNCE_DELAY  // 500ms
  );

  /**
   * visibleProducts - Danh sách sản phẩm sau khi filter và sort
   * 
   * Logic:
   * 1. Lọc sản phẩm hết hàng (stock = 0)
   * 2. Filter theo searchTerm (tìm trong productTitle)
   * 3. Filter theo brandFilter
   * 4. Filter theo tagFilter (sale, hot, hot-and-sale)
   * 5. Sort theo sortOption (name, price, date)
   * 
   * useMemo: Chỉ tính toán lại khi dependencies thay đổi
   */
  const visibleProducts = useMemo(() => {
    let filtered = [...products];
    
    // Bước 1: Lọc sản phẩm hết hàng (stock = 0)
    filtered = filtered.filter(p => {
      const stock = config.getField("productStock", p);
      // Nếu không có trường stock, hoặc stock > 0 thì hiển thị
      return stock === undefined || stock > 0;
    });
    
    // Bước 2: Filter theo searchTerm (tìm kiếm trong productTitle)
    if (debouncedSearchTerm) {
      filtered = filtered.filter((p) =>
        config
          .getField("productTitle", p)
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Bước 3: Filter theo brandFilter
    if (brandFilter) {
      filtered = filtered.filter(
        (p) => config.getField("productBrand", p) === brandFilter
      );
    }

    // Bước 4: Filter theo tagFilter
    const tagsField = "productTags";
    if (tagFilter === "sale") {
      filtered = filtered.filter(
        (p) =>
          config.getField(tagsField, p) &&
          config.getField(tagsField, p).includes("sale")
      );
    } else if (tagFilter === "hot") {
      filtered = filtered.filter(
        (p) =>
          config.getField(tagsField, p) &&
          config.getField(tagsField, p).includes("hot")
      );
    } else if (tagFilter === "hot-and-sale") {
      filtered = filtered.filter(
        (p) =>
          config.getField(tagsField, p) &&
          config.getField(tagsField, p).includes("hot") &&
          config.getField(tagsField, p).includes("sale")
      );
    }

    // Bước 5: Sort theo sortOption
    const sortFunctions = {
      "name-asc": (a, b) =>
        config
          .getField("productTitle", a)
          .localeCompare(config.getField("productTitle", b)),  // Sắp xếp tên A-Z
      "price-asc": (a, b) =>
        (config.getField("productSalePrice", a) ||
          config.getField("productPrice", a)) -
        (config.getField("productSalePrice", b) ||
          config.getField("productPrice", b)),  // Sắp xếp giá tăng dần
      "price-desc": (a, b) =>
        (config.getField("productSalePrice", b) ||
          config.getField("productPrice", b)) -
        (config.getField("productSalePrice", a) ||
          config.getField("productPrice", a)),  // Sắp xếp giá giảm dần
      "date-desc": (a, b) =>
        new Date(config.getField("productDate", b)) -
        new Date(config.getField("productDate", a)),  // Sắp xếp ngày mới nhất
      "date-asc": (a, b) =>
        new Date(config.getField("productDate", a)) -
        new Date(config.getField("productDate", b)),  // Sắp xếp ngày cũ nhất
    };

    // Áp dụng sort function nếu có
    if (sortFunctions[sortOption]) {
      filtered.sort(sortFunctions[sortOption]);
    }
    return filtered;
  }, [products, debouncedSearchTerm, sortOption, brandFilter, tagFilter]);  // Dependencies: chỉ tính lại khi các giá trị này thay đổi

  /**
   * handleClearFilters - Xóa tất cả filters và reset về mặc định
   * Được gọi khi user click icon X trong Filter component
   */
  const handleClearFilters = () => {
    setSearchTerm("");
    setSortOption("");
    setBrandFilter("");
    setTagFilter("");
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  /**
   * resetPageAndSet - Hàm helper để set value và reset về trang 1
   * Được dùng khi user thay đổi filter (để reset pagination)
   */
  const resetPageAndSet = useCallback(
    (setter) => (value) => {
      setter(value);
      setCurrentPage(1);  // Reset về trang 1 khi filter thay đổi
    },
    []
  );

  /**
   * currentProducts - Danh sách sản phẩm của trang hiện tại (pagination)
   * 
   * Logic:
   * - Lấy slice từ visibleProducts dựa vào currentPage và itemsPerPage
   * - Ví dụ: page 1, 8 items/page → slice(0, 8)
   *          page 2, 8 items/page → slice(8, 16)
   */
  const currentProducts = useMemo(
    () =>
      visibleProducts.slice(
        (currentPage - 1) * itemsPerPage,  // Start index
        currentPage * itemsPerPage          // End index
      ),
    [visibleProducts, currentPage, itemsPerPage]  // Tính lại khi các giá trị này thay đổi
  );

  return (
    <div>
      <Filter
        products={products}
        searchTerm={searchTerm}
        setSearchTerm={resetPageAndSet(setSearchTerm)}
        sortOption={sortOption}
        setSortOption={resetPageAndSet(setSortOption)}
        brandFilter={brandFilter}
        setBrandFilter={resetPageAndSet(setBrandFilter)}
        tagFilter={tagFilter}
        setTagFilter={resetPageAndSet(setTagFilter)}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={resetPageAndSet(setItemsPerPage)}
        onClearFilters={handleClearFilters} // MODIFICATION: Pass the clear function
      />
      {currentProducts.length > 0 ? (
        <Row xs={1} sm={2} lg={3} className="g-4">
          {currentProducts.map((product) => (
            <Col key={config.getField("productId", product)}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center mt-4">
          No products found.
        </Alert>
      )}
    </div>
  );
};

export default ProductList;
