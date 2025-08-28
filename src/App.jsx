import React from 'react';
import Step1_Intro from './components/steps/Step1_Intro';
import Step3_PKC from './components/steps/Step3_PKC';
import Step2_Goal from './components/steps/Step2_Goal';

import Step4_ECC from './components/steps/Step4_ECC';
import './App.css';

function App() {
  return (
    <div className="App">
      <Step1_Intro />
      <Step2_Goal />
      <Step3_PKC />
      <Step4_ECC />
    </div>
  );
}

export default App;
