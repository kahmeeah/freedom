import { useState } from 'react';
import './App.css';
import Scene_01 from './scenes/01scene';
import Scene_02 from './scenes/02scene';
import Scene_03 from './scenes/03scene';
import DemographicScene from './scenes/demographic';
import Final_Scene from './scenes/finalscene';

export default function App() {
  const [scene, setScene] = useState(1);

  return (
    // global components can go hereeee
    <div>
      <button 
  className="global-nav-btn" 
  onClick={() => scene < 9 ? setScene(9) : setScene(1)}
  style={{ color: (scene >= 4 && scene <= 8) ? '#f7f6f2' : '#0d0d0d' }}
>
  {scene < 9 ? "SKIP" : "REPLAY"}
</button>

    <div className={scene === 1 || scene === 2 ? "film-jitter" : ""}>
      {scene === 1 && <Scene_01 next={() => setScene(2)} />}
      {scene === 2 && <Scene_02 next={() => setScene(3)} />}
      {scene === 3 && <Scene_03 next={() => setScene(4)} />}
      {scene === 4 && <DemographicScene demographic="THE WHITE MAN" next={() => setScene(5)} />}
      {scene === 5 && <DemographicScene demographic="THE NEGRO" next={() => setScene(6)} />}
      {scene === 6 && <DemographicScene demographic="THE NATIVE" next={() => setScene(7)} />}
      {scene === 7 && <DemographicScene demographic="THE IMMIGRANT" next={() => setScene(8)} />}
      {scene === 8 && <DemographicScene demographic="THE WOMAN" next={() => setScene(9)} />}
      {scene === 9 && <Final_Scene restart={() => setScene(1)} />}
    </div>


    </div>
    

    
  );
}