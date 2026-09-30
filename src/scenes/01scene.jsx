import { useRef, useState } from 'react';
import './01scene.css'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';


export default function Scene_01({ next }) {


    gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

    // iniate variables 2 set later
    const containerRef = useRef(null);
    const textRef = useRef(null);

  // variables to count steps / which phrase we're on
  const [step, setStep] = useState(0);

  const phrases = [
    "",
    "QUESTION:",
    "WHAT IS FREEDOM...",
    "...TO AMERICA?"
  ];

  gsap.ticker.fps('8')

  // useGSAP triggers onload & evry time steps state changes
  useGSAP(() => {
    if (step < phrases.length) {
      // scramble to the next phrase in the array
      gsap.to(textRef.current, {
        // if step is first step (===0) then duration is 2.5 else 0 
        duration: step === 0 ? 0 : 1,
        scrambleText: {
          text: phrases[step],
          chars: "upperAndLowerCase", 
          // if step is first step (===0) then delay is 1.5 else 0 
          revealDelay: step === 0 ? 0 : 0, 
          speed: 1, 
          delimiter: " " //scramble by word instead of char
        },
        ease: "none"
      });
    } else {
      // on last click fade out the entire scene and navigate away
      gsap.to(containerRef.current, {
        // opacity: 0,
        // duration: 1.5,
        // ease: "power2.inOut",
        onComplete: () => {
          next(); 
        }
      });
    }
  }, { scope: containerRef, dependencies: [step] }); // tells gsap 2 re-run/trigger everytime step updates

  // handles clicks -> advances step counter
  const handleTextClick = () => {
    // dont let counter surpass array lentgh
    if (step <= phrases.length) {
      setStep(step + 1);
    }
  };


   








  return (
    <section className="scene scene-01" onClick={handleTextClick} ref={containerRef}>
        <div className='text-container' ref={textRef}>
     
        </div>

      {/* <button onClick={next}>Next Scene</button> */}
    </section>
  );
}