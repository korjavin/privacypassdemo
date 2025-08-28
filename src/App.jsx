import React from 'react';
import Step1_Intro from './components/steps/Step1_Intro';
import Step2_Goal from './components/steps/Step2_Goal';
import Step3_PKC from './components/steps/Step3_PKC';
import Step4_ECC from './components/steps/Step4_ECC';
import Step6_Trust from './components/steps/Step6_Trust';
import Step7_ZKP from './components/steps/Step7_ZKP';
import Step8_FullFlow from './components/steps/Step8_FullFlow';
import './App.css';

function App() {
  return (
    <div className="App">
      <Step1_Intro />
      <Step2_Goal />
      <Step3_PKC />
      <Step4_ECC />
      <Step6_Trust />
      <Step7_ZKP />
      <Step8_FullFlow />
    </div>
  );
}

export default App;
