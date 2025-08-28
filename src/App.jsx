import React from 'react';
import Step1_Intro from './components/steps/Step1_Intro';
import Step4_ECC from './components/steps/Step4_ECC';
import Step7_ZKP from './components/steps/Step7_ZKP';
import './App.css';

function App() {
  return (
    <div className="App">
      <Step1_Intro />
      <Step4_ECC />
      <Step7_ZKP />
    </div>
  );
}

export default App;
