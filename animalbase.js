"use strict";

window.addEventListener("DOMContentLoaded", start);
const globalProps = { chosenFilter: "*" };
let allAnimals = [];

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
  star: false,
};
function start() {
  console.log("ready");

  addEventListeners();
  loadJSON();
}
function addEventListeners() {
  document.querySelector(`[data-filter="cat"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="dog"]`).addEventListener("click", klikFilter);
  document.querySelector(`[data-filter="*"]`).addEventListener("click", klikFilter);
}

function klikFilter(evt) {
  // console.log("klikFilter", evt.target.dataset.filter);
  globalProps.chosenFilter = evt.target.dataset.filter;
  buildList();
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // TODO: This might not be the function we want to call first

  buildList();
}
function buildList() {
  console.log("BUILD LIST");
  const currentList = filterList(allAnimals);

  displayList(currentList);
}

function filterList(theFilteredList) {
  if (globalProps.chosenFilter === "cat") {
    theFilteredList = allAnimals.filter(isCat);
  } else if (globalProps.chosenFilter === "dog") {
    theFilteredList = allAnimals.filter(isDog);
  }
  return theFilteredList;
}

function isCat(animal) {
  if (animal.type === "cat") {
    return true;
  }
}
function isDog(animal) {
  if (animal.type === "dog") {
    return true;
  }
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // Show star ⭐ or ☆
  if (Animal.star) {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    // clone.querySelector("[data-field=star]").textContent = "☆";
    clone.querySelector("[data-field=star]").textContent = "⭐";
    clone.querySelector("td[data-field=star]").style.filter = "grayscale(100%)";
  }

  // TODO: Add event listeners for star and winner

  clone.querySelector("[data-field=star]").addEventListener("click", starToggle);

  function starToggle() {
    // console.log("starToggle");
    if (Animal.star === true) {
      Animal.star = false;
    } else {
      Animal.star = true;
    }
    // console.log(animal);
    displayList(allAnimals);
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
