import "./App.css";
import Navbar from "./components/Navbar";
import ContentPanel from "./components/ContentPanel";
import { useState, useEffect } from "react";

function App() {
  const [selectedLink, setSelectedLink] = useState<string | null>(null);

  const handleSelectButton = (item: string) => {
    setSelectedLink(item);
  };

  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
    }

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div>
      <Navbar onSelectButton={handleSelectButton} />
      <ContentPanel selectedLink={selectedLink} />
    </div>
  );
}

export default App;
