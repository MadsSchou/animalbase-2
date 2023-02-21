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

//Sorting
function sortList(sortBy) {
  let sortedList = allAnimals;

  if (sortBy === "name") {
    sortedList = sortedList.sort(sortByName);
  } else if (sortBy === "type") {
    sortedList = sortedList.sort(sortByType);
  }

  displayList(sortedList);
}

function sortByName(animalA, animalB) {
  if (animalA.name < animalB.name) {
    return -1;
  } else {
    return 1;
  }
}
function sortByType(animalA, animalB) {
  if (animalA.type < animalB.type) {
    return -1;
  } else {
    return 1;
  }
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

  // TODO: Add event listeners for star

  // Show star ⭐ or ☆
  if (animal.star) {
    clone.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    // clone.querySelector("[data-field=star]").textContent = "☆";
    clone.querySelector("[data-field=star]").textContent = "☆";
  }

  clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

  function clickStar() {
    // console.log("starToggle");
    if (animal.star === true) {
      animal.star = false;
    } else {
      animal.star = true;
    }
    // console.log(animal);
    displayList(allAnimals);
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
