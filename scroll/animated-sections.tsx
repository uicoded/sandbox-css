import React, { useState, useEffect, useRef } from 'react';

const AnimatedSections = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const wrapperRef = useRef(null);
  
  const sections = [
    {
      id: 'section1',
      title: 'Section 1',
      text: 'Scroll down or use the navigation bar.',
      bgColor: 'bg-sky-50'
    },
    {
      id: 'section2',
      title: 'Section 2',
      text: 'Click Section 4 to see proper alignment.',
      bgColor: 'bg-sky-100'
    },
    {
      id: 'section3',
      title: 'Section 3',
      text: 'The red border will align above the footer.',
      bgColor: 'bg-sky-200'
    },
    {
      id: 'section4',
      title: 'Section 4',
      text: 'Now the red border should appear above the footer when scrolling here!',
      bgColor: 'bg-sky-300'
    }
  ];

  const scrollToBottom = () => {
    if (wrapperRef.current) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        const scrollHeight = wrapperRef.current.scrollHeight;
        const clientHeight = wrapperRef.current.clientHeight;
        const maxScroll = scrollHeight - clientHeight;
        
        wrapperRef.current.scrollTo({
          top: maxScroll,
          behavior: 'smooth'
        });
      }, 100); // Small delay to ensure DOM update
    }
  };

  useEffect(() => {
    // Add sections one by one with a delay
    sections.forEach((section, index) => {
      setTimeout(() => {
        setVisibleSections(prev => {
          const newSections = [...prev, section];
          // Trigger scroll after state update
          requestAnimationFrame(scrollToBottom);
          return newSections;
        });
      }, (index + 1) * 1000);
    });
  }, []);

  // Watch for changes in visible sections and scroll
  useEffect(() => {
    if (visibleSections.length > 0) {
      scrollToBottom();
    }
  }, [visibleSections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div 
        ref={wrapperRef} 
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        {visibleSections.map(section => (
          <section
            key={section.id}
            id={section.id}
            className={`h-96 flex flex-col justify-center items-center p-5 text-center ${section.bgColor} ${
              section.id === 'section4' ? 'border-b-4 border-red-500 mb-20' : ''
            }`}
          >
            <h2 className="text-3xl mb-4">{section.title}</h2>
            <p className="max-w-xl leading-relaxed">{section.text}</p>
          </section>
        ))}
      </div>
      
      <nav className="fixed bottom-0 w-full h-20 bg-sky-950/80 flex justify-center items-center gap-5 shadow-lg z-10">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="text-white px-5 py-2 rounded hover:bg-sky-800 transition-colors"
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AnimatedSections;