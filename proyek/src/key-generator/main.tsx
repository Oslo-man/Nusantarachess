import { createRoot } from "react-dom/client";
import { KeyGeneratorApp } from "./KeyGeneratorApp";

const root = document.getElementById("root");
if (root) createRoot(root).render(<KeyGeneratorApp />);
