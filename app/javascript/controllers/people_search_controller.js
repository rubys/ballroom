import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="people-search"
export default class extends Controller {
  connect() {
    this.element.addEventListener("input", _event => {
      let input = this.element.value.toLowerCase();
      let tokens = input.trim().split(" ");
      for (let row of document.querySelectorAll("tbody tr")) {
        let name = row.querySelector("td").textContent.toLowerCase();
        if (!input || tokens.every(token => name.includes(token))) {
          row.style.display = "table-row";
        } else {
          row.style.display = "none";
        }
      }
    });

    this.element.focus();
  }
}
