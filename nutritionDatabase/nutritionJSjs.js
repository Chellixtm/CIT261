//import api key
import apiKey from './keys.js';

//report url start and end
const baseReportURL = "https://api.nal.usda.gov/ndb/V2/reports?";
const endReportURL = "&type=b&format=json&api_key=" + apiKey;
//search url start and end
const baseSearchURL = "https://api.nal.usda.gov/ndb/search/?format=json";
const endSearchURL = "&sort=n&max=25&offset=0&api_key=" + apiKey;



const foodList = [
  {
    name: "HoneyCrisp Apple",
    imgSrc: "apple.jpg",
    imgAlt: "HoneyCrisp Apple",
    servingSize: "182g",
    calories: "95",
    fat: "0.3",
    carbs: "25",
    protein: ".5",
    vitamins: "Vitamin A:2%, Vitamin C:14%"
  },
  {
    name: "Ribeye Steak",
    imgSrc: "ribeyeSteak.jpg",
    imgAlt: "Raw Ribeye Steak",
    servingSize: "3oz",
    calories: "230",
    fat: "16",
    carbs: "0",
    protein: "21",
    vitamins: "Iron:11%"
  },
  {
    name: "Russet Potato",
    imgSrc: "russetPotato.jpg",
    imgAlt: "Russet Potato",
    servingSize: "1 potato (299g)",
    calories: "290",
    fat: ".4",
    carbs: "64.1",
    protein: "7.9",
    vitamins: "Vitamin C:64%, Vitamin B6:53%"
  },
  {
    name: "Whole Wheat Bread (Breadlovers)",
    imgSrc: "breadloversWholeWheat.jpg",
    imgAlt: "Breadlovers Whole Wheat Bread",
    servingSize: "1 Slice (32g)",
    calories: "80",
    fat: "1",
    carbs: "15",
    protein: "4",
    vitamins: "Vitamin C:2%, Calcium:2%, Iron:4%"
  },
  {
    name: "Meatloaf",
    imgSrc: "meatloaf.jpg",
    imgAlt: "Meatloaf",
    servingSize: "1/6th Meatloaf",
    calories: "276",
    fat: "9",
    carbs: "24",
    protein: "25",
    vitamins: ""
  }
];

window.addEventListener("load", function() {
  console.log("it worked!");
  let foodListElement = document.getElementById("result");
  foodListElement.innerHTML = "";
  foodList.map(food => {
    foodListElement.appendChild(renderFood(food));
  });
});

function renderFood(food) {
  const item = document.createElement("div");
  item.setAttribute("class", "resultStyle");
  item.setAttribute("id", "result");
  item.innerHTML = `
        
        <img src="${food.imgSrc}" alt="${food.imgAlt}">
        <h2>Name: ${food.name}</h2>
        <p>Calories: ${food.calories}
        <br>Fat: ${food.fat}g
        <br>Carbs: ${food.carbs}g
        <br>Protein: ${food.protein}g
        </p>
    `;
  return item;
}

//create function to search for food
function foodSearch() {
  console.log("foodSearch called");
  let searchObject = document.getElementById("foodSearch");

  for (var i = 0, leng = foodList.length; i < leng; i++) {
    if (foodList.name == searchObject) {
    }
  }
}

//Create functions to sort food based on macronutrients
function fatHighLow() {
  console.log("fatHighLow called");
  const fatHighLow = foodList.sort(
    (a, b) => parseFloat(b.fat) - parseFloat(a.fat)
  );
  return fatHighLow;
}
function fatLowHigh() {
  console.log("fatLowHigh called");
  const fatLowHigh = foodList.sort(
    (a, b) => parseFloat(a.fat) - parseFloat(b.fat)
  );
  return fatLowHigh;
}
function carbsHighLow() {
  console.log("carbsHighLow called");
  const carbsHighLow = foodList.sort(
    (a, b) => parseFloat(b.carbs) - parseFloat(a.carbs)
  );
  return carbsHighLow;
}
function carbsLowHigh() {
  console.log("carbsLowHigh called");
  const carbsLowHigh = foodList.sort(
    (a, b) => parseFloat(a.carbs) - parseFloat(b.carbs)
  );
  return carbsLowHigh;
}
function proteinHighLow() {
  console.log("proteinHighLow called");
  const proteinHighLow = foodList.sort(
    (a, b) => parseFloat(b.protein) - parseFloat(a.protein)
  );
  return proteinHighLow;
}
function proteinLowHigh() {
  console.log("proteinLowHigh called");
  const proteinLowHigh = foodList.sort(
    (a, b) => parseFloat(a.protein) - parseFloat(b.protein)
  );
  return proteinLowHigh;
}

function printList(list) {
  let result = document.getElementById("result");
  result.innerHTML = "";
  list.forEach(food => {
    result.appendChild(renderFood(food));
  });
}
