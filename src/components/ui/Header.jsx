import { useState, useRef, useEffect } from 'react';
import {
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiFileText,
  FiLink,
  FiUpload,
} from 'react-icons/fi';

const Header = ({ onAddClick, onSearch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleAddClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCreateModule = () => {
    onAddClick('module');
    setIsDropdownOpen(false);
  };

  const handleAddLink = () => {
    onAddClick('link');
    setIsDropdownOpen(false);
  };

  const handleUpload = () => {
    onAddClick('upload');
    setIsDropdownOpen(false);
  };

  return (
    <div className="header">
      <h1 className="header-title">Course builder</h1>
      <div className="header-right">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            onChange={e => onSearch && onSearch(e.target.value)}
          />
        </div>
        <div className="dropdown-container" ref={dropdownRef}>
          <button className="add-button" onClick={handleAddClick}>
            <FiPlus style={{ marginRight: 6 }} />
            Add
            {isDropdownOpen ? (
              <FiChevronUp className="dropdown-arrow" />
            ) : (
              <FiChevronDown className="dropdown-arrow" />
            )}
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleCreateModule}>
                <FiFileText className="item-icon" />
                Create module
              </button>
              <button className="dropdown-item" onClick={handleAddLink}>
                <FiLink className="item-icon" />
                Add a link
              </button>
              <button className="dropdown-item" onClick={handleUpload}>
                <FiUpload className="item-icon" />
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
