import "./styles.scss";
import { FormSeating } from "./components/form-seating";
// import "dotenv";
require("dotenv").config(); // Why I can not import it?

document.addEventListener('DOMContentLoaded', () => {
    new FormSeating();
});