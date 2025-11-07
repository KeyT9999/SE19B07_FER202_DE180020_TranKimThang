import React from "react";
import { FaGithub, FaFacebook, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer-container footer">
      <p className="footer-text">
        © {new Date().getFullYear()} E-Shop Project.  </p>
      <div className="social-icons">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebook size={24} />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram size={24} />
        </a>
      </div>
    </footer>
  );
}
export default Footer;
