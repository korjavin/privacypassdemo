import React from 'react';
import Step1_Intro from './components/steps/Step1_Intro';
import Step4_ECC from './components/steps/Step4_ECC';
import Step8_FullFlow from './components/steps/Step8_FullFlow';
import './App.css';

function App() {
  return (
    <div className="App">
      <Step1_Intro />
      <Step4_ECC />
      <Step8_FullFlow />
    </div>
  );
}

export default App;
