import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import dreamVid from '../assets/scenes/dreamVid.mp4';
import './demographic.css';
import DemographicGraph from '../components/DemographicGraph';
// import { DATA } from '../components/dataset';

export default function DemographicScene({ demographic = "WHITE", next }) {
  gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

  const containerRef = useRef(null);
  const textRef = useRef(null);

  // state vars 2 track text progression and scene phases (text -> video -> p5)
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('text'); 

  const phrases = [
    "QUESTION:",
    "WHAT IS FREEDOM...",
    `...TO ${demographic}?`
  ];

  gsap.ticker.fps('8');

  // scrable phrases
  useGSAP(() => {
    if (phase !== 'text') return;

    if (step < phrases.length) {
      gsap.to(textRef.current, {
        duration: 1,
        scrambleText: {
          text: phrases[step],
          chars: "upperAndLowerCase", 
          speed: 1, 
          delimiter: " " 
        },
        ease: "none"
      });
    } else {
      // after -> switch to video phase
      setPhase('video');
    }
  }, { scope: containerRef, dependencies: [step, phase] });

  // handle clicks based on curr phase 
  const handleClick = () => {
    if (phase === 'text') {
      if (step < phrases.length) {
        setStep(step + 1);
      }
    } else if (phase === 'p5') {
      // data graph scene -> next demograph
      if (next) next();
    }
  };

  const handleVideoEnded = () => {
    // when vid finishes -> change 2 p5 graph
    setPhase('p5');
  };

return (
    <section className="scene demographic-scene demographic-film-jitter" onClick={handleClick} ref={containerRef}>
      {phase === 'text' && (
        <div className='demographic-text-container' ref={textRef}></div>
      )}

      {phase === 'video' && (
        <video 
          src={dreamVid} 
          autoPlay 
          playsInline 
          onEnded={handleVideoEnded}
          className="demographic-video"
        />
      )}

      {phase === 'p5' && (
        <div className="demographic-p5-container">
          <DemographicGraph demographic={demographic} />
          {/* <p className="p5-prompt-hint">[Click anywhere to proceed]</p> */}
        </div>
      )}
    </section>
  );
}