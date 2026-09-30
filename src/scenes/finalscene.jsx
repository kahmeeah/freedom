import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { DATA } from '../components/dataset';
import './finalscene.css';

export default function Final_Scene({ restart }) {
  // var to hold canvas 
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    const currentRef = canvasContainerRef.current;
    if (!currentRef) return; // if page isnt loaded fully - then stop

    const sketch = (p) => {
      // list all column names we want
      const categories = [
        "THE WHITE MAN", 
        "THE NEGRO", 
        "THE NATIVE", 
        "THE IMMIGRANT", 
        "THE WOMAN"
      ];
      

      const lineColors = {
        "THE WHITE MAN": [13, 13, 13, 100], //base color
        "THE NEGRO": [235, 60, 135, 210], 
        "THE NATIVE": [240, 80, 45, 210],    
        "THE IMMIGRANT": [0, 150, 220, 210],     
        "THE WOMAN": [110, 180, 45, 210] 
      };

      p.setup = () => {
        currentRef.innerHTML = ""; // clear any old canvas
        
        // set sizing
        const canvas = p.createCanvas(Math.min(window.innerWidth * 0.7, 900), 320);
        canvas.parent(currentRef); // attach canvas 2 dom
        
        // stops the canvas from redrawing bc rn its just static </3
        p.noLoop();
      };

      p.draw = () => {
        p.background(247, 246, 242); 
        
        // define margins
        const paddingLeft = 120;
        const paddingRight = 140; // leave room 4 text labels
        const paddingTop = 30;
        const paddingBottom = 40;
        
        // calc the actual drawable space left inside the margins after all that ^
        const chartWidth = p.width - paddingLeft - paddingRight;
        const chartHeight = p.height - paddingTop - paddingBottom;

        // draw grid lines
        const gridVals = [0, 3, 5, 7];
        gridVals.forEach(val => {
          // convert 0-7 num scale into pixel-able heights on the screen
          const y = p.map(val, 0, 7, paddingTop + chartHeight, paddingTop);
          
          // draw horiz lines
          p.stroke(13, 13, 13, 18);
          p.strokeWeight(1);
          p.line(paddingLeft, y, paddingLeft + chartWidth, y);

          // draw num labels (0, 3, 5, 7) on left
          p.noStroke();
          p.fill(13, 13, 13, 120);
          p.textSize(10);
          p.textAlign(p.RIGHT, p.CENTER);
          p.text(val, paddingLeft - 12, y);
        });

        // draw main unfreeedom lines
        categories.forEach((cat) => {
          // loop thru entire json array & get for curr demo
          const points = DATA.map(row => row[cat]);
          
          // get curr color
          const [r, g, b, alpha] = lineColors[cat];

          p.noFill(); // lines, no shapes
          p.stroke(r, g, b, alpha); 
          
          //thin white line for contrast
          p.strokeWeight(cat === "THE WHITE MAN" ? 1 : 1.5);
          
          // start connecting the dots
          p.beginShape();
          points.forEach((val, i) => {
            // map the year to an X position ---- the val (0-7) to a Y position
            const x = p.map(i, 0, points.length - 1, paddingLeft, paddingLeft + chartWidth);
            const y = p.map(val, 0, 7, paddingTop + chartHeight, paddingTop);
            p.vertex(x, y); // put everything downn
          });
          p.endShape();
        });

        // smartly place the labels better so they dont overlap
        // figure out where evry label naturally wants 2 sit based on its final point
        const endLabels = categories.map(cat => {
          const points = DATA.map(row => row[cat]);
          const lastVal = points[points.length - 1]; // get the very last number in 2026
          const y = p.map(lastVal, 0, 7, paddingTop + chartHeight, paddingTop);
          
          // store og positions
          return { cat, y, originalY: y, color: lineColors[cat] };
        });

        // sort the labels from highest up on the screen to lowest down
        endLabels.sort((a, b) => a.y - b.y);

        // make a min 16px fap btwn labels
        const minGap = 16; 
        for (let i = 1; i < endLabels.length; i++) {
          if (endLabels[i].y - endLabels[i - 1].y < minGap) {
            // if too close, shove the bottom one down
            endLabels[i].y = endLabels[i - 1].y + minGap;
          }
        }

        // draw the labels on the screen
        const lastX = paddingLeft + chartWidth;
        endLabels.forEach(label => {
          // if pushed down, draw a tiny line connecting it back 2 its true endpoint
          if (Math.abs(label.y - label.originalY) > 0.5) {
            p.stroke(13, 13, 13, 40);
            p.strokeWeight(1);
            p.line(lastX, label.originalY, lastX + 10, label.y);
          }

          const [r, g, b, alpha] = label.color;

          // write text next to lines
          p.noStroke();
          p.fill(r, g, b, 255); 
          p.textSize(10);
          p.textAlign(p.LEFT, p.CENTER);
          p.text(label.cat, lastX + 15, label.y); 
        });
      };

      // when window is resized, redraw the canvas to fit new size
      p.windowResized = () => {
        p.resizeCanvas(Math.min(window.innerWidth * 0.7, 900), 320);
        p.redraw();
      };
    };

    // statt everything
    const myP5 = new p5(sketch);
    
    // clear everything at all
    return () => {
      myP5.remove();
      if (currentRef) currentRef.innerHTML = "";
    };
  }, []);

  return (
    <section className="final-scene-container">
      <div className="final-scene-header">
        
        <h1 className="final-scene-title">Evaluating 250 Years of Unfreedom in America</h1>
        <p className="final-scene-subtitle">
          Total Points of Unfreedom (0-7) across Movement, Body, Wealth, Personhood, Voice, Bloodline, & Environment
        </p>

        
        
      </div>

      <div ref={canvasContainerRef} className="final-scene-canvas-wrapper" />

      <blockquote className="douglass-quote">
          "What, to the American slave, is your 4th of July? I answer; a day that reveals to him, more than all other days in the year, the gross injustice and cruelty to which he is the constant victim. ... There is not a nation on the earth guilty of practices more shocking and bloody than are the people of the United States, at this very hour."
          <span>— Frederick Douglass, "The Meaning of July Fourth for the Negro" (1852)</span>
        </blockquote>

      <div className="final-scene-footer">
        <p className="footer-lead">
          <strong>The higher the score (0-7), the greater the restriction of freedom.</strong><br/>
          A score is calculated for each group for every year since 1776. A score of 7 means near-total institutional control over a group's existence. 
        </p>
        
        <div className="footer-categories">
          <p><strong>1. Movement:</strong> Where you are allowed to go, where you can live, and if you can be forced to move.</p>
          <p><strong>2. Body:</strong> Who controls your physical safety, and whether the state can legally harm or confine you.</p>
          <p><strong>3. Wealth:</strong> The right to own property, keep the money you earn, and build a future.</p>
          <p><strong>4. Personhood:</strong> Being legally recognized as a full human being instead of property, a ward, or an alien.</p>
          <p><strong>5. Bloodline:</strong> The right to marry who you want, keep your children, and exist as a family.</p>
          <p><strong>6. Environment:</strong> The safety and resources of the physical places you are forced to reside (ex. reservations or redlined zones).</p>
          <p><strong>7. Voice:</strong> The right to vote, speak in court, and legally be believed against those in power.</p>
        </div>
      </div>
    </section>
  );
}