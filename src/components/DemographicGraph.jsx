import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { DATA } from '../components/dataset';

export default function DemographicGraph({ demographic = "WHITE" }) {
  const sketchRef = useRef(null);

  useEffect(() => {
    const currentRef = sketchRef.current;
    if (!currentRef) return;

    const sketch = (p) => {
        //parsing data stuffs
      // clean up the text prop to ensure it's uppercase
      const rawText = demographic ? demographic.toUpperCase() : "WHITE";
      
      // check incoming word agsint JSON columns and grab correct one
      let key = "THE WHITE MAN"; // fallback
      if (rawText.includes("BLACK") || rawText.includes("NEGRO")) key = "THE NEGRO";
      else if (rawText.includes("NATIVE")) key = "THE NATIVE";
      else if (rawText.includes("IMMIGRANT")) key = "THE IMMIGRANT";
      else if (rawText.includes("WOMAN")) key = "THE WOMAN";

      // loop thru json and get numbers for curr demo
      const points = DATA.map(row => row[key]);
      
      // var to animate line / draw it slowly over time / track steps
      let animProgress = 0;

      p.setup = () => {
        currentRef.innerHTML = "";
        const canvas = p.createCanvas(window.innerWidth * 0.6, window.innerHeight * 0.4);
        canvas.parent(currentRef);
        
        // fps
        p.frameRate(8); 
      };

      p.draw = () => {
        p.clear(); // clean canv every frame b4 redrawing
        
        const padding = 50;

        // faint horiz bg grid lines at 0, 3, 5, and 7
        const gridVals = [0, 3, 5, 7];
        gridVals.forEach(val => {
          const y = p.map(val, 0, 7, p.height - padding, padding);
          p.stroke(255, 255, 255, 12);
          p.strokeWeight(1);
          p.line(padding, y, p.width - padding, y);
        });

        // increase animation timer/steps by a small amnt evry frame until it reaches 1 (100%)
        if (animProgress < 1) {
          animProgress += 0.008; //increase or lower to change speed
        }

        //figure out how many 2 dots/lines to draw based on curr progress
        //if 50% draw 125 n etc
        const currentPointsCount = Math.floor(p.lerp(1, points.length, animProgress));

        p.noFill();
        p.stroke(255, 255, 255, 180); 
        p.strokeWeight(1);
        
        // conncet da dots here
        p.beginShape();
        for (let i = 0; i < currentPointsCount; i++) {
          // calc where on screen curr year and score shld be put
          const x = p.map(i, 0, points.length - 1, padding, p.width - padding);
          const y = p.map(points[i], 0, 7, p.height - padding, padding);
          p.vertex(x, y); // finally -> put it on da thing
        }
        p.endShape();
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth * 0.6, window.innerHeight * 0.4);
      };
    };

    const myP5 = new p5(sketch);

    // clear canvas after
    return () => {
      myP5.remove();
      if (currentRef) {
        currentRef.innerHTML = "";
      }
    };
  }, [demographic]);

  return <div ref={sketchRef} className="p5-canvas-wrapper" />;
}