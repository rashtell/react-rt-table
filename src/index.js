import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import ListView from "./views/ListView";

import "./assets/css/animate.min.css";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";

const headers = ["Name", "Phone", "Email"];
const items = [{ name: "Rashtell", phone: "0987654321", email: "a@b.com" }];
const title = "Test";
const footers = ["Name Footer", "", "Email Footer"];

const cardProps = {
  plain: true,
  hCenter: true,
  ctAllIcons: true,
  ctTableFullWidth: true,
  ctTableResponsive: true,
  ctTableUpgrade: true,
  legend: "",
  stats: "",
  statsIcon: "",
};
const cardStyle = {};
const tableProps = { striped: true, hover: true };
const tableStyle = {};
const tableHeadStyle = {};
const tableBodyStyle = {};
const tableFooterStyle={}

const stuffs = {
  cardProps,
  cardStyle,
  tableProps,
  tableStyle,
  tableHeadStyle,
  tableBodyStyle,
  tableFooterStyle
};

ReactDOM.render(
  <React.StrictMode>
    <ListView
      title={title}
      headers={headers}
      items={items}
      footers={footers}
      {...stuffs}
    />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(ListView);
