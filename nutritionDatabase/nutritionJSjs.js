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
document.getElementById("searchDatabase").addEventListener("touchend", function() {
    searchAPI();
  });

  //add event listener for back button
document.getElementById('backToList').addEventListener("click", () => {
    let refineButtons = document.getElementById("refine");
    let list = document.getElementById("result");
    let foodDetails = document.getElementById("foodDetails");
    let searchBar = document.getElementById("searchBar");
    let button = document.getElementById('backToList');
    
    list.style.transform = "translateX(0vw)";
    refineButtons.style.transform = "translateX(0vw)";
    searchBar.style.transform = "translateX(0vw)";
    foodDetails.style.transform = "translateX(100vw)";
    button.style.transform = "translateX(100vw)";
  })

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
    return match.value + " " + match.unit;
  } else {
    return "0";
  }
}

//function to create each food element in returned array
function renderFood(food) {
  const item = document.createElement("div");
  item.setAttribute("id", "resultRender");
  item.innerHTML = `
        
        <h2>Name: ${food.name}</h2>
        <p>
        <b>Calories:</b> ${food.calories} <br>
        <b>Fat:</b> ${food.fat} <br>
        <b>Carbs:</b> ${food.carbs} <br>
        <b>Protein:</b> ${food.protein}
        </p>
    `;
  item.addEventListener("click", () => {
    let refineButtons = document.getElementById("refine");
    let list = document.getElementById("result");
    let foodDetails = document.getElementById("foodDetails");
    let searchBar = document.getElementById("searchBar");
    let button = document.getElementById('backToList');

    list.style.transform = "translateX(-100vw)";
    refineButtons.style.transform = "translateX(-100vw)";
    searchBar.style.transform = "translateX(-100vw)";
    foodDetails.style.transform = "translateX(0vw)";
    button.style.transform = "translateX(0vw)";
    foodDetails.innerHTML = renderFoodDetails(food);

  });
  return item;
}

//creat function to render details for food
function renderFoodDetails(food) {
  return `
  <div class="nameNutrient"><h1>${food.name}</h1></div>
  <div class="labelNutrient">
    <div class="headNutrient">Nutrition Facts</div>
    <div class="majorNutrient" style="font-size:2em"><b>Calories:</b> <span class="right">${food.calories} </span><br></div>
    <div class="majorNutrient"><b>Total Fat:</b> <span class="right">${food.fat} </span><br></div>
    <div class="minorNutrient">Saturated Fat: <span class="right">${food.saturated} </span><br></div>
    <div class="minorNutrient">Monosaturated Fat: <span class="right">${food.mono} </span><br></div>
    <div class="minorNutrient">Polysaturated Fat: <span class="right">${food.poly} </span><br></div>
    <div class="minorNutrient"><i>Trans</i> Fat: <span class="right">${food.trans} </span><br></div>
    <div class="majorNutrient"><b>Cholesterol:</b> <span class="right">${food.chol} </span><br></div>
    <div class="majorNutrient"><b>Sodium:</b> <span class="right">${food.sodium} </span><br></div>
    <div class="majorNutrient"><b>Total Carbohydrates:</b> <span class="right">${food.carbs} </span><br></div>
    <div class="minorNutrient">Fiber: <span class="right">${food.fiber} </span><br></div>
    <div class="majorNutrient"><b>Protein:</b> <span class="right">${food.protein} </span><br></div>
    <div class="vitaminNutrient">Vitamin C: <span class="right">${food.vitc} </span><br></div>
    <div class="vitaminNutrient">Calcium: <span class="right">${food.calcium} </span><br></div>
    <div class="vitaminNutrient">Iron: <span class="right">${food.iron} </span><br></div>
    <div class="vitaminNutrient">Potassium: <span class="right">${food.potassium} </span><br></div>
  </div>
  `;
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