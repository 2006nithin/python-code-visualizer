# Python Code Visualizer

A beginner-friendly Python learning website based on the supplied design.

## Features
- Python editor with Run / Step / Reset / Clear
- Step-by-step execution tracing
- Current-line highlighting
- Variables snapshot for every step
- Function call stack tracking
- Program output and errors
- Real-world scenario library
- Prediction quiz with explanations and score
- What-If simulation by changing input/code
- Compare & Learn for two approaches
- Responsive navy/teal/white UI

## Run in VS Code

1. Open this folder in VS Code.
2. Create a virtual environment:
   `py -m venv .venv`
3. Activate it in PowerShell:
   `.\.venv\Scripts\Activate.ps1`
4. Install packages:
   `pip install -r requirements.txt`
5. Start:
   `uvicorn app:app --reload`
6. Open `http://127.0.0.1:8000`

## Security note
The execution endpoint runs submitted Python on the server machine. This project is intended for local learning/demo use. Do not deploy it publicly without a proper sandbox/container isolation layer.
