import React, { useState, useEffect, useCallback } from "react";

const Section = ({ id, height, color, children }) => (
  <div
    id={id}
    className={`
      w-[90%] max-w-[600px] mx-auto mb-5
      flex justify-center items-center
      text-[clamp(16px,3vw,24px)] text-gray-700
      border border-gray-200 shadow-sm
      ${color}
    `}
    style={{
      minHeight: height.min,
      height: height.vh,
      maxHeight: height.max,
      borderBottom: id === "section1" ? "1px solid red" : "none",
    }}
  >
    {children}
  </div>
);

const StickyHeader = ({ onHeaderChange }) => {
  const headerRef = React.useRef(null);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (headerRef.current) {
        onHeaderChange(headerRef.current.getBoundingClientRect());
      }
    });

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, [onHeaderChange]);

  return (
    <div className="sticky top-0 w-full flex justify-center bg-white shadow-sm z-50">
      <div
        ref={headerRef}
        className="w-[92%] max-w-[620px] bg-white border-b-2 border-red-500"
        style={{ padding: "clamp(12px, 3vh, 24px) 20px" }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="text-[clamp(16px,3vw,24px)] font-bold">Patient Overview</div>
            <div className="flex gap-3">
              <button className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-[clamp(12px,1.8vw,14px)]">
                Edit
              </button>
              <button className="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-[clamp(12px,1.8vw,14px)]">
                Share
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-[clamp(12px,2vw,14px)]">
            <div className="flex items-center gap-1">
              <span>Status:</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[clamp(11px,1.6vw,13px)]">Active</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Last updated:</span>
              <span>Today at 2:30 PM</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Case ID:</span>
              <span>#12345-B</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Department:</span>
              <span>Cardiology</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, isVisible }) => (
  <div
    className={`
    fixed bottom-5 left-1/2 -translate-x-1/2
    bg-gray-800 text-white px-6 py-3 rounded
    transition-opacity duration-300 whitespace-nowrap z-50
    ${isVisible ? "opacity-100" : "opacity-0"}
  `}
  >
    {message}
  </div>
);

const DebugInfo = ({ headerRect, section1Rect }) => (
  <div className="fixed top-28 right-5 bg-black/80 text-white p-2.5 rounded text-sm z-50">
    Header Height: {Math.round(headerRect?.height || 0)}px
    <br />
    Header Width: {Math.round(headerRect?.width || 0)}px
    <br />
    Section1 Height: {Math.round(section1Rect?.height || 0)}px
    <br />
    Section1 Bottom: {Math.round(section1Rect?.bottom || 0)}px
    <br />
    Header Bottom: {Math.round(headerRect?.bottom || 0)}px
  </div>
);

const App = () => {
  const [headerRect, setHeaderRect] = useState(null);
  const [section1Rect, setSection1Rect] = useState(null);
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [lastPosition, setLastPosition] = useState("unknown");

  const showToast = useCallback((message) => {
    setToast({ message, isVisible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 2000);
  }, []);

  const checkIntersection = useCallback(() => {
    const section1 = document.getElementById("section1");
    if (!headerRect || !section1) return;

    const section1Bottom = section1.getBoundingClientRect().bottom;
    setSection1Rect(section1.getBoundingClientRect());

    if (section1Bottom < headerRect.bottom && lastPosition !== "above") {
      console.log("left the view");
      showToast("Section 1 left the view");
      setLastPosition("above");
    } else if (section1Bottom >= headerRect.bottom && lastPosition !== "below") {
      console.log("entered the view");
      showToast("Section 1 entered the view");
      setLastPosition("below");
    }
  }, [headerRect, lastPosition, showToast]);

  useEffect(() => {
    checkIntersection();
    window.addEventListener("scroll", checkIntersection);
    window.addEventListener("resize", checkIntersection);

    return () => {
      window.removeEventListener("scroll", checkIntersection);
      window.removeEventListener("resize", checkIntersection);
    };
  }, [checkIntersection]);

  return (
    <div className="min-w-[320px]">
      <StickyHeader onHeaderChange={setHeaderRect} />

      <div className="p-5 flex flex-col items-center">
        <Section id="section1" height={{ min: "250px", vh: "40vh", max: "300px" }} color="bg-[#d4e6f7]">
          Section 1 (40vh)
        </Section>

        <Section id="section2" height={{ min: "350px", vh: "50vh", max: "450px" }} color="bg-[#f7d4e1]">
          Section 2 (50vh)
        </Section>

        <Section id="section3" height={{ min: "450px", vh: "60vh", max: "600px" }} color="bg-[#d4f7d4]">
          Section 3 (60vh)
        </Section>
      </div>

      <Toast {...toast} />
      <DebugInfo headerRect={headerRect} section1Rect={section1Rect} />
    </div>
  );
};

export default App;
