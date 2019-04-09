//import api key
import { apiKey } from "./keys.js";

//report url start and end
const baseReportURL = "https://api.nal.usda.gov/ndb/V2/reports?";
const endReportURL = "&type=b&format=json&api_key=" + apiKey;
//search url start and end
const baseSearchURL = "https://api.nal.usda.gov/ndb/search/?format=json";
const endSearchURL =
  "&ds=Standard%20Reference&sort=r&max=25&offset=0&api_key=" + apiKey;

//array for api elements
let foodList = [];

//grab elements for buttons
const refineButtons = document.getElementById("refine");
const list = document.getElementById("result");
const foodDetails = document.getElementById("foodDetails");
const searchBar = document.getElementById("searchBar");
const button = document.getElementById("backToList");

//add event listener to search database button
document
  .getElementById("searchDatabase")
  .addEventListener("touchend", function() {
    searchAPI();
  });

//add event listener for back button
document.getElementById("backToList").addEventListener("click", () => {
  list.style.transform = "translateX(0vw)";
  refineButtons.style.transform = "translateX(0vw)";
  searchBar.style.transform = "translateX(0vw)";
  foodDetails.style.transform = "translateX(100vw)";
  button.style.transform = "translateX(100vw)";
});

//function to call an api search
async function searchAPI() {
  const searchObject = document.getElementById("foodSearch");
  let searchURL = baseSearchURL + "&q=" + searchObject.value + endSearchURL;
  const JSONresponse = await fetch(searchURL)
    .then(response => {
      if (response.ok) {
        return response;
      }
      throw new Error("Network didn't respond.");
    })
    .then(results => {
      return results.json();
    });
  foodList = JSONresponse.list.item;
  foodList = await getMacroDetails(foodList);
}

//create function to grab food details based on search
async function getMacroDetails(foodList) {
  let foodListElement = document.getElementById("result");
  foodListElement.innerHTML = "";
  const newList = [];
  for (let i = 0; i < foodList.length; i++) {
    let food = foodList[i];
    let foodUrl = baseReportURL + `&ndbno=${food.ndbno}` + endReportURL;
    const getMacros = await grabFoodDetails(foodUrl);
    console.log(foodUrl);
    const nutrients = getMacros.foods[0].food.nutrients;
    food.calories = findNextMac(nutrients, "Energy");
    food.fat = findNextMac(nutrients, "Total lipid (fat)");
    food.carbs = findNextMac(nutrients, "Carbohydrate, by difference");
    food.protein = findNextMac(nutrients, "Protein");
    food.fiber = findNextMac(nutrients, "Fiber, total dietary");
    food.calcium = findNextMac(nutrients, "Calcium, Ca");
    food.iron = findNextMac(nutrients, "Iron, Fe");
    food.potassium = findNextMac(nutrients, "Potassium, K");
    food.sodium = findNextMac(nutrients, "Sodium, Na");
    food.vitc = findNextMac(nutrients, "Vitamin C, total ascorbic acid");
    food.saturated = findNextMac(nutrients, "Fatty acids, total saturated");
    food.mono = findNextMac(nutrients, "Fatty acids, total monosaturated");
    food.poly = findNextMac(nutrients, "Fatty acids, total polysaturated");
    food.trans = findNextMac(nutrients, "Fatty acids, total trans");
    food.chol = findNextMac(nutrients, "Cholesterol");
    foodListElement.appendChild(renderFood(food));
    console.log(food);
    newList.push(food);
  }
  return newList;
}

//creat function to grab ndbno numbers of food items
function grabFoodDetails(foodUrl) {
  return fetch(foodUrl)
    .then(response => {
      if (response.ok) {
        return response;
      }
      throw new Error("Network didn't respond.");
    })
    .then(results => {
      return results.json();
    })
    .catch(error => {
      console.log("There was a problem with your fetch:", error.message);
    });
}

//creat function to find nutrients
function findNextMac(nutrients, query) {
  if (!nutrients) {
    nutrients = [];
  }
  const match = nutrients.find(macro => macro.name === query);
  if (match) {
    let value = parseFloat(match.value);
    let unit = match.unit;
    return Math.round(value) + " " + unit;
  } else {
    return "0";
  }
}

//function to create each food element in returned array
function renderFood(food, highlight) {
  const item = document.createElement("div");
  item.setAttribute("id", "resultRender");
  item.innerHTML = `
        
        <div class="searchName">Name: ${food.name}</div>
        <div class="miniSearch">
        <b>Calories:</b> <span class="right">${food.calories} </span>
        <div ${addHighlight(highlight, "fat")}><b>Fat:</b> <span class="right">${food.fat} </span></div>
        <div ${addHighlight(highlight, "carbs")}><b>Carbs:</b> <span class="right">${food.carbs} </span></div>
        <div ${addHighlight(highlight, "protein")}><b>Protein:</b> <span class="right">${food.protein} </span></div>
        </div>
    `;
  item.addEventListener("click", () => {
    list.style.transform = "translateX(-100vw)";
    refineButtons.style.transform = "translateX(-100vw)";
    searchBar.style.transform = "translateX(-100vw)";
    foodDetails.style.transform = "translateX(0vw)";
    button.style.transform = "translateX(0vw)";
    foodDetails.innerHTML = renderFoodDetails(food);
  });
  return item;
}

function addHighlight(highlight, check) {
  if(highlight == check) {
    return "class=highlight";
  }
}

//creat function to render details for food
function renderFoodDetails(food) {
  return `
  <div class="headNutrient">Nutrition Facts</div>
  <div class="labelNutrient">
    <div class="nameNutrient">${food.name}</div>
    <div class="majorNutrient" style="font-size:1.5em"><b>Calories:</b> <span class="rightB">${
      food.calories
    } </span><br></div>
    <div class="majorNutrient"><b>Total Fat:</b> <span class="rightB">${
      food.fat
    } </span><br></div>
    <div class="minorNutrient">Saturated Fat: <span class="rightB">${
      food.saturated
    } </span><br></div>
    <div class="minorNutrient">Monosaturated Fat: <span class="rightB">${
      food.mono
    } </span><br></div>
    <div class="minorNutrient">Polysaturated Fat: <span class="rightB">${
      food.poly
    } </span><br></div>
    <div class="minorNutrient"><i>Trans</i> Fat: <span class="rightB">${
      food.trans
    } </span><br></div>
    <div class="majorNutrient"><b>Cholesterol:</b> <span class="rightB">${
      food.chol
    } </span><br></div>
    <div class="majorNutrient"><b>Sodium:</b> <span class="rightB">${
      food.sodium
    } </span><br></div>
    <div class="majorNutrient"><b>Total Carbohydrates:</b> <span class="rightB">${
      food.carbs
    } </span><br></div>
    <div class="minorNutrient">Fiber: <span class="rightB">${
      food.fiber
    } </span><br></div>
    <div class="majorNutrient"><b>Protein:</b> <span class="rightB">${
      food.protein
    } </span><br></div>
    <div class="vitaminNutrient">Vitamin C: <span class="rightB">${
      food.vitc
    } </span><br></div>
    <div class="vitaminNutrient">Calcium: <span class="rightB">${
      food.calcium
    } </span><br></div>
    <div class="vitaminNutrient">Iron: <span class="rightB">${
      food.iron
    } </span><br></div>
    <div class="vitaminNutrient">Potassium: <span class="rightB">${
      food.potassium
    } </span><br></div>
  </div>
  `;
}

//Create functions to sort food based on macronutrients

//Hight fat to low fat
document.getElementById("fatHigh").addEventListener("touchend", () => {
  printList(fatHighLow(), "fat");
});
function fatHighLow() {
  const fatHighLow = foodList.sort(
    (a, b) => parseFloat(b.fat) - parseFloat(a.fat)
  );
  return fatHighLow;
}

//Low fat to high fat
document.getElementById("fatLow").addEventListener("touchend", () => {
  printList(fatLowHigh(), "fat");
});
function fatLowHigh() {
  const fatLowHigh = foodList.sort(
    (a, b) => parseFloat(a.fat) - parseFloat(b.fat)
  );
  return fatLowHigh;
}

//High carb to low carb
document.getElementById("carbsHigh").addEventListener("touchend", () => {
  printList(carbsHighLow(), "carbs");
});
function carbsHighLow() {
  const carbsHighLow = foodList.sort(
    (a, b) => parseFloat(b.carbs) - parseFloat(a.carbs)
  );
  return carbsHighLow;
}

//Low carb to high carb
document.getElementById("carbsLow").addEventListener("touchend", () => {
  printList(carbsLowHigh(), "carbs");
});
function carbsLowHigh() {
  const carbsLowHigh = foodList.sort(
    (a, b) => parseFloat(a.carbs) - parseFloat(b.carbs)
  );
  return carbsLowHigh;
}

//High protein to low protein
document.getElementById("proteinHigh").addEventListener("touchend", () => {
  printList(proteinHighLow(), "protein");
});
function proteinHighLow() {
  const proteinHighLow = foodList.sort(
    (a, b) => parseFloat(b.protein) - parseFloat(a.protein)
  );
  return proteinHighLow;
}

//low protein to high protein
document.getElementById("proteinLow").addEventListener("touchend", () => {
  printList(proteinLowHigh(), "protein");
});
function proteinLowHigh() {
  const proteinLowHigh = foodList.sort(
    (a, b) => parseFloat(a.protein) - parseFloat(b.protein)
  );
  return proteinLowHigh;
}

//create function to print the list to the inner html using renderFood()
function printList(list, sort) {
  let result = document.getElementById("result");
  result.innerHTML = "";
  list.forEach(food => {
    result.appendChild(renderFood(food, sort));
  });
}
