import React, { useState, useRef, useEffect, useCallback } from "react";
import "./index.css";

const SubHeader = ({ activeIndex, setActiveIndex }) => {
  const [underlineStyle, setUnderlineStyle] = useState({});
  const navRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  const navItems = ["Tous", "Actualité", "Nouveauté", "Portrait", "Chronique", "Agenda"];

  // Memoize the update function to prevent unnecessary re-renders
  const updateUnderline = useCallback(() => {
    if (navRefs.current[activeIndex]) {
      const { offsetLeft, offsetWidth } = navRefs.current[activeIndex];
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });

      // Auto-scroll to keep active item centered
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: offsetLeft - scrollContainerRef.current.offsetWidth / 2 + offsetWidth / 2,
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  // Update underline on activeIndex change and window resize
  useEffect(() => {
    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeIndex, updateUnderline]);

  return (
    <nav className="subheader">
      <div className="subheader-scroll-container" ref={scrollContainerRef}>
        <ul className="subheader-nav-list">
          {navItems.map((item, index) => (
            <li
              key={index}
              ref={(el) => (navRefs.current[index] = el)}
              className={`subheader-nav-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <h3 className="subheader-title">{item}</h3>
            </li>
          ))}
          <div className="subheader-underline" style={underlineStyle}></div>
        </ul>
      </div>
    </nav>
  );
};

export default SubHeader;