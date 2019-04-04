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

//add event listener to search database button
document
  .getElementById("searchDatabase")
  .addEventListener("touchend", function() {
    searchAPI();
  });

//function to call an api search
async function searchAPI() {
  const searchObject = document.getElementById("foodSearch");
  let searchURL = baseSearchURL + "&q=" + searchObject.value + endSearchURL;
  console.log(searchURL);
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
  //.then(async logSearch => {
  foodList = JSONresponse.list.item;
  foodList = await getMacroDetails(foodList);
  console.log(foodList);
  // )
  // .catch(error => {
  //   console.log("There was a problem with your fetch:", error.message);
  // });
}

async function getMacroDetails(foodList) {
  let foodListElement = document.getElementById("result");
  foodListElement.innerHTML = "";
  const newList = [];
  for (let i = 0; i < foodList.length; i++) {
    let food = foodList[i];
    let foodUrl = baseReportURL + `&ndbno=${food.ndbno}` + endReportURL;
    const getMacros = await grabFoodDetails(foodUrl);
    const nutrients = getMacros.foods[0].food.nutrients;
    food.calories = findNextMac(nutrients, "Energy");
    food.fat = findNextMac(nutrients, "Total lipid (fat)");
    food.carbs = findNextMac(nutrients, "Carbohydrate, by difference");
    food.protein = findNextMac(nutrients, "Protein");
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
    return parseFloat(match.value);
  } else {
    return "";
  }
}

//function to create each food element in returned array
function renderFood(food) {
  const item = document.createElement("div");
  item.setAttribute("class", "resultStyle");
  item.setAttribute("id", "result");
  item.innerHTML = `
        
        <h2>Name: ${food.name}</h2>
        <p>Calories: ${food.calories} kcal</p>
        <p>Fat: ${Math.round(food.fat)} g</p>
        <p>Carbs: ${Math.round(food.carbs)} g</p>
        <p>Protein: ${Math.round(food.protein)} g</p>
    `;
  return item;
}

//Create functions to sort food based on macronutrients

//Hight fat to low fat
document.getElementById("fatHigh").addEventListener("touchend", () => {
  printList(fatHighLow());
});
function fatHighLow() {
  const fatHighLow = foodList.sort(
    (a, b) => parseFloat(b.fat) - parseFloat(a.fat)
  );
  return fatHighLow;
}

//Low fat to high fat
document.getElementById("fatLow").addEventListener("touchend", () => {
  printList(fatLowHigh());
});
function fatLowHigh() {
  const fatLowHigh = foodList.sort(
    (a, b) => parseFloat(a.fat) - parseFloat(b.fat)
  );
  return fatLowHigh;
}

//High carb to low carb
document.getElementById("carbsHigh").addEventListener("touchend", () => {
  printList(carbsHighLow());
});
function carbsHighLow() {
  const carbsHighLow = foodList.sort(
    (a, b) => parseFloat(b.carbs) - parseFloat(a.carbs)
  );
  return carbsHighLow;
}

//Low carb to high carb
document.getElementById("carbsLow").addEventListener("touchend", () => {
  printList(carbsLowHigh());
});
function carbsLowHigh() {
  const carbsLowHigh = foodList.sort(
    (a, b) => parseFloat(a.carbs) - parseFloat(b.carbs)
  );
  return carbsLowHigh;
}

//High protein to low protein
document.getElementById("proteinHigh").addEventListener("touchend", () => {
  printList(proteinHighLow());
});
function proteinHighLow() {
  const proteinHighLow = foodList.sort(
    (a, b) => parseFloat(b.protein) - parseFloat(a.protein)
  );
  return proteinHighLow;
}

//low protein to high protein
document.getElementById("proteinLow").addEventListener("touchend", () => {
  printList(proteinLowHigh());
});
function proteinLowHigh() {
  const proteinLowHigh = foodList.sort(
    (a, b) => parseFloat(a.protein) - parseFloat(b.protein)
  );
  return proteinLowHigh;
}

//create function to print the list to the inner html using renderFood()
function printList(list) {
  let result = document.getElementById("result");
  result.innerHTML = "";
  list.forEach(food => {
    result.appendChild(renderFood(food));
  });
}
