import { useRef, useImperativeHandle, forwardRef } from 'react';
import gsap from 'gsap';
import './CoolUnderline.css'

// forwardRef = lets the parent scene pass strings/refs to this component
const CoolUnderline = forwardRef(function CoolUnderline({ children, onClick, id }, ref) {
    
    gsap.ticker.fps(6);

    // the underline variable element 
    const lineRef = useRef(null);

    // the variable element from parent scene
    const containerRef = useRef(null);
    // sets containerRef to the ref from parent scene
    useImperativeHandle(ref, () => containerRef.current);


    // animate/expand dot's width to full line on mouse hover
    const handleMouseEnter = () => {
        gsap.to(lineRef.current, {
        width: '100%',
        duration: 1.3,
        ease: 'steps(4)', // animate in steps rather than smoothly
        overwrite: 'auto' // overwrite other animations
        });
    };

  // animate/shrink dot's width back to og size on mouse leave
  const handleMouseLeave = () => {
    gsap.to(lineRef.current, {
      width: '2px',    // shrink back into og dot size
      duration: .3,
      ease: 'steps(6)', // animate in steps rather than smoothly
      overwrite: 'auto' // overwrite other animations
    });
  };

  return (
    <span
      id={id}
      ref={containerRef}
      className="CoolUnderline-word"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <span ref={lineRef} className="CoolUnderline-line" />
    </span>
  );
});

export default CoolUnderline;