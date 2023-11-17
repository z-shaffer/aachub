import React, { useEffect, useState } from "react";
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

const goldNodes: { [key: string]: { [key: string]: nodeVal } } = {};
const gildaNodes: { [key: string]: { [key: string]: nodeVal } } = {};
const stabNodes: { [key: string]: { [key: string]: nodeVal } } = {};

let showValues = false;

// Loop through all nodes to initialize them
for (const nodeX of [
  ...nuiaPortNodes,
  ...nuiaTradeNodes,
  ...haranyaPortNodes,
  ...haranyaTradeNodes,
]) {
  goldNodes[nodeX.name] = {};
  gildaNodes[nodeX.name] = {};
  stabNodes[nodeX.name] = {};

  for (const nodeY of [
    ...nuiaPortNodes,
    ...nuiaTradeNodes,
    ...haranyaPortNodes,
    ...haranyaTradeNodes,
    ...freedichNode,
  ]) {
    goldNodes[nodeX.name][nodeY.name] = {
      goldValue: -1,
      gildaValue: -1,
      fellowshipValue: -1,
      fertValue: -1,
      honeyValue: -1,
      cheeseValue: -1,
    };

    gildaNodes[nodeX.name][nodeY.name] = {
      goldValue: -1,
      gildaValue: -1,
      fellowshipValue: -1,
      fertValue: -1,
      honeyValue: -1,
      cheeseValue: -1,
    };

    stabNodes[nodeX.name][nodeY.name] = {
      goldValue: -1,
      gildaValue: -1,
      fellowshipValue: -1,
      fertValue: -1,
      honeyValue: -1,
      cheeseValue: -1,
    };
  }
}

generateHaranyaGGFGoldValues();
generateHaranyaGGFGildaValues();
generateHaranyaGGFStabValues();
generateHaranyaFHCGoldValues();
generateHaranyaFHCGildaValues();
generateHaranyaFHCStabValues();
generateNuiaGGFGoldValues();
generateNuiaGGFGildaValues();
generateNuiaGGFStabValues();
generateNuiaFHCGoldValues();
generateNuiaFHCGildaValues();
generateNuiaFHCStabValues();

// Sample arrays
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
auroriaNodes.forEach((node) => {
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

      // Include goldNodes
      if (fromOptionGoldNodes) {
        toOptions = toOptions.concat(
          Object.keys(fromOptionGoldNodes).filter(
            (toOption) => fromOptionGoldNodes[toOption].goldValue !== -1
          )
        );
      }

      if (fromOptionGildaNodes) {
        toOptions = toOptions.concat(Object.keys(fromOptionGildaNodes));
      }

      if (fromOptionStabNodes) {
        toOptions = toOptions.concat(Object.keys(fromOptionStabNodes));
      }

      toOptions = [...new Set(toOptions)];

      for (const node of [
        ...haranyaPortNodes,
        ...haranyaTradeNodes,
        ...nuiaPortNodes,
        ...nuiaTradeNodes,
        ...auroriaNodes,
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
                Contact chimpp on discord for any issues
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
              <div className="news-title">November 15th, 2023</div>
              <div className="news-subtitle">Patch 1.1.7</div>
              <br />
              <ul className="news-content">
                <li>
                  The Reedwind zone is now available
                  <ul>
                    <li>
                      A custom Conflict/War cycle has been added to keep the
                      zone interesting. Like Karkasse, Reedwind will know no
                      peace!
                    </li>
                  </ul>
                </li>
                <li>
                  Two new mounts have been added
                  <ul>
                    <li>
                      The first one, Aquestria, is available right away! We are
                      letting players figure out how to get it.
                    </li>
                    <li>
                      The second one will be revealed and become obtainable a
                      bit later!
                    </li>
                  </ul>
                </li>
                <li>
                  Some world bosses have been buffed slightly to make the fights
                  longer
                </li>
                <li>
                  Hasla, Perinoor, Rookborne, Windscour, Hellswamp, Cinderstone,
                  Ynystere and Sanddeep's conflict cycle has been changed
                  <ul>
                    <li>
                      All zones will have 2 hours of conflict, 2 hours of war
                      and 2 hours of peace. These will happen at various offset
                      in an effort to keep all zones cycling
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

function generateHaranyaGGFGoldValues() {
  goldNodes["Arcum Iris"]["Falcorth Plains"]!.goldValue = 6.6287;
  goldNodes["Arcum Iris"]["Falcorth Plains"]!.gildaValue = 7.442;
  goldNodes["Arcum Iris"]["Falcorth Plains"]!.fellowshipValue = 7.7535;
  goldNodes["Arcum Iris"]["Mahadevi"]!.goldValue = 6.0934;
  goldNodes["Arcum Iris"]["Mahadevi"]!.gildaValue = 6.8232;
  goldNodes["Arcum Iris"]["Mahadevi"]!.fellowshipValue = 7.1926;
  goldNodes["Arcum Iris"]["Solis Headlands"]!.goldValue = 9.0796;
  goldNodes["Arcum Iris"]["Solis Headlands"]!.gildaValue = 10.2651;
  goldNodes["Arcum Iris"]["Solis Headlands"]!.fellowshipValue = 10.3208;
  goldNodes["Arcum Iris"]["Villanelle"]!.goldValue = 8.47;
  goldNodes["Arcum Iris"]["Villanelle"]!.gildaValue = 9.5635;
  goldNodes["Arcum Iris"]["Villanelle"]!.fellowshipValue = 9.6823;
  goldNodes["Arcum Iris"]["Ynystere"]!.goldValue = 13.4416;
  goldNodes["Arcum Iris"]["Ynystere"]!.gildaValue = 15.2931;
  goldNodes["Arcum Iris"]["Ynystere"]!.fellowshipValue = 14.8906;
  goldNodes["Arcum Iris"]["Rookborne Basin"]!.goldValue = 9.5419;
  goldNodes["Arcum Iris"]["Rookborne Basin"]!.gildaValue = 10.7966;
  goldNodes["Arcum Iris"]["Rookborne Basin"]!.fellowshipValue = 11.9135;
  goldNodes["Arcum Iris"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["Arcum Iris"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["Arcum Iris"]["Freedich Island"]!.fellowshipValue = 24.908;

  goldNodes["Falcorth Plains"]["Arcum Iris"]!.goldValue = 6.6287;
  goldNodes["Falcorth Plains"]["Arcum Iris"]!.gildaValue = 7.442;
  goldNodes["Falcorth Plains"]["Arcum Iris"]!.fellowshipValue = 7.3375;
  goldNodes["Falcorth Plains"]["Mahadevi"]!.goldValue = 7.3407;
  goldNodes["Falcorth Plains"]["Mahadevi"]!.gildaValue = 8.2624;
  goldNodes["Falcorth Plains"]["Mahadevi"]!.fellowshipValue = 8.0834;
  goldNodes["Falcorth Plains"]["Solis Headlands"]!.goldValue = 10.6522;
  goldNodes["Falcorth Plains"]["Solis Headlands"]!.gildaValue = 12.0774;
  goldNodes["Falcorth Plains"]["Solis Headlands"]!.fellowshipValue = 11.5523;
  goldNodes["Falcorth Plains"]["Villanelle"]!.goldValue = 9.4875;
  goldNodes["Falcorth Plains"]["Villanelle"]!.gildaValue = 10.7358;
  goldNodes["Falcorth Plains"]["Villanelle"]!.fellowshipValue = 10.3323;
  goldNodes["Falcorth Plains"]["Ynystere"]!.goldValue = 14.5552;
  goldNodes["Falcorth Plains"]["Ynystere"]!.gildaValue = 16.5751;
  goldNodes["Falcorth Plains"]["Ynystere"]!.fellowshipValue = 15.6412;
  goldNodes["Falcorth Plains"]["Rookborne Basin"]!.goldValue = 12.561;
  goldNodes["Falcorth Plains"]["Rookborne Basin"]!.gildaValue = 14.2788;
  goldNodes["Falcorth Plains"]["Rookborne Basin"]!.fellowshipValue = 13.5522;
  goldNodes["Falcorth Plains"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["Falcorth Plains"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["Falcorth Plains"]["Freedich Island"]!.fellowshipValue = 24.3161;

  goldNodes["Tigerspine Mountains"]["Arcum Iris"]!.goldValue = 5.0021;
  goldNodes["Tigerspine Mountains"]["Arcum Iris"]!.gildaValue = 5.5663;
  goldNodes["Tigerspine Mountains"]["Arcum Iris"]!.fellowshipValue = 5.5424;
  goldNodes["Tigerspine Mountains"]["Falcorth Plains"]!.goldValue = 5.4635;
  goldNodes["Tigerspine Mountains"]["Falcorth Plains"]!.gildaValue = 5.0983;
  goldNodes["Tigerspine Mountains"][
    "Falcorth Plains"
  ]!.fellowshipValue = 6.0258;
  goldNodes["Tigerspine Mountains"]["Mahadevi"]!.goldValue = 5.3665;
  goldNodes["Tigerspine Mountains"]["Mahadevi"]!.gildaValue = 5.9866;
  goldNodes["Tigerspine Mountains"]["Mahadevi"]!.fellowshipValue = 5.9242;
  goldNodes["Tigerspine Mountains"]["Solis Headlands"]!.goldValue = 8.1905;
  goldNodes["Tigerspine Mountains"]["Solis Headlands"]!.gildaValue = 9.2404;
  goldNodes["Tigerspine Mountains"][
    "Solis Headlands"
  ]!.fellowshipValue = 8.8825;
  goldNodes["Tigerspine Mountains"]["Villanelle"]!.goldValue = 7.5761;
  goldNodes["Tigerspine Mountains"]["Villanelle"]!.gildaValue = 8.5336;
  goldNodes["Tigerspine Mountains"]["Villanelle"]!.fellowshipValue = 8.2389;
  goldNodes["Tigerspine Mountains"]["Ynystere"]!.goldValue = 12.3396;
  goldNodes["Tigerspine Mountains"]["Ynystere"]!.gildaValue = 14.0227;
  goldNodes["Tigerspine Mountains"]["Ynystere"]!.fellowshipValue = 13.2289;
  goldNodes["Tigerspine Mountains"]["Rookborne Basin"]!.goldValue = 11.1939;
  goldNodes["Tigerspine Mountains"]["Rookborne Basin"]!.gildaValue = 12.7032;
  goldNodes["Tigerspine Mountains"][
    "Rookborne Basin"
  ]!.fellowshipValue = 12.029;
  goldNodes["Tigerspine Mountains"]["Freedich Island"]!.goldValue = 21.8878;
  goldNodes["Tigerspine Mountains"]["Freedich Island"]!.gildaValue = 24.6548;
  goldNodes["Tigerspine Mountains"][
    "Freedich Island"
  ]!.fellowshipValue = 22.8952;

  goldNodes["Mahadevi"]["Arcum Iris"]!.goldValue = 6.0934;
  goldNodes["Mahadevi"]["Arcum Iris"]!.gildaValue = 6.8232;
  goldNodes["Mahadevi"]["Arcum Iris"]!.fellowshipValue = 6.4906;
  goldNodes["Mahadevi"]["Falcorth Plains"]!.goldValue = 7.3407;
  goldNodes["Mahadevi"]["Falcorth Plains"]!.gildaValue = 8.2624;
  goldNodes["Mahadevi"]["Falcorth Plains"]!.fellowshipValue = 7.7974;
  goldNodes["Mahadevi"]["Solis Headlands"]!.goldValue = 6.1035;
  goldNodes["Mahadevi"]["Solis Headlands"]!.gildaValue = 6.8346;
  goldNodes["Mahadevi"]["Solis Headlands"]!.fellowshipValue = 6.5012;
  goldNodes["Mahadevi"]["Villanelle"]!.goldValue = 6.0568;
  goldNodes["Mahadevi"]["Villanelle"]!.gildaValue = 6.7813;
  goldNodes["Mahadevi"]["Villanelle"]!.fellowshipValue = 6.4522;
  goldNodes["Mahadevi"]["Ynystere"]!.goldValue = 10.2177;
  goldNodes["Mahadevi"]["Ynystere"]!.gildaValue = 11.5752;
  goldNodes["Mahadevi"]["Ynystere"]!.fellowshipValue = 10.8112;
  goldNodes["Mahadevi"]["Rookborne Basin"]!.goldValue = 11.6013;
  goldNodes["Mahadevi"]["Rookborne Basin"]!.gildaValue = 13.172;
  goldNodes["Mahadevi"]["Rookborne Basin"]!.fellowshipValue = 11.7424;
  goldNodes["Mahadevi"]["Freedich Island"]!.goldValue = 20.203;
  goldNodes["Mahadevi"]["Freedich Island"]!.gildaValue = 22.7414;
  goldNodes["Mahadevi"]["Freedich Island"]!.fellowshipValue = 20.9628;

  goldNodes["Solis Headlands"]["Arcum Iris"]!.goldValue = 9.0796;
  goldNodes["Solis Headlands"]["Arcum Iris"]!.gildaValue = 10.2651;
  goldNodes["Solis Headlands"]["Arcum Iris"]!.fellowshipValue = 10.1778;
  goldNodes["Solis Headlands"]["Falcorth Plains"]!.goldValue = 10.6522;
  goldNodes["Solis Headlands"]["Falcorth Plains"]!.gildaValue = 12.0774;
  goldNodes["Solis Headlands"]["Falcorth Plains"]!.fellowshipValue = 11.8253;
  goldNodes["Solis Headlands"]["Mahadevi"]!.goldValue = 6.1035;
  goldNodes["Solis Headlands"]["Mahadevi"]!.gildaValue = 6.8346;
  goldNodes["Solis Headlands"]["Mahadevi"]!.fellowshipValue = 7.0602;
  goldNodes["Solis Headlands"]["Villanelle"]!.goldValue = 7.7563;
  goldNodes["Solis Headlands"]["Villanelle"]!.gildaValue = 8.7403;
  goldNodes["Solis Headlands"]["Villanelle"]!.fellowshipValue = 8.7916;
  goldNodes["Solis Headlands"]["Ynystere"]!.goldValue = 11.3131;
  goldNodes["Solis Headlands"]["Ynystere"]!.gildaValue = 12.8389;
  goldNodes["Solis Headlands"]["Ynystere"]!.fellowshipValue = 12.5178;
  goldNodes["Solis Headlands"]["Rookborne Basin"]!.goldValue = 11.3131;
  goldNodes["Solis Headlands"]["Rookborne Basin"]!.gildaValue = 16.4323;
  goldNodes["Solis Headlands"]["Rookborne Basin"]!.fellowshipValue = 16.849;
  goldNodes["Solis Headlands"]["Freedich Island"]!.goldValue = 19.9742;
  goldNodes["Solis Headlands"]["Freedich Island"]!.gildaValue = 22.484;
  goldNodes["Solis Headlands"]["Freedich Island"]!.fellowshipValue = 21.2858;

  goldNodes["Villanelle"]["Arcum Iris"]!.goldValue = 8.47;
  goldNodes["Villanelle"]["Arcum Iris"]!.gildaValue = 9.5635;
  goldNodes["Villanelle"]["Arcum Iris"]!.fellowshipValue = 9.5523;
  goldNodes["Villanelle"]["Falcorth Plains"]!.goldValue = 9.4875;
  goldNodes["Villanelle"]["Falcorth Plains"]!.gildaValue = 10.7358;
  goldNodes["Villanelle"]["Falcorth Plains"]!.fellowshipValue = 10.6183;
  goldNodes["Villanelle"]["Mahadevi"]!.goldValue = 6.0568;
  goldNodes["Villanelle"]["Mahadevi"]!.gildaValue = 6.7813;
  goldNodes["Villanelle"]["Mahadevi"]!.fellowshipValue = 7.0242;
  goldNodes["Villanelle"]["Solis Headlands"]!.goldValue = 7.7563;
  goldNodes["Villanelle"]["Solis Headlands"]!.gildaValue = 8.7403;
  goldNodes["Villanelle"]["Solis Headlands"]!.fellowshipValue = 8.8046;
  goldNodes["Villanelle"]["Ynystere"]!.goldValue = 8.069;
  goldNodes["Villanelle"]["Ynystere"]!.gildaValue = 9.1001;
  goldNodes["Villanelle"]["Ynystere"]!.fellowshipValue = 9.1322;
  goldNodes["Villanelle"]["Rookborne Basin"]!.goldValue = 8.5293;
  goldNodes["Villanelle"]["Rookborne Basin"]!.gildaValue = 9.6309;
  goldNodes["Villanelle"]["Rookborne Basin"]!.fellowshipValue = 9.6145;
  goldNodes["Villanelle"]["Freedich Island"]!.goldValue = 17.6363;
  goldNodes["Villanelle"]["Freedich Island"]!.gildaValue = 19.8328;
  goldNodes["Villanelle"]["Freedich Island"]!.fellowshipValue = 18.8878;

  goldNodes["Silent Forest"]["Arcum Iris"]!.goldValue = 10.3844;
  goldNodes["Silent Forest"]["Arcum Iris"]!.gildaValue = 11.7695;
  goldNodes["Silent Forest"]["Arcum Iris"]!.fellowshipValue = 11.181;
  goldNodes["Silent Forest"]["Falcorth Plains"]!.goldValue = 10.5052;
  goldNodes["Silent Forest"]["Falcorth Plains"]!.gildaValue = 11.9083;
  goldNodes["Silent Forest"]["Falcorth Plains"]!.fellowshipValue = 11.3075;
  goldNodes["Silent Forest"]["Mahadevi"]!.goldValue = 8.7086;
  goldNodes["Silent Forest"]["Mahadevi"]!.gildaValue = 9.6256;
  goldNodes["Silent Forest"]["Mahadevi"]!.fellowshipValue = 9.6256;
  goldNodes["Silent Forest"]["Solis Headlands"]!.goldValue = 10.7529;
  goldNodes["Silent Forest"]["Solis Headlands"]!.gildaValue = 10.563;
  goldNodes["Silent Forest"]["Solis Headlands"]!.fellowshipValue = 11.5671;
  goldNodes["Silent Forest"]["Villanelle"]!.goldValue = 5.8453;
  goldNodes["Silent Forest"]["Villanelle"]!.gildaValue = 6.539;
  goldNodes["Silent Forest"]["Villanelle"]!.fellowshipValue = 6.4258;
  goldNodes["Silent Forest"]["Ynystere"]!.goldValue = 6.3128;
  goldNodes["Silent Forest"]["Ynystere"]!.gildaValue = 7.0764;
  goldNodes["Silent Forest"]["Ynystere"]!.fellowshipValue = 6.9156;
  goldNodes["Silent Forest"]["Rookborne Basin"]!.goldValue = 6.1898;
  goldNodes["Silent Forest"]["Rookborne Basin"]!.gildaValue = 6.936;
  goldNodes["Silent Forest"]["Rookborne Basin"]!.fellowshipValue = 6.7867;
  goldNodes["Silent Forest"]["Freedich Island"]!.goldValue = 16.8293;
  goldNodes["Silent Forest"]["Freedich Island"]!.gildaValue = 18.9147;
  goldNodes["Silent Forest"]["Freedich Island"]!.fellowshipValue = 17.6786;

  goldNodes["Ynystere"]["Arcum Iris"]!.goldValue = 13.4416;
  goldNodes["Ynystere"]["Arcum Iris"]!.gildaValue = 15.2931;
  goldNodes["Ynystere"]["Arcum Iris"]!.fellowshipValue = 14.7476;
  goldNodes["Ynystere"]["Falcorth Plains"]!.goldValue = 14.5552;
  goldNodes["Ynystere"]["Falcorth Plains"]!.gildaValue = 16.5751;
  goldNodes["Ynystere"]["Falcorth Plains"]!.fellowshipValue = 15.9142;
  goldNodes["Ynystere"]["Mahadevi"]!.goldValue = 10.2177;
  goldNodes["Ynystere"]["Mahadevi"]!.gildaValue = 11.5752;
  goldNodes["Ynystere"]["Mahadevi"]!.fellowshipValue = 11.2702;
  goldNodes["Ynystere"]["Solis Headlands"]!.goldValue = 11.3131;
  goldNodes["Ynystere"]["Solis Headlands"]!.gildaValue = 12.8389;
  goldNodes["Ynystere"]["Solis Headlands"]!.fellowshipValue = 12.5178;
  goldNodes["Ynystere"]["Villanelle"]!.goldValue = 8.069;
  goldNodes["Ynystere"]["Villanelle"]!.gildaValue = 9.1001;
  goldNodes["Ynystere"]["Villanelle"]!.fellowshipValue = 9.1192;
  goldNodes["Ynystere"]["Rookborne Basin"]!.goldValue = 9.487;
  goldNodes["Ynystere"]["Rookborne Basin"]!.gildaValue = 10.7334;
  goldNodes["Ynystere"]["Rookborne Basin"]!.fellowshipValue = 10.6049;
  goldNodes["Ynystere"]["Freedich Island"]!.goldValue = 14.1752;
  goldNodes["Ynystere"]["Freedich Island"]!.gildaValue = 15.9075;
  goldNodes["Ynystere"]["Freedich Island"]!.fellowshipValue = 15.3056;

  goldNodes["Rookborne Basin"]["Arcum Iris"]!.goldValue = 9.5419;
  goldNodes["Rookborne Basin"]["Arcum Iris"]!.gildaValue = 10.7966;
  goldNodes["Rookborne Basin"]["Arcum Iris"]!.fellowshipValue = 10.7793;
  goldNodes["Rookborne Basin"]["Falcorth Plains"]!.goldValue = 12.561;
  goldNodes["Rookborne Basin"]["Falcorth Plains"]!.gildaValue = 14.2788;
  goldNodes["Rookborne Basin"]["Falcorth Plains"]!.fellowshipValue = 13.9422;
  goldNodes["Rookborne Basin"]["Mahadevi"]!.goldValue = 11.6013;
  goldNodes["Rookborne Basin"]["Mahadevi"]!.gildaValue = 13.172;
  goldNodes["Rookborne Basin"]["Mahadevi"]!.fellowshipValue = 12.9367;
  goldNodes["Rookborne Basin"]["Solis Headlands"]!.goldValue = 11.3131;
  goldNodes["Rookborne Basin"]["Solis Headlands"]!.gildaValue = 16.4323;
  goldNodes["Rookborne Basin"]["Solis Headlands"]!.fellowshipValue = 15.902;
  goldNodes["Rookborne Basin"]["Villanelle"]!.goldValue = 8.5293;
  goldNodes["Rookborne Basin"]["Villanelle"]!.gildaValue = 9.6309;
  goldNodes["Rookborne Basin"]["Villanelle"]!.fellowshipValue = 9.7185;
  goldNodes["Rookborne Basin"]["Ynystere"]!.goldValue = 9.487;
  goldNodes["Rookborne Basin"]["Ynystere"]!.gildaValue = 10.7334;
  goldNodes["Rookborne Basin"]["Ynystere"]!.fellowshipValue = 10.7219;
  goldNodes["Rookborne Basin"]["Freedich Island"]!.goldValue = 20.54;
  goldNodes["Rookborne Basin"]["Freedich Island"]!.gildaValue = 23.1275;
  goldNodes["Rookborne Basin"]["Freedich Island"]!.fellowshipValue = 21.9862;

  goldNodes["Windscour Savannah"]["Arcum Iris"]!.goldValue = 6.5084;
  goldNodes["Windscour Savannah"]["Arcum Iris"]!.gildaValue = 7.3021;
  goldNodes["Windscour Savannah"]["Arcum Iris"]!.fellowshipValue = 7.7185;
  goldNodes["Windscour Savannah"]["Falcorth Plains"]!.goldValue = 9.5713;
  goldNodes["Windscour Savannah"]["Falcorth Plains"]!.gildaValue = 10.8332;
  goldNodes["Windscour Savannah"]["Falcorth Plains"]!.fellowshipValue = 10.9271;
  goldNodes["Windscour Savannah"]["Mahadevi"]!.goldValue = 9.5554;
  goldNodes["Windscour Savannah"]["Mahadevi"]!.gildaValue = 10.8125;
  goldNodes["Windscour Savannah"]["Mahadevi"]!.fellowshipValue = 10.9104;
  goldNodes["Windscour Savannah"]["Solis Headlands"]!.goldValue = 13.3723;
  goldNodes["Windscour Savannah"]["Solis Headlands"]!.gildaValue = 15.2133;
  goldNodes["Windscour Savannah"]["Solis Headlands"]!.fellowshipValue = 14.9089;
  goldNodes["Windscour Savannah"]["Villanelle"]!.goldValue = 12.2877;
  goldNodes["Windscour Savannah"]["Villanelle"]!.gildaValue = 13.9624;
  goldNodes["Windscour Savannah"]["Villanelle"]!.fellowshipValue = 13.7727;
  goldNodes["Windscour Savannah"]["Ynystere"]!.goldValue = 17.5139;
  goldNodes["Windscour Savannah"]["Ynystere"]!.gildaValue = 19.9828;
  goldNodes["Windscour Savannah"]["Ynystere"]!.fellowshipValue = 19.2477;
  goldNodes["Windscour Savannah"]["Rookborne Basin"]!.goldValue = 7.1526;
  goldNodes["Windscour Savannah"]["Rookborne Basin"]!.gildaValue = 8.0439;
  goldNodes["Windscour Savannah"]["Rookborne Basin"]!.fellowshipValue = 8.3933;
  goldNodes["Windscour Savannah"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["Windscour Savannah"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["Windscour Savannah"]["Freedich Island"]!.fellowshipValue = 24.999;

  goldNodes["Perinoor Ruins"]["Arcum Iris"]!.goldValue = 9.0425;
  goldNodes["Perinoor Ruins"]["Arcum Iris"]!.gildaValue = 10.2218;
  goldNodes["Perinoor Ruins"]["Arcum Iris"]!.fellowshipValue = 10.1912;
  goldNodes["Perinoor Ruins"]["Falcorth Plains"]!.goldValue = 12.6805;
  goldNodes["Perinoor Ruins"]["Falcorth Plains"]!.gildaValue = 14.4143;
  goldNodes["Perinoor Ruins"]["Falcorth Plains"]!.fellowshipValue = 12.0024;
  goldNodes["Perinoor Ruins"]["Mahadevi"]!.goldValue = 12.7575;
  goldNodes["Perinoor Ruins"]["Mahadevi"]!.gildaValue = 14.5032;
  goldNodes["Perinoor Ruins"]["Mahadevi"]!.fellowshipValue = 14.0832;
  goldNodes["Perinoor Ruins"]["Solis Headlands"]!.goldValue = 17.2064;
  goldNodes["Perinoor Ruins"]["Solis Headlands"]!.gildaValue = 19.6287;
  goldNodes["Perinoor Ruins"]["Solis Headlands"]!.fellowshipValue = 18.7435;
  goldNodes["Perinoor Ruins"]["Villanelle"]!.goldValue = 15.8934;
  goldNodes["Perinoor Ruins"]["Villanelle"]!.gildaValue = 18.1176;
  goldNodes["Perinoor Ruins"]["Villanelle"]!.fellowshipValue = 17.368;
  goldNodes["Perinoor Ruins"]["Ynystere"]!.goldValue = 18.1627;
  goldNodes["Perinoor Ruins"]["Ynystere"]!.gildaValue = 20.7303;
  goldNodes["Perinoor Ruins"]["Ynystere"]!.fellowshipValue = 19.7454;
  goldNodes["Perinoor Ruins"]["Rookborne Basin"]!.goldValue = 9.6243;
  goldNodes["Perinoor Ruins"]["Rookborne Basin"]!.gildaValue = 10.8922;
  goldNodes["Perinoor Ruins"]["Rookborne Basin"]!.fellowshipValue = 10.8007;
  goldNodes["Perinoor Ruins"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["Perinoor Ruins"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["Perinoor Ruins"]["Freedich Island"]!.fellowshipValue = 24.817;

  goldNodes["Hasla"]["Arcum Iris"]!.goldValue = 12.8664;
  goldNodes["Hasla"]["Arcum Iris"]!.gildaValue = 14.6303;
  goldNodes["Hasla"]["Arcum Iris"]!.fellowshipValue = 14.0152;
  goldNodes["Hasla"]["Falcorth Plains"]!.goldValue = 13.6581;
  goldNodes["Hasla"]["Falcorth Plains"]!.gildaValue = 15.5412;
  goldNodes["Hasla"]["Falcorth Plains"]!.fellowshipValue = 14.8446;
  goldNodes["Hasla"]["Mahadevi"]!.goldValue = 17.0823;
  goldNodes["Hasla"]["Mahadevi"]!.gildaValue = 19.486;
  goldNodes["Hasla"]["Mahadevi"]!.fellowshipValue = 18.4318;
  goldNodes["Hasla"]["Solis Headlands"]!.goldValue = 19.5391;
  goldNodes["Hasla"]["Solis Headlands"]!.gildaValue = 22.318;
  goldNodes["Hasla"]["Solis Headlands"]!.fellowshipValue = 22.1517;
  goldNodes["Hasla"]["Villanelle"]!.goldValue = 19.4056;
  goldNodes["Hasla"]["Villanelle"]!.gildaValue = 22.1658;
  goldNodes["Hasla"]["Villanelle"]!.fellowshipValue = 20.8658;
  goldNodes["Hasla"]["Ynystere"]!.goldValue = 21.476;
  goldNodes["Hasla"]["Ynystere"]!.gildaValue = 24.1871;
  goldNodes["Hasla"]["Ynystere"]!.fellowshipValue = 23.1592;
  goldNodes["Hasla"]["Rookborne Basin"]!.goldValue = 12.9479;
  goldNodes["Hasla"]["Rookborne Basin"]!.gildaValue = 14.722;
  goldNodes["Hasla"]["Rookborne Basin"]!.fellowshipValue = 14.1005;
  goldNodes["Hasla"]["Freedich Island"]!.goldValue = 21.476;
  goldNodes["Hasla"]["Freedich Island"]!.gildaValue = 24.1871;
  goldNodes["Hasla"]["Freedich Island"]!.fellowshipValue = 23.9529;

  goldNodes["Sunbite Wilds"]["Arcum Iris"]!.goldValue = 5.8011;
  goldNodes["Sunbite Wilds"]["Arcum Iris"]!.gildaValue = 6.4862;
  goldNodes["Sunbite Wilds"]["Arcum Iris"]!.fellowshipValue = 6.1054;
  goldNodes["Sunbite Wilds"]["Falcorth Plains"]!.goldValue = 9.0409;
  goldNodes["Sunbite Wilds"]["Falcorth Plains"]!.gildaValue = 10.2196;
  goldNodes["Sunbite Wilds"]["Falcorth Plains"]!.fellowshipValue = 9.4093;
  goldNodes["Sunbite Wilds"]["Mahadevi"]!.goldValue = 8.3727;
  goldNodes["Sunbite Wilds"]["Mahadevi"]!.gildaValue = 9.4515;
  goldNodes["Sunbite Wilds"]["Mahadevi"]!.fellowshipValue = 8.7095;
  goldNodes["Sunbite Wilds"]["Solis Headlands"]!.goldValue = 10.8911;
  goldNodes["Sunbite Wilds"]["Solis Headlands"]!.gildaValue = 12.3521;
  goldNodes["Sunbite Wilds"]["Solis Headlands"]!.fellowshipValue = 11.3478;
  goldNodes["Sunbite Wilds"]["Villanelle"]!.goldValue = 11.238;
  goldNodes["Sunbite Wilds"]["Villanelle"]!.gildaValue = 12.7521;
  goldNodes["Sunbite Wilds"]["Villanelle"]!.fellowshipValue = 11.7112;
  goldNodes["Sunbite Wilds"]["Ynystere"]!.goldValue = 16.1463;
  goldNodes["Sunbite Wilds"]["Ynystere"]!.gildaValue = 18.4071;
  goldNodes["Sunbite Wilds"]["Ynystere"]!.fellowshipValue = 16.8529;
  goldNodes["Sunbite Wilds"]["Rookborne Basin"]!.goldValue = 11.6635;
  goldNodes["Sunbite Wilds"]["Rookborne Basin"]!.gildaValue = 13.2418;
  goldNodes["Sunbite Wilds"]["Rookborne Basin"]!.fellowshipValue = 12.1568;
  goldNodes["Sunbite Wilds"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["Sunbite Wilds"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["Sunbite Wilds"]["Freedich Island"]!.fellowshipValue = 24.037;

  goldNodes["Rokhala Mountains"]["Arcum Iris"]!.goldValue = 14.8108;
  goldNodes["Rokhala Mountains"]["Arcum Iris"]!.gildaValue = 16.8696;
  goldNodes["Rokhala Mountains"]["Arcum Iris"]!.fellowshipValue = 15.4639;
  goldNodes["Rokhala Mountains"]["Falcorth Plains"]!.goldValue = 12.2599;
  goldNodes["Rokhala Mountains"]["Falcorth Plains"]!.gildaValue = 13.9304;
  goldNodes["Rokhala Mountains"]["Falcorth Plains"]!.fellowshipValue = 12.7816;
  goldNodes["Rokhala Mountains"]["Mahadevi"]!.goldValue = 17.2008;
  goldNodes["Rokhala Mountains"]["Mahadevi"]!.gildaValue = 19.6218;
  goldNodes["Rokhala Mountains"]["Mahadevi"]!.fellowshipValue = 17.9581;
  goldNodes["Rokhala Mountains"]["Solis Headlands"]!.goldValue = 21.1585;
  goldNodes["Rokhala Mountains"]["Solis Headlands"]!.gildaValue = 24.1868;
  goldNodes["Rokhala Mountains"]["Solis Headlands"]!.fellowshipValue = 22.1038;
  goldNodes["Rokhala Mountains"]["Villanelle"]!.goldValue = 14.6342;
  goldNodes["Rokhala Mountains"]["Villanelle"]!.gildaValue = 16.6657;
  goldNodes["Rokhala Mountains"]["Villanelle"]!.fellowshipValue = 15.2692;
  goldNodes["Rokhala Mountains"]["Ynystere"]!.goldValue = 17.0465;
  goldNodes["Rokhala Mountains"]["Ynystere"]!.gildaValue = 19.4448;
  goldNodes["Rokhala Mountains"]["Ynystere"]!.fellowshipValue = 17.7962;
  goldNodes["Rokhala Mountains"]["Rookborne Basin"]!.goldValue = 8.6255;
  goldNodes["Rokhala Mountains"]["Rookborne Basin"]!.gildaValue = 9.7418;
  goldNodes["Rokhala Mountains"]["Rookborne Basin"]!.fellowshipValue = 8.9744;
  goldNodes["Rokhala Mountains"]["Freedich Island"]!.goldValue = 26.26;
  goldNodes["Rokhala Mountains"]["Freedich Island"]!.gildaValue = 29.614;
  goldNodes["Rokhala Mountains"]["Freedich Island"]!.fellowshipValue = 28.5844;
}

function generateHaranyaGGFGildaValues() {
  gildaNodes["Arcum Iris"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Arcum Iris"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Arcum Iris"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Arcum Iris"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Arcum Iris"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Arcum Iris"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Arcum Iris"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Arcum Iris"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Arcum Iris"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Arcum Iris"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Arcum Iris"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Arcum Iris"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Falcorth Plains"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Falcorth Plains"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Falcorth Plains"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Falcorth Plains"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Falcorth Plains"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Falcorth Plains"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Falcorth Plains"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Falcorth Plains"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Falcorth Plains"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Falcorth Plains"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Falcorth Plains"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Falcorth Plains"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Tigerspine Mountains"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Tigerspine Mountains"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Tigerspine Mountains"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Tigerspine Mountains"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Tigerspine Mountains"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Tigerspine Mountains"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Mahadevi"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Mahadevi"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Mahadevi"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Mahadevi"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Mahadevi"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Mahadevi"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Mahadevi"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Mahadevi"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Mahadevi"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Mahadevi"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Mahadevi"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Mahadevi"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Solis Headlands"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Solis Headlands"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Solis Headlands"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Solis Headlands"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Solis Headlands"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Solis Headlands"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Solis Headlands"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Solis Headlands"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Solis Headlands"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Solis Headlands"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Solis Headlands"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Solis Headlands"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Villanelle"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Villanelle"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Villanelle"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Villanelle"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Villanelle"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Villanelle"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Villanelle"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Villanelle"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Villanelle"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Villanelle"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Villanelle"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Villanelle"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Silent Forest"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Silent Forest"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Silent Forest"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Silent Forest"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Silent Forest"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Silent Forest"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Silent Forest"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Silent Forest"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Silent Forest"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Silent Forest"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Silent Forest"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Silent Forest"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Ynystere"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Ynystere"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Ynystere"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Ynystere"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Ynystere"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Ynystere"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Ynystere"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Ynystere"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Ynystere"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Ynystere"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Ynystere"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Ynystere"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Rookborne Basin"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Rookborne Basin"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Rookborne Basin"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Rookborne Basin"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Rookborne Basin"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Rookborne Basin"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Rookborne Basin"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Rookborne Basin"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Rookborne Basin"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Rookborne Basin"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Rookborne Basin"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Rookborne Basin"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Windscour Savannah"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Windscour Savannah"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Windscour Savannah"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Windscour Savannah"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Windscour Savannah"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Windscour Savannah"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Windscour Savannah"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Windscour Savannah"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Windscour Savannah"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Windscour Savannah"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Windscour Savannah"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Windscour Savannah"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Perinoor Ruins"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Perinoor Ruins"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Perinoor Ruins"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Perinoor Ruins"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Perinoor Ruins"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Perinoor Ruins"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Perinoor Ruins"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Perinoor Ruins"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Perinoor Ruins"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Hasla"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Hasla"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Hasla"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Hasla"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Hasla"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Hasla"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Hasla"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Hasla"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Hasla"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Hasla"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Hasla"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Hasla"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Sunbite Wilds"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Sunbite Wilds"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Sunbite Wilds"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Sunbite Wilds"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Sunbite Wilds"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Sunbite Wilds"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Sunbite Wilds"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Sunbite Wilds"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Sunbite Wilds"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Rokhala Mountains"]["Two Crowns"]!.goldValue = 1;
  gildaNodes["Rokhala Mountains"]["Two Crowns"]!.gildaValue = 1;
  gildaNodes["Rokhala Mountains"]["Two Crowns"]!.fellowshipValue = 2;
  gildaNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.goldValue = 1;
  gildaNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.gildaValue = 1;
  gildaNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.fellowshipValue = 2;
  gildaNodes["Rokhala Mountains"]["Cinderstone Moor"]!.goldValue = 2;
  gildaNodes["Rokhala Mountains"]["Cinderstone Moor"]!.gildaValue = 2;
  gildaNodes["Rokhala Mountains"]["Cinderstone Moor"]!.fellowshipValue = 3;
  gildaNodes["Rokhala Mountains"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Rokhala Mountains"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Rokhala Mountains"]["Freedich Island"]!.fellowshipValue = 5;
}

function generateHaranyaGGFStabValues() {
  stabNodes["Arcum Iris"]["Two Crowns"]!.goldValue = 16;
  stabNodes["Arcum Iris"]["Two Crowns"]!.gildaValue = 16;
  stabNodes["Arcum Iris"]["Two Crowns"]!.fellowshipValue = 18;
  stabNodes["Arcum Iris"]["Solzreed Peninsula"]!.goldValue = 15;
  stabNodes["Arcum Iris"]["Solzreed Peninsula"]!.gildaValue = 15;
  stabNodes["Arcum Iris"]["Solzreed Peninsula"]!.fellowshipValue = 17;
  stabNodes["Arcum Iris"]["Cinderstone Moor"]!.goldValue = 14;
  stabNodes["Arcum Iris"]["Cinderstone Moor"]!.gildaValue = 16;
  stabNodes["Arcum Iris"]["Cinderstone Moor"]!.fellowshipValue = 16;
  stabNodes["Arcum Iris"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Arcum Iris"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Arcum Iris"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Falcorth Plains"]["Two Crowns"]!.goldValue = 15;
  stabNodes["Falcorth Plains"]["Two Crowns"]!.gildaValue = 17;
  stabNodes["Falcorth Plains"]["Two Crowns"]!.fellowshipValue = 17;
  stabNodes["Falcorth Plains"]["Solzreed Peninsula"]!.goldValue = 15;
  stabNodes["Falcorth Plains"]["Solzreed Peninsula"]!.gildaValue = 17;
  stabNodes["Falcorth Plains"]["Solzreed Peninsula"]!.fellowshipValue = 17;
  stabNodes["Falcorth Plains"]["Cinderstone Moor"]!.goldValue = 14;
  stabNodes["Falcorth Plains"]["Cinderstone Moor"]!.gildaValue = 16;
  stabNodes["Falcorth Plains"]["Cinderstone Moor"]!.fellowshipValue = 15;
  stabNodes["Falcorth Plains"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Falcorth Plains"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Falcorth Plains"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Tigerspine Mountains"]["Two Crowns"]!.goldValue = 14;
  stabNodes["Tigerspine Mountains"]["Two Crowns"]!.gildaValue = 15;
  stabNodes["Tigerspine Mountains"]["Two Crowns"]!.fellowshipValue = 15;
  stabNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.goldValue = 13;
  stabNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.gildaValue = 15;
  stabNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.fellowshipValue = 15;
  stabNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.goldValue = 12;
  stabNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.gildaValue = 14;
  stabNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.fellowshipValue = 13;
  stabNodes["Tigerspine Mountains"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Tigerspine Mountains"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Tigerspine Mountains"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Mahadevi"]["Two Crowns"]!.goldValue = 12;
  stabNodes["Mahadevi"]["Two Crowns"]!.gildaValue = 13;
  stabNodes["Mahadevi"]["Two Crowns"]!.fellowshipValue = 13;
  stabNodes["Mahadevi"]["Solzreed Peninsula"]!.goldValue = 12;
  stabNodes["Mahadevi"]["Solzreed Peninsula"]!.gildaValue = 13;
  stabNodes["Mahadevi"]["Solzreed Peninsula"]!.fellowshipValue = 12;
  stabNodes["Mahadevi"]["Cinderstone Moor"]!.goldValue = 10;
  stabNodes["Mahadevi"]["Cinderstone Moor"]!.gildaValue = 12;
  stabNodes["Mahadevi"]["Cinderstone Moor"]!.fellowshipValue = 11;
  stabNodes["Mahadevi"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Mahadevi"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Mahadevi"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Solis Headlands"]["Two Crowns"]!.goldValue = 11;
  stabNodes["Solis Headlands"]["Two Crowns"]!.gildaValue = 11;
  stabNodes["Solis Headlands"]["Two Crowns"]!.fellowshipValue = 16;
  stabNodes["Solis Headlands"]["Solzreed Peninsula"]!.goldValue = 13;
  stabNodes["Solis Headlands"]["Solzreed Peninsula"]!.gildaValue = 14;
  stabNodes["Solis Headlands"]["Solzreed Peninsula"]!.fellowshipValue = 11;
  stabNodes["Solis Headlands"]["Cinderstone Moor"]!.goldValue = 10;
  stabNodes["Solis Headlands"]["Cinderstone Moor"]!.gildaValue = 11;
  stabNodes["Solis Headlands"]["Cinderstone Moor"]!.fellowshipValue = 16;
  stabNodes["Solis Headlands"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Solis Headlands"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Solis Headlands"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Villanelle"]["Two Crowns"]!.goldValue = 12;
  stabNodes["Villanelle"]["Two Crowns"]!.gildaValue = 13;
  stabNodes["Villanelle"]["Two Crowns"]!.fellowshipValue = 13;
  stabNodes["Villanelle"]["Solzreed Peninsula"]!.goldValue = 12;
  stabNodes["Villanelle"]["Solzreed Peninsula"]!.gildaValue = 14;
  stabNodes["Villanelle"]["Solzreed Peninsula"]!.fellowshipValue = 14;
  stabNodes["Villanelle"]["Cinderstone Moor"]!.goldValue = 11;
  stabNodes["Villanelle"]["Cinderstone Moor"]!.gildaValue = 12;
  stabNodes["Villanelle"]["Cinderstone Moor"]!.fellowshipValue = 13;
  stabNodes["Villanelle"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Villanelle"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Villanelle"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Silent Forest"]["Two Crowns"]!.goldValue = 14;
  stabNodes["Silent Forest"]["Two Crowns"]!.gildaValue = 15;
  stabNodes["Silent Forest"]["Two Crowns"]!.fellowshipValue = 15;
  stabNodes["Silent Forest"]["Solzreed Peninsula"]!.goldValue = 15;
  stabNodes["Silent Forest"]["Solzreed Peninsula"]!.gildaValue = 17;
  stabNodes["Silent Forest"]["Solzreed Peninsula"]!.fellowshipValue = 16;
  stabNodes["Silent Forest"]["Cinderstone Moor"]!.goldValue = 14;
  stabNodes["Silent Forest"]["Cinderstone Moor"]!.gildaValue = 15;
  stabNodes["Silent Forest"]["Cinderstone Moor"]!.fellowshipValue = 15;
  stabNodes["Silent Forest"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Silent Forest"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Silent Forest"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Ynystere"]["Two Crowns"]!.goldValue = 11;
  stabNodes["Ynystere"]["Two Crowns"]!.gildaValue = 12;
  stabNodes["Ynystere"]["Two Crowns"]!.fellowshipValue = 13;
  stabNodes["Ynystere"]["Solzreed Peninsula"]!.goldValue = 13;
  stabNodes["Ynystere"]["Solzreed Peninsula"]!.gildaValue = 14;
  stabNodes["Ynystere"]["Solzreed Peninsula"]!.fellowshipValue = 14;
  stabNodes["Ynystere"]["Cinderstone Moor"]!.goldValue = 12;
  stabNodes["Ynystere"]["Cinderstone Moor"]!.gildaValue = 13;
  stabNodes["Ynystere"]["Cinderstone Moor"]!.fellowshipValue = 13;
  stabNodes["Ynystere"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Ynystere"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Ynystere"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Rookborne Basin"]["Two Crowns"]!.goldValue = 16;
  stabNodes["Rookborne Basin"]["Two Crowns"]!.gildaValue = 18;
  stabNodes["Rookborne Basin"]["Two Crowns"]!.fellowshipValue = 18;
  stabNodes["Rookborne Basin"]["Solzreed Peninsula"]!.goldValue = 18;
  stabNodes["Rookborne Basin"]["Solzreed Peninsula"]!.gildaValue = 19;
  stabNodes["Rookborne Basin"]["Solzreed Peninsula"]!.fellowshipValue = 19;
  stabNodes["Rookborne Basin"]["Cinderstone Moor"]!.goldValue = 16;
  stabNodes["Rookborne Basin"]["Cinderstone Moor"]!.gildaValue = 17;
  stabNodes["Rookborne Basin"]["Cinderstone Moor"]!.fellowshipValue = 17;
  stabNodes["Rookborne Basin"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Rookborne Basin"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Rookborne Basin"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Windscour Savannah"]["Two Crowns"]!.goldValue = 18;
  stabNodes["Windscour Savannah"]["Two Crowns"]!.gildaValue = 20;
  stabNodes["Windscour Savannah"]["Two Crowns"]!.fellowshipValue = 20;
  stabNodes["Windscour Savannah"]["Solzreed Peninsula"]!.goldValue = 18;
  stabNodes["Windscour Savannah"]["Solzreed Peninsula"]!.gildaValue = 20;
  stabNodes["Windscour Savannah"]["Solzreed Peninsula"]!.fellowshipValue = 20;
  stabNodes["Windscour Savannah"]["Cinderstone Moor"]!.goldValue = 17;
  stabNodes["Windscour Savannah"]["Cinderstone Moor"]!.gildaValue = 19;
  stabNodes["Windscour Savannah"]["Cinderstone Moor"]!.fellowshipValue = 19;
  stabNodes["Windscour Savannah"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Windscour Savannah"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Windscour Savannah"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Perinoor Ruins"]["Two Crowns"]!.goldValue = 20;
  stabNodes["Perinoor Ruins"]["Two Crowns"]!.gildaValue = 22;
  stabNodes["Perinoor Ruins"]["Two Crowns"]!.fellowshipValue = 22;
  stabNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.goldValue = 19;
  stabNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.gildaValue = 21;
  stabNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.fellowshipValue = 21;
  stabNodes["Perinoor Ruins"]["Cinderstone Moor"]!.goldValue = 18;
  stabNodes["Perinoor Ruins"]["Cinderstone Moor"]!.gildaValue = 20;
  stabNodes["Perinoor Ruins"]["Cinderstone Moor"]!.fellowshipValue = 20;
  stabNodes["Perinoor Ruins"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Perinoor Ruins"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Perinoor Ruins"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Hasla"]["Two Crowns"]!.goldValue = 22;
  stabNodes["Hasla"]["Two Crowns"]!.gildaValue = 24;
  stabNodes["Hasla"]["Two Crowns"]!.fellowshipValue = 24;
  stabNodes["Hasla"]["Solzreed Peninsula"]!.goldValue = 22;
  stabNodes["Hasla"]["Solzreed Peninsula"]!.gildaValue = 24;
  stabNodes["Hasla"]["Solzreed Peninsula"]!.fellowshipValue = 23;
  stabNodes["Hasla"]["Cinderstone Moor"]!.goldValue = 21;
  stabNodes["Hasla"]["Cinderstone Moor"]!.gildaValue = 23;
  stabNodes["Hasla"]["Cinderstone Moor"]!.fellowshipValue = 23;
  stabNodes["Hasla"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Hasla"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Hasla"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Sunbite Wilds"]["Two Crowns"]!.goldValue = 17;
  stabNodes["Sunbite Wilds"]["Two Crowns"]!.gildaValue = 18;
  stabNodes["Sunbite Wilds"]["Two Crowns"]!.fellowshipValue = 18;
  stabNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.goldValue = 15;
  stabNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.gildaValue = 17;
  stabNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.fellowshipValue = 16;
  stabNodes["Sunbite Wilds"]["Cinderstone Moor"]!.goldValue = 15;
  stabNodes["Sunbite Wilds"]["Cinderstone Moor"]!.gildaValue = 16;
  stabNodes["Sunbite Wilds"]["Cinderstone Moor"]!.fellowshipValue = 16;
  stabNodes["Sunbite Wilds"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Sunbite Wilds"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Sunbite Wilds"]["Freedich Island"]!.fellowshipValue = 2;

  stabNodes["Rokhala Mountains"]["Two Crowns"]!.goldValue = 40;
  stabNodes["Rokhala Mountains"]["Two Crowns"]!.gildaValue = 45;
  stabNodes["Rokhala Mountains"]["Two Crowns"]!.fellowshipValue = 42;
  stabNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.goldValue = 42;
  stabNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.gildaValue = 47;
  stabNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.fellowshipValue = 45;
  stabNodes["Rokhala Mountains"]["Cinderstone Moor"]!.goldValue = 40;
  stabNodes["Rokhala Mountains"]["Cinderstone Moor"]!.gildaValue = 44;
  stabNodes["Rokhala Mountains"]["Cinderstone Moor"]!.fellowshipValue = 42;
  stabNodes["Rokhala Mountains"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Rokhala Mountains"]["Freedich Island"]!.gildaValue = 1;
  stabNodes["Rokhala Mountains"]["Freedich Island"]!.fellowshipValue = 2;
}

function generateHaranyaFHCGoldValues() {
  goldNodes["Arcum Iris"]["Falcorth Plains"]!.fertValue = 7.2885;
  goldNodes["Arcum Iris"]["Falcorth Plains"]!.honeyValue = 10.9425;
  goldNodes["Arcum Iris"]["Falcorth Plains"]!.cheeseValue = 10.6887;
  goldNodes["Arcum Iris"]["Mahadevi"]!.fertValue = 6.6869;
  goldNodes["Arcum Iris"]["Mahadevi"]!.honeyValue = 9.9739;
  goldNodes["Arcum Iris"]["Mahadevi"]!.cheeseValue = 9.7456;
  goldNodes["Arcum Iris"]["Solis Headlands"]!.fertValue = 10.0425;
  goldNodes["Arcum Iris"]["Solis Headlands"]!.honeyValue = 15.3771;
  goldNodes["Arcum Iris"]["Solis Headlands"]!.cheeseValue = 15.68;
  goldNodes["Arcum Iris"]["Villanelle"]!.fertValue = 9.3575;
  goldNodes["Arcum Iris"]["Villanelle"]!.honeyValue = 14.274;
  goldNodes["Arcum Iris"]["Villanelle"]!.cheeseValue = 13.9328;
  goldNodes["Arcum Iris"]["Ynystere"]!.fertValue = 14.9445;
  goldNodes["Arcum Iris"]["Ynystere"]!.honeyValue = 23.2701;
  goldNodes["Arcum Iris"]["Ynystere"]!.cheeseValue = 22.6923;
  goldNodes["Arcum Iris"]["Rookborne Basin"]!.fertValue = 11.7508;
  goldNodes["Arcum Iris"]["Rookborne Basin"]!.honeyValue = 18.1279;
  goldNodes["Arcum Iris"]["Rookborne Basin"]!.cheeseValue = 17.6852;
  goldNodes["Arcum Iris"]["Freedich Island"]!.fertValue = 25.415;
  goldNodes["Arcum Iris"]["Freedich Island"]!.honeyValue = 44.2855;
  goldNodes["Arcum Iris"]["Freedich Island"]!.cheeseValue = 44.2855;

  goldNodes["Falcorth Plains"]["Arcum Iris"]!.fertValue = 7.2885;
  goldNodes["Falcorth Plains"]["Arcum Iris"]!.honeyValue = 10.9425;
  goldNodes["Falcorth Plains"]["Arcum Iris"]!.cheeseValue = 10.6887;
  goldNodes["Falcorth Plains"]["Mahadevi"]!.fertValue = 8.0886;
  goldNodes["Falcorth Plains"]["Mahadevi"]!.honeyValue = 12.2309;
  goldNodes["Falcorth Plains"]["Mahadevi"]!.cheeseValue = 11.9432;
  goldNodes["Falcorth Plains"]["Solis Headlands"]!.fertValue = 11.8098;
  goldNodes["Falcorth Plains"]["Solis Headlands"]!.honeyValue = 18.2226;
  goldNodes["Falcorth Plains"]["Solis Headlands"]!.cheeseValue = 17.7775;
  goldNodes["Falcorth Plains"]["Villanelle"]!.fertValue = 10.501;
  goldNodes["Falcorth Plains"]["Villanelle"]!.honeyValue = 16.1152;
  goldNodes["Falcorth Plains"]["Villanelle"]!.cheeseValue = 15.7256;
  goldNodes["Falcorth Plains"]["Ynystere"]!.fertValue = 16.1959;
  goldNodes["Falcorth Plains"]["Ynystere"]!.honeyValue = 25.2851;
  goldNodes["Falcorth Plains"]["Ynystere"]!.cheeseValue = 24.6542;
  goldNodes["Falcorth Plains"]["Rookborne Basin"]!.fertValue = 13.9552;
  goldNodes["Falcorth Plains"]["Rookborne Basin"]!.honeyValue = 21.6771;
  goldNodes["Falcorth Plains"]["Rookborne Basin"]!.cheeseValue = 21.1409;
  goldNodes["Falcorth Plains"]["Freedich Island"]!.fertValue = 25.2284;
  goldNodes["Falcorth Plains"]["Freedich Island"]!.honeyValue = 40.9529;
  goldNodes["Falcorth Plains"]["Freedich Island"]!.cheeseValue = 40.9529;

  goldNodes["Tigerspine Mountains"]["Arcum Iris"]!.fertValue = 5.4605;
  goldNodes["Tigerspine Mountains"]["Arcum Iris"]!.honeyValue = 7.9992;
  goldNodes["Tigerspine Mountains"]["Arcum Iris"]!.cheeseValue = 7.8229;
  goldNodes["Tigerspine Mountains"]["Falcorth Plains"]!.fertValue = 5.979;
  goldNodes["Tigerspine Mountains"]["Falcorth Plains"]!.honeyValue = 8.8339;
  goldNodes["Tigerspine Mountains"]["Falcorth Plains"]!.cheeseValue = 8.6356;
  goldNodes["Tigerspine Mountains"]["Mahadevi"]!.fertValue = 5.87;
  goldNodes["Tigerspine Mountains"]["Mahadevi"]!.honeyValue = 8.6585;
  goldNodes["Tigerspine Mountains"]["Mahadevi"]!.cheeseValue = 8.4648;
  goldNodes["Tigerspine Mountains"]["Solis Headlands"]!.fertValue = 9.0435;
  goldNodes["Tigerspine Mountains"]["Solis Headlands"]!.honeyValue = 13.7683;
  goldNodes["Tigerspine Mountains"]["Solis Headlands"]!.cheeseValue = 13.4404;
  goldNodes["Tigerspine Mountains"]["Villanelle"]!.fertValue = 8.353;
  goldNodes["Tigerspine Mountains"]["Villanelle"]!.honeyValue = 12.6567;
  goldNodes["Tigerspine Mountains"]["Villanelle"]!.cheeseValue = 12.3579;
  goldNodes["Tigerspine Mountains"]["Ynystere"]!.fertValue = 13.706;
  goldNodes["Tigerspine Mountains"]["Ynystere"]!.honeyValue = 21.2759;
  goldNodes["Tigerspine Mountains"]["Ynystere"]!.cheeseValue = 20.7505;
  goldNodes["Tigerspine Mountains"]["Rookborne Basin"]!.fertValue = 12.4189;
  goldNodes["Tigerspine Mountains"]["Rookborne Basin"]!.honeyValue = 19.2033;
  goldNodes["Tigerspine Mountains"]["Rookborne Basin"]!.cheeseValue = 18.7322;
  goldNodes["Tigerspine Mountains"]["Freedich Island"]!.fertValue = 23.8179;
  goldNodes["Tigerspine Mountains"]["Freedich Island"]!.honeyValue = 38.6155;
  goldNodes["Tigerspine Mountains"]["Freedich Island"]!.cheeseValue = 38.6155;

  goldNodes["Mahadevi"]["Arcum Iris"]!.fertValue = 6.6869;
  goldNodes["Mahadevi"]["Arcum Iris"]!.honeyValue = 9.9739;
  goldNodes["Mahadevi"]["Arcum Iris"]!.cheeseValue = 9.7456;
  goldNodes["Mahadevi"]["Falcorth Plains"]!.fertValue = 8.0886;
  goldNodes["Mahadevi"]["Falcorth Plains"]!.honeyValue = 12.2309;
  goldNodes["Mahadevi"]["Falcorth Plains"]!.cheeseValue = 11.9432;
  goldNodes["Mahadevi"]["Solis Headlands"]!.fertValue = 6.6981;
  goldNodes["Mahadevi"]["Solis Headlands"]!.honeyValue = 9.9918;
  goldNodes["Mahadevi"]["Solis Headlands"]!.cheeseValue = 9.7633;
  goldNodes["Mahadevi"]["Villanelle"]!.fertValue = 6.6456;
  goldNodes["Mahadevi"]["Villanelle"]!.honeyValue = 9.9073;
  goldNodes["Mahadevi"]["Villanelle"]!.cheeseValue = 9.681;
  goldNodes["Mahadevi"]["Ynystere"]!.fertValue = 11.3214;
  goldNodes["Mahadevi"]["Ynystere"]!.honeyValue = 17.4364;
  goldNodes["Mahadevi"]["Ynystere"]!.cheeseValue = 17.0119;
  goldNodes["Mahadevi"]["Rookborne Basin"]!.fertValue = 12.3205;
  goldNodes["Mahadevi"]["Rookborne Basin"]!.honeyValue = 19.0449;
  goldNodes["Mahadevi"]["Rookborne Basin"]!.cheeseValue = 18.5779;
  goldNodes["Mahadevi"]["Freedich Island"]!.fertValue = 21.9752;
  goldNodes["Mahadevi"]["Freedich Island"]!.honeyValue = 35.5618;
  goldNodes["Mahadevi"]["Freedich Island"]!.cheeseValue = 35.5618;

  goldNodes["Solis Headlands"]["Arcum Iris"]!.fertValue = 10.0425;
  goldNodes["Solis Headlands"]["Arcum Iris"]!.honeyValue = 15.3771;
  goldNodes["Solis Headlands"]["Arcum Iris"]!.cheeseValue = 15.0068;
  goldNodes["Solis Headlands"]["Falcorth Plains"]!.fertValue = 11.8098;
  goldNodes["Solis Headlands"]["Falcorth Plains"]!.honeyValue = 18.2226;
  goldNodes["Solis Headlands"]["Falcorth Plains"]!.cheeseValue = 17.7775;
  goldNodes["Solis Headlands"]["Mahadevi"]!.fertValue = 6.6981;
  goldNodes["Solis Headlands"]["Mahadevi"]!.honeyValue = 9.9918;
  goldNodes["Solis Headlands"]["Mahadevi"]!.cheeseValue = 9.7633;
  goldNodes["Solis Headlands"]["Villanelle"]!.fertValue = 8.5557;
  goldNodes["Solis Headlands"]["Villanelle"]!.honeyValue = 12.9827;
  goldNodes["Solis Headlands"]["Villanelle"]!.cheeseValue = 12.6753;
  goldNodes["Solis Headlands"]["Ynystere"]!.fertValue = 12.5527;
  goldNodes["Solis Headlands"]["Ynystere"]!.honeyValue = 19.4189;
  goldNodes["Solis Headlands"]["Ynystere"]!.cheeseValue = 19.05;
  goldNodes["Solis Headlands"]["Rookborne Basin"]!.fertValue = 17.1989;
  goldNodes["Solis Headlands"]["Rookborne Basin"]!.honeyValue = 26.9;
  goldNodes["Solis Headlands"]["Rookborne Basin"]!.cheeseValue = 26.2266;
  goldNodes["Solis Headlands"]["Freedich Island"]!.fertValue = 21.7249;
  goldNodes["Solis Headlands"]["Freedich Island"]!.honeyValue = 35.1471;
  goldNodes["Solis Headlands"]["Freedich Island"]!.cheeseValue = 35.1471;

  goldNodes["Villanelle"]["Arcum Iris"]!.fertValue = 9.3575;
  goldNodes["Villanelle"]["Arcum Iris"]!.honeyValue = 14.274;
  goldNodes["Villanelle"]["Arcum Iris"]!.cheeseValue = 13.9328;
  goldNodes["Villanelle"]["Falcorth Plains"]!.fertValue = 10.501;
  goldNodes["Villanelle"]["Falcorth Plains"]!.honeyValue = 16.1152;
  goldNodes["Villanelle"]["Falcorth Plains"]!.cheeseValue = 15.7256;
  goldNodes["Villanelle"]["Mahadevi"]!.fertValue = 6.6456;
  goldNodes["Villanelle"]["Mahadevi"]!.honeyValue = 9.9073;
  goldNodes["Villanelle"]["Mahadevi"]!.cheeseValue = 9.681;
  goldNodes["Villanelle"]["Solis Headlands"]!.fertValue = 8.5557;
  goldNodes["Villanelle"]["Solis Headlands"]!.honeyValue = 12.9827;
  goldNodes["Villanelle"]["Solis Headlands"]!.cheeseValue = 12.6753;
  goldNodes["Villanelle"]["Ynystere"]!.fertValue = 8.9071;
  goldNodes["Villanelle"]["Ynystere"]!.honeyValue = 13.5486;
  goldNodes["Villanelle"]["Ynystere"]!.cheeseValue = 13.2262;
  goldNodes["Villanelle"]["Rookborne Basin"]!.fertValue = 9.4244;
  goldNodes["Villanelle"]["Rookborne Basin"]!.honeyValue = 14.3816;
  goldNodes["Villanelle"]["Rookborne Basin"]!.cheeseValue = 14.0374;
  goldNodes["Villanelle"]["Freedich Island"]!.fertValue = 19.1679;
  goldNodes["Villanelle"]["Freedich Island"]!.honeyValue = 30.9096;
  goldNodes["Villanelle"]["Freedich Island"]!.cheeseValue = 30.9096;

  goldNodes["Silent Forest"]["Arcum Iris"]!.fertValue = 11.5092;
  goldNodes["Silent Forest"]["Arcum Iris"]!.honeyValue = 17.7385;
  goldNodes["Silent Forest"]["Arcum Iris"]!.cheeseValue = 17.3066;
  goldNodes["Silent Forest"]["Falcorth Plains"]!.fertValue = 11.6447;
  goldNodes["Silent Forest"]["Falcorth Plains"]!.honeyValue = 17.957;
  goldNodes["Silent Forest"]["Falcorth Plains"]!.cheeseValue = 17.5187;
  goldNodes["Silent Forest"]["Mahadevi"]!.fertValue = 9.4251;
  goldNodes["Silent Forest"]["Mahadevi"]!.honeyValue = 14.7056;
  goldNodes["Silent Forest"]["Mahadevi"]!.cheeseValue = 14.353;
  goldNodes["Silent Forest"]["Solis Headlands"]!.fertValue = 11.9236;
  goldNodes["Silent Forest"]["Solis Headlands"]!.honeyValue = 18.4054;
  goldNodes["Silent Forest"]["Solis Headlands"]!.cheeseValue = 17.9552;
  goldNodes["Silent Forest"]["Villanelle"]!.fertValue = 6.4081;
  goldNodes["Silent Forest"]["Villanelle"]!.honeyValue = 9.5248;
  goldNodes["Silent Forest"]["Villanelle"]!.cheeseValue = 9.3084;
  goldNodes["Silent Forest"]["Ynystere"]!.fertValue = 6.9334;
  goldNodes["Silent Forest"]["Ynystere"]!.honeyValue = 10.3709;
  goldNodes["Silent Forest"]["Ynystere"]!.cheeseValue = 10.1322;
  goldNodes["Silent Forest"]["Rookborne Basin"]!.fertValue = 6.7952;
  goldNodes["Silent Forest"]["Rookborne Basin"]!.honeyValue = 10.1482;
  goldNodes["Silent Forest"]["Rookborne Basin"]!.cheeseValue = 9.9154;
  goldNodes["Silent Forest"]["Freedich Island"]!.fertValue = 18.2852;
  goldNodes["Silent Forest"]["Freedich Island"]!.honeyValue = 29.4468;
  goldNodes["Silent Forest"]["Freedich Island"]!.cheeseValue = 29.4468;

  goldNodes["Ynystere"]["Arcum Iris"]!.fertValue = 14.9445;
  goldNodes["Ynystere"]["Arcum Iris"]!.honeyValue = 23.2701;
  goldNodes["Ynystere"]["Arcum Iris"]!.cheeseValue = 22.6923;
  goldNodes["Ynystere"]["Falcorth Plains"]!.fertValue = 16.1959;
  goldNodes["Ynystere"]["Falcorth Plains"]!.honeyValue = 25.2851;
  goldNodes["Ynystere"]["Falcorth Plains"]!.cheeseValue = 24.6542;
  goldNodes["Ynystere"]["Mahadevi"]!.fertValue = 11.3214;
  goldNodes["Ynystere"]["Mahadevi"]!.honeyValue = 17.4364;
  goldNodes["Ynystere"]["Mahadevi"]!.cheeseValue = 17.0119;
  goldNodes["Ynystere"]["Solis Headlands"]!.fertValue = 12.5527;
  goldNodes["Ynystere"]["Solis Headlands"]!.honeyValue = 19.4189;
  goldNodes["Ynystere"]["Solis Headlands"]!.cheeseValue = 18.942;
  goldNodes["Ynystere"]["Villanelle"]!.fertValue = 8.9071;
  goldNodes["Ynystere"]["Villanelle"]!.honeyValue = 13.5486;
  goldNodes["Ynystere"]["Villanelle"]!.cheeseValue = 13.2262;
  goldNodes["Ynystere"]["Rookborne Basin"]!.fertValue = 10.5008;
  goldNodes["Ynystere"]["Rookborne Basin"]!.honeyValue = 16.1147;
  goldNodes["Ynystere"]["Rookborne Basin"]!.cheeseValue = 15.7248;
  goldNodes["Ynystere"]["Freedich Island"]!.fertValue = 15.3823;
  goldNodes["Ynystere"]["Freedich Island"]!.honeyValue = 24.6363;
  goldNodes["Ynystere"]["Freedich Island"]!.cheeseValue = 24.6363;

  goldNodes["Rookborne Basin"]["Arcum Iris"]!.fertValue = 10.5624;
  goldNodes["Rookborne Basin"]["Arcum Iris"]!.honeyValue = 16.214;
  goldNodes["Rookborne Basin"]["Arcum Iris"]!.cheeseValue = 15.8215;
  goldNodes["Rookborne Basin"]["Falcorth Plains"]!.fertValue = 13.9552;
  goldNodes["Rookborne Basin"]["Falcorth Plains"]!.honeyValue = 21.6771;
  goldNodes["Rookborne Basin"]["Falcorth Plains"]!.cheeseValue = 21.1409;
  goldNodes["Rookborne Basin"]["Mahadevi"]!.fertValue = 12.8766;
  goldNodes["Rookborne Basin"]["Mahadevi"]!.honeyValue = 19.9401;
  goldNodes["Rookborne Basin"]["Mahadevi"]!.cheeseValue = 15.8451;
  goldNodes["Rookborne Basin"]["Solis Headlands"]!.fertValue = 16.0576;
  goldNodes["Rookborne Basin"]["Solis Headlands"]!.honeyValue = 25.0619;
  goldNodes["Rookborne Basin"]["Solis Headlands"]!.cheeseValue = 24.4366;
  goldNodes["Rookborne Basin"]["Villanelle"]!.fertValue = 9.4244;
  goldNodes["Rookborne Basin"]["Villanelle"]!.honeyValue = 14.3816;
  goldNodes["Rookborne Basin"]["Villanelle"]!.cheeseValue = 14.0374;
  goldNodes["Rookborne Basin"]["Ynystere"]!.fertValue = 10.5008;
  goldNodes["Rookborne Basin"]["Ynystere"]!.honeyValue = 16.1147;
  goldNodes["Rookborne Basin"]["Ynystere"]!.cheeseValue = 15.7248;
  goldNodes["Rookborne Basin"]["Freedich Island"]!.fertValue = 22.3437;
  goldNodes["Rookborne Basin"]["Freedich Island"]!.honeyValue = 36.1725;
  goldNodes["Rookborne Basin"]["Freedich Island"]!.cheeseValue = 36.1725;

  goldNodes["Windscour Savannah"]["Arcum Iris"]!.fertValue = 7.1533;
  goldNodes["Windscour Savannah"]["Arcum Iris"]!.honeyValue = 10.7247;
  goldNodes["Windscour Savannah"]["Arcum Iris"]!.cheeseValue = 10.4767;
  goldNodes["Windscour Savannah"]["Falcorth Plains"]!.fertValue = 10.5954;
  goldNodes["Windscour Savannah"]["Falcorth Plains"]!.honeyValue = 16.267;
  goldNodes["Windscour Savannah"]["Falcorth Plains"]!.cheeseValue = 15.8733;
  goldNodes["Windscour Savannah"]["Mahadevi"]!.fertValue = 10.5775;
  goldNodes["Windscour Savannah"]["Mahadevi"]!.honeyValue = 16.2382;
  goldNodes["Windscour Savannah"]["Mahadevi"]!.cheeseValue = 15.8451;
  goldNodes["Windscour Savannah"]["Solis Headlands"]!.fertValue = 14.8668;
  goldNodes["Windscour Savannah"]["Solis Headlands"]!.honeyValue = 23.1447;
  goldNodes["Windscour Savannah"]["Solis Headlands"]!.cheeseValue = 22.5702;
  goldNodes["Windscour Savannah"]["Villanelle"]!.fertValue = 13.6479;
  goldNodes["Windscour Savannah"]["Villanelle"]!.honeyValue = 21.1822;
  goldNodes["Windscour Savannah"]["Villanelle"]!.cheeseValue = 20.6592;
  goldNodes["Windscour Savannah"]["Ynystere"]!.fertValue = 19.5209;
  goldNodes["Windscour Savannah"]["Ynystere"]!.honeyValue = 19.9828;
  goldNodes["Windscour Savannah"]["Ynystere"]!.cheeseValue = 19.2477;
  goldNodes["Windscour Savannah"]["Rookborne Basin"]!.fertValue = 7.8772;
  goldNodes["Windscour Savannah"]["Rookborne Basin"]!.honeyValue = 11.8903;
  goldNodes["Windscour Savannah"]["Rookborne Basin"]!.cheeseValue = 11.6117;
  goldNodes["Windscour Savannah"]["Freedich Island"]!.fertValue = 25.415;
  goldNodes["Windscour Savannah"]["Freedich Island"]!.honeyValue = 46.54;
  goldNodes["Windscour Savannah"]["Freedich Island"]!.cheeseValue = 46.54;

  goldNodes["Perinoor Ruins"]["Arcum Iris"]!.fertValue = 10.0012;
  goldNodes["Perinoor Ruins"]["Arcum Iris"]!.honeyValue = 15.3104;
  goldNodes["Perinoor Ruins"]["Arcum Iris"]!.cheeseValue = 14.9417;
  goldNodes["Perinoor Ruins"]["Falcorth Plains"]!.fertValue = 14.0895;
  goldNodes["Perinoor Ruins"]["Falcorth Plains"]!.honeyValue = 21.8932;
  goldNodes["Perinoor Ruins"]["Falcorth Plains"]!.cheeseValue = 21.3513;
  goldNodes["Perinoor Ruins"]["Mahadevi"]!.fertValue = 14.1761;
  goldNodes["Perinoor Ruins"]["Mahadevi"]!.honeyValue = 22.0328;
  goldNodes["Perinoor Ruins"]["Mahadevi"]!.cheeseValue = 21.4872;
  goldNodes["Perinoor Ruins"]["Solis Headlands"]!.fertValue = 19.1754;
  goldNodes["Perinoor Ruins"]["Solis Headlands"]!.honeyValue = 30.0824;
  goldNodes["Perinoor Ruins"]["Solis Headlands"]!.cheeseValue = 29.3253;
  goldNodes["Perinoor Ruins"]["Villanelle"]!.fertValue = 17.6999;
  goldNodes["Perinoor Ruins"]["Villanelle"]!.honeyValue = 27.7066;
  goldNodes["Perinoor Ruins"]["Villanelle"]!.cheeseValue = 27.0119;
  goldNodes["Perinoor Ruins"]["Ynystere"]!.fertValue = 20.2501;
  goldNodes["Perinoor Ruins"]["Ynystere"]!.honeyValue = 31.813;
  goldNodes["Perinoor Ruins"]["Ynystere"]!.cheeseValue = 31.0103;
  goldNodes["Perinoor Ruins"]["Rookborne Basin"]!.fertValue = 10.6589;
  goldNodes["Perinoor Ruins"]["Rookborne Basin"]!.honeyValue = 16.3631;
  goldNodes["Perinoor Ruins"]["Rookborne Basin"]!.cheeseValue = 15.9666;
  goldNodes["Perinoor Ruins"]["Freedich Island"]!.fertValue = 25.415;
  goldNodes["Perinoor Ruins"]["Freedich Island"]!.honeyValue = 46.54;
  goldNodes["Perinoor Ruins"]["Freedich Island"]!.cheeseValue = 46.54;

  goldNodes["Hasla"]["Arcum Iris"]!.fertValue = 14.2984;
  goldNodes["Hasla"]["Arcum Iris"]!.honeyValue = 22.2297;
  goldNodes["Hasla"]["Arcum Iris"]!.cheeseValue = 21.6789;
  goldNodes["Hasla"]["Falcorth Plains"]!.fertValue = 15.1882;
  goldNodes["Hasla"]["Falcorth Plains"]!.honeyValue = 23.6622;
  goldNodes["Hasla"]["Falcorth Plains"]!.cheeseValue = 23.0737;
  goldNodes["Hasla"]["Mahadevi"]!.fertValue = 19.0362;
  goldNodes["Hasla"]["Mahadevi"]!.honeyValue = 29.8583;
  goldNodes["Hasla"]["Mahadevi"]!.cheeseValue = 29.1067;
  goldNodes["Hasla"]["Solis Headlands"]!.fertValue = 23.0268;
  goldNodes["Hasla"]["Solis Headlands"]!.honeyValue = 38.2027;
  goldNodes["Hasla"]["Solis Headlands"]!.cheeseValue = 37.2319;
  goldNodes["Hasla"]["Villanelle"]!.fertValue = 21.6473;
  goldNodes["Hasla"]["Villanelle"]!.honeyValue = 34.0626;
  goldNodes["Hasla"]["Villanelle"]!.cheeseValue = 33.2004;
  goldNodes["Hasla"]["Ynystere"]!.fertValue = 23.8498;
  goldNodes["Hasla"]["Ynystere"]!.honeyValue = 38.6682;
  goldNodes["Hasla"]["Ynystere"]!.cheeseValue = 37.3797;
  goldNodes["Hasla"]["Rookborne Basin"]!.fertValue = 14.39;
  goldNodes["Hasla"]["Rookborne Basin"]!.honeyValue = 22.377;
  goldNodes["Hasla"]["Rookborne Basin"]!.cheeseValue = 21.8223;
  goldNodes["Hasla"]["Freedich Island"]!.fertValue = 24.6915;
  goldNodes["Hasla"]["Freedich Island"]!.honeyValue = 45.1828;
  goldNodes["Hasla"]["Freedich Island"]!.cheeseValue = 45.1828;

  goldNodes["Sunbite Wilds"]["Arcum Iris"]!.fertValue = 6.3583;
  goldNodes["Sunbite Wilds"]["Arcum Iris"]!.honeyValue = 9.4448;
  goldNodes["Sunbite Wilds"]["Arcum Iris"]!.cheeseValue = 9.2305;
  goldNodes["Sunbite Wilds"]["Falcorth Plains"]!.fertValue = 9.999;
  goldNodes["Sunbite Wilds"]["Falcorth Plains"]!.honeyValue = 15.3069;
  goldNodes["Sunbite Wilds"]["Falcorth Plains"]!.cheeseValue = 14.9384;
  goldNodes["Sunbite Wilds"]["Mahadevi"]!.fertValue = 9.2483;
  goldNodes["Sunbite Wilds"]["Mahadevi"]!.honeyValue = 14.0981;
  goldNodes["Sunbite Wilds"]["Mahadevi"]!.cheeseValue = 13.7614;
  goldNodes["Sunbite Wilds"]["Solis Headlands"]!.fertValue = 12.0784;
  goldNodes["Sunbite Wilds"]["Solis Headlands"]!.honeyValue = 18.6554;
  goldNodes["Sunbite Wilds"]["Solis Headlands"]!.cheeseValue = 18.1986;
  goldNodes["Sunbite Wilds"]["Villanelle"]!.fertValue = 12.4686;
  goldNodes["Sunbite Wilds"]["Villanelle"]!.honeyValue = 19.283;
  goldNodes["Sunbite Wilds"]["Villanelle"]!.cheeseValue = 18.8098;
  goldNodes["Sunbite Wilds"]["Ynystere"]!.fertValue = 17.9839;
  goldNodes["Sunbite Wilds"]["Ynystere"]!.honeyValue = 28.1641;
  goldNodes["Sunbite Wilds"]["Ynystere"]!.cheeseValue = 27.4574;
  goldNodes["Sunbite Wilds"]["Rookborne Basin"]!.fertValue = 12.9462;
  goldNodes["Sunbite Wilds"]["Rookborne Basin"]!.honeyValue = 20.0526;
  goldNodes["Sunbite Wilds"]["Rookborne Basin"]!.cheeseValue = 19.5594;
  goldNodes["Sunbite Wilds"]["Freedich Island"]!.fertValue = 25.415;
  goldNodes["Sunbite Wilds"]["Freedich Island"]!.honeyValue = 46.54;
  goldNodes["Sunbite Wilds"]["Freedich Island"]!.cheeseValue = 46.54;

  goldNodes["Rokhala Mountains"]["Arcum Iris"]!.fertValue = 16.4834;
  goldNodes["Rokhala Mountains"]["Arcum Iris"]!.honeyValue = 25.7475;
  goldNodes["Rokhala Mountains"]["Arcum Iris"]!.cheeseValue = 25.1044;
  goldNodes["Rokhala Mountains"]["Falcorth Plains"]!.fertValue = 13.6167;
  goldNodes["Rokhala Mountains"]["Falcorth Plains"]!.honeyValue = 21.1318;
  goldNodes["Rokhala Mountains"]["Falcorth Plains"]!.cheeseValue = 20.6102;
  goldNodes["Rokhala Mountains"]["Mahadevi"]!.fertValue = 19.1695;
  goldNodes["Rokhala Mountains"]["Mahadevi"]!.honeyValue = 30.0729;
  goldNodes["Rokhala Mountains"]["Mahadevi"]!.cheeseValue = 29.3158;
  goldNodes["Rokhala Mountains"]["Solis Headlands"]!.fertValue = 23.6171;
  goldNodes["Rokhala Mountains"]["Solis Headlands"]!.honeyValue = 37.2338;
  goldNodes["Rokhala Mountains"]["Solis Headlands"]!.cheeseValue = 36.2886;
  goldNodes["Rokhala Mountains"]["Villanelle"]!.fertValue = 16.2851;
  goldNodes["Rokhala Mountains"]["Villanelle"]!.honeyValue = 25.4285;
  goldNodes["Rokhala Mountains"]["Villanelle"]!.cheeseValue = 24.7936;
  goldNodes["Rokhala Mountains"]["Ynystere"]!.fertValue = 18.996;
  goldNodes["Rokhala Mountains"]["Ynystere"]!.honeyValue = 29.7935;
  goldNodes["Rokhala Mountains"]["Ynystere"]!.cheeseValue = 29.0437;
  goldNodes["Rokhala Mountains"]["Rookborne Basin"]!.fertValue = 9.5325;
  goldNodes["Rokhala Mountains"]["Rookborne Basin"]!.honeyValue = 14.5557;
  goldNodes["Rokhala Mountains"]["Rookborne Basin"]!.cheeseValue = 14.2069;
  goldNodes["Rokhala Mountains"]["Freedich Island"]!.fertValue = 30.238;
  goldNodes["Rokhala Mountains"]["Freedich Island"]!.honeyValue = 49.556;
  goldNodes["Rokhala Mountains"]["Freedich Island"]!.cheeseValue = 49.556;
}

function generateHaranyaFHCGildaValues() {
  gildaNodes["Arcum Iris"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Arcum Iris"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Arcum Iris"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Arcum Iris"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Arcum Iris"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Arcum Iris"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Arcum Iris"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Arcum Iris"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Arcum Iris"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Arcum Iris"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Arcum Iris"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Arcum Iris"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Falcorth Plains"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Falcorth Plains"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Falcorth Plains"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Falcorth Plains"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Falcorth Plains"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Falcorth Plains"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Falcorth Plains"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Falcorth Plains"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Falcorth Plains"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Falcorth Plains"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Falcorth Plains"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Falcorth Plains"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Tigerspine Mountains"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Tigerspine Mountains"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Tigerspine Mountains"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Tigerspine Mountains"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Tigerspine Mountains"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Tigerspine Mountains"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Mahadevi"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Mahadevi"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Mahadevi"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Mahadevi"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Mahadevi"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Mahadevi"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Mahadevi"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Mahadevi"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Mahadevi"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Mahadevi"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Mahadevi"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Mahadevi"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Solis Headlands"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Solis Headlands"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Solis Headlands"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Solis Headlands"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Solis Headlands"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Solis Headlands"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Solis Headlands"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Solis Headlands"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Solis Headlands"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Solis Headlands"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Solis Headlands"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Solis Headlands"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Villanelle"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Villanelle"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Villanelle"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Villanelle"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Villanelle"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Villanelle"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Villanelle"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Villanelle"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Villanelle"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Villanelle"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Villanelle"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Villanelle"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Silent Forest"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Silent Forest"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Silent Forest"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Silent Forest"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Silent Forest"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Silent Forest"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Silent Forest"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Silent Forest"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Silent Forest"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Silent Forest"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Silent Forest"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Silent Forest"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Ynystere"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Ynystere"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Ynystere"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Ynystere"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Ynystere"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Ynystere"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Ynystere"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Ynystere"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Ynystere"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Ynystere"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Ynystere"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Ynystere"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Rookborne Basin"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Rookborne Basin"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Rookborne Basin"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Rookborne Basin"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Rookborne Basin"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Rookborne Basin"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Rookborne Basin"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Rookborne Basin"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Rookborne Basin"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Rookborne Basin"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Rookborne Basin"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Rookborne Basin"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Windscour Savannah"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Windscour Savannah"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Windscour Savannah"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Windscour Savannah"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Windscour Savannah"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Windscour Savannah"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Windscour Savannah"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Windscour Savannah"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Windscour Savannah"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Windscour Savannah"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Windscour Savannah"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Windscour Savannah"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Perinoor Ruins"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Perinoor Ruins"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Perinoor Ruins"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Perinoor Ruins"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Perinoor Ruins"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Perinoor Ruins"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Perinoor Ruins"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Perinoor Ruins"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Perinoor Ruins"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Hasla"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Hasla"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Hasla"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Hasla"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Hasla"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Hasla"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Hasla"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Hasla"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Hasla"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Hasla"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Hasla"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Hasla"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Sunbite Wilds"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Sunbite Wilds"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Sunbite Wilds"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Sunbite Wilds"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Sunbite Wilds"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Sunbite Wilds"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Sunbite Wilds"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Sunbite Wilds"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Sunbite Wilds"]["Freedich Island"]!.cheeseValue = 5;

  gildaNodes["Rokhala Mountains"]["Two Crowns"]!.fertValue = 2;
  gildaNodes["Rokhala Mountains"]["Two Crowns"]!.honeyValue = 2;
  gildaNodes["Rokhala Mountains"]["Two Crowns"]!.cheeseValue = 2;
  gildaNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.fertValue = 2;
  gildaNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.honeyValue = 2;
  gildaNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.cheeseValue = 2;
  gildaNodes["Rokhala Mountains"]["Cinderstone Moor"]!.fertValue = 3;
  gildaNodes["Rokhala Mountains"]["Cinderstone Moor"]!.honeyValue = 3;
  gildaNodes["Rokhala Mountains"]["Cinderstone Moor"]!.cheeseValue = 3;
  gildaNodes["Rokhala Mountains"]["Freedich Island"]!.fertValue = 5;
  gildaNodes["Rokhala Mountains"]["Freedich Island"]!.honeyValue = 5;
  gildaNodes["Rokhala Mountains"]["Freedich Island"]!.cheeseValue = 5;
}

function generateHaranyaFHCStabValues() {
  stabNodes["Arcum Iris"]["Two Crowns"]!.fertValue = 17;
  stabNodes["Arcum Iris"]["Two Crowns"]!.honeyValue = 28;
  stabNodes["Arcum Iris"]["Two Crowns"]!.cheeseValue = 28;
  stabNodes["Arcum Iris"]["Solzreed Peninsula"]!.fertValue = 17;
  stabNodes["Arcum Iris"]["Solzreed Peninsula"]!.honeyValue = 27;
  stabNodes["Arcum Iris"]["Solzreed Peninsula"]!.cheeseValue = 27;
  stabNodes["Arcum Iris"]["Cinderstone Moor"]!.fertValue = 15;
  stabNodes["Arcum Iris"]["Cinderstone Moor"]!.honeyValue = 25;
  stabNodes["Arcum Iris"]["Cinderstone Moor"]!.cheeseValue = 25;
  stabNodes["Arcum Iris"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Arcum Iris"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Arcum Iris"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Falcorth Plains"]["Two Crowns"]!.fertValue = 17;
  stabNodes["Falcorth Plains"]["Two Crowns"]!.honeyValue = 27;
  stabNodes["Falcorth Plains"]["Two Crowns"]!.cheeseValue = 27;
  stabNodes["Falcorth Plains"]["Solzreed Peninsula"]!.fertValue = 17;
  stabNodes["Falcorth Plains"]["Solzreed Peninsula"]!.honeyValue = 27;
  stabNodes["Falcorth Plains"]["Solzreed Peninsula"]!.cheeseValue = 27;
  stabNodes["Falcorth Plains"]["Cinderstone Moor"]!.fertValue = 15;
  stabNodes["Falcorth Plains"]["Cinderstone Moor"]!.honeyValue = 25;
  stabNodes["Falcorth Plains"]["Cinderstone Moor"]!.cheeseValue = 25;
  stabNodes["Falcorth Plains"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Falcorth Plains"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Falcorth Plains"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Tigerspine Mountains"]["Two Crowns"]!.fertValue = 14;
  stabNodes["Tigerspine Mountains"]["Two Crowns"]!.honeyValue = 24;
  stabNodes["Tigerspine Mountains"]["Two Crowns"]!.cheeseValue = 24;
  stabNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.fertValue = 14;
  stabNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.honeyValue = 24;
  stabNodes["Tigerspine Mountains"]["Solzreed Peninsula"]!.cheeseValue = 24;
  stabNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.fertValue = 13;
  stabNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.honeyValue = 22;
  stabNodes["Tigerspine Mountains"]["Cinderstone Moor"]!.cheeseValue = 22;
  stabNodes["Tigerspine Mountains"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Tigerspine Mountains"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Tigerspine Mountains"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Mahadevi"]["Two Crowns"]!.fertValue = 13;
  stabNodes["Mahadevi"]["Two Crowns"]!.honeyValue = 21;
  stabNodes["Mahadevi"]["Two Crowns"]!.cheeseValue = 21;
  stabNodes["Mahadevi"]["Solzreed Peninsula"]!.fertValue = 12;
  stabNodes["Mahadevi"]["Solzreed Peninsula"]!.honeyValue = 20;
  stabNodes["Mahadevi"]["Solzreed Peninsula"]!.cheeseValue = 20;
  stabNodes["Mahadevi"]["Cinderstone Moor"]!.fertValue = 11;
  stabNodes["Mahadevi"]["Cinderstone Moor"]!.honeyValue = 18;
  stabNodes["Mahadevi"]["Cinderstone Moor"]!.cheeseValue = 18;
  stabNodes["Mahadevi"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Mahadevi"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Mahadevi"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Solis Headlands"]["Two Crowns"]!.fertValue = 12;
  stabNodes["Solis Headlands"]["Two Crowns"]!.honeyValue = 19;
  stabNodes["Solis Headlands"]["Two Crowns"]!.cheeseValue = 19;
  stabNodes["Solis Headlands"]["Solzreed Peninsula"]!.fertValue = 13;
  stabNodes["Solis Headlands"]["Solzreed Peninsula"]!.honeyValue = 22;
  stabNodes["Solis Headlands"]["Solzreed Peninsula"]!.cheeseValue = 22;
  stabNodes["Solis Headlands"]["Cinderstone Moor"]!.fertValue = 11;
  stabNodes["Solis Headlands"]["Cinderstone Moor"]!.honeyValue = 17;
  stabNodes["Solis Headlands"]["Cinderstone Moor"]!.cheeseValue = 17;
  stabNodes["Solis Headlands"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Solis Headlands"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Solis Headlands"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Villanelle"]["Two Crowns"]!.fertValue = 13;
  stabNodes["Villanelle"]["Two Crowns"]!.honeyValue = 21;
  stabNodes["Villanelle"]["Two Crowns"]!.cheeseValue = 21;
  stabNodes["Villanelle"]["Solzreed Peninsula"]!.fertValue = 13;
  stabNodes["Villanelle"]["Solzreed Peninsula"]!.honeyValue = 22;
  stabNodes["Villanelle"]["Solzreed Peninsula"]!.cheeseValue = 22;
  stabNodes["Villanelle"]["Cinderstone Moor"]!.fertValue = 12;
  stabNodes["Villanelle"]["Cinderstone Moor"]!.honeyValue = 20;
  stabNodes["Villanelle"]["Cinderstone Moor"]!.cheeseValue = 20;
  stabNodes["Villanelle"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Villanelle"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Villanelle"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Silent Forest"]["Two Crowns"]!.fertValue = 15;
  stabNodes["Silent Forest"]["Two Crowns"]!.honeyValue = 24;
  stabNodes["Silent Forest"]["Two Crowns"]!.cheeseValue = 24;
  stabNodes["Silent Forest"]["Solzreed Peninsula"]!.fertValue = 16;
  stabNodes["Silent Forest"]["Solzreed Peninsula"]!.honeyValue = 27;
  stabNodes["Silent Forest"]["Solzreed Peninsula"]!.cheeseValue = 27;
  stabNodes["Silent Forest"]["Cinderstone Moor"]!.fertValue = 15;
  stabNodes["Silent Forest"]["Cinderstone Moor"]!.honeyValue = 24;
  stabNodes["Silent Forest"]["Cinderstone Moor"]!.cheeseValue = 24;
  stabNodes["Silent Forest"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Silent Forest"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Silent Forest"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Ynystere"]["Two Crowns"]!.fertValue = 12;
  stabNodes["Ynystere"]["Two Crowns"]!.honeyValue = 20;
  stabNodes["Ynystere"]["Two Crowns"]!.cheeseValue = 20;
  stabNodes["Ynystere"]["Solzreed Peninsula"]!.fertValue = 14;
  stabNodes["Ynystere"]["Solzreed Peninsula"]!.honeyValue = 23;
  stabNodes["Ynystere"]["Solzreed Peninsula"]!.cheeseValue = 23;
  stabNodes["Ynystere"]["Cinderstone Moor"]!.fertValue = 12;
  stabNodes["Ynystere"]["Cinderstone Moor"]!.honeyValue = 20;
  stabNodes["Ynystere"]["Cinderstone Moor"]!.cheeseValue = 20;
  stabNodes["Ynystere"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Ynystere"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Ynystere"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Rookborne Basin"]["Two Crowns"]!.fertValue = 17;
  stabNodes["Rookborne Basin"]["Two Crowns"]!.honeyValue = 28;
  stabNodes["Rookborne Basin"]["Two Crowns"]!.cheeseValue = 28;
  stabNodes["Rookborne Basin"]["Solzreed Peninsula"]!.fertValue = 18;
  stabNodes["Rookborne Basin"]["Solzreed Peninsula"]!.honeyValue = 30;
  stabNodes["Rookborne Basin"]["Solzreed Peninsula"]!.cheeseValue = 30;
  stabNodes["Rookborne Basin"]["Cinderstone Moor"]!.fertValue = 17;
  stabNodes["Rookborne Basin"]["Cinderstone Moor"]!.honeyValue = 28;
  stabNodes["Rookborne Basin"]["Cinderstone Moor"]!.cheeseValue = 28;
  stabNodes["Rookborne Basin"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Rookborne Basin"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Rookborne Basin"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Windscour Savannah"]["Two Crowns"]!.fertValue = 20;
  stabNodes["Windscour Savannah"]["Two Crowns"]!.honeyValue = 33;
  stabNodes["Windscour Savannah"]["Two Crowns"]!.cheeseValue = 33;
  stabNodes["Windscour Savannah"]["Solzreed Peninsula"]!.fertValue = 19;
  stabNodes["Windscour Savannah"]["Solzreed Peninsula"]!.honeyValue = 32;
  stabNodes["Windscour Savannah"]["Solzreed Peninsula"]!.cheeseValue = 32;
  stabNodes["Windscour Savannah"]["Cinderstone Moor"]!.fertValue = 18;
  stabNodes["Windscour Savannah"]["Cinderstone Moor"]!.honeyValue = 30;
  stabNodes["Windscour Savannah"]["Cinderstone Moor"]!.cheeseValue = 30;
  stabNodes["Windscour Savannah"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Windscour Savannah"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Windscour Savannah"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Perinoor Ruins"]["Two Crowns"]!.fertValue = 21;
  stabNodes["Perinoor Ruins"]["Two Crowns"]!.honeyValue = 35;
  stabNodes["Perinoor Ruins"]["Two Crowns"]!.cheeseValue = 35;
  stabNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.fertValue = 20;
  stabNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.honeyValue = 34;
  stabNodes["Perinoor Ruins"]["Solzreed Peninsula"]!.cheeseValue = 34;
  stabNodes["Perinoor Ruins"]["Cinderstone Moor"]!.fertValue = 20;
  stabNodes["Perinoor Ruins"]["Cinderstone Moor"]!.honeyValue = 33;
  stabNodes["Perinoor Ruins"]["Cinderstone Moor"]!.cheeseValue = 33;
  stabNodes["Perinoor Ruins"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Perinoor Ruins"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Perinoor Ruins"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Hasla"]["Two Crowns"]!.fertValue = 24;
  stabNodes["Hasla"]["Two Crowns"]!.honeyValue = 40;
  stabNodes["Hasla"]["Two Crowns"]!.cheeseValue = 40;
  stabNodes["Hasla"]["Solzreed Peninsula"]!.fertValue = 23;
  stabNodes["Hasla"]["Solzreed Peninsula"]!.honeyValue = 39;
  stabNodes["Hasla"]["Solzreed Peninsula"]!.cheeseValue = 39;
  stabNodes["Hasla"]["Cinderstone Moor"]!.fertValue = 23;
  stabNodes["Hasla"]["Cinderstone Moor"]!.honeyValue = 37;
  stabNodes["Hasla"]["Cinderstone Moor"]!.cheeseValue = 37;
  stabNodes["Hasla"]["Freedich Island"]!.fertValue = 1;
  stabNodes["Hasla"]["Freedich Island"]!.honeyValue = 3;
  stabNodes["Hasla"]["Freedich Island"]!.cheeseValue = 3;

  stabNodes["Sunbite Wilds"]["Two Crowns"]!.fertValue = 18;
  stabNodes["Sunbite Wilds"]["Two Crowns"]!.honeyValue = 30;
  stabNodes["Sunbite Wilds"]["Two Crowns"]!.cheeseValue = 30;
  stabNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.fertValue = 16;
  stabNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.honeyValue = 27;
  stabNodes["Sunbite Wilds"]["Solzreed Peninsula"]!.cheeseValue = 27;
  stabNodes["Sunbite Wilds"]["Cinderstone Moor"]!.fertValue = 16;
  stabNodes["Sunbite Wilds"]["Cinderstone Moor"]!.honeyValue = 26;
  stabNodes["Sunbite Wilds"]["Cinderstone Moor"]!.cheeseValue = 26;
  stabNodes["Sunbite Wilds"]["Freedich Island"]!.fertValue = 2;
  stabNodes["Sunbite Wilds"]["Freedich Island"]!.honeyValue = 5;
  stabNodes["Sunbite Wilds"]["Freedich Island"]!.cheeseValue = 5;

  stabNodes["Rokhala Mountains"]["Two Crowns"]!.fertValue = 44;
  stabNodes["Rokhala Mountains"]["Two Crowns"]!.honeyValue = 73;
  stabNodes["Rokhala Mountains"]["Two Crowns"]!.cheeseValue = 73;
  stabNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.fertValue = 47;
  stabNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.honeyValue = 77;
  stabNodes["Rokhala Mountains"]["Solzreed Peninsula"]!.cheeseValue = 77;
  stabNodes["Rokhala Mountains"]["Cinderstone Moor"]!.fertValue = 43;
  stabNodes["Rokhala Mountains"]["Cinderstone Moor"]!.honeyValue = 72;
  stabNodes["Rokhala Mountains"]["Cinderstone Moor"]!.cheeseValue = 72;
  stabNodes["Rokhala Mountains"]["Freedich Island"]!.fertValue = 2;
  stabNodes["Rokhala Mountains"]["Freedich Island"]!.honeyValue = 5;
  stabNodes["Rokhala Mountains"]["Freedich Island"]!.cheeseValue = 5;
}

function generateNuiaGGFGoldValues() {
  goldNodes["Solzreed Peninsula"]["Gweonid Forest"]!.goldValue = 8.9647;
  goldNodes["Solzreed Peninsula"]["Gweonid Forest"]!.gildaValue = 10.1327;
  goldNodes["Solzreed Peninsula"]["Gweonid Forest"]!.fellowshipValue = 9.8123;
  goldNodes["Solzreed Peninsula"]["Dewstone Plains"]!.goldValue = 7.0802;
  goldNodes["Solzreed Peninsula"]["Dewstone Plains"]!.gildaValue = 7.9615;
  goldNodes["Solzreed Peninsula"]["Dewstone Plains"]!.fellowshipValue = 7.3554;
  goldNodes["Solzreed Peninsula"]["Marianople"]!.goldValue = 8.7582;
  goldNodes["Solzreed Peninsula"]["Marianople"]!.gildaValue = 9.8959;
  goldNodes["Solzreed Peninsula"]["Marianople"]!.fellowshipValue = 9.6983;
  goldNodes["Solzreed Peninsula"]["Two Crowns"]!.goldValue = 8.9634;
  goldNodes["Solzreed Peninsula"]["Two Crowns"]!.gildaValue = 10.1317;
  goldNodes["Solzreed Peninsula"]["Two Crowns"]!.fellowshipValue = 10.0573;
  goldNodes["Solzreed Peninsula"]["Cinderstone Moor"]!.goldValue = 9.4483;
  goldNodes["Solzreed Peninsula"]["Cinderstone Moor"]!.gildaValue = 10.6891;
  goldNodes["Solzreed Peninsula"][
    "Cinderstone Moor"
  ]!.fellowshipValue = 14.8963;
  goldNodes["Solzreed Peninsula"]["Sanddeep"]!.goldValue = 13.0981;
  goldNodes["Solzreed Peninsula"]["Sanddeep"]!.gildaValue = 14.8963;
  goldNodes["Solzreed Peninsula"]["Sanddeep"]!.fellowshipValue = 13.829;
  goldNodes["Solzreed Peninsula"]["Freedich Island"]!.goldValue = 16.5589;
  goldNodes["Solzreed Peninsula"]["Freedich Island"]!.gildaValue = 18.6102;
  goldNodes["Solzreed Peninsula"]["Freedich Island"]!.fellowshipValue = 14.2315;

  goldNodes["Gweonid Forest"]["Solzreed Peninsula"]!.goldValue = 8.9647;
  goldNodes["Gweonid Forest"]["Solzreed Peninsula"]!.gildaValue = 10.1327;
  goldNodes["Gweonid Forest"]["Solzreed Peninsula"]!.fellowshipValue = 9.8123;
  goldNodes["Gweonid Forest"]["Dewstone Plains"]!.goldValue = 7.0671;
  goldNodes["Gweonid Forest"]["Dewstone Plains"]!.gildaValue = 7.9453;
  goldNodes["Gweonid Forest"]["Dewstone Plains"]!.fellowshipValue = 7.3418;
  goldNodes["Gweonid Forest"]["Marianople"]!.goldValue = 9.1211;
  goldNodes["Gweonid Forest"]["Marianople"]!.gildaValue = 10.3119;
  goldNodes["Gweonid Forest"]["Marianople"]!.fellowshipValue = 10.0785;
  goldNodes["Gweonid Forest"]["Two Crowns"]!.gildaValue = 12.2979;
  goldNodes["Gweonid Forest"]["Two Crowns"]!.gildaValue = 13.9725;
  goldNodes["Gweonid Forest"]["Two Crowns"]!.gildaValue = 13.4844;
  goldNodes["Gweonid Forest"]["Cinderstone Moor"]!.goldValue = 12.2979;
  goldNodes["Gweonid Forest"]["Cinderstone Moor"]!.gildaValue = 15.9227;
  goldNodes["Gweonid Forest"]["Cinderstone Moor"]!.fellowshipValue = 17.3878;
  goldNodes["Gweonid Forest"]["Sanddeep"]!.goldValue = 15.2593;
  goldNodes["Gweonid Forest"]["Sanddeep"]!.gildaValue = 17.3878;
  goldNodes["Gweonid Forest"]["Sanddeep"]!.fellowshipValue = 16.0927;
  goldNodes["Gweonid Forest"]["Freedich Island"]!.goldValue = 20.9934;
  goldNodes["Gweonid Forest"]["Freedich Island"]!.gildaValue = 23.638;
  goldNodes["Gweonid Forest"]["Freedich Island"]!.fellowshipValue = 22.0899;

  goldNodes["Lilyut Hills"]["Solzreed Peninsula"]!.goldValue = 6.6173;
  goldNodes["Lilyut Hills"]["Solzreed Peninsula"]!.gildaValue = 7.4283;
  goldNodes["Lilyut Hills"]["Solzreed Peninsula"]!.fellowshipValue = 7.1172;
  goldNodes["Lilyut Hills"]["Gweonid Forest"]!.goldValue = 5.6398;
  goldNodes["Lilyut Hills"]["Gweonid Forest"]!.gildaValue = 6.3014;
  goldNodes["Lilyut Hills"]["Gweonid Forest"]!.fellowshipValue = 6.0935;
  goldNodes["Lilyut Hills"]["Dewstone Plains"]!.goldValue = 5.3668;
  goldNodes["Lilyut Hills"]["Dewstone Plains"]!.gildaValue = 5.9866;
  goldNodes["Lilyut Hills"]["Dewstone Plains"]!.fellowshipValue = 5.8072;
  goldNodes["Lilyut Hills"]["Marianople"]!.goldValue = 7.9569;
  goldNodes["Lilyut Hills"]["Marianople"]!.gildaValue = 8.9703;
  goldNodes["Lilyut Hills"]["Marianople"]!.fellowshipValue = 8.5207;
  goldNodes["Lilyut Hills"]["Two Crowns"]!.goldValue = 9.8739;
  goldNodes["Lilyut Hills"]["Two Crowns"]!.gildaValue = 11.1809;
  goldNodes["Lilyut Hills"]["Two Crowns"]!.fellowshipValue = 10.529;
  goldNodes["Lilyut Hills"]["Cinderstone Moor"]!.goldValue = 11.1428;
  goldNodes["Lilyut Hills"]["Cinderstone Moor"]!.gildaValue = 12.6424;
  goldNodes["Lilyut Hills"]["Cinderstone Moor"]!.fellowshipValue = 11.8585;
  goldNodes["Lilyut Hills"]["Sanddeep"]!.goldValue = 13.0345;
  goldNodes["Lilyut Hills"]["Sanddeep"]!.gildaValue = 14.8234;
  goldNodes["Lilyut Hills"]["Sanddeep"]!.fellowshipValue = 13.841;
  goldNodes["Lilyut Hills"]["Freedich Island"]!.goldValue = 17.9317;
  goldNodes["Lilyut Hills"]["Freedich Island"]!.gildaValue = 20.1674;
  goldNodes["Lilyut Hills"]["Freedich Island"]!.fellowshipValue = 18.6984;

  goldNodes["Dewstone Plains"]["Solzreed Peninsula"]!.goldValue = 7.0802;
  goldNodes["Dewstone Plains"]["Solzreed Peninsula"]!.gildaValue = 7.9615;
  goldNodes["Dewstone Plains"]["Solzreed Peninsula"]!.fellowshipValue = 7.3554;
  goldNodes["Dewstone Plains"]["Gweonid Forest"]!.goldValue = 7.0671;
  goldNodes["Dewstone Plains"]["Gweonid Forest"]!.gildaValue = 7.9453;
  goldNodes["Dewstone Plains"]["Gweonid Forest"]!.fellowshipValue = 7.3418;
  goldNodes["Dewstone Plains"]["Marianople"]!.goldValue = 5.4635;
  goldNodes["Dewstone Plains"]["Marianople"]!.gildaValue = 6.0983;
  goldNodes["Dewstone Plains"]["Marianople"]!.fellowshipValue = 6.7059;
  goldNodes["Dewstone Plains"]["Two Crowns"]!.goldValue = 6.4722;
  goldNodes["Dewstone Plains"]["Two Crowns"]!.gildaValue = 7.2613;
  goldNodes["Dewstone Plains"]["Two Crowns"]!.fellowshipValue = 8.8849;
  goldNodes["Dewstone Plains"]["Cinderstone Moor"]!.goldValue = 9.5804;
  goldNodes["Dewstone Plains"]["Cinderstone Moor"]!.gildaValue = 10.8433;
  goldNodes["Dewstone Plains"]["Cinderstone Moor"]!.fellowshipValue = 15.0478;
  goldNodes["Dewstone Plains"]["Sanddeep"]!.goldValue = 11.2588;
  goldNodes["Dewstone Plains"]["Sanddeep"]!.gildaValue = 12.776;
  goldNodes["Dewstone Plains"]["Sanddeep"]!.fellowshipValue = 13.9679;
  goldNodes["Dewstone Plains"]["Freedich Island"]!.goldValue = 20.1822;
  goldNodes["Dewstone Plains"]["Freedich Island"]!.gildaValue = 22.72;
  goldNodes["Dewstone Plains"]["Freedich Island"]!.fellowshipValue = 20.7723;

  goldNodes["White Arden"]["Solzreed Peninsula"]!.goldValue = 9.3436;
  goldNodes["White Arden"]["Solzreed Peninsula"]!.gildaValue = 10.5687;
  goldNodes["White Arden"]["Solzreed Peninsula"]!.fellowshipValue = 10.3897;
  goldNodes["White Arden"]["Gweonid Forest"]!.goldValue = 8.5661;
  goldNodes["White Arden"]["Gweonid Forest"]!.gildaValue = 9.6725;
  goldNodes["White Arden"]["Gweonid Forest"]!.fellowshipValue = 9.575;
  goldNodes["White Arden"]["Dewstone Plains"]!.goldValue = 5.3665;
  goldNodes["White Arden"]["Dewstone Plains"]!.gildaValue = 5.9866;
  goldNodes["White Arden"]["Dewstone Plains"]!.fellowshipValue = 6.2232;
  goldNodes["White Arden"]["Marianople"]!.goldValue = 5.2212;
  goldNodes["White Arden"]["Marianople"]!.gildaValue = 5.8181;
  goldNodes["White Arden"]["Marianople"]!.fellowshipValue = 6.0709;
  goldNodes["White Arden"]["Two Crowns"]!.goldValue = 7.4876;
  goldNodes["White Arden"]["Two Crowns"]!.gildaValue = 8.4302;
  goldNodes["White Arden"]["Two Crowns"]!.fellowshipValue = 8.4452;
  goldNodes["White Arden"]["Cinderstone Moor"]!.goldValue = 10.6106;
  goldNodes["White Arden"]["Cinderstone Moor"]!.gildaValue = 12.031;
  goldNodes["White Arden"]["Cinderstone Moor"]!.fellowshipValue = 11.717;
  goldNodes["White Arden"]["Sanddeep"]!.goldValue = 9.9553;
  goldNodes["White Arden"]["Sanddeep"]!.gildaValue = 11.2749;
  goldNodes["White Arden"]["Sanddeep"]!.fellowshipValue = 11.0302;
  goldNodes["White Arden"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["White Arden"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["White Arden"]["Freedich Island"]!.fellowshipValue = 23.8377;

  goldNodes["Marianople"]["Solzreed Peninsula"]!.goldValue = 8.7582;
  goldNodes["Marianople"]["Solzreed Peninsula"]!.gildaValue = 9.8959;
  goldNodes["Marianople"]["Solzreed Peninsula"]!.fellowshipValue = 9.6983;
  goldNodes["Marianople"]["Gweonid Forest"]!.goldValue = 9.1211;
  goldNodes["Marianople"]["Gweonid Forest"]!.gildaValue = 10.3119;
  goldNodes["Marianople"]["Gweonid Forest"]!.fellowshipValue = 10.0785;
  goldNodes["Marianople"]["Dewstone Plains"]!.goldValue = 5.4635;
  goldNodes["Marianople"]["Dewstone Plains"]!.gildaValue = 6.0983;
  goldNodes["Marianople"]["Dewstone Plains"]!.fellowshipValue = 6.7059;
  goldNodes["Marianople"]["Two Crowns"]!.goldValue = 5.7213;
  goldNodes["Marianople"]["Two Crowns"]!.gildaValue = 6.3948;
  goldNodes["Marianople"]["Two Crowns"]!.fellowshipValue = 6.5948;
  goldNodes["Marianople"]["Cinderstone Moor"]!.goldValue = 5.7213;
  goldNodes["Marianople"]["Cinderstone Moor"]!.gildaValue = 9.763;
  goldNodes["Marianople"]["Cinderstone Moor"]!.fellowshipValue = 8.855;
  goldNodes["Marianople"]["Sanddeep"]!.goldValue = 7.8567;
  goldNodes["Marianople"]["Sanddeep"]!.gildaValue = 8.855;
  goldNodes["Marianople"]["Sanddeep"]!.fellowshipValue = 8.3377;
  goldNodes["Marianople"]["Freedich Island"]!.goldValue = 22.0584;
  goldNodes["Marianople"]["Freedich Island"]!.gildaValue = 24.8478;
  goldNodes["Marianople"]["Freedich Island"]!.fellowshipValue = 23.2921;

  goldNodes["Two Crowns"]["Solzreed Peninsula"]!.goldValue = 8.9634;
  goldNodes["Two Crowns"]["Solzreed Peninsula"]!.gildaValue = 10.1317;
  goldNodes["Two Crowns"]["Solzreed Peninsula"]!.fellowshipValue = 10.0573;
  goldNodes["Two Crowns"]["Gweonid Forest"]!.goldValue = 12.2979;
  goldNodes["Two Crowns"]["Gweonid Forest"]!.gildaValue = 13.9725;
  goldNodes["Two Crowns"]["Gweonid Forest"]!.fellowshipValue = 13.4844;
  goldNodes["Two Crowns"]["Dewstone Plains"]!.goldValue = 6.4722;
  goldNodes["Two Crowns"]["Dewstone Plains"]!.gildaValue = 7.2613;
  goldNodes["Two Crowns"]["Dewstone Plains"]!.fellowshipValue = 8.8849;
  goldNodes["Two Crowns"]["Marianople"]!.goldValue = 5.7213;
  goldNodes["Two Crowns"]["Marianople"]!.gildaValue = 6.3948;
  goldNodes["Two Crowns"]["Marianople"]!.fellowshipValue = 6.5948;
  goldNodes["Two Crowns"]["Cinderstone Moor"]!.goldValue = 5.9663;
  goldNodes["Two Crowns"]["Cinderstone Moor"]!.gildaValue = 6.6775;
  goldNodes["Two Crowns"]["Cinderstone Moor"]!.fellowshipValue = 9.9525;
  goldNodes["Two Crowns"]["Sanddeep"]!.goldValue = 8.8075;
  goldNodes["Two Crowns"]["Sanddeep"]!.gildaValue = 9.9525;
  goldNodes["Two Crowns"]["Sanddeep"]!.fellowshipValue = 9.3339;
  goldNodes["Two Crowns"]["Freedich Island"]!.goldValue = 20.5483;
  goldNodes["Two Crowns"]["Freedich Island"]!.gildaValue = 23.1361;
  goldNodes["Two Crowns"]["Freedich Island"]!.fellowshipValue = 23.2921;

  goldNodes["Cinderstone Moor"]["Solzreed Peninsula"]!.goldValue = 9.4483;
  goldNodes["Cinderstone Moor"]["Solzreed Peninsula"]!.gildaValue = 10.6891;
  goldNodes["Cinderstone Moor"][
    "Solzreed Peninsula"
  ]!.fellowshipValue = 14.8963;
  goldNodes["Cinderstone Moor"]["Gweonid Forest"]!.goldValue = 13.989;
  goldNodes["Cinderstone Moor"]["Gweonid Forest"]!.gildaValue = 15.9227;
  goldNodes["Cinderstone Moor"]["Gweonid Forest"]!.fellowshipValue = 17.3878;
  goldNodes["Cinderstone Moor"]["Dewstone Plains"]!.goldValue = 9.5804;
  goldNodes["Cinderstone Moor"]["Dewstone Plains"]!.gildaValue = 10.8433;
  goldNodes["Cinderstone Moor"]["Dewstone Plains"]!.fellowshipValue = 15.0478;
  goldNodes["Cinderstone Moor"]["Marianople"]!.goldValue = 5.7213;
  goldNodes["Cinderstone Moor"]["Marianople"]!.gildaValue = 9.763;
  goldNodes["Cinderstone Moor"]["Marianople"]!.fellowshipValue = 8.855;
  goldNodes["Cinderstone Moor"]["Two Crowns"]!.goldValue = 5.9663;
  goldNodes["Cinderstone Moor"]["Two Crowns"]!.gildaValue = 6.6775;
  goldNodes["Cinderstone Moor"]["Two Crowns"]!.fellowshipValue = 9.9525;
  goldNodes["Cinderstone Moor"]["Sanddeep"]!.goldValue = 10.5903;
  goldNodes["Cinderstone Moor"]["Sanddeep"]!.gildaValue = 12.7686;
  goldNodes["Cinderstone Moor"]["Sanddeep"]!.fellowshipValue = 11.8959;
  goldNodes["Cinderstone Moor"]["Freedich Island"]!.goldValue = 18.7595;
  goldNodes["Cinderstone Moor"]["Freedich Island"]!.gildaValue = 21.1069;
  goldNodes["Cinderstone Moor"]["Freedich Island"]!.fellowshipValue = 23.2921;

  goldNodes["Halcyona"]["Solzreed Peninsula"]!.goldValue = 12.5882;
  goldNodes["Halcyona"]["Solzreed Peninsula"]!.gildaValue = 14.309;
  goldNodes["Halcyona"]["Solzreed Peninsula"]!.fellowshipValue = 13.6195;
  goldNodes["Halcyona"]["Gweonid Forest"]!.goldValue = 12.6681;
  goldNodes["Halcyona"]["Gweonid Forest"]!.gildaValue = 14.4011;
  goldNodes["Halcyona"]["Gweonid Forest"]!.fellowshipValue = 13.7036;
  goldNodes["Halcyona"]["Dewstone Plains"]!.goldValue = 9.5746;
  goldNodes["Halcyona"]["Dewstone Plains"]!.gildaValue = 10.8343;
  goldNodes["Halcyona"]["Dewstone Plains"]!.fellowshipValue = 10.4627;
  goldNodes["Halcyona"]["Marianople"]!.goldValue = 6.1898;
  goldNodes["Halcyona"]["Marianople"]!.gildaValue = 6.936;
  goldNodes["Halcyona"]["Marianople"]!.fellowshipValue = 6.9167;
  goldNodes["Halcyona"]["Two Crowns"]!.goldValue = 8.0029;
  goldNodes["Halcyona"]["Two Crowns"]!.gildaValue = 9.0232;
  goldNodes["Halcyona"]["Two Crowns"]!.fellowshipValue = 8.816;
  goldNodes["Halcyona"]["Cinderstone Moor"]!.goldValue = 10.5903;
  goldNodes["Halcyona"]["Cinderstone Moor"]!.gildaValue = 12.0063;
  goldNodes["Halcyona"]["Cinderstone Moor"]!.fellowshipValue = 11.5267;
  goldNodes["Halcyona"]["Sanddeep"]!.goldValue = 8.5353;
  goldNodes["Halcyona"]["Sanddeep"]!.gildaValue = 9.6368;
  goldNodes["Halcyona"]["Sanddeep"]!.fellowshipValue = 9.3737;
  goldNodes["Halcyona"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["Halcyona"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["Halcyona"]["Freedich Island"]!.fellowshipValue = 24.531;

  goldNodes["Hellswamp"]["Solzreed Peninsula"]!.goldValue = 16.2172;
  goldNodes["Hellswamp"]["Solzreed Peninsula"]!.gildaValue = 18.4913;
  goldNodes["Hellswamp"]["Solzreed Peninsula"]!.fellowshipValue = 17.7076;
  goldNodes["Hellswamp"]["Gweonid Forest"]!.goldValue = 17.914;
  goldNodes["Hellswamp"]["Gweonid Forest"]!.gildaValue = 20.4465;
  goldNodes["Hellswamp"]["Gweonid Forest"]!.fellowshipValue = 19.4852;
  goldNodes["Hellswamp"]["Dewstone Plains"]!.goldValue = 12.9446;
  goldNodes["Hellswamp"]["Dewstone Plains"]!.gildaValue = 14.7183;
  goldNodes["Hellswamp"]["Dewstone Plains"]!.fellowshipValue = 14.2791;
  goldNodes["Hellswamp"]["Marianople"]!.goldValue = 9.0672;
  goldNodes["Hellswamp"]["Marianople"]!.gildaValue = 10.2506;
  goldNodes["Hellswamp"]["Marianople"]!.fellowshipValue = 10.2171;
  goldNodes["Hellswamp"]["Two Crowns"]!.goldValue = 10.9418;
  goldNodes["Hellswamp"]["Two Crowns"]!.gildaValue = 12.4099;
  goldNodes["Hellswamp"]["Two Crowns"]!.fellowshipValue = 12.1807;
  goldNodes["Hellswamp"]["Cinderstone Moor"]!.goldValue = 13.8997;
  goldNodes["Hellswamp"]["Cinderstone Moor"]!.gildaValue = 15.82;
  goldNodes["Hellswamp"]["Cinderstone Moor"]!.fellowshipValue = 15.2797;
  goldNodes["Hellswamp"]["Sanddeep"]!.goldValue = 6.8233;
  goldNodes["Hellswamp"]["Sanddeep"]!.gildaValue = 7.6655;
  goldNodes["Hellswamp"]["Sanddeep"]!.fellowshipValue = 7.8663;
  goldNodes["Hellswamp"]["Freedich Island"]!.goldValue = 20.644;
  goldNodes["Hellswamp"]["Freedich Island"]!.gildaValue = 23.2433;
  goldNodes["Hellswamp"]["Freedich Island"]!.fellowshipValue = 23.2254;

  goldNodes["Sanddeep"]["Solzreed Peninsula"]!.goldValue = 13.0981;
  goldNodes["Sanddeep"]["Solzreed Peninsula"]!.gildaValue = 14.8963;
  goldNodes["Sanddeep"]["Solzreed Peninsula"]!.fellowshipValue = 13.829;
  goldNodes["Sanddeep"]["Gweonid Forest"]!.goldValue = 15.2593;
  goldNodes["Sanddeep"]["Gweonid Forest"]!.gildaValue = 17.3878;
  goldNodes["Sanddeep"]["Gweonid Forest"]!.fellowshipValue = 16.0927;
  goldNodes["Sanddeep"]["Dewstone Plains"]!.goldValue = 11.2588;
  goldNodes["Sanddeep"]["Dewstone Plains"]!.gildaValue = 12.776;
  goldNodes["Sanddeep"]["Dewstone Plains"]!.fellowshipValue = 13.9679;
  goldNodes["Sanddeep"]["Marianople"]!.goldValue = 7.8567;
  goldNodes["Sanddeep"]["Marianople"]!.gildaValue = 8.855;
  goldNodes["Sanddeep"]["Marianople"]!.fellowshipValue = 8.3377;
  goldNodes["Sanddeep"]["Two Crowns"]!.goldValue = 8.8075;
  goldNodes["Sanddeep"]["Two Crowns"]!.gildaValue = 9.9525;
  goldNodes["Sanddeep"]["Two Crowns"]!.fellowshipValue = 9.3339;
  goldNodes["Sanddeep"]["Cinderstone Moor"]!.goldValue = 11.2529;
  goldNodes["Sanddeep"]["Cinderstone Moor"]!.gildaValue = 12.7686;
  goldNodes["Sanddeep"]["Cinderstone Moor"]!.fellowshipValue = 11.8959;
  goldNodes["Sanddeep"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["Sanddeep"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["Sanddeep"]["Freedich Island"]!.fellowshipValue = 24.206;

  goldNodes["Karkasse Ridgelands"]["Solzreed Peninsula"]!.goldValue = 14.6994;
  goldNodes["Karkasse Ridgelands"]["Solzreed Peninsula"]!.gildaValue = 16.7411;
  goldNodes["Karkasse Ridgelands"][
    "Solzreed Peninsula"
  ]!.fellowshipValue = 15.3374;
  goldNodes["Karkasse Ridgelands"]["Gweonid Forest"]!.goldValue = 8.4564;
  goldNodes["Karkasse Ridgelands"]["Gweonid Forest"]!.gildaValue = 9.54;
  goldNodes["Karkasse Ridgelands"]["Gweonid Forest"]!.fellowshipValue = 8.7971;
  goldNodes["Karkasse Ridgelands"]["Dewstone Plains"]!.goldValue = 11.0434;
  goldNodes["Karkasse Ridgelands"]["Dewstone Plains"]!.gildaValue = 12.52;
  goldNodes["Karkasse Ridgelands"][
    "Dewstone Plains"
  ]!.fellowshipValue = 11.5073;
  goldNodes["Karkasse Ridgelands"]["Marianople"]!.goldValue = 12.4297;
  goldNodes["Karkasse Ridgelands"]["Marianople"]!.gildaValue = 10.7;
  goldNodes["Karkasse Ridgelands"]["Marianople"]!.fellowshipValue = 9.8508;
  goldNodes["Karkasse Ridgelands"]["Two Crowns"]!.goldValue = 12.4297;
  goldNodes["Karkasse Ridgelands"]["Two Crowns"]!.gildaValue = 14.1257;
  goldNodes["Karkasse Ridgelands"]["Two Crowns"]!.fellowshipValue = 12.9597;
  goldNodes["Karkasse Ridgelands"]["Cinderstone Moor"]!.goldValue = 15.9788;
  goldNodes["Karkasse Ridgelands"]["Cinderstone Moor"]!.gildaValue = 18.21;
  goldNodes["Karkasse Ridgelands"][
    "Cinderstone Moor"
  ]!.fellowshipValue = 16.6777;
  goldNodes["Karkasse Ridgelands"]["Sanddeep"]!.goldValue = 18.7186;
  goldNodes["Karkasse Ridgelands"]["Sanddeep"]!.gildaValue = 21.371;
  goldNodes["Karkasse Ridgelands"]["Sanddeep"]!.fellowshipValue = 19.5477;
  goldNodes["Karkasse Ridgelands"]["Freedich Island"]!.goldValue = 26.26;
  goldNodes["Karkasse Ridgelands"]["Freedich Island"]!.gildaValue = 29.61;
  goldNodes["Karkasse Ridgelands"][
    "Freedich Island"
  ]!.fellowshipValue = 28.5844;

  goldNodes["Airain Rock"]["Solzreed Peninsula"]!.goldValue = 13.7433;
  goldNodes["Airain Rock"]["Solzreed Peninsula"]!.gildaValue = 15.6386;
  goldNodes["Airain Rock"]["Solzreed Peninsula"]!.fellowshipValue = 14.3356;
  goldNodes["Airain Rock"]["Gweonid Forest"]!.goldValue = 13.3219;
  goldNodes["Airain Rock"]["Gweonid Forest"]!.gildaValue = 15.1548;
  goldNodes["Airain Rock"]["Gweonid Forest"]!.fellowshipValue = 13.8943;
  goldNodes["Airain Rock"]["Dewstone Plains"]!.goldValue = 9.5255;
  goldNodes["Airain Rock"]["Dewstone Plains"]!.gildaValue = 10.78;
  goldNodes["Airain Rock"]["Dewstone Plains"]!.fellowshipValue = 9.9172;
  goldNodes["Airain Rock"]["Marianople"]!.goldValue = 9.1789;
  goldNodes["Airain Rock"]["Marianople"]!.gildaValue = 10.38;
  goldNodes["Airain Rock"]["Marianople"]!.fellowshipValue = 9.5541;
  goldNodes["Airain Rock"]["Two Crowns"]!.goldValue = 12.2607;
  goldNodes["Airain Rock"]["Two Crowns"]!.gildaValue = 13.9318;
  goldNodes["Airain Rock"]["Two Crowns"]!.fellowshipValue = 12.7826;
  goldNodes["Airain Rock"]["Cinderstone Moor"]!.goldValue = 16.2578;
  goldNodes["Airain Rock"]["Cinderstone Moor"]!.gildaValue = 18.5389;
  goldNodes["Airain Rock"]["Cinderstone Moor"]!.fellowshipValue = 16.9701;
  goldNodes["Airain Rock"]["Sanddeep"]!.goldValue = 14.8797;
  goldNodes["Airain Rock"]["Sanddeep"]!.gildaValue = 16.9498;
  goldNodes["Airain Rock"]["Sanddeep"]!.fellowshipValue = 15.526;
  goldNodes["Airain Rock"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["Airain Rock"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["Airain Rock"]["Freedich Island"]!.fellowshipValue = 24.037;

  goldNodes["Aubre Cradle"]["Solzreed Peninsula"]!.goldValue = 10.973;
  goldNodes["Aubre Cradle"]["Solzreed Peninsula"]!.gildaValue = 12.44;
  goldNodes["Aubre Cradle"]["Solzreed Peninsula"]!.fellowshipValue = 11.4334;
  goldNodes["Aubre Cradle"]["Gweonid Forest"]!.goldValue = 11.813;
  goldNodes["Aubre Cradle"]["Gweonid Forest"]!.gildaValue = 12.2346;
  goldNodes["Aubre Cradle"]["Gweonid Forest"]!.fellowshipValue = 11.2407;
  goldNodes["Aubre Cradle"]["Dewstone Plains"]!.goldValue = 7.2985;
  goldNodes["Aubre Cradle"]["Dewstone Plains"]!.gildaValue = 8.2134;
  goldNodes["Aubre Cradle"]["Dewstone Plains"]!.fellowshipValue = 7.5841;
  goldNodes["Aubre Cradle"]["Marianople"]!.goldValue = 6.9492;
  goldNodes["Aubre Cradle"]["Marianople"]!.gildaValue = 7.8101;
  goldNodes["Aubre Cradle"]["Marianople"]!.fellowshipValue = 7.2181;
  goldNodes["Aubre Cradle"]["Two Crowns"]!.goldValue = 9.6385;
  goldNodes["Aubre Cradle"]["Two Crowns"]!.gildaValue = 10.9091;
  goldNodes["Aubre Cradle"]["Two Crowns"]!.fellowshipValue = 10.0356;
  goldNodes["Aubre Cradle"]["Cinderstone Moor"]!.goldValue = 13.1251;
  goldNodes["Aubre Cradle"]["Cinderstone Moor"]!.gildaValue = 14.928;
  goldNodes["Aubre Cradle"]["Cinderstone Moor"]!.fellowshipValue = 13.6882;
  goldNodes["Aubre Cradle"]["Sanddeep"]!.goldValue = 12.3155;
  goldNodes["Aubre Cradle"]["Sanddeep"]!.gildaValue = 13.9939;
  goldNodes["Aubre Cradle"]["Sanddeep"]!.fellowshipValue = 12.8401;
  goldNodes["Aubre Cradle"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["Aubre Cradle"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["Aubre Cradle"]["Freedich Island"]!.fellowshipValue = 24.037;

  goldNodes["Ahnimar"]["Solzreed Peninsula"]!.goldValue = 19.77;
  goldNodes["Ahnimar"]["Solzreed Peninsula"]!.gildaValue = 22.58;
  goldNodes["Ahnimar"]["Solzreed Peninsula"]!.fellowshipValue = 20.6492;
  goldNodes["Ahnimar"]["Gweonid Forest"]!.goldValue = 19.7787;
  goldNodes["Ahnimar"]["Gweonid Forest"]!.gildaValue = 22.59;
  goldNodes["Ahnimar"]["Gweonid Forest"]!.fellowshipValue = 20.6587;
  goldNodes["Ahnimar"]["Dewstone Plains"]!.goldValue = 14.6043;
  goldNodes["Ahnimar"]["Dewstone Plains"]!.gildaValue = 16.63;
  goldNodes["Ahnimar"]["Dewstone Plains"]!.fellowshipValue = 15.2378;
  goldNodes["Ahnimar"]["Marianople"]!.gildaValue = 11.6697;
  goldNodes["Ahnimar"]["Marianople"]!.gildaValue = 13.24;
  goldNodes["Ahnimar"]["Marianople"]!.fellowshipValue = 12.1634;
  goldNodes["Ahnimar"]["Two Crowns"]!.goldValue = 14.2936;
  goldNodes["Ahnimar"]["Two Crowns"]!.gildaValue = 16.27;
  goldNodes["Ahnimar"]["Two Crowns"]!.fellowshipValue = 14.912;
  goldNodes["Ahnimar"]["Cinderstone Moor"]!.goldValue = 17.8173;
  goldNodes["Ahnimar"]["Cinderstone Moor"]!.gildaValue = 20.33;
  goldNodes["Ahnimar"]["Cinderstone Moor"]!.fellowshipValue = 18.6038;
  goldNodes["Ahnimar"]["Sanddeep"]!.goldValue = 9.3059;
  goldNodes["Ahnimar"]["Sanddeep"]!.gildaValue = 10.52;
  goldNodes["Ahnimar"]["Sanddeep"]!.fellowshipValue = 9.6872;
  goldNodes["Ahnimar"]["Freedich Island"]!.goldValue = 22.1;
  goldNodes["Ahnimar"]["Freedich Island"]!.gildaValue = 24.895;
  goldNodes["Ahnimar"]["Freedich Island"]!.fellowshipValue = 24.037;
}

function generateNuiaGGFGildaValues() {
  gildaNodes["Solzreed Peninsula"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Solzreed Peninsula"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Solzreed Peninsula"]["Ynystere"]!.fellowshipValue = 2;
  gildaNodes["Solzreed Peninsula"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Solzreed Peninsula"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Solzreed Peninsula"]["Villanelle"]!.fellowshipValue = 1;
  gildaNodes["Solzreed Peninsula"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Solzreed Peninsula"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Solzreed Peninsula"]["Solis Headlands"]!.fellowshipValue = 1;
  gildaNodes["Solzreed Peninsula"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Solzreed Peninsula"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Solzreed Peninsula"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Gweonid Forest"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Gweonid Forest"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Gweonid Forest"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Gweonid Forest"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Gweonid Forest"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Gweonid Forest"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Gweonid Forest"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Gweonid Forest"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Gweonid Forest"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Gweonid Forest"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Gweonid Forest"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Gweonid Forest"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Lilyut Hills"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Lilyut Hills"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Lilyut Hills"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Lilyut Hills"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Lilyut Hills"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Lilyut Hills"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Lilyut Hills"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Lilyut Hills"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Lilyut Hills"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Lilyut Hills"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Lilyut Hills"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Lilyut Hills"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Dewstone Plains"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Dewstone Plains"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Dewstone Plains"]["Ynystere"]!.fellowshipValue = 2;
  gildaNodes["Dewstone Plains"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Dewstone Plains"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Dewstone Plains"]["Villanelle"]!.fellowshipValue = 1;
  gildaNodes["Dewstone Plains"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Dewstone Plains"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Dewstone Plains"]["Solis Headlands"]!.fellowshipValue = 1;
  gildaNodes["Dewstone Plains"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Dewstone Plains"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Dewstone Plains"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["White Arden"]["Ynystere"]!.goldValue = 2;
  gildaNodes["White Arden"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["White Arden"]["Ynystere"]!.fellowshipValue = 2;
  gildaNodes["White Arden"]["Villanelle"]!.goldValue = 1;
  gildaNodes["White Arden"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["White Arden"]["Villanelle"]!.fellowshipValue = 1;
  gildaNodes["White Arden"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["White Arden"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["White Arden"]["Solis Headlands"]!.fellowshipValue = 1;
  gildaNodes["White Arden"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["White Arden"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["White Arden"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Marianople"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Marianople"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Marianople"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Marianople"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Marianople"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Marianople"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Marianople"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Marianople"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Marianople"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Marianople"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Marianople"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Marianople"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Two Crowns"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Two Crowns"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Two Crowns"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Two Crowns"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Two Crowns"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Two Crowns"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Two Crowns"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Two Crowns"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Two Crowns"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Two Crowns"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Two Crowns"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Two Crowns"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Cinderstone Moor"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Cinderstone Moor"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Cinderstone Moor"]["Ynystere"]!.fellowshipValue = 2;
  gildaNodes["Cinderstone Moor"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Cinderstone Moor"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Cinderstone Moor"]["Villanelle"]!.fellowshipValue = 1;
  gildaNodes["Cinderstone Moor"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Cinderstone Moor"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Cinderstone Moor"]["Solis Headlands"]!.fellowshipValue = 1;
  gildaNodes["Cinderstone Moor"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Cinderstone Moor"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Cinderstone Moor"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Halcyona"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Halcyona"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Halcyona"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Halcyona"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Halcyona"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Halcyona"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Halcyona"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Halcyona"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Halcyona"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Halcyona"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Halcyona"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Halcyona"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Hellswamp"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Hellswamp"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Hellswamp"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Hellswamp"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Hellswamp"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Hellswamp"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Hellswamp"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Hellswamp"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Hellswamp"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Hellswamp"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Hellswamp"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Hellswamp"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Sanddeep"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Sanddeep"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Sanddeep"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Sanddeep"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Sanddeep"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Sanddeep"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Sanddeep"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Sanddeep"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Sanddeep"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Sanddeep"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Sanddeep"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Sanddeep"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Karkasse Ridgelands"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Karkasse Ridgelands"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Karkasse Ridgelands"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Karkasse Ridgelands"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Karkasse Ridgelands"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Karkasse Ridgelands"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Karkasse Ridgelands"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Karkasse Ridgelands"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Airain Rock"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Airain Rock"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Airain Rock"]["Ynystere"]!.fellowshipValue = 2;
  gildaNodes["Airain Rock"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Airain Rock"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Airain Rock"]["Villanelle"]!.fellowshipValue = 1;
  gildaNodes["Airain Rock"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Airain Rock"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Airain Rock"]["Solis Headlands"]!.fellowshipValue = 1;
  gildaNodes["Airain Rock"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Airain Rock"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Airain Rock"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Aubre Cradle"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Aubre Cradle"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Aubre Cradle"]["Ynystere"]!.fellowshipValue = 2;
  gildaNodes["Aubre Cradle"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Aubre Cradle"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Aubre Cradle"]["Villanelle"]!.fellowshipValue = 1;
  gildaNodes["Aubre Cradle"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Aubre Cradle"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Aubre Cradle"]["Solis Headlands"]!.fellowshipValue = 1;
  gildaNodes["Aubre Cradle"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Aubre Cradle"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Aubre Cradle"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Ahnimar"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Ahnimar"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Ahnimar"]["Ynystere"]!.fellowshipValue = 2;
  gildaNodes["Ahnimar"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Ahnimar"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Ahnimar"]["Villanelle"]!.fellowshipValue = 1;
  gildaNodes["Ahnimar"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Ahnimar"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Ahnimar"]["Solis Headlands"]!.fellowshipValue = 1;
  gildaNodes["Ahnimar"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Ahnimar"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Ahnimar"]["Freedich Island"]!.fellowshipValue = 4;
}

function generateNuiaGGFStabValues() {
  gildaNodes["Solzreed Peninsula"]["Ynystere"]!.goldValue = 14;
  gildaNodes["Solzreed Peninsula"]["Ynystere"]!.gildaValue = 15;
  gildaNodes["Solzreed Peninsula"]["Ynystere"]!.fellowshipValue = 4;
  gildaNodes["Solzreed Peninsula"]["Villanelle"]!.goldValue = 15;
  gildaNodes["Solzreed Peninsula"]["Villanelle"]!.gildaValue = 16;
  gildaNodes["Solzreed Peninsula"]["Villanelle"]!.fellowshipValue = 8;
  gildaNodes["Solzreed Peninsula"]["Solis Headlands"]!.goldValue = 13;
  gildaNodes["Solzreed Peninsula"]["Solis Headlands"]!.gildaValue = 14;
  gildaNodes["Solzreed Peninsula"]["Solis Headlands"]!.fellowshipValue = 11;
  gildaNodes["Solzreed Peninsula"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Solzreed Peninsula"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Solzreed Peninsula"]["Freedich Island"]!.fellowshipValue = 1;

  gildaNodes["Gweonid Forest"]["Ynystere"]!.goldValue = 20;
  gildaNodes["Gweonid Forest"]["Ynystere"]!.gildaValue = 22;
  gildaNodes["Gweonid Forest"]["Ynystere"]!.fellowshipValue = 21;
  gildaNodes["Gweonid Forest"]["Villanelle"]!.goldValue = 21;
  gildaNodes["Gweonid Forest"]["Villanelle"]!.gildaValue = 23;
  gildaNodes["Gweonid Forest"]["Villanelle"]!.fellowshipValue = 22;
  gildaNodes["Gweonid Forest"]["Solis Headlands"]!.goldValue = 20;
  gildaNodes["Gweonid Forest"]["Solis Headlands"]!.gildaValue = 21;
  gildaNodes["Gweonid Forest"]["Solis Headlands"]!.fellowshipValue = 21;
  gildaNodes["Gweonid Forest"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Gweonid Forest"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Gweonid Forest"]["Freedich Island"]!.fellowshipValue = 2;

  gildaNodes["Lilyut Hills"]["Ynystere"]!.goldValue = 17;
  gildaNodes["Lilyut Hills"]["Ynystere"]!.gildaValue = 19;
  gildaNodes["Lilyut Hills"]["Ynystere"]!.fellowshipValue = 18;
  gildaNodes["Lilyut Hills"]["Villanelle"]!.goldValue = 19;
  gildaNodes["Lilyut Hills"]["Villanelle"]!.gildaValue = 20;
  gildaNodes["Lilyut Hills"]["Villanelle"]!.fellowshipValue = 19;
  gildaNodes["Lilyut Hills"]["Solis Headlands"]!.goldValue = 18;
  gildaNodes["Lilyut Hills"]["Solis Headlands"]!.gildaValue = 19;
  gildaNodes["Lilyut Hills"]["Solis Headlands"]!.fellowshipValue = 18;
  gildaNodes["Lilyut Hills"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Lilyut Hills"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Lilyut Hills"]["Freedich Island"]!.fellowshipValue = 2;

  gildaNodes["Dewstone Plains"]["Ynystere"]!.goldValue = 18;
  gildaNodes["Dewstone Plains"]["Ynystere"]!.gildaValue = 20;
  gildaNodes["Dewstone Plains"]["Ynystere"]!.fellowshipValue = 19;
  gildaNodes["Dewstone Plains"]["Villanelle"]!.goldValue = 18;
  gildaNodes["Dewstone Plains"]["Villanelle"]!.gildaValue = 20;
  gildaNodes["Dewstone Plains"]["Villanelle"]!.fellowshipValue = 19;
  gildaNodes["Dewstone Plains"]["Solis Headlands"]!.goldValue = 16;
  gildaNodes["Dewstone Plains"]["Solis Headlands"]!.gildaValue = 17;
  gildaNodes["Dewstone Plains"]["Solis Headlands"]!.fellowshipValue = 16;
  gildaNodes["Dewstone Plains"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Dewstone Plains"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Dewstone Plains"]["Freedich Island"]!.fellowshipValue = 1;

  gildaNodes["White Arden"]["Ynystere"]!.goldValue = 20;
  gildaNodes["White Arden"]["Ynystere"]!.gildaValue = 21;
  gildaNodes["White Arden"]["Ynystere"]!.fellowshipValue = 21;
  gildaNodes["White Arden"]["Villanelle"]!.goldValue = 20;
  gildaNodes["White Arden"]["Villanelle"]!.gildaValue = 22;
  gildaNodes["White Arden"]["Villanelle"]!.fellowshipValue = 21;
  gildaNodes["White Arden"]["Solis Headlands"]!.goldValue = 17;
  gildaNodes["White Arden"]["Solis Headlands"]!.gildaValue = 18;
  gildaNodes["White Arden"]["Solis Headlands"]!.fellowshipValue = 16;
  gildaNodes["White Arden"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["White Arden"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["White Arden"]["Freedich Island"]!.fellowshipValue = 2;

  gildaNodes["Marianople"]["Ynystere"]!.goldValue = 19;
  gildaNodes["Marianople"]["Ynystere"]!.gildaValue = 20;
  gildaNodes["Marianople"]["Ynystere"]!.fellowshipValue = 20;
  gildaNodes["Marianople"]["Villanelle"]!.goldValue = 19;
  gildaNodes["Marianople"]["Villanelle"]!.gildaValue = 20;
  gildaNodes["Marianople"]["Villanelle"]!.fellowshipValue = 20;
  gildaNodes["Marianople"]["Solis Headlands"]!.goldValue = 15;
  gildaNodes["Marianople"]["Solis Headlands"]!.gildaValue = 16;
  gildaNodes["Marianople"]["Solis Headlands"]!.fellowshipValue = 16;
  gildaNodes["Marianople"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Marianople"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Marianople"]["Freedich Island"]!.fellowshipValue = 2;

  gildaNodes["Two Crowns"]["Ynystere"]!.goldValue = 16;
  gildaNodes["Two Crowns"]["Ynystere"]!.gildaValue = 17;
  gildaNodes["Two Crowns"]["Ynystere"]!.fellowshipValue = 17;
  gildaNodes["Two Crowns"]["Villanelle"]!.goldValue = 15;
  gildaNodes["Two Crowns"]["Villanelle"]!.gildaValue = 17;
  gildaNodes["Two Crowns"]["Villanelle"]!.fellowshipValue = 17;
  gildaNodes["Two Crowns"]["Solis Headlands"]!.goldValue = 11;
  gildaNodes["Two Crowns"]["Solis Headlands"]!.gildaValue = 11;
  gildaNodes["Two Crowns"]["Solis Headlands"]!.fellowshipValue = 16;
  gildaNodes["Two Crowns"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Two Crowns"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Two Crowns"]["Freedich Island"]!.fellowshipValue = 2;

  gildaNodes["Cinderstone Moor"]["Ynystere"]!.goldValue = 14;
  gildaNodes["Cinderstone Moor"]["Ynystere"]!.gildaValue = 15;
  gildaNodes["Cinderstone Moor"]["Ynystere"]!.fellowshipValue = 22;
  gildaNodes["Cinderstone Moor"]["Villanelle"]!.goldValue = 14;
  gildaNodes["Cinderstone Moor"]["Villanelle"]!.gildaValue = 15;
  gildaNodes["Cinderstone Moor"]["Villanelle"]!.fellowshipValue = 21;
  gildaNodes["Cinderstone Moor"]["Solis Headlands"]!.goldValue = 10;
  gildaNodes["Cinderstone Moor"]["Solis Headlands"]!.gildaValue = 11;
  gildaNodes["Cinderstone Moor"]["Solis Headlands"]!.fellowshipValue = 16;
  gildaNodes["Cinderstone Moor"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Cinderstone Moor"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Cinderstone Moor"]["Freedich Island"]!.fellowshipValue = 1;

  gildaNodes["Halcyona"]["Ynystere"]!.goldValue = 21;
  gildaNodes["Halcyona"]["Ynystere"]!.gildaValue = 23;
  gildaNodes["Halcyona"]["Ynystere"]!.fellowshipValue = 22;
  gildaNodes["Halcyona"]["Villanelle"]!.goldValue = 21;
  gildaNodes["Halcyona"]["Villanelle"]!.gildaValue = 22;
  gildaNodes["Halcyona"]["Villanelle"]!.fellowshipValue = 22;
  gildaNodes["Halcyona"]["Solis Headlands"]!.goldValue = 16;
  gildaNodes["Halcyona"]["Solis Headlands"]!.gildaValue = 17;
  gildaNodes["Halcyona"]["Solis Headlands"]!.fellowshipValue = 17;
  gildaNodes["Halcyona"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Halcyona"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Halcyona"]["Freedich Island"]!.fellowshipValue = 2;

  gildaNodes["Hellswamp"]["Ynystere"]!.goldValue = 24;
  gildaNodes["Hellswamp"]["Ynystere"]!.gildaValue = 26;
  gildaNodes["Hellswamp"]["Ynystere"]!.fellowshipValue = 21;
  gildaNodes["Hellswamp"]["Villanelle"]!.goldValue = 23;
  gildaNodes["Hellswamp"]["Villanelle"]!.gildaValue = 25;
  gildaNodes["Hellswamp"]["Villanelle"]!.fellowshipValue = 20;
  gildaNodes["Hellswamp"]["Solis Headlands"]!.goldValue = 19;
  gildaNodes["Hellswamp"]["Solis Headlands"]!.gildaValue = 20;
  gildaNodes["Hellswamp"]["Solis Headlands"]!.fellowshipValue = 20;
  gildaNodes["Hellswamp"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Hellswamp"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Hellswamp"]["Freedich Island"]!.fellowshipValue = 2;

  gildaNodes["Sanddeep"]["Ynystere"]!.goldValue = 21;
  gildaNodes["Sanddeep"]["Ynystere"]!.gildaValue = 22;
  gildaNodes["Sanddeep"]["Ynystere"]!.fellowshipValue = 21;
  gildaNodes["Sanddeep"]["Villanelle"]!.goldValue = 20;
  gildaNodes["Sanddeep"]["Villanelle"]!.gildaValue = 21;
  gildaNodes["Sanddeep"]["Villanelle"]!.fellowshipValue = 20;
  gildaNodes["Sanddeep"]["Solis Headlands"]!.goldValue = 15;
  gildaNodes["Sanddeep"]["Solis Headlands"]!.gildaValue = 16;
  gildaNodes["Sanddeep"]["Solis Headlands"]!.fellowshipValue = 16;
  gildaNodes["Sanddeep"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Sanddeep"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Sanddeep"]["Freedich Island"]!.fellowshipValue = 2;

  gildaNodes["Karkasse Ridgelands"]["Ynystere"]!.goldValue = 42;
  gildaNodes["Karkasse Ridgelands"]["Ynystere"]!.gildaValue = 45;
  gildaNodes["Karkasse Ridgelands"]["Ynystere"]!.fellowshipValue = 43;
  gildaNodes["Karkasse Ridgelands"]["Villanelle"]!.goldValue = 43;
  gildaNodes["Karkasse Ridgelands"]["Villanelle"]!.gildaValue = 47;
  gildaNodes["Karkasse Ridgelands"]["Villanelle"]!.fellowshipValue = 45;
  gildaNodes["Karkasse Ridgelands"]["Solis Headlands"]!.goldValue = 40;
  gildaNodes["Karkasse Ridgelands"]["Solis Headlands"]!.gildaValue = 44;
  gildaNodes["Karkasse Ridgelands"]["Solis Headlands"]!.fellowshipValue = 42;
  gildaNodes["Karkasse Ridgelands"]["Freedich Island"]!.goldValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Freedich Island"]!.gildaValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Freedich Island"]!.fellowshipValue = 2;

  gildaNodes["Airain Rock"]["Ynystere"]!.goldValue = 25;
  gildaNodes["Airain Rock"]["Ynystere"]!.gildaValue = 27;
  gildaNodes["Airain Rock"]["Ynystere"]!.fellowshipValue = 25;
  gildaNodes["Airain Rock"]["Villanelle"]!.goldValue = 25;
  gildaNodes["Airain Rock"]["Villanelle"]!.gildaValue = 27;
  gildaNodes["Airain Rock"]["Villanelle"]!.fellowshipValue = 26;
  gildaNodes["Airain Rock"]["Solis Headlands"]!.goldValue = 21;
  gildaNodes["Airain Rock"]["Solis Headlands"]!.gildaValue = 23;
  gildaNodes["Airain Rock"]["Solis Headlands"]!.fellowshipValue = 22;
  gildaNodes["Airain Rock"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Airain Rock"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Airain Rock"]["Freedich Island"]!.fellowshipValue = 1;

  gildaNodes["Aubre Cradle"]["Ynystere"]!.goldValue = 22;
  gildaNodes["Aubre Cradle"]["Ynystere"]!.gildaValue = 24;
  gildaNodes["Aubre Cradle"]["Ynystere"]!.fellowshipValue = 23;
  gildaNodes["Aubre Cradle"]["Villanelle"]!.goldValue = 22;
  gildaNodes["Aubre Cradle"]["Villanelle"]!.gildaValue = 24;
  gildaNodes["Aubre Cradle"]["Villanelle"]!.fellowshipValue = 23;
  gildaNodes["Aubre Cradle"]["Solis Headlands"]!.goldValue = 19;
  gildaNodes["Aubre Cradle"]["Solis Headlands"]!.gildaValue = 20;
  gildaNodes["Aubre Cradle"]["Solis Headlands"]!.fellowshipValue = 19;
  gildaNodes["Aubre Cradle"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Aubre Cradle"]["Freedich Island"]!.gildaValue = 1;
  gildaNodes["Aubre Cradle"]["Freedich Island"]!.fellowshipValue = 1;

  gildaNodes["Ahnimar"]["Ynystere"]!.goldValue = 26;
  gildaNodes["Ahnimar"]["Ynystere"]!.gildaValue = 28;
  gildaNodes["Ahnimar"]["Ynystere"]!.fellowshipValue = 27;
  gildaNodes["Ahnimar"]["Villanelle"]!.goldValue = 26;
  gildaNodes["Ahnimar"]["Villanelle"]!.gildaValue = 28;
  gildaNodes["Ahnimar"]["Villanelle"]!.fellowshipValue = 27;
  gildaNodes["Ahnimar"]["Solis Headlands"]!.goldValue = 21;
  gildaNodes["Ahnimar"]["Solis Headlands"]!.gildaValue = 23;
  gildaNodes["Ahnimar"]["Solis Headlands"]!.fellowshipValue = 22;
  gildaNodes["Ahnimar"]["Freedich Island"]!.goldValue = 1;
  gildaNodes["Ahnimar"]["Freedich Island"]!.gildaValue = 2;
  gildaNodes["Ahnimar"]["Freedich Island"]!.fellowshipValue = 1;
}

function generateNuiaFHCGoldValues() {
  goldNodes["Solzreed Peninsula"]["Gweonid Forest"]!.fertValue = 9.9154;
  goldNodes["Solzreed Peninsula"]["Gweonid Forest"]!.honeyValue = 15.172;
  goldNodes["Solzreed Peninsula"]["Gweonid Forest"]!.cheeseValue = 14.8073;
  goldNodes["Solzreed Peninsula"]["Dewstone Plains"]!.fertValue = 7.796;
  goldNodes["Solzreed Peninsula"]["Dewstone Plains"]!.honeyValue = 11.7594;
  goldNodes["Solzreed Peninsula"]["Dewstone Plains"]!.cheeseValue = 11.4842;
  goldNodes["Solzreed Peninsula"]["Marianople"]!.fertValue = 9.6814;
  goldNodes["Solzreed Peninsula"]["Marianople"]!.honeyValue = 14.7956;
  goldNodes["Solzreed Peninsula"]["Marianople"]!.cheeseValue = 14.4407;
  goldNodes["Solzreed Peninsula"]["Two Crowns"]!.fertValue = 9.9121;
  goldNodes["Solzreed Peninsula"]["Two Crowns"]!.honeyValue = 15.2812;
  goldNodes["Solzreed Peninsula"]["Two Crowns"]!.cheeseValue = 14.8022;
  goldNodes["Solzreed Peninsula"]["Cinderstone Moor"]!.fertValue = 10.4571;
  goldNodes["Solzreed Peninsula"]["Cinderstone Moor"]!.honeyValue = 16.0442;
  goldNodes["Solzreed Peninsula"]["Cinderstone Moor"]!.cheeseValue = 15.6564;
  goldNodes["Solzreed Peninsula"]["Sanddeep"]!.fertValue = 14.5588;
  goldNodes["Solzreed Peninsula"]["Sanddeep"]!.honeyValue = 22.6491;
  goldNodes["Solzreed Peninsula"]["Sanddeep"]!.cheeseValue = 22.0873;
  goldNodes["Solzreed Peninsula"]["Freedich Island"]!.fertValue = 17.9894;
  goldNodes["Solzreed Peninsula"]["Freedich Island"]!.honeyValue = 28.9567;
  goldNodes["Solzreed Peninsula"]["Freedich Island"]!.cheeseValue = 28.9567;

  goldNodes["Gweonid Forest"]["Solzreed Peninsula"]!.fertValue = 9.9154;
  goldNodes["Gweonid Forest"]["Solzreed Peninsula"]!.honeyValue = 15.172;
  goldNodes["Gweonid Forest"]["Solzreed Peninsula"]!.cheeseValue = 14.8073;
  goldNodes["Gweonid Forest"]["Dewstone Plains"]!.fertValue = 7.7812;
  goldNodes["Gweonid Forest"]["Dewstone Plains"]!.honeyValue = 11.7356;
  goldNodes["Gweonid Forest"]["Dewstone Plains"]!.cheeseValue = 11.4611;
  goldNodes["Gweonid Forest"]["Marianople"]!.fertValue = 10.0894;
  goldNodes["Gweonid Forest"]["Marianople"]!.honeyValue = 15.4525;
  goldNodes["Gweonid Forest"]["Marianople"]!.cheeseValue = 15.0801;
  goldNodes["Gweonid Forest"]["Two Crowns"]!.honeyValue = 13.6591;
  goldNodes["Gweonid Forest"]["Two Crowns"]!.honeyValue = 21.2004;
  goldNodes["Gweonid Forest"]["Two Crowns"]!.honeyValue = 20.801;
  goldNodes["Gweonid Forest"]["Cinderstone Moor"]!.fertValue = 15.56;
  goldNodes["Gweonid Forest"]["Cinderstone Moor"]!.honeyValue = 24.2611;
  goldNodes["Gweonid Forest"]["Cinderstone Moor"]!.cheeseValue = 23.6569;
  goldNodes["Gweonid Forest"]["Sanddeep"]!.fertValue = 16.9874;
  goldNodes["Gweonid Forest"]["Sanddeep"]!.honeyValue = 26.5593;
  goldNodes["Gweonid Forest"]["Sanddeep"]!.cheeseValue = 25.8947;
  goldNodes["Gweonid Forest"]["Freedich Island"]!.fertValue = 22.8397;
  goldNodes["Gweonid Forest"]["Freedich Island"]!.honeyValue = 36.9944;
  goldNodes["Gweonid Forest"]["Freedich Island"]!.cheeseValue = 36.9944;

  goldNodes["Lilyut Hills"]["Solzreed Peninsula"]!.fertValue = 7.2783;
  goldNodes["Lilyut Hills"]["Solzreed Peninsula"]!.honeyValue = 10.9213;
  goldNodes["Lilyut Hills"]["Solzreed Peninsula"]!.cheeseValue = 10.6683;
  goldNodes["Lilyut Hills"]["Gweonid Forest"]!.fertValue = 6.1772;
  goldNodes["Lilyut Hills"]["Gweonid Forest"]!.honeyValue = 9.153;
  goldNodes["Lilyut Hills"]["Gweonid Forest"]!.cheeseValue = 8.9465;
  goldNodes["Lilyut Hills"]["Dewstone Plains"]!.fertValue = 5.87;
  goldNodes["Lilyut Hills"]["Dewstone Plains"]!.honeyValue = 8.6585;
  goldNodes["Lilyut Hills"]["Dewstone Plains"]!.cheeseValue = 8.4648;
  goldNodes["Lilyut Hills"]["Marianople"]!.fertValue = 8.7809;
  goldNodes["Lilyut Hills"]["Marianople"]!.honeyValue = 13.3454;
  goldNodes["Lilyut Hills"]["Marianople"]!.cheeseValue = 13.0286;
  goldNodes["Lilyut Hills"]["Two Crowns"]!.fertValue = 10.9351;
  goldNodes["Lilyut Hills"]["Two Crowns"]!.honeyValue = 16.8142;
  goldNodes["Lilyut Hills"]["Two Crowns"]!.cheeseValue = 16.4061;
  goldNodes["Lilyut Hills"]["Cinderstone Moor"]!.fertValue = 12.3613;
  goldNodes["Lilyut Hills"]["Cinderstone Moor"]!.honeyValue = 19.1108;
  goldNodes["Lilyut Hills"]["Cinderstone Moor"]!.cheeseValue = 18.6421;
  goldNodes["Lilyut Hills"]["Sanddeep"]!.fertValue = 14.4881;
  goldNodes["Lilyut Hills"]["Sanddeep"]!.honeyValue = 22.535;
  goldNodes["Lilyut Hills"]["Sanddeep"]!.cheeseValue = 21.9764;
  goldNodes["Lilyut Hills"]["Freedich Island"]!.fertValue = 19.4909;
  goldNodes["Lilyut Hills"]["Freedich Island"]!.honeyValue = 31.4449;
  goldNodes["Lilyut Hills"]["Freedich Island"]!.cheeseValue = 31.4449;

  goldNodes["Dewstone Plains"]["Solzreed Peninsula"]!.fertValue = 7.796;
  goldNodes["Dewstone Plains"]["Solzreed Peninsula"]!.honeyValue = 11.7594;
  goldNodes["Dewstone Plains"]["Solzreed Peninsula"]!.cheeseValue = 11.4842;
  goldNodes["Dewstone Plains"]["Gweonid Forest"]!.fertValue = 7.7812;
  goldNodes["Dewstone Plains"]["Gweonid Forest"]!.honeyValue = 11.7356;
  goldNodes["Dewstone Plains"]["Gweonid Forest"]!.cheeseValue = 11.4611;
  goldNodes["Dewstone Plains"]["Marianople"]!.fertValue = 6.4715;
  goldNodes["Dewstone Plains"]["Marianople"]!.honeyValue = 8.8339;
  goldNodes["Dewstone Plains"]["Marianople"]!.cheeseValue = 9.408;
  goldNodes["Dewstone Plains"]["Two Crowns"]!.fertValue = 8.7255;
  goldNodes["Dewstone Plains"]["Two Crowns"]!.honeyValue = 13.256;
  goldNodes["Dewstone Plains"]["Two Crowns"]!.cheeseValue = 10.4129;
  goldNodes["Dewstone Plains"]["Cinderstone Moor"]!.fertValue = 10.4614;
  goldNodes["Dewstone Plains"]["Cinderstone Moor"]!.honeyValue = 16.0514;
  goldNodes["Dewstone Plains"]["Cinderstone Moor"]!.cheeseValue = 15.889;
  goldNodes["Dewstone Plains"]["Sanddeep"]!.fertValue = 11.0266;
  goldNodes["Dewstone Plains"]["Sanddeep"]!.honeyValue = 22.8888;
  goldNodes["Dewstone Plains"]["Sanddeep"]!.cheeseValue = 18.8464;
  goldNodes["Dewstone Plains"]["Freedich Island"]!.fertValue = 22.8397;
  goldNodes["Dewstone Plains"]["Freedich Island"]!.honeyValue = 35.5241;
  goldNodes["Dewstone Plains"]["Freedich Island"]!.cheeseValue = 35.5241;

  goldNodes["White Arden"]["Solzreed Peninsula"]!.fertValue = 10.3397;
  goldNodes["White Arden"]["Solzreed Peninsula"]!.honeyValue = 15.8552;
  goldNodes["White Arden"]["Solzreed Peninsula"]!.cheeseValue = 15.4722;
  goldNodes["White Arden"]["Gweonid Forest"]!.fertValue = 9.4657;
  goldNodes["White Arden"]["Gweonid Forest"]!.honeyValue = 14.4481;
  goldNodes["White Arden"]["Gweonid Forest"]!.cheeseValue = 14.1021;
  goldNodes["White Arden"]["Dewstone Plains"]!.fertValue = 5.87;
  goldNodes["White Arden"]["Dewstone Plains"]!.honeyValue = 8.6585;
  goldNodes["White Arden"]["Dewstone Plains"]!.cheeseValue = 8.4648;
  goldNodes["White Arden"]["Marianople"]!.fertValue = 5.7066;
  goldNodes["White Arden"]["Marianople"]!.honeyValue = 8.3955;
  goldNodes["White Arden"]["Marianople"]!.cheeseValue = 8.2087;
  goldNodes["White Arden"]["Two Crowns"]!.fertValue = 8.2537;
  goldNodes["White Arden"]["Two Crowns"]!.honeyValue = 12.4966;
  goldNodes["White Arden"]["Two Crowns"]!.cheeseValue = 12.2019;
  goldNodes["White Arden"]["Cinderstone Moor"]!.fertValue = 11.7636;
  goldNodes["White Arden"]["Cinderstone Moor"]!.honeyValue = 18.1479;
  goldNodes["White Arden"]["Cinderstone Moor"]!.cheeseValue = 17.7044;
  goldNodes["White Arden"]["Sanddeep"]!.fertValue = 11.0266;
  goldNodes["White Arden"]["Sanddeep"]!.honeyValue = 16.9615;
  goldNodes["White Arden"]["Sanddeep"]!.cheeseValue = 16.5495;
  goldNodes["White Arden"]["Freedich Island"]!.fertValue = 24.5004;
  goldNodes["White Arden"]["Freedich Island"]!.honeyValue = 39.7465;
  goldNodes["White Arden"]["Freedich Island"]!.cheeseValue = 39.7465;

  goldNodes["Marianople"]["Solzreed Peninsula"]!.fertValue = 9.6814;
  goldNodes["Marianople"]["Solzreed Peninsula"]!.honeyValue = 14.7956;
  goldNodes["Marianople"]["Solzreed Peninsula"]!.cheeseValue = 14.4407;
  goldNodes["Marianople"]["Gweonid Forest"]!.fertValue = 10.0894;
  goldNodes["Marianople"]["Gweonid Forest"]!.honeyValue = 15.4525;
  goldNodes["Marianople"]["Gweonid Forest"]!.cheeseValue = 15.0801;
  goldNodes["Marianople"]["Dewstone Plains"]!.fertValue = 6.4715;
  goldNodes["Marianople"]["Dewstone Plains"]!.honeyValue = 8.8339;
  goldNodes["Marianople"]["Dewstone Plains"]!.cheeseValue = 9.408;
  goldNodes["Marianople"]["Two Crowns"]!.fertValue = 6.2686;
  goldNodes["Marianople"]["Two Crowns"]!.honeyValue = 9.3003;
  goldNodes["Marianople"]["Two Crowns"]!.cheeseValue = 9.0899;
  goldNodes["Marianople"]["Cinderstone Moor"]!.fertValue = 9.5544;
  goldNodes["Marianople"]["Cinderstone Moor"]!.honeyValue = 14.5907;
  goldNodes["Marianople"]["Cinderstone Moor"]!.cheeseValue = 14.241;
  goldNodes["Marianople"]["Sanddeep"]!.fertValue = 8.6683;
  goldNodes["Marianople"]["Sanddeep"]!.honeyValue = 13.1642;
  goldNodes["Marianople"]["Sanddeep"]!.cheeseValue = 12.8521;
  goldNodes["Marianople"]["Freedich Island"]!.fertValue = 24.0045;
  goldNodes["Marianople"]["Freedich Island"]!.honeyValue = 38.9246;
  goldNodes["Marianople"]["Freedich Island"]!.cheeseValue = 38.9246;

  goldNodes["Two Crowns"]["Solzreed Peninsula"]!.fertValue = 9.9121;
  goldNodes["Two Crowns"]["Solzreed Peninsula"]!.honeyValue = 15.2812;
  goldNodes["Two Crowns"]["Solzreed Peninsula"]!.cheeseValue = 14.8022;
  goldNodes["Two Crowns"]["Gweonid Forest"]!.fertValue = 13.6591;
  goldNodes["Two Crowns"]["Gweonid Forest"]!.honeyValue = 21.2004;
  goldNodes["Two Crowns"]["Gweonid Forest"]!.cheeseValue = 20.677;
  goldNodes["Two Crowns"]["Dewstone Plains"]!.fertValue = 8.7255;
  goldNodes["Two Crowns"]["Dewstone Plains"]!.honeyValue = 13.256;
  goldNodes["Two Crowns"]["Dewstone Plains"]!.cheeseValue = 10.4129;
  goldNodes["Two Crowns"]["Marianople"]!.fertValue = 6.2686;
  goldNodes["Two Crowns"]["Marianople"]!.honeyValue = 9.3003;
  goldNodes["Two Crowns"]["Marianople"]!.cheeseValue = 9.0899;
  goldNodes["Two Crowns"]["Cinderstone Moor"]!.fertValue = 6.5439;
  goldNodes["Two Crowns"]["Cinderstone Moor"]!.honeyValue = 9.7436;
  goldNodes["Two Crowns"]["Cinderstone Moor"]!.cheeseValue = 9.5215;
  goldNodes["Two Crowns"]["Sanddeep"]!.fertValue = 9.7369;
  goldNodes["Two Crowns"]["Sanddeep"]!.honeyValue = 14.8847;
  goldNodes["Two Crowns"]["Sanddeep"]!.cheeseValue = 14.5275;
  goldNodes["Two Crowns"]["Freedich Island"]!.fertValue = 22.3528;
  goldNodes["Two Crowns"]["Freedich Island"]!.honeyValue = 36.1876;
  goldNodes["Two Crowns"]["Freedich Island"]!.cheeseValue = 36.1876;

  goldNodes["Cinderstone Moor"]["Solzreed Peninsula"]!.fertValue = 10.4571;
  goldNodes["Cinderstone Moor"]["Solzreed Peninsula"]!.honeyValue = 16.0442;
  goldNodes["Cinderstone Moor"]["Solzreed Peninsula"]!.cheeseValue = 15.6564;
  goldNodes["Cinderstone Moor"]["Gweonid Forest"]!.fertValue = 15.56;
  goldNodes["Cinderstone Moor"]["Gweonid Forest"]!.honeyValue = 24.2611;
  goldNodes["Cinderstone Moor"]["Gweonid Forest"]!.cheeseValue = 23.6569;
  goldNodes["Cinderstone Moor"]["Dewstone Plains"]!.fertValue = 10.4614;
  goldNodes["Cinderstone Moor"]["Dewstone Plains"]!.honeyValue = 16.0514;
  goldNodes["Cinderstone Moor"]["Dewstone Plains"]!.cheeseValue = 15.889;
  goldNodes["Cinderstone Moor"]["Marianople"]!.fertValue = 9.5544;
  goldNodes["Cinderstone Moor"]["Marianople"]!.honeyValue = 14.5907;
  goldNodes["Cinderstone Moor"]["Marianople"]!.cheeseValue = 14.241;
  goldNodes["Cinderstone Moor"]["Two Crowns"]!.fertValue = 6.5439;
  goldNodes["Cinderstone Moor"]["Two Crowns"]!.honeyValue = 9.7436;
  goldNodes["Cinderstone Moor"]["Two Crowns"]!.cheeseValue = 9.5215;
  goldNodes["Cinderstone Moor"]["Sanddeep"]!.fertValue = 12.4851;
  goldNodes["Cinderstone Moor"]["Sanddeep"]!.honeyValue = 19.3102;
  goldNodes["Cinderstone Moor"]["Sanddeep"]!.cheeseValue = 18.8362;
  goldNodes["Cinderstone Moor"]["Freedich Island"]!.fertValue = 20.3964;
  goldNodes["Cinderstone Moor"]["Freedich Island"]!.honeyValue = 32.9454;
  goldNodes["Cinderstone Moor"]["Freedich Island"]!.cheeseValue = 32.9454;

  goldNodes["Halcyona"]["Solzreed Peninsula"]!.fertValue = 13.9854;
  goldNodes["Halcyona"]["Solzreed Peninsula"]!.honeyValue = 21.7259;
  goldNodes["Halcyona"]["Solzreed Peninsula"]!.cheeseValue = 21.1886;
  goldNodes["Halcyona"]["Gweonid Forest"]!.fertValue = 14.0756;
  goldNodes["Halcyona"]["Gweonid Forest"]!.honeyValue = 21.8709;
  goldNodes["Halcyona"]["Gweonid Forest"]!.cheeseValue = 21.3296;
  goldNodes["Halcyona"]["Dewstone Plains"]!.fertValue = 10.5693;
  goldNodes["Halcyona"]["Dewstone Plains"]!.honeyValue = 16.273;
  goldNodes["Halcyona"]["Dewstone Plains"]!.cheeseValue = 15.879;
  goldNodes["Halcyona"]["Marianople"]!.fertValue = 6.7952;
  goldNodes["Halcyona"]["Marianople"]!.honeyValue = 10.1482;
  goldNodes["Halcyona"]["Marianople"]!.cheeseValue = 9.9154;
  goldNodes["Halcyona"]["Two Crowns"]!.fertValue = 8.8326;
  goldNodes["Halcyona"]["Two Crowns"]!.honeyValue = 13.4287;
  goldNodes["Halcyona"]["Two Crowns"]!.cheeseValue = 13.1097;
  goldNodes["Halcyona"]["Cinderstone Moor"]!.fertValue = 11.7407;
  goldNodes["Halcyona"]["Cinderstone Moor"]!.honeyValue = 18.111;
  goldNodes["Halcyona"]["Cinderstone Moor"]!.cheeseValue = 17.6686;
  goldNodes["Halcyona"]["Sanddeep"]!.fertValue = 9.431;
  goldNodes["Halcyona"]["Sanddeep"]!.honeyValue = 14.3922;
  goldNodes["Halcyona"]["Sanddeep"]!.cheeseValue = 14.0478;
  goldNodes["Halcyona"]["Freedich Island"]!.fertValue = 25.415;
  goldNodes["Halcyona"]["Freedich Island"]!.honeyValue = 44.9792;
  goldNodes["Halcyona"]["Freedich Island"]!.cheeseValue = 44.9792;

  goldNodes["Hellswamp"]["Solzreed Peninsula"]!.fertValue = 18.064;
  goldNodes["Hellswamp"]["Solzreed Peninsula"]!.honeyValue = 28.2931;
  goldNodes["Hellswamp"]["Solzreed Peninsula"]!.cheeseValue = 27.5828;
  goldNodes["Hellswamp"]["Gweonid Forest"]!.fertValue = 19.9713;
  goldNodes["Hellswamp"]["Gweonid Forest"]!.honeyValue = 31.3635;
  goldNodes["Hellswamp"]["Gweonid Forest"]!.cheeseValue = 30.5724;
  goldNodes["Hellswamp"]["Dewstone Plains"]!.fertValue = 14.3865;
  goldNodes["Hellswamp"]["Dewstone Plains"]!.honeyValue = 22.3712;
  goldNodes["Hellswamp"]["Dewstone Plains"]!.cheeseValue = 21.8166;
  goldNodes["Hellswamp"]["Marianople"]!.fertValue = 10.029;
  goldNodes["Hellswamp"]["Marianople"]!.honeyValue = 15.3551;
  goldNodes["Hellswamp"]["Marianople"]!.cheeseValue = 14.9852;
  goldNodes["Hellswamp"]["Two Crowns"]!.fertValue = 12.1354;
  goldNodes["Hellswamp"]["Two Crowns"]!.honeyValue = 18.7468;
  goldNodes["Hellswamp"]["Two Crowns"]!.cheeseValue = 18.2879;
  goldNodes["Hellswamp"]["Cinderstone Moor"]!.fertValue = 15.4599;
  goldNodes["Hellswamp"]["Cinderstone Moor"]!.honeyValue = 24.0995;
  goldNodes["Hellswamp"]["Cinderstone Moor"]!.cheeseValue = 23.4994;
  goldNodes["Hellswamp"]["Sanddeep"]!.fertValue = 7.5072;
  goldNodes["Hellswamp"]["Sanddeep"]!.honeyValue = 11.2947;
  goldNodes["Hellswamp"]["Sanddeep"]!.cheeseValue = 11.0315;
  goldNodes["Hellswamp"]["Freedich Island"]!.fertValue = 23.7269;
  goldNodes["Hellswamp"]["Freedich Island"]!.honeyValue = 43.3732;
  goldNodes["Hellswamp"]["Freedich Island"]!.cheeseValue = 43.3732;

  goldNodes["Sanddeep"]["Solzreed Peninsula"]!.fertValue = 14.5588;
  goldNodes["Sanddeep"]["Solzreed Peninsula"]!.honeyValue = 22.6491;
  goldNodes["Sanddeep"]["Solzreed Peninsula"]!.cheeseValue = 22.0873;
  goldNodes["Sanddeep"]["Gweonid Forest"]!.fertValue = 16.9874;
  goldNodes["Sanddeep"]["Gweonid Forest"]!.honeyValue = 26.5593;
  goldNodes["Sanddeep"]["Gweonid Forest"]!.cheeseValue = 25.8947;
  goldNodes["Sanddeep"]["Dewstone Plains"]!.fertValue = 14.7077;
  goldNodes["Sanddeep"]["Dewstone Plains"]!.honeyValue = 22.8888;
  goldNodes["Sanddeep"]["Dewstone Plains"]!.cheeseValue = 18.8464;
  goldNodes["Sanddeep"]["Marianople"]!.fertValue = 8.6683;
  goldNodes["Sanddeep"]["Marianople"]!.honeyValue = 13.1642;
  goldNodes["Sanddeep"]["Marianople"]!.cheeseValue = 12.8521;
  goldNodes["Sanddeep"]["Two Crowns"]!.fertValue = 9.7369;
  goldNodes["Sanddeep"]["Two Crowns"]!.honeyValue = 14.8847;
  goldNodes["Sanddeep"]["Two Crowns"]!.cheeseValue = 14.5275;
  goldNodes["Sanddeep"]["Cinderstone Moor"]!.fertValue = 12.4851;
  goldNodes["Sanddeep"]["Cinderstone Moor"]!.honeyValue = 19.3102;
  goldNodes["Sanddeep"]["Cinderstone Moor"]!.cheeseValue = 18.8362;
  goldNodes["Sanddeep"]["Freedich Island"]!.fertValue = 25.415;
  goldNodes["Sanddeep"]["Freedich Island"]!.honeyValue = 45.1526;
  goldNodes["Sanddeep"]["Freedich Island"]!.cheeseValue = 45.1526;

  goldNodes["Karkasse Ridgelands"]["Solzreed Peninsula"]!.fertValue = 16.3586;
  goldNodes["Karkasse Ridgelands"]["Solzreed Peninsula"]!.honeyValue = 25.5463;
  goldNodes["Karkasse Ridgelands"]["Solzreed Peninsula"]!.cheeseValue = 24.9083;
  goldNodes["Karkasse Ridgelands"]["Gweonid Forest"]!.fertValue = 9.3425;
  goldNodes["Karkasse Ridgelands"]["Gweonid Forest"]!.honeyValue = 14.2496;
  goldNodes["Karkasse Ridgelands"]["Gweonid Forest"]!.cheeseValue = 13.9087;
  goldNodes["Karkasse Ridgelands"]["Dewstone Plains"]!.fertValue = 12.2498;
  goldNodes["Karkasse Ridgelands"]["Dewstone Plains"]!.honeyValue = 18.931;
  goldNodes["Karkasse Ridgelands"]["Dewstone Plains"]!.cheeseValue = 18.467;
  goldNodes["Karkasse Ridgelands"]["Marianople"]!.fertValue = 10.4727;
  goldNodes["Karkasse Ridgelands"]["Marianople"]!.honeyValue = 16.0694;
  goldNodes["Karkasse Ridgelands"]["Marianople"]!.cheeseValue = 15.6807;
  goldNodes["Karkasse Ridgelands"]["Two Crowns"]!.fertValue = 13.8076;
  goldNodes["Karkasse Ridgelands"]["Two Crowns"]!.honeyValue = 21.4393;
  goldNodes["Karkasse Ridgelands"]["Two Crowns"]!.cheeseValue = 20.9095;
  goldNodes["Karkasse Ridgelands"]["Cinderstone Moor"]!.fertValue = 17.7961;
  goldNodes["Karkasse Ridgelands"]["Cinderstone Moor"]!.honeyValue = 27.8616;
  goldNodes["Karkasse Ridgelands"]["Cinderstone Moor"]!.cheeseValue = 27.1626;
  goldNodes["Karkasse Ridgelands"]["Sanddeep"]!.fertValue = 20.8748;
  goldNodes["Karkasse Ridgelands"]["Sanddeep"]!.honeyValue = 32.8188;
  goldNodes["Karkasse Ridgelands"]["Sanddeep"]!.cheeseValue = 31.9896;
  goldNodes["Karkasse Ridgelands"]["Freedich Island"]!.fertValue = 30.238;
  goldNodes["Karkasse Ridgelands"]["Freedich Island"]!.honeyValue = 52.8208;
  goldNodes["Karkasse Ridgelands"]["Freedich Island"]!.cheeseValue = 52.8208;

  goldNodes["Airain Rock"]["Solzreed Peninsula"]!.fertValue = 15.2837;
  goldNodes["Airain Rock"]["Solzreed Peninsula"]!.honeyValue = 23.8161;
  goldNodes["Airain Rock"]["Solzreed Peninsula"]!.cheeseValue = 23.2238;
  goldNodes["Airain Rock"]["Gweonid Forest"]!.fertValue = 14.8103;
  goldNodes["Airain Rock"]["Gweonid Forest"]!.honeyValue = 23.0538;
  goldNodes["Airain Rock"]["Gweonid Forest"]!.cheeseValue = 22.4814;
  goldNodes["Airain Rock"]["Dewstone Plains"]!.fertValue = 10.5439;
  goldNodes["Airain Rock"]["Dewstone Plains"]!.honeyValue = 16.1842;
  goldNodes["Airain Rock"]["Dewstone Plains"]!.cheeseValue = 15.7925;
  goldNodes["Airain Rock"]["Marianople"]!.fertValue = 10.1544;
  goldNodes["Airain Rock"]["Marianople"]!.honeyValue = 15.5571;
  goldNodes["Airain Rock"]["Marianople"]!.cheeseValue = 15.1818;
  goldNodes["Airain Rock"]["Two Crowns"]!.fertValue = 13.6178;
  goldNodes["Airain Rock"]["Two Crowns"]!.honeyValue = 21.1337;
  goldNodes["Airain Rock"]["Two Crowns"]!.cheeseValue = 20.6118;
  goldNodes["Airain Rock"]["Cinderstone Moor"]!.fertValue = 18.1099;
  goldNodes["Airain Rock"]["Cinderstone Moor"]!.honeyValue = 28.3665;
  goldNodes["Airain Rock"]["Cinderstone Moor"]!.cheeseValue = 27.6543;
  goldNodes["Airain Rock"]["Sanddeep"]!.fertValue = 16.5607;
  goldNodes["Airain Rock"]["Sanddeep"]!.honeyValue = 25.8722;
  goldNodes["Airain Rock"]["Sanddeep"]!.cheeseValue = 25.2258;
  goldNodes["Airain Rock"]["Freedich Island"]!.fertValue = 25.415;
  goldNodes["Airain Rock"]["Freedich Island"]!.honeyValue = 46.54;
  goldNodes["Airain Rock"]["Freedich Island"]!.cheeseValue = 46.54;

  goldNodes["Aubre Cradle"]["Solzreed Peninsula"]!.fertValue = 12.1703;
  goldNodes["Aubre Cradle"]["Solzreed Peninsula"]!.honeyValue = 18.8032;
  goldNodes["Aubre Cradle"]["Solzreed Peninsula"]!.cheeseValue = 18.3427;
  goldNodes["Aubre Cradle"]["Gweonid Forest"]!.fertValue = 11.9636;
  goldNodes["Aubre Cradle"]["Gweonid Forest"]!.honeyValue = 18.4703;
  goldNodes["Aubre Cradle"]["Gweonid Forest"]!.cheeseValue = 18.0185;
  goldNodes["Aubre Cradle"]["Dewstone Plains"]!.fertValue = 8.0412;
  goldNodes["Aubre Cradle"]["Dewstone Plains"]!.honeyValue = 12.1543;
  goldNodes["Aubre Cradle"]["Dewstone Plains"]!.cheeseValue = 11.8687;
  goldNodes["Aubre Cradle"]["Marianople"]!.fertValue = 7.6486;
  goldNodes["Aubre Cradle"]["Marianople"]!.honeyValue = 11.5223;
  goldNodes["Aubre Cradle"]["Marianople"]!.cheeseValue = 11.2533;
  goldNodes["Aubre Cradle"]["Two Crowns"]!.fertValue = 10.6709;
  goldNodes["Aubre Cradle"]["Two Crowns"]!.honeyValue = 16.3787;
  goldNodes["Aubre Cradle"]["Two Crowns"]!.cheeseValue = 15.9917;
  goldNodes["Aubre Cradle"]["Cinderstone Moor"]!.fertValue = 14.5894;
  goldNodes["Aubre Cradle"]["Cinderstone Moor"]!.honeyValue = 22.6977;
  goldNodes["Aubre Cradle"]["Cinderstone Moor"]!.cheeseValue = 22.1347;
  goldNodes["Aubre Cradle"]["Sanddeep"]!.fertValue = 13.6794;
  goldNodes["Aubre Cradle"]["Sanddeep"]!.honeyValue = 21.233;
  goldNodes["Aubre Cradle"]["Sanddeep"]!.cheeseValue = 20.7085;
  goldNodes["Aubre Cradle"]["Freedich Island"]!.fertValue = 25.415;
  goldNodes["Aubre Cradle"]["Freedich Island"]!.honeyValue = 44.3157;
  goldNodes["Aubre Cradle"]["Freedich Island"]!.cheeseValue = 44.3157;

  goldNodes["Ahnimar"]["Solzreed Peninsula"]!.fertValue = 22.0544;
  goldNodes["Ahnimar"]["Solzreed Peninsula"]!.honeyValue = 34.7213;
  goldNodes["Ahnimar"]["Solzreed Peninsula"]!.cheeseValue = 20.1313;
  goldNodes["Ahnimar"]["Gweonid Forest"]!.fertValue = 22.0666;
  goldNodes["Ahnimar"]["Gweonid Forest"]!.honeyValue = 34.7377;
  goldNodes["Ahnimar"]["Gweonid Forest"]!.cheeseValue = 33.8577;
  goldNodes["Ahnimar"]["Dewstone Plains"]!.fertValue = 16.2514;
  goldNodes["Ahnimar"]["Dewstone Plains"]!.honeyValue = 25.3744;
  goldNodes["Ahnimar"]["Dewstone Plains"]!.cheeseValue = 24.7409;
  goldNodes["Ahnimar"]["Marianople"]!.honeyValue = 12.9536;
  goldNodes["Ahnimar"]["Marianople"]!.honeyValue = 20.0642;
  goldNodes["Ahnimar"]["Marianople"]!.cheeseValue = 19.5705;
  goldNodes["Ahnimar"]["Two Crowns"]!.fertValue = 15.902;
  goldNodes["Ahnimar"]["Two Crowns"]!.honeyValue = 24.8117;
  goldNodes["Ahnimar"]["Two Crowns"]!.cheeseValue = 24.1933;
  goldNodes["Ahnimar"]["Cinderstone Moor"]!.fertValue = 19.8622;
  goldNodes["Ahnimar"]["Cinderstone Moor"]!.honeyValue = 31.1883;
  goldNodes["Ahnimar"]["Cinderstone Moor"]!.cheeseValue = 30.4018;
  goldNodes["Ahnimar"]["Sanddeep"]!.fertValue = 10.2972;
  goldNodes["Ahnimar"]["Sanddeep"]!.honeyValue = 15.7869;
  goldNodes["Ahnimar"]["Sanddeep"]!.cheeseValue = 15.4058;
  goldNodes["Ahnimar"]["Freedich Island"]!.fertValue = 25.415;
  goldNodes["Ahnimar"]["Freedich Island"]!.honeyValue = 46.54;
  goldNodes["Ahnimar"]["Freedich Island"]!.cheeseValue = 46.54;
}

function generateNuiaFHCGildaValues() {
  gildaNodes["Solzreed Peninsula"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Solzreed Peninsula"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Solzreed Peninsula"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Solzreed Peninsula"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Solzreed Peninsula"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Solzreed Peninsula"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Solzreed Peninsula"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Solzreed Peninsula"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Solzreed Peninsula"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Solzreed Peninsula"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Solzreed Peninsula"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Solzreed Peninsula"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Gweonid Forest"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Gweonid Forest"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Gweonid Forest"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Gweonid Forest"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Gweonid Forest"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Gweonid Forest"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Gweonid Forest"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Gweonid Forest"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Gweonid Forest"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Gweonid Forest"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Gweonid Forest"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Gweonid Forest"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Lilyut Hills"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Lilyut Hills"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Lilyut Hills"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Lilyut Hills"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Lilyut Hills"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Lilyut Hills"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Lilyut Hills"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Lilyut Hills"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Lilyut Hills"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Lilyut Hills"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Lilyut Hills"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Lilyut Hills"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Dewstone Plains"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Dewstone Plains"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Dewstone Plains"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Dewstone Plains"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Dewstone Plains"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Dewstone Plains"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Dewstone Plains"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Dewstone Plains"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Dewstone Plains"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Dewstone Plains"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Dewstone Plains"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Dewstone Plains"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["White Arden"]["Ynystere"]!.goldValue = 3;
  gildaNodes["White Arden"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["White Arden"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["White Arden"]["Villanelle"]!.goldValue = 2;
  gildaNodes["White Arden"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["White Arden"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["White Arden"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["White Arden"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["White Arden"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["White Arden"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["White Arden"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["White Arden"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Marianople"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Marianople"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Marianople"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Marianople"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Marianople"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Marianople"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Marianople"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Marianople"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Marianople"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Marianople"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Marianople"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Marianople"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Two Crowns"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Two Crowns"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Two Crowns"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Two Crowns"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Two Crowns"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Two Crowns"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Two Crowns"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Two Crowns"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Two Crowns"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Two Crowns"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Two Crowns"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Two Crowns"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Cinderstone Moor"]["Ynystere"]!.goldValue = 2;
  gildaNodes["Cinderstone Moor"]["Ynystere"]!.gildaValue = 2;
  gildaNodes["Cinderstone Moor"]["Ynystere"]!.fellowshipValue = 2;
  gildaNodes["Cinderstone Moor"]["Villanelle"]!.goldValue = 1;
  gildaNodes["Cinderstone Moor"]["Villanelle"]!.gildaValue = 1;
  gildaNodes["Cinderstone Moor"]["Villanelle"]!.fellowshipValue = 1;
  gildaNodes["Cinderstone Moor"]["Solis Headlands"]!.goldValue = 1;
  gildaNodes["Cinderstone Moor"]["Solis Headlands"]!.gildaValue = 1;
  gildaNodes["Cinderstone Moor"]["Solis Headlands"]!.fellowshipValue = 1;
  gildaNodes["Cinderstone Moor"]["Freedich Island"]!.goldValue = 4;
  gildaNodes["Cinderstone Moor"]["Freedich Island"]!.gildaValue = 4;
  gildaNodes["Cinderstone Moor"]["Freedich Island"]!.fellowshipValue = 4;

  gildaNodes["Halcyona"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Halcyona"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Halcyona"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Halcyona"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Halcyona"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Halcyona"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Halcyona"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Halcyona"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Halcyona"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Halcyona"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Halcyona"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Halcyona"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Hellswamp"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Hellswamp"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Hellswamp"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Hellswamp"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Hellswamp"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Hellswamp"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Hellswamp"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Hellswamp"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Hellswamp"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Hellswamp"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Hellswamp"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Hellswamp"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Sanddeep"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Sanddeep"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Sanddeep"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Sanddeep"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Sanddeep"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Sanddeep"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Sanddeep"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Sanddeep"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Sanddeep"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Sanddeep"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Sanddeep"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Sanddeep"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Karkasse Ridgelands"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Karkasse Ridgelands"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Karkasse Ridgelands"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Karkasse Ridgelands"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Karkasse Ridgelands"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Karkasse Ridgelands"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Karkasse Ridgelands"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Airain Rock"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Airain Rock"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Airain Rock"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Airain Rock"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Airain Rock"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Airain Rock"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Airain Rock"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Airain Rock"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Airain Rock"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Airain Rock"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Airain Rock"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Airain Rock"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Aubre Cradle"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Aubre Cradle"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Aubre Cradle"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Aubre Cradle"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Aubre Cradle"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Aubre Cradle"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Aubre Cradle"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Aubre Cradle"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Aubre Cradle"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Aubre Cradle"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Aubre Cradle"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Aubre Cradle"]["Freedich Island"]!.fellowshipValue = 5;

  gildaNodes["Ahnimar"]["Ynystere"]!.goldValue = 3;
  gildaNodes["Ahnimar"]["Ynystere"]!.gildaValue = 3;
  gildaNodes["Ahnimar"]["Ynystere"]!.fellowshipValue = 3;
  gildaNodes["Ahnimar"]["Villanelle"]!.goldValue = 2;
  gildaNodes["Ahnimar"]["Villanelle"]!.gildaValue = 2;
  gildaNodes["Ahnimar"]["Villanelle"]!.fellowshipValue = 2;
  gildaNodes["Ahnimar"]["Solis Headlands"]!.goldValue = 2;
  gildaNodes["Ahnimar"]["Solis Headlands"]!.gildaValue = 2;
  gildaNodes["Ahnimar"]["Solis Headlands"]!.fellowshipValue = 2;
  gildaNodes["Ahnimar"]["Freedich Island"]!.goldValue = 5;
  gildaNodes["Ahnimar"]["Freedich Island"]!.gildaValue = 5;
  gildaNodes["Ahnimar"]["Freedich Island"]!.fellowshipValue = 5;
}

function generateNuiaFHCStabValues() {
  stabNodes["Solzreed Peninsula"]["Ynystere"]!.goldValue = 14;
  stabNodes["Solzreed Peninsula"]["Ynystere"]!.gildaValue = 23;
  stabNodes["Solzreed Peninsula"]["Ynystere"]!.fellowshipValue = 23;
  stabNodes["Solzreed Peninsula"]["Villanelle"]!.goldValue = 15;
  stabNodes["Solzreed Peninsula"]["Villanelle"]!.gildaValue = 25;
  stabNodes["Solzreed Peninsula"]["Villanelle"]!.fellowshipValue = 25;
  stabNodes["Solzreed Peninsula"]["Solis Headlands"]!.goldValue = 13;
  stabNodes["Solzreed Peninsula"]["Solis Headlands"]!.gildaValue = 22;
  stabNodes["Solzreed Peninsula"]["Solis Headlands"]!.fellowshipValue = 22;
  stabNodes["Solzreed Peninsula"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Solzreed Peninsula"]["Freedich Island"]!.gildaValue = 3;
  stabNodes["Solzreed Peninsula"]["Freedich Island"]!.fellowshipValue = 3;

  stabNodes["Gweonid Forest"]["Ynystere"]!.goldValue = 21;
  stabNodes["Gweonid Forest"]["Ynystere"]!.gildaValue = 34;
  stabNodes["Gweonid Forest"]["Ynystere"]!.fellowshipValue = 34;
  stabNodes["Gweonid Forest"]["Villanelle"]!.goldValue = 22;
  stabNodes["Gweonid Forest"]["Villanelle"]!.gildaValue = 36;
  stabNodes["Gweonid Forest"]["Villanelle"]!.fellowshipValue = 36;
  stabNodes["Gweonid Forest"]["Solis Headlands"]!.goldValue = 20;
  stabNodes["Gweonid Forest"]["Solis Headlands"]!.gildaValue = 34;
  stabNodes["Gweonid Forest"]["Solis Headlands"]!.fellowshipValue = 34;
  stabNodes["Gweonid Forest"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Gweonid Forest"]["Freedich Island"]!.gildaValue = 3;
  stabNodes["Gweonid Forest"]["Freedich Island"]!.fellowshipValue = 3;

  stabNodes["Lilyut Hills"]["Ynystere"]!.goldValue = 18;
  stabNodes["Lilyut Hills"]["Ynystere"]!.gildaValue = 29;
  stabNodes["Lilyut Hills"]["Ynystere"]!.fellowshipValue = 29;
  stabNodes["Lilyut Hills"]["Villanelle"]!.goldValue = 19;
  stabNodes["Lilyut Hills"]["Villanelle"]!.gildaValue = 32;
  stabNodes["Lilyut Hills"]["Villanelle"]!.fellowshipValue = 32;
  stabNodes["Lilyut Hills"]["Solis Headlands"]!.goldValue = 18;
  stabNodes["Lilyut Hills"]["Solis Headlands"]!.gildaValue = 30;
  stabNodes["Lilyut Hills"]["Solis Headlands"]!.fellowshipValue = 30;
  stabNodes["Lilyut Hills"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Lilyut Hills"]["Freedich Island"]!.gildaValue = 3;
  stabNodes["Lilyut Hills"]["Freedich Island"]!.fellowshipValue = 3;

  stabNodes["Dewstone Plains"]["Ynystere"]!.goldValue = 19;
  stabNodes["Dewstone Plains"]["Ynystere"]!.gildaValue = 31;
  stabNodes["Dewstone Plains"]["Ynystere"]!.fellowshipValue = 31;
  stabNodes["Dewstone Plains"]["Villanelle"]!.goldValue = 19;
  stabNodes["Dewstone Plains"]["Villanelle"]!.gildaValue = 32;
  stabNodes["Dewstone Plains"]["Villanelle"]!.fellowshipValue = 32;
  stabNodes["Dewstone Plains"]["Solis Headlands"]!.goldValue = 16;
  stabNodes["Dewstone Plains"]["Solis Headlands"]!.gildaValue = 27;
  stabNodes["Dewstone Plains"]["Solis Headlands"]!.fellowshipValue = 27;
  stabNodes["Dewstone Plains"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Dewstone Plains"]["Freedich Island"]!.gildaValue = 3;
  stabNodes["Dewstone Plains"]["Freedich Island"]!.fellowshipValue = 3;

  stabNodes["White Arden"]["Ynystere"]!.goldValue = 20;
  stabNodes["White Arden"]["Ynystere"]!.gildaValue = 34;
  stabNodes["White Arden"]["Ynystere"]!.fellowshipValue = 34;
  stabNodes["White Arden"]["Villanelle"]!.goldValue = 21;
  stabNodes["White Arden"]["Villanelle"]!.gildaValue = 34;
  stabNodes["White Arden"]["Villanelle"]!.fellowshipValue = 34;
  stabNodes["White Arden"]["Solis Headlands"]!.goldValue = 17;
  stabNodes["White Arden"]["Solis Headlands"]!.gildaValue = 28;
  stabNodes["White Arden"]["Solis Headlands"]!.fellowshipValue = 28;
  stabNodes["White Arden"]["Freedich Island"]!.goldValue = 1;
  stabNodes["White Arden"]["Freedich Island"]!.gildaValue = 3;
  stabNodes["White Arden"]["Freedich Island"]!.fellowshipValue = 3;

  stabNodes["Marianople"]["Ynystere"]!.goldValue = 19;
  stabNodes["Marianople"]["Ynystere"]!.gildaValue = 32;
  stabNodes["Marianople"]["Ynystere"]!.fellowshipValue = 32;
  stabNodes["Marianople"]["Villanelle"]!.goldValue = 19;
  stabNodes["Marianople"]["Villanelle"]!.gildaValue = 32;
  stabNodes["Marianople"]["Villanelle"]!.fellowshipValue = 32;
  stabNodes["Marianople"]["Solis Headlands"]!.goldValue = 15;
  stabNodes["Marianople"]["Solis Headlands"]!.gildaValue = 25;
  stabNodes["Marianople"]["Solis Headlands"]!.fellowshipValue = 25;
  stabNodes["Marianople"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Marianople"]["Freedich Island"]!.gildaValue = 3;
  stabNodes["Marianople"]["Freedich Island"]!.fellowshipValue = 3;

  stabNodes["Two Crowns"]["Ynystere"]!.goldValue = 17;
  stabNodes["Two Crowns"]["Ynystere"]!.gildaValue = 27;
  stabNodes["Two Crowns"]["Ynystere"]!.fellowshipValue = 27;
  stabNodes["Two Crowns"]["Villanelle"]!.goldValue = 16;
  stabNodes["Two Crowns"]["Villanelle"]!.gildaValue = 26;
  stabNodes["Two Crowns"]["Villanelle"]!.fellowshipValue = 26;
  stabNodes["Two Crowns"]["Solis Headlands"]!.goldValue = 12;
  stabNodes["Two Crowns"]["Solis Headlands"]!.gildaValue = 19;
  stabNodes["Two Crowns"]["Solis Headlands"]!.fellowshipValue = 19;
  stabNodes["Two Crowns"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Two Crowns"]["Freedich Island"]!.gildaValue = 3;
  stabNodes["Two Crowns"]["Freedich Island"]!.fellowshipValue = 3;

  stabNodes["Cinderstone Moor"]["Ynystere"]!.goldValue = 15;
  stabNodes["Cinderstone Moor"]["Ynystere"]!.gildaValue = 24;
  stabNodes["Cinderstone Moor"]["Ynystere"]!.fellowshipValue = 24;
  stabNodes["Cinderstone Moor"]["Villanelle"]!.goldValue = 14;
  stabNodes["Cinderstone Moor"]["Villanelle"]!.gildaValue = 23;
  stabNodes["Cinderstone Moor"]["Villanelle"]!.fellowshipValue = 23;
  stabNodes["Cinderstone Moor"]["Solis Headlands"]!.goldValue = 11;
  stabNodes["Cinderstone Moor"]["Solis Headlands"]!.gildaValue = 17;
  stabNodes["Cinderstone Moor"]["Solis Headlands"]!.fellowshipValue = 17;
  stabNodes["Cinderstone Moor"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Cinderstone Moor"]["Freedich Island"]!.gildaValue = 3;
  stabNodes["Cinderstone Moor"]["Freedich Island"]!.fellowshipValue = 3;

  stabNodes["Halcyona"]["Ynystere"]!.goldValue = 22;
  stabNodes["Halcyona"]["Ynystere"]!.gildaValue = 37;
  stabNodes["Halcyona"]["Ynystere"]!.fellowshipValue = 37;
  stabNodes["Halcyona"]["Villanelle"]!.goldValue = 21;
  stabNodes["Halcyona"]["Villanelle"]!.gildaValue = 36;
  stabNodes["Halcyona"]["Villanelle"]!.fellowshipValue = 36;
  stabNodes["Halcyona"]["Solis Headlands"]!.goldValue = 17;
  stabNodes["Halcyona"]["Solis Headlands"]!.gildaValue = 28;
  stabNodes["Halcyona"]["Solis Headlands"]!.fellowshipValue = 28;
  stabNodes["Halcyona"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Halcyona"]["Freedich Island"]!.gildaValue = 4;
  stabNodes["Halcyona"]["Freedich Island"]!.fellowshipValue = 4;

  stabNodes["Hellswamp"]["Ynystere"]!.goldValue = 25;
  stabNodes["Hellswamp"]["Ynystere"]!.gildaValue = 42;
  stabNodes["Hellswamp"]["Ynystere"]!.fellowshipValue = 42;
  stabNodes["Hellswamp"]["Villanelle"]!.goldValue = 24;
  stabNodes["Hellswamp"]["Villanelle"]!.gildaValue = 40;
  stabNodes["Hellswamp"]["Villanelle"]!.fellowshipValue = 40;
  stabNodes["Hellswamp"]["Solis Headlands"]!.goldValue = 19;
  stabNodes["Hellswamp"]["Solis Headlands"]!.gildaValue = 32;
  stabNodes["Hellswamp"]["Solis Headlands"]!.fellowshipValue = 32;
  stabNodes["Hellswamp"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Hellswamp"]["Freedich Island"]!.gildaValue = 4;
  stabNodes["Hellswamp"]["Freedich Island"]!.fellowshipValue = 4;

  stabNodes["Sanddeep"]["Ynystere"]!.goldValue = 21;
  stabNodes["Sanddeep"]["Ynystere"]!.gildaValue = 35;
  stabNodes["Sanddeep"]["Ynystere"]!.fellowshipValue = 35;
  stabNodes["Sanddeep"]["Villanelle"]!.goldValue = 20;
  stabNodes["Sanddeep"]["Villanelle"]!.gildaValue = 34;
  stabNodes["Sanddeep"]["Villanelle"]!.fellowshipValue = 34;
  stabNodes["Sanddeep"]["Solis Headlands"]!.goldValue = 15;
  stabNodes["Sanddeep"]["Solis Headlands"]!.gildaValue = 25;
  stabNodes["Sanddeep"]["Solis Headlands"]!.fellowshipValue = 25;
  stabNodes["Sanddeep"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Sanddeep"]["Freedich Island"]!.gildaValue = 4;
  stabNodes["Sanddeep"]["Freedich Island"]!.fellowshipValue = 4;

  stabNodes["Karkasse Ridgelands"]["Ynystere"]!.goldValue = 43;
  stabNodes["Karkasse Ridgelands"]["Ynystere"]!.gildaValue = 72;
  stabNodes["Karkasse Ridgelands"]["Ynystere"]!.fellowshipValue = 72;
  stabNodes["Karkasse Ridgelands"]["Villanelle"]!.goldValue = 45;
  stabNodes["Karkasse Ridgelands"]["Villanelle"]!.gildaValue = 75;
  stabNodes["Karkasse Ridgelands"]["Villanelle"]!.fellowshipValue = 75;
  stabNodes["Karkasse Ridgelands"]["Solis Headlands"]!.goldValue = 42;
  stabNodes["Karkasse Ridgelands"]["Solis Headlands"]!.gildaValue = 70;
  stabNodes["Karkasse Ridgelands"]["Solis Headlands"]!.fellowshipValue = 70;
  stabNodes["Karkasse Ridgelands"]["Freedich Island"]!.goldValue = 2;
  stabNodes["Karkasse Ridgelands"]["Freedich Island"]!.gildaValue = 6;
  stabNodes["Karkasse Ridgelands"]["Freedich Island"]!.fellowshipValue = 6;

  stabNodes["Airain Rock"]["Ynystere"]!.goldValue = 25;
  stabNodes["Airain Rock"]["Ynystere"]!.gildaValue = 42;
  stabNodes["Airain Rock"]["Ynystere"]!.fellowshipValue = 42;
  stabNodes["Airain Rock"]["Villanelle"]!.goldValue = 26;
  stabNodes["Airain Rock"]["Villanelle"]!.gildaValue = 43;
  stabNodes["Airain Rock"]["Villanelle"]!.fellowshipValue = 43;
  stabNodes["Airain Rock"]["Solis Headlands"]!.goldValue = 22;
  stabNodes["Airain Rock"]["Solis Headlands"]!.gildaValue = 36;
  stabNodes["Airain Rock"]["Solis Headlands"]!.fellowshipValue = 36;
  stabNodes["Airain Rock"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Airain Rock"]["Freedich Island"]!.gildaValue = 4;
  stabNodes["Airain Rock"]["Freedich Island"]!.fellowshipValue = 4;

  stabNodes["Aubre Cradle"]["Ynystere"]!.goldValue = 23;
  stabNodes["Aubre Cradle"]["Ynystere"]!.gildaValue = 38;
  stabNodes["Aubre Cradle"]["Ynystere"]!.fellowshipValue = 38;
  stabNodes["Aubre Cradle"]["Villanelle"]!.goldValue = 33;
  stabNodes["Aubre Cradle"]["Villanelle"]!.gildaValue = 39;
  stabNodes["Aubre Cradle"]["Villanelle"]!.fellowshipValue = 39;
  stabNodes["Aubre Cradle"]["Solis Headlands"]!.goldValue = 19;
  stabNodes["Aubre Cradle"]["Solis Headlands"]!.gildaValue = 32;
  stabNodes["Aubre Cradle"]["Solis Headlands"]!.fellowshipValue = 32;
  stabNodes["Aubre Cradle"]["Freedich Island"]!.goldValue = 1;
  stabNodes["Aubre Cradle"]["Freedich Island"]!.gildaValue = 4;
  stabNodes["Aubre Cradle"]["Freedich Island"]!.fellowshipValue = 4;

  stabNodes["Ahnimar"]["Ynystere"]!.goldValue = 27;
  stabNodes["Ahnimar"]["Ynystere"]!.gildaValue = 46;
  stabNodes["Ahnimar"]["Ynystere"]!.fellowshipValue = 46;
  stabNodes["Ahnimar"]["Villanelle"]!.goldValue = 27;
  stabNodes["Ahnimar"]["Villanelle"]!.gildaValue = 45;
  stabNodes["Ahnimar"]["Villanelle"]!.fellowshipValue = 45;
  stabNodes["Ahnimar"]["Solis Headlands"]!.goldValue = 22;
  stabNodes["Ahnimar"]["Solis Headlands"]!.gildaValue = 36;
  stabNodes["Ahnimar"]["Solis Headlands"]!.fellowshipValue = 36;
  stabNodes["Ahnimar"]["Freedich Island"]!.goldValue = 2;
  stabNodes["Ahnimar"]["Freedich Island"]!.gildaValue = 4;
  stabNodes["Ahnimar"]["Freedich Island"]!.fellowshipValue = 4;
}
