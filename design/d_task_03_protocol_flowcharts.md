Task: Generate technical flowcharts for the VOPRF protocol.
Prompt 3.1: VOPRF Protocol Flow
Prompt: "Create a technical swimlane diagram illustrating the VOPRF token generation flow. There should be two vertical lanes labeled 'Client' and 'Server'. The sequence of events should be shown with numbered arrows moving between the lanes.
(Inside Client lane) Process box: 'Generate random nonce n and blinding factor r. Compute Blinded Element B=r⋅H(n)'.
(Arrow from Client to Server) Data label: 'B'.
(Inside Server lane) Process box: 'Receive B. Compute Evaluated Element E=k⋅B. Generate DLEQ Proof π'.
(Arrow from Server to Client) Data label: 'E,π'.
(Inside Client lane) Process box: 'Receive E,π. Verify Proof π. If valid, compute Final Token Output O=r−1⋅E'.
The style should be a clean, professional flowchart using standard UML shapes (rectangles for processes, parallelograms for data). Use a clear, sans-serif font. Use LaTeX notation for all mathematical formulas."
