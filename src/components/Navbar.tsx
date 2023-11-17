import "./Navbar.css";
import { useState } from "react";
import logo from "./assets/logo.png";

interface Props {
  onSelectButton: (item: string) => void;
}

const Navbar: React.FC<Props> = ({ onSelectButton }: Props) => {
  const [selectedLink, setSelectedLink] = useState<string | null>(null);

  const handleLinkClick = (item: string) => {
    setSelectedLink(item);
    onSelectButton(item);
  };

  return (
    <nav className="navbar navbar-expand-lg brown-navbar">
      <div className="container-fluid">
        <ul className="navbar-nav align-items-center navbar-center">
          <li className="nav-item">
            <a
              className={`navbar-button ${
                selectedLink === "Trade Pack Planner" ? "selected" : ""
              }`}
              onClick={() => handleLinkClick("Trade Pack Planner")}
            >
              Trade Pack Planner
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`navbar-title ${
                selectedLink === "" ? "selected" : ""
              }`}
              onClick={() => handleLinkClick("")}
            >
              <img src={logo} className="logo" draggable="false" />
            </a>
          </li>
          <li className="nav-item">
            <a
              style={{ marginLeft: "5px" }}
              className={`navbar-button ${
                selectedLink === "Regrade Simulator" ? "selected" : ""
              }`}
              onClick={() => handleLinkClick("Regrade Simulator")}
            >
              Regrade Simulator
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
