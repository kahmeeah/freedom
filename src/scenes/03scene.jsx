import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './03scene.css'; 

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Scene_03({ next }) {
  const containerRef = useRef(null);
  const panTrackRef = useRef(null);
  const targetPhraseRef = useRef(null);
  const underlineRef = useRef(null);
  const asteriskRef = useRef(null); 

  useGSAP(() => {
    const getScrollAmount = () => {
      const phrase = targetPhraseRef.current;
      const phraseRightEdge = phrase.offsetLeft + phrase.offsetWidth;
      return -(phraseRightEdge - (window.innerWidth / 2));
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true, 
        scrub: 1,
        start: "top top",
        end: () => `+=${Math.abs(getScrollAmount()) + 1500}`, //calc full tl 
        invalidateOnRefresh: true,
      }
    });

    // horizontal pan/scrolling
    tl.to(panTrackRef.current, {
      x: getScrollAmount, 
      ease: "none",
      duration: () => Math.abs(getScrollAmount()) 
    });

    // animate underline
    tl.to(underlineRef.current, {
      scaleX: 1,
      ease: "none",
      duration: 800 //last 800 w
    }, "<"); //start immediately

    // scale into asterik to fullscreen & then transiton to next page
    tl.to(asteriskRef.current, {
      scale: 400,
      color: '#0d0d0d', 
      transformOrigin: "center center",
      ease: "power2.in",
      duration: 300,
      onComplete: () => {
        if (next) next();
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="scene-container scene-03">
      <div ref={panTrackRef} className="pan-track" style={{ position: 'relative' }}>
        
        <p className="massive-paragraph">
          In Congress, July 4, 1776 The unanimous Declaration of the thirteen united States of America, When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation. We hold these truths to be self-evident, that{' '}
          
          <span ref={targetPhraseRef} className="target-phrase-wrapper">
  
            <span style={{ position: 'relative', display: 'inline-block' }}>
              all men are created equal
              <div ref={underlineRef} className="underline" />
            </span>
            
            <span ref={asteriskRef} className="asterisk" style={{ display: 'inline-block' }}>*</span>

          </span>
          
          {', that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.--That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, --That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness.'}
        </p>

      </div>
    </section>
  );
}