import { getLocation } from './utilities.js';
import Quake from './Quake.js';
import QuakesView from './QuakesView.js';

// Quake controller
export default class QuakesController {
  constructor(parent, position = null) {
    this.parent = parent;
    // sometimes the DOM won't exist/be ready when the Class gets instantiated, so we will set this later in the init()
    this.parentElement = null;
    // let's give ourselves the option of using a location other than the current location by passing it in.
    this.position = position || {
      lat: 0,
      lon: 0
    };
    // this is how our controller will know about the model and view...we add them right into the class as members.
    this.quakes = new Quake();
    this.quakesView = new QuakesView();
  }
  async init() {
    // use this as a place to grab the element identified by this.parent, do the initial call of this.intiPos(), and display some quakes by calling this.getQuakesByRadius()
    console.log('Init Called');
    this.parentElement = document.querySelector(this.parent);
  }
  async initPos() {
    // if a position has not been set
    if (this.position.lat === 0) {
      try {
        // try to get the position using getLocation()
        const psoFull = await getLocation();
        console.log(posFull);
        // if we get the location back then set the latitude and longitude into this.position
        this.position.lat = posFill.coords.latitude;
        this.position.lon = posFull.coords.longitude;
      } catch (error) {
        console.log(error);
      }
    }
  }

  async getQuakesByRadius(radius = 100) {
    //set a loading message in case it takes long to get the quakes
    this.parentElement.innerHTML = 'Loading...';
    // get the list of quakes in the specified radius of the location
    

    // render the list to html
    
    // add a listener to the new list of quakes to allow drill down in to the details. The listener should call this.getQuakeDetails on the targeted element
    
  }
  async getQuakeDetails(quakeId) {
    // get the details for the quakeId provided, then send them to the view to be displayed
   
  }
}