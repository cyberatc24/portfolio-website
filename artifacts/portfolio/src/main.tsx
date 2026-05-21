import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { unlockAudio } from "./lib/sounds";

const unlock = () => {
  unlockAudio();
  document.removeEventListener("click", unlock, true);
  document.removeEventListener("keydown", unlock, true);
  document.removeEventListener("touchstart", unlock, true);
};

document.addEventListener("click", unlock, true);
document.addEventListener("keydown", unlock, true);
document.addEventListener("touchstart", unlock, true);

createRoot(document.getElementById("root")!).render(<App />);
