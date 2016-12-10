require("./index.html");

import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import Styles from "./style.css";

document.body.className = Styles.body;
ReactDOM.render(<App />, document.getElementById("app"));