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
  const [filteredCarryingOptions, setFilteredCarryingOptions] = useState<
    string[]
  >([]);
  const [selectedTradeValue, setSelectedTradeValue] = useState("");
  const [selectedPackType, setSelectedPackType] = useState("");

  useEffect(() => {
    // Update "To" dropdown options based on the selected "From" option
    const updateToOptions = () => {
      const fromOptionGoldNodes = goldNodes[selectedFromOption];
      const fromOptionGildaNodes = gildaNodes[selectedFromOption];
      const fromOptionStabNodes = stabNodes[selectedFromOption];

      let toOptions: string[] = [];
      let carryingOptions: string[] = [];

      // If the source has a gold node, render its possible destinations in the destination list
      if (fromOptionGoldNodes) {
        toOptions = toOptions.concat(
          Object.keys(fromOptionGoldNodes).filter(
            (toOption) => fromOptionGoldNodes[toOption].goldValue !== -1
          )
        );
      }

      // If the source has a gilda node, render its possible destinations in the destination list
      if (fromOptionGildaNodes) {
        toOptions = toOptions.concat(
          Object.keys(fromOptionGildaNodes).filter(
            (toOption) => fromOptionGildaNodes[toOption].goldValue !== -1
          )
        );
      }

      // If the source has a stab node, render its possible destinations in the destination list
      if (fromOptionStabNodes) {
        toOptions = toOptions.concat(
          Object.keys(fromOptionStabNodes).filter(
            (toOption) => fromOptionStabNodes[toOption].goldValue !== -1
          )
        );
      }

      // Take the list of destinations and generate the list of possible packs
      toOptions = [...new Set(toOptions)];
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
      setFilteredToOptions(toOptions);
      setFilteredCarryingOptions(carryingOptions);
    };

    updateToOptions();
  }, [selectedFromOption, goldNodes, gildaNodes, stabNodes]);

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

    let calculatedGoldValue = -1;
    let calculatedGildaValue = -1;
    let calculatedStabValue = -1;
    const percentageDifference = (parseInt(selectedTradeValue, 10) - 100) / 100;

    // Algorithm to determine the reward based on pack type
    switch (selectedPackType) {
      case "0":
        if (
          goldNodes[selectedFromOption][selectedToOption] &&
          goldNodes[selectedFromOption][selectedToOption].goldValue !== -1
        ) {
          calculatedGoldValue =
            (goldNodes[selectedFromOption][selectedToOption].goldValue / 1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          gildaNodes[selectedFromOption][selectedToOption] &&
          gildaNodes[selectedFromOption][selectedToOption].goldValue !== -1
        ) {
          calculatedGildaValue =
            (gildaNodes[selectedFromOption][selectedToOption].goldValue / 1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          stabNodes[selectedFromOption][selectedToOption] &&
          stabNodes[selectedFromOption][selectedToOption].goldValue !== -1
        ) {
          calculatedStabValue =
            (stabNodes[selectedFromOption][selectedToOption].goldValue / 1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        break;
      case "1":
        if (
          goldNodes[selectedFromOption][selectedToOption] &&
          goldNodes[selectedFromOption][selectedToOption].gildaValue !== -1
        ) {
          calculatedGoldValue =
            (goldNodes[selectedFromOption][selectedToOption].gildaValue / 1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          gildaNodes[selectedFromOption][selectedToOption] &&
          gildaNodes[selectedFromOption][selectedToOption].gildaValue !== -1
        ) {
          calculatedGildaValue =
            (gildaNodes[selectedFromOption][selectedToOption].gildaValue /
              1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          stabNodes[selectedFromOption][selectedToOption] &&
          stabNodes[selectedFromOption][selectedToOption].gildaValue !== -1
        ) {
          calculatedStabValue =
            (stabNodes[selectedFromOption][selectedToOption].gildaValue / 1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        break;
      case "2":
        if (
          goldNodes[selectedFromOption][selectedToOption] &&
          goldNodes[selectedFromOption][selectedToOption].fellowshipValue !== -1
        ) {
          calculatedGoldValue =
            (goldNodes[selectedFromOption][selectedToOption].fellowshipValue /
              1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          gildaNodes[selectedFromOption][selectedToOption] &&
          gildaNodes[selectedFromOption][selectedToOption].fellowshipValue !==
            -1
        ) {
          calculatedGildaValue =
            (gildaNodes[selectedFromOption][selectedToOption].fellowshipValue /
              1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          stabNodes[selectedFromOption][selectedToOption] &&
          stabNodes[selectedFromOption][selectedToOption].fellowshipValue !== -1
        ) {
          calculatedStabValue =
            (stabNodes[selectedFromOption][selectedToOption].fellowshipValue /
              1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        break;
      case "3":
        if (
          goldNodes[selectedFromOption][selectedToOption] &&
          goldNodes[selectedFromOption][selectedToOption].fertValue !== -1
        ) {
          calculatedGoldValue =
            (goldNodes[selectedFromOption][selectedToOption].fertValue / 1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          gildaNodes[selectedFromOption][selectedToOption] &&
          gildaNodes[selectedFromOption][selectedToOption].fertValue !== -1
        ) {
          calculatedGildaValue =
            (gildaNodes[selectedFromOption][selectedToOption].fertValue / 1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          stabNodes[selectedFromOption][selectedToOption] &&
          stabNodes[selectedFromOption][selectedToOption].fertValue !== -1
        ) {
          calculatedStabValue =
            (stabNodes[selectedFromOption][selectedToOption].fertValue / 1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        break;
      case "4":
        if (
          goldNodes[selectedFromOption][selectedToOption] &&
          goldNodes[selectedFromOption][selectedToOption].honeyValue !== -1
        ) {
          calculatedGoldValue =
            (goldNodes[selectedFromOption][selectedToOption].honeyValue / 1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          gildaNodes[selectedFromOption][selectedToOption] &&
          gildaNodes[selectedFromOption][selectedToOption].honeyValue !== -1
        ) {
          calculatedGildaValue =
            (gildaNodes[selectedFromOption][selectedToOption].honeyValue /
              1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          stabNodes[selectedFromOption][selectedToOption] &&
          stabNodes[selectedFromOption][selectedToOption].honeyValue !== -1
        ) {
          calculatedStabValue =
            (stabNodes[selectedFromOption][selectedToOption].honeyValue / 1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        break;
      case "5":
        if (
          goldNodes[selectedFromOption][selectedToOption] &&
          goldNodes[selectedFromOption][selectedToOption].cheeseValue !== -1
        ) {
          calculatedGoldValue =
            (goldNodes[selectedFromOption][selectedToOption].cheeseValue /
              1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          gildaNodes[selectedFromOption][selectedToOption] &&
          gildaNodes[selectedFromOption][selectedToOption].cheeseValue !== -1
        ) {
          calculatedGildaValue =
            (gildaNodes[selectedFromOption][selectedToOption].cheeseValue /
              1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        if (
          stabNodes[selectedFromOption][selectedToOption] &&
          stabNodes[selectedFromOption][selectedToOption].cheeseValue !== -1
        ) {
          calculatedStabValue =
            (stabNodes[selectedFromOption][selectedToOption].cheeseValue /
              1.3) *
            (parseInt(selectedTradeValue, 10) / 100);
        }
        break;
    }
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
                    onChange={(e) => setSelectedToOption(e.target.value)}
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
              <div className="news-title">November 24th, 2023</div>
              <div className="news-subtitle">Patch 1.1.8</div>
              <br />
              <ul className="news-content">
                <li>
                  <b>Fixes/Adjustments:</b>
                  <ul>
                    <li>
                      Hellswamp returns to normal conflict cycle but requires
                      less kills to push
                    </li>
                    <li>Reedwind's war time reduced to 2 hours</li>
                    <li>
                      Heart of Ayanad buffed (Damage taken by boss is decreased
                      by 30%)
                    </li>
                    <li>Experia Patches reenabled</li>
                    <li>Siege defender count fixed</li>
                  </ul>
                </li>
                <li>
                  <b>Ghost Wedding (11/24/23 - 12/8/23)</b>
                  <ul>
                    <li>
                      Located in White Arden, the usual event world gates can be
                      found in Austera, Marianople, and Diamond Shores
                    </li>
                  </ul>
                </li>
                <li>
                  <b>Marketplace</b>
                  <ul>
                    <li>
                      PayPal payment method has been made available on
                      playcardexpress.com
                    </li>
                    <li>
                      New crypto payment system implemented, it should be a much
                      smoother process now
                    </li>
                    <li>New cosmetics added</li>
                    <li>
                      A Free Thanksgiving Gift will be available in the
                      marketplace (x1 claim per account for characters lvl 51+)
                    </li>
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
