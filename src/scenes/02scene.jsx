import { useRef } from 'react';
import gsap from 'gsap';
import './02scene.css';

import declarationUrl from '../assets/photos/declaration.svg';

export default function Scene_02({ next }) {
  const imgRef = useRef(null);
  
  // gsap scale animation
  const handleClick = () => {
    const currentWidth = imgRef.current.offsetWidth;
    gsap.set(imgRef.current, { width: currentWidth });

    gsap.to(imgRef.current, {
      scale: '10', 
      rotation: 18,
      duration: 1.2,  
      ease: 'steps(4)', //make it jittery
      onComplete: next 
    });
  };

  return (
    <section className="scene-02 scene">
      <img 
        ref={imgRef}
        src={declarationUrl} 
        alt="Declaration" 
        className="declaration" 
        onClick={handleClick} 
      />
    </section>
  );
}