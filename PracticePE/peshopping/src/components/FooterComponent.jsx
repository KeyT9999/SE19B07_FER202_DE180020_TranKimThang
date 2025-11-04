/**
 * FILE: FooterComponent.jsx
 * TÁC DỤNG: Component hiển thị footer ở dưới cùng mọi trang
 * FOLDER: src/components/ - Chứa các components tái sử dụng được
 * 
 * GIAO DIỆN:
 * ┌─────────────────────────────────────────────┐
 * │ © 2025 FreshFood Mart. All rights reserved. │ ← Footer màu đen, text trắng
 * └─────────────────────────────────────────────┘
 * 
 * MAPPING:
 * App.js → FooterComponent → hiển thị ở dưới cùng mọi trang
 */

/**
 * FooterComponent - Component hiển thị footer
 * @returns {JSX.Element} - JSX chứa footer
 */
export default function FooterComponent() {
  return (
    // <footer>: HTML semantic tag cho footer
    // className="bg-dark": Bootstrap class - background màu đen
    // className="text-white": Bootstrap class - text màu trắng
    // className="text-center": Bootstrap class - căn giữa text
    // className="py-3": Bootstrap class - padding top và bottom = 3 units
    <footer className="bg-dark text-white text-center py-3">
      {/* <p>: Paragraph tag chứa copyright text */}
      {/* &copy;: HTML entity cho ký tự © (copyright symbol) */}
      <p>&copy; 2025 FreshFood Mart. All rights reserved.</p>
    </footer>
  );
}
