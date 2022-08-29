import react, { useState } from "react";
import "./header.css";
import logo from "../assets/logo.jpg";
// import {pdfreport, setPdfReport} from '../constant';
import Explore from "../Explore.js";

import { useTranslation } from "react-i18next";
const Header = () => {
  const [state, setstate] = useState(false);
  const { t, i18n } = useTranslation();
  const [path, setPath] = useState(false);
  const [minus, setMinus] = useState("/media/Britain.svg");

  const [plus, setPlus] = useState("/media/sp.png");

  const [chinese, setChinese] = useState("/media/China.svg");
  const [korean, setKorean] = useState("/media/Korea.svg");
  const [french, setFrench] = useState("/media/French.svg");

  const [imagePath, setImagePath] = useState(minus);

  function handleClick(lang) {
    i18n.changeLanguage(lang);
    console.log("18", t);
    switch (lang) {
      case "en":
        setImagePath(minus);
        break;
      case "sp":
        setImagePath(plus);
        break;
      case "fr":
        setImagePath(french);
        break;
      case "chi":
        setImagePath(chinese);
        break;
      case "ko":
        setImagePath(korean);
        break;
    }
  }

  return (
    <div className="container">
      <div class="row">
        <div className="col-4"></div>
        <div className="col-3">
          <img src={logo} className="main-logo" />
        </div>

        <div className="col-4">
          <div class="dropdown">
            <button
              class="dropbtnn"
              onClick={() => {
                setstate(true);
              }}
            >
              <img
                src={imagePath}
                style={{
                  width: "35px",
                  borderRadius: "25px",
                  padding: "2rem 0rem",
                }}
              />
            </button>
            {state ? (
              <div class="dropdown-content">
                <button className="dropbtn" onClick={() => handleClick("en")}>
                  <img
                    src="/media/Britain.svg"
                    style={{ width: "20px", margin: "0 10px" }}
                  />{" "}
                  English
                </button>
                <button className="dropbtn" onClick={() => handleClick("sp")}>
                  <img
                    src="/media/sp.png"
                    style={{ width: "20px", margin: "0 10px" }}
                  />{" "}
                  Spanish
                </button>
                <button className="dropbtn" onClick={() => handleClick("chi")}>
                  <img
                    src="/media/China.svg"
                    style={{ width: "20px", margin: "0 10px" }}
                  />{" "}
                  Chinese
                </button>
                <button className="dropbtn" onClick={() => handleClick("fr")}>
                  <img
                    src="/media/French.svg"
                    style={{ width: "20px", margin: "0 10px" }}
                  />{" "}
                  French
                </button>

                <button className="dropbtn" onClick={() => handleClick("ko")}>
                  <img
                    src="/media/Korea.svg"
                    style={{ width: "20px", margin: "0 10px" }}
                  />{" "}
                  Korean
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
