import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="person"
// Dynamically shows/hides form fields based on person type and role.
export default class extends Controller {
  static targets = ["independent", "level", "age", "role", "back", "exclude", "table"];

  connect() {
    for (let select of [...document.querySelectorAll("select")]) {
      let changeEvent = new Event("change");
      select.dispatchEvent(changeEvent);
    }
  }

  setType(event) {
    if (this.hasTableTarget) this.tableTarget.style.display = "block";

    if (event.target.value == "Student") {
      this.levelTarget.style.display = "block";
      if (this.hasAgeTarget) this.ageTarget.style.display = "block";
      this.roleTarget.style.display = "block";
      this.excludeTarget.style.display = "block";
      if (this.hasIndependentTarget) this.independentTarget.style.display = "none";
    } else {
      this.levelTarget.style.display = "none";
      if (this.hasAgeTarget) this.ageTarget.style.display = "none";

      if (event.target.value == "Professional") {
        this.roleTarget.style.display = "block";
        this.excludeTarget.style.display = "block";
        if (this.hasIndependentTarget) this.independentTarget.style.display = "block";
      } else {
        this.roleTarget.style.display = "none";
        this.backTarget.style.display = "none";
        this.excludeTarget.style.display = "none";
        if (this.hasIndependentTarget) this.independentTarget.style.display = "none";
      }
    }
  }

  setRole(event) {
    if (event.target.value == "Follower") {
      this.backTarget.style.display = "none";
    } else {
      this.backTarget.style.display = "block";
    }
  }
}
