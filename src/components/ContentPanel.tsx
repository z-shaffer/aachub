import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  worldNodes,
  auroriaNodes,
  haranyaPortNodes,
  haranyaTradeNodes,
  nuiaPortNodes,
  nuiaTradeNodes,
  nodeVal,
  freedichNode,
} from "./data/NodeData";

import "./ContentPanel.css";

import tradeImage from "./assets/trade.jpg";
import regradeImage from "./assets/regrade.jpg";
import newsImage from "./assets/news.jpg";
import charc from "./assets/charcstab.jpg";
import drag from "./assets/dragstab.jpg";
import gilda from "./assets/gildastar.jpg";

let showValues = false;

// Initial populated list of source locations
const fromOptions: string[] = [];
haranyaPortNodes.forEach((node) => {
  fromOptions.push(node.name);
});
haranyaTradeNodes.forEach((node) => {
  fromOptions.push(node.name);
});
nuiaPortNodes.forEach((node) => {
  fromOptions.push(node.name);
});
nuiaTradeNodes.forEach((node) => {
  fromOptions.push(node.name);
});
const toOptions: string[] = [];
const carryingOptions: string[] = [];

interface ContentPanelProps {
  selectedLink: string | null;
}

function ContentPanel({ selectedLink }: ContentPanelProps) {
  const [fadeTransition, setFadeTransition] = useState(false);
  const [inputValue, setInputValue] = useState(130);

  useEffect(() => {
    setFadeTransition(true);

    const resetTimeout = setTimeout(() => {
      setFadeTransition(false);
    }, 500);

    return () => {
      clearTimeout(resetTimeout);
    };
  }, [selectedLink]);

  // Keep current demand percantage between 70 and 130
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseFloat(event.target.value);
    if (newValue < 70) {
      newValue = 70;
    } else if (newValue > 130) {
      newValue = 130;
    }
    setInputValue(newValue);
  };

  const [selectedFromOption, setSelectedFromOption] = useState("");
  const [selectedToOption, setSelectedToOption] = useState("");
  const [filteredToOptions, setFilteredToOptions] = useState<string[]>([]);
  const [selectedCarryingOption, setSelectedCarryingOption] = useState("");
  const [filteredCarryingOptions, setFilteredCarryingOptions] = useState<string[]>([]);
  const [selectedTradeValue, setSelectedTradeValue] = useState("");
  const [selectedPackType, setSelectedPackType] = useState("");
  const [calculatedGoldValue, setCalculatedGoldValue] = useState<number>(-1);
  const [calculatedGildaValue, setCalculatedGildaValue] = useState<number>(-1);
  const [calculatedStabValue, setCalculatedStabValue] = useState<number>(-1);

  useEffect(() => {
    // Update "To" dropdown options based on the selected "From" option
    const updateToOptions = () => {
      let toOptions: string[] = [];
      let carryingOptions: string[] = [];
      (async () => {
        try {
          const response = await axios.get(`http://localhost:5050/tradeRoutes/${selectedFromOption}`);
          toOptions = await toOptions.concat(response.data.destinations);
          toOptions = await [...new Set(toOptions)];
          setFilteredToOptions(toOptions);
        } catch (error) {
            console.error('Error fetching trade routes:', error);
        }
      })();
      // Take the list of destinations and generate the list of possible packs
      for (const node of [
        ...haranyaPortNodes,
        ...haranyaTradeNodes,
        ...nuiaPortNodes,
        ...nuiaTradeNodes,
      ]) {
        if (node.name === selectedFromOption) {
          carryingOptions = carryingOptions.concat(node.goldPack!);
          carryingOptions = carryingOptions.concat(node.gildaPack!);
          carryingOptions = carryingOptions.concat(node.fellowshipPack!);
          carryingOptions = carryingOptions.concat(node.fertPack!);
          carryingOptions = carryingOptions.concat(node.agedPack!);
          carryingOptions = carryingOptions.concat(node.communityPack!);
        }
      }
      setFilteredCarryingOptions(carryingOptions);
    };

    updateToOptions();
  }, [selectedFromOption]);

  const calculateValues = () => {
    // Prepare the currency format to be rendered with the reward amount
    function formatCurrency(value: number): JSX.Element | string {
      if (value === -1) {
        return "";
      }
      const gold = Math.floor(value);
      const silver = Math.floor((value - gold) * 100);
      const copper = Math.floor(((value - gold) * 100 - silver) * 100);

      // Format the result
      const formattedResult = (
        <div className="currency-gold">
          <span className="gold">{String(gold).padStart(2, "0")}g </span>
          <span className="silver">{String(silver).padStart(2, "0")}s </span>
          <span className="copper">{String(copper).padStart(2, "0")}c </span>
        </div>
      );

      return formattedResult;
    }
    const percentageDifference = (parseInt(selectedTradeValue, 10) - 100) / 100;

    let baseGoldValue = 0;
    let baseGildaValue = 0;
    let baseStabValue = 0;
    let tradeValue = parseInt(selectedTradeValue, 10);
    prepareValues();
    // Algorithm to determine the reward based on pack type
    async function prepareValues() {
      let responseGold = null;
      let responseGilda = null;
      let responseStab = null;
      const API_URL = 'http://localhost:5050/tradeRoutes'
      switch (selectedPackType) {
        case "0":
          try {
            responseGold = await axios.get(`${API_URL}/goldNodes/${selectedFromOption}/${selectedToOption}/goldValue`);
            baseGoldValue = parseFloat(responseGold.data);
            setCalculatedGoldValue((baseGoldValue / 1.3) * (tradeValue / 100));
            
          }
          catch {
            
          }
          try {
            responseGilda = await axios.get(`${API_URL}/gildaNodes/${selectedFromOption}/${selectedToOption}/goldValue`);
            baseGildaValue = parseFloat(responseGilda.data);
            setCalculatedGildaValue((baseGildaValue / 1.3) * (tradeValue / 100));
            responseStab = await axios.get(`${API_URL}/stabNodes/${selectedFromOption}/${selectedToOption}/goldValue`);
            baseStabValue = parseFloat(responseStab.data);
            setCalculatedStabValue((baseStabValue / 1.3) * (tradeValue / 100));
            
          }
          catch {
            
          }
          break;
        case "1":
          try {
            responseGold = await axios.get(`${API_URL}/goldNodes/${selectedFromOption}/${selectedToOption}/gildaValue`);
            baseGoldValue = parseFloat(responseGold.data);
            setCalculatedGoldValue((baseGoldValue / 1.3) * (tradeValue / 100));
          }
          catch {
            
          }
          try {
            responseGilda = await axios.get(`${API_URL}/gildaNodes/${selectedFromOption}/${selectedToOption}/gildaValue`);
            baseGildaValue = parseFloat(responseGilda.data);
            setCalculatedGildaValue((baseGildaValue / 1.3) * (tradeValue / 100));
            responseStab = await axios.get(`${API_URL}/stabNodes/${selectedFromOption}/${selectedToOption}/gildaValue`);
            baseStabValue = parseFloat(responseStab.data);
            setCalculatedStabValue((baseStabValue / 1.3) * (tradeValue / 100));
          }
          catch {
            
          }
          break;
        case "2":
          try {
            responseGold = await axios.get(`${API_URL}/goldNodes/${selectedFromOption}/${selectedToOption}/fellowshipValue`);
            baseGoldValue = parseFloat(responseGold.data);
            setCalculatedGoldValue((baseGoldValue / 1.3) * (tradeValue / 100));
          }
          catch {
            
          }
          try {
            responseGilda = await axios.get(`${API_URL}/gildaNodes/${selectedFromOption}/${selectedToOption}/fellowshipValue`);
            baseGildaValue = parseFloat(responseGilda.data);
            setCalculatedGildaValue((baseGildaValue / 1.3) * (tradeValue / 100));
            responseStab = await axios.get(`${API_URL}/stabNodes/${selectedFromOption}/${selectedToOption}/fellowshipValue`);
            baseStabValue = parseFloat(responseStab.data);
            setCalculatedStabValue((baseStabValue / 1.3) * (tradeValue / 100));
          }
          catch {
            
          }
          break;
        case "3":
          try {
            responseGold = await axios.get(`${API_URL}/goldNodes/${selectedFromOption}/${selectedToOption}/fertValue`);
            baseGoldValue = parseFloat(responseGold.data);
            setCalculatedGoldValue((baseGoldValue / 1.3) * (tradeValue / 100));
          }
          catch {
            
          }
          try {
            responseGilda = await axios.get(`${API_URL}/gildaNodes/${selectedFromOption}/${selectedToOption}/fertValue`);
            baseGildaValue = parseFloat(responseGilda.data);
            setCalculatedGildaValue((baseGildaValue / 1.3) * (tradeValue / 100));
            responseStab = await axios.get(`${API_URL}/stabNodes/${selectedFromOption}/${selectedToOption}/fertValue`);
            baseStabValue = parseFloat(responseStab.data);
            setCalculatedStabValue((baseStabValue / 1.3) * (tradeValue / 100));
          }
          catch {
            
          }
          break;
        case "4":
          try {
            responseGold = await axios.get(`${API_URL}/goldNodes/${selectedFromOption}/${selectedToOption}/honeyValue`);
            baseGoldValue = parseFloat(responseGold.data);
            setCalculatedGoldValue((baseGoldValue / 1.3) * (tradeValue / 100));
          }
          catch {
            
          }
          try {
            responseGilda = await axios.get(`${API_URL}/gildaNodes/${selectedFromOption}/${selectedToOption}/honeyValue`);
            baseGildaValue = parseFloat(responseGilda.data);
            setCalculatedGildaValue((baseGildaValue / 1.3) * (tradeValue / 100));
            responseStab = await axios.get(`${API_URL}/stabNodes/${selectedFromOption}/${selectedToOption}/honeyValue`);
            baseStabValue = parseFloat(responseStab.data);
            setCalculatedStabValue((baseStabValue / 1.3) * (tradeValue / 100));
          }
          catch {
            
          }
          break;
        case "5":
          try {
            responseGold = await axios.get(`${API_URL}/goldNodes/${selectedFromOption}/${selectedToOption}/cheeseValue`);
            baseGoldValue = parseFloat(responseGold.data);
            setCalculatedGoldValue((baseGoldValue / 1.3) * (tradeValue / 100));
          }
          catch {
            
          }
          try {
            responseGilda = await axios.get(`${API_URL}/gildaNodes/${selectedFromOption}/${selectedToOption}/cheeseValue`);
            baseGildaValue = parseFloat(responseGilda.data);
            setCalculatedGildaValue((baseGildaValue / 1.3) * (tradeValue / 100));
            responseStab = await axios.get(`${API_URL}/stabNodes/${selectedFromOption}/${selectedToOption}/cheeseValue`);
            baseStabValue = parseFloat(responseStab.data);
            setCalculatedStabValue((baseStabValue / 1.3) * (tradeValue / 100));
          }
          catch {
            
          }
          break;
        }
    }

    // Return the calculated reward amount and currency
    return (
      <div
        style={{
          display: "inline-block",
          width: "70%",
          paddingLeft: "5vw",
        }}
      >
        {calculatedGoldValue !== -1 && (
          <span className="gold">{formatCurrency(calculatedGoldValue)}</span>
        )}
        {calculatedGildaValue !== -1 && (
          <span className="gilda">
            {Math.round(calculatedGildaValue)} <img src={gilda} />
          </span>
        )}
        {calculatedStabValue !== -1 &&
          selectedToOption === "Freedich Island" && (
            <span className="drag-stab">
              {Math.round(calculatedStabValue)} <img src={drag} />
            </span>
          )}
        {calculatedStabValue !== -1 &&
          selectedToOption !== "Freedich Island" && (
            <span className="charc-stab">
              {Math.round(calculatedStabValue)} <img src={charc} />
            </span>
          )}
      </div>
    );
  };

  return (
    <div className="content-panel">
      <div className={`content ${fadeTransition ? "fade-out" : ""}`}>
        {selectedLink === "Trade Pack Planner" && (
          <>
            <div className="image-container">
              <img
                src={tradeImage}
                className="rounded-image"
                draggable="false"
              />
            </div>
            <div className="planner-content">
              <h2>
                <div className="input-container">
                  <label htmlFor="fromInput">Crafting:</label>
                  <input
                    type="text"
                    list="fromOptions"
                    id="fromInput"
                    className="standard-input"
                    value={selectedFromOption}
                    onChange={(e) => {
                      setSelectedFromOption(e.target.value);
                      setSelectedCarryingOption("");
                      setSelectedTradeValue("130");
                      if (selectedFromOption === selectedToOption) {
                        setSelectedToOption("");
                        setFilteredToOptions([]);
                      }
                    }}
                    style={{ fontSize: "24px" }}
                  />
                  <datalist id="fromOptions">
                    {fromOptions.map((option, index) => (
                      <option key={index} value={option} />
                    ))}
                  </datalist>
                </div>
                <div className="input-container">
                  <label htmlFor="toInput">Selling:</label>
                  <input
                    type="text"
                    list="toOptions"
                    id="toInput"
                    className="standard-input"
                    value={selectedToOption}
                    onChange={(e) => { setSelectedToOption(e.target.value);
                      setCalculatedGildaValue(-1);
                      setCalculatedStabValue(-1);
                      setCalculatedGoldValue(-1);}}
                    style={{ fontSize: "24px" }}
                  />
                  <datalist id="toOptions">
                    {filteredToOptions.map((option, index) => (
                      <option key={index} value={option} />
                    ))}
                  </datalist>
                </div>
                <div className="input-container">
                  <label htmlFor="carryingInput">Carrying:</label>
                  <input
                    type="text"
                    list="carryingOptions"
                    id="carryingInput"
                    className="standard-input"
                    value={selectedCarryingOption}
                    onChange={(e) => {
                      setSelectedCarryingOption(e.target.value);
                      setSelectedPackType(
                        filteredCarryingOptions
                          .findIndex((option) => option === e.target.value)
                          .toString()
                      );
                      setCalculatedGildaValue(-1);
                      setCalculatedStabValue(-1);
                      setCalculatedGoldValue(-1);
                    }}
                    style={{ fontSize: "24px" }}
                  />
                  <datalist id="carryingOptions">
                    {filteredCarryingOptions.map((option, index) => (
                      <option key={index} value={option} />
                    ))}
                  </datalist>
                </div>
                <div className="result-container">
                  <div className="input-container">
                    <label htmlFor="tradeValueInput">At: </label>
                    <input
                      type="number"
                      id="tradeValueInput"
                      className="smaller-input"
                      value={selectedTradeValue}
                      onChange={(e) => {
                        setSelectedTradeValue(e.target.value);
                      }}
                      min={70}
                      max={130}
                      style={{
                        fontSize: "24px",
                        appearance: "none"
                      }}
                    />
                    <label htmlFor="tradeValueInput"> % </label>
                  </div>
                  {selectedFromOption &&
                    selectedToOption &&
                    selectedCarryingOption &&
                    calculateValues()}
                </div>
              </h2>
              <div
                style={{
                  fontSize: "1rem",
                  position: "fixed",
                  left: "50%",
                  bottom: "1%",
                }}
              >
              </div>
            </div>
          </>
        )}
        {selectedLink === "Regrade Simulator" && (
          <>
            <div className="image-container">
              <img
                src={regradeImage}
                className="rounded-image"
                draggable="false"
              />
            </div>
            <div className="regrade-content">
              <h2>Coming soon.</h2>
            </div>
          </>
        )}
        {!selectedLink && (
          <>
            <div className="image-container">
              <img
                src={newsImage}
                className="rounded-image"
                draggable="false"
              />
            </div>
            <div className="news-container">
              <div className="news-title">January 31st, 2024</div>
              <div className="news-subtitle">Patch 1.1.15</div>
              <br />
              <ul className="news-content">
                <li>
                  <b>General</b>
                  <ul>
                    <li>Commerce was changed! More labor but more gold!</li>
                    <li>Abyssal Attack is impacted by the commerce change!</li>
                    <li>The log-in tracker for February has been added</li>
                    <li>Experia Patches reenabled</li>
                    <li>Fixes were applied to the extra hotbars</li>
                  </ul>
                </li>
                <li>
                  <b>Transfers</b>
                  <ul>
                    <li>Players can now transfer from East to West again, we will continue to monitor this going forward.</li>
                  </ul>
                </li>
                <li>
                  <b>New Player Experience Revised</b>
                  <ul>
                    <li>We've streamlined some of the New Player leveling experience now that we've progressed enough into the server's timeline.</li>
                    <li>A Written Guide has been Provided for anyone Starting the Server that will guide them from start to Level 52, including the receiving of their Catch Up Kit. https://forum.aa-classic.com/index.php?threads/aa-classic-new-player-guide-2024.841/</li>
                  </ul>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ContentPanel;
