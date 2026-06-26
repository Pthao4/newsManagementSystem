import React, { useState, useEffect, useRef } from "react";
import { Form, Badge, ListGroup } from "react-bootstrap";
import { tagAPI } from "../../api/tagAPI";

const TagInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef(null);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (val.trim()) {
      debounceTimer.current = setTimeout(async () => {
        try {
          const results = await tagAPI.searchTags(val.trim());
          // Lọc bỏ những tag đã được chọn
          const filteredResults = results.filter(
            (item) => !value.includes(item.name)
          );
          setSuggestions(filteredResults);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error searching tags:", error);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addTag = (tagName) => {
    const normalizedTag = tagName.trim();
    if (normalizedTag && !value.some(t => t.toLowerCase() === normalizedTag.toLowerCase())) {
      const newTags = [...value, normalizedTag];
      onChange(newTags);
    }
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const removeTag = (indexToRemove) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div ref={wrapperRef} className="position-relative">
      <div className="d-flex flex-wrap align-items-center border rounded p-2 bg-white" style={{ minHeight: "45px" }}>
        {value.map((tag, index) => (
          <Badge
            key={index}
            bg="primary"
            className="me-2 mb-1 p-2 d-flex align-items-center"
            style={{ fontSize: "0.9rem", fontWeight: "500" }}
          >
            {tag}
            <span
              className="ms-2 cursor-pointer"
              style={{ cursor: "pointer", fontSize: "1.2rem", lineHeight: "1" }}
              onClick={() => removeTag(index)}
            >
              &times;
            </span>
          </Badge>
        ))}
        <Form.Control
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "Type and press Enter to add tags..." : ""}
          className="border-0 shadow-none p-0 flex-grow-1"
          style={{ minWidth: "150px" }}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ListGroup className="position-absolute w-100 shadow-sm mt-1" style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}>
          {suggestions.map((suggestion) => (
            <ListGroup.Item
              key={suggestion.id}
              action
              onClick={() => addTag(suggestion.name)}
              className="py-2"
            >
              {suggestion.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default TagInput;
