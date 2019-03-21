import QuakesController from "./QuakesController.js";
const baseUrl =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=2019-03-02";

const myController = new QuakesController('#quakeList');
myController.init();