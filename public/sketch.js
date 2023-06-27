/****************************************************************************
  TEMPLATE FOR P5JS INTERFACE TO COMMUNICATE WITH RESOLUME VIA OSC MESSAGES

  Author: Luke Hespanhol
  Date: April 2022
*****************************************************************************/
////////////////////////////////////////////////////////
//FIXED SECTION - START: DO NOT CHANGE THESE VARIABLES
////////////////////////////////////////////////////////
/*
	Disabling canvas scroll for better experience on mobile interfce.
	Source: 
		User 'soanvig', answer posted on Jul 20 '17 at 18:23.
		https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element 
*/
document.addEventListener('touchstart', function(e) {
  document.documentElement.style.overflow = 'hidden';
});

document.addEventListener('touchend', function(e) {
  document.documentElement.style.overflow = 'auto';
});


// Fixed variables
var HOST = window.location.origin;
let xmlHttpRequest = new XMLHttpRequest();
////////////////////////////////////////////////////////
//FIXED SECTION - END: DO NOT CHANGE THESE VARIABLES
////////////////////////////////////////////////////////

const selectedButtons = [];

function setup() {
  createButtons();
  loadClip(1, 1);  // load layer1st snow scene
  loadClip(23, 1); // load layer23 tent
  turnLayerOff(25, 1); // load layer 25 default mode when no one is interacting
  loadClip(24, 1); // play the transition effect
}

function createButtons() {
  const itemOneButton = select('#item-one').mousePressed(itemOneCallback);
  const itemTwoButton = select('#item-two').mousePressed(itemTwoCallback);
  const itemThreeButton = select('#item-three').mousePressed(itemThreeCallback);
  const itemFourButton = select('#item-four').mousePressed(itemFourCallback);
  const itemFiveButton = select('#item-five').mousePressed(itemFiveCallback);
  const itemSixButton = select('#item-six').mousePressed(itemSixCallback);
  const itemSevenButton = select('#item-seven').mousePressed(itemSevenCallback);
  const itemEightButton = select('#item-eight').mousePressed(itemEightCallback);
}

function itemOneCallback() {
  console.log('Item one clicked');
  handleButtonPress(this);
}

function itemTwoCallback() {
  console.log('Item two clicked');
  handleButtonPress(this);
}

function itemThreeCallback() {
  console.log('Item three clicked');
  handleButtonPress(this);
}

function itemFourCallback() {
  console.log('Item four clicked');
  handleButtonPress(this);
}

function itemFiveCallback() {
  console.log('Item five clicked');
  handleButtonPress(this);
}

function itemSixCallback() {
  console.log('Item six clicked');
  handleButtonPress(this);
}

function itemSevenCallback() {
  console.log('Item seven clicked');
  handleButtonPress(this);
}

function itemEightCallback() {
  console.log('Item eight clicked');
  handleButtonPress(this);
}

function handleButtonPress(button) {
  const buttonId = button.elt.id;
  console.log(typeof buttonId); // (debugging) Add this line to find out why the id() method isn't returning a string.
  const row = getRow(buttonId);

  // Deselect the previously selected button in the same row
  if (selectedButtons[row]) {
    selectedButtons[row].removeClass('pressed');
  }

  // Select the current button
  button.addClass('pressed');
  selectedButtons[row] = button;

  turnLayerOff(25, 1); // close the default mode, starting user interaction
  //loadClip(24, 1); // play the transition effect
  // Based on the button pressed, load the corresponding layer in Resolume
  loadCorrespondingClip(buttonId);
}

// Define the mapping from button to Resolume layer and clip
const buttonToLayerClipMapping = {
  'item-one': { layer: 2, clip: 2 },
  'item-two': { layer: 2, clip: 1 },
  'item-three': { layer: 6, clip: 2 },
  'item-four': { layer: 6, clip: 1 },
  'item-five': { layer: 10, clip: 1 },
  'item-six': { layer: 10, clip: 2 },
  'item-seven': { layer: 14, clip: 1 },
  'item-eight': { layer: 14, clip: 2 },
};

// Function to load the corresponding clip based on the button pressed
function loadCorrespondingClip(buttonId) {
  console.log('Loading clip for button: ' + buttonId);
  const { layer, clip } = buttonToLayerClipMapping[buttonId];
  loadClip(layer, clip);
}

function getRow(buttonId) {
  // Define the row for each buttonId
  const rowMapping = {
    'item-one': 1,
    'item-two': 1,
    'item-three': 2,
    'item-four': 2,
    'item-five': 3,
    'item-six': 3,
    'item-seven': 4,
    'item-eight': 4,
  };

  return rowMapping[buttonId];
}

function loadClip(layer, clip) {
	sendMessage("/composition/layers/" + layer + "/clips/" + clip + "/connect", 1, "f");
}

function turnLayerOff(layer) {
	sendMessage("/composition/layers/" + layer + "/clear", 0, "f");
}


/***********************************************************************
  === PLEASE DO NOT CHANGE OR DELETE THIS SECTION ===
  This function sends a OSC message to server

  Parameters:
  	- address: the OSC message address pattern string
  	- value: single value as message payload
  	- type: type of the value passed as message payload
***********************************************************************/
function sendMessage(address, value, type) {
	let postData = JSON.stringify({ id: 1, 'address': address,
                  'value': value,
                  'type': type });

	xmlHttpRequest.open("POST", HOST + '/sendMessage',true);//synchronous change to asynchronous make sure the request will not block the execution of the code and the user experience will be improved.
    xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
	xmlHttpRequest.send(postData);
}

//use an event listener for the onload event to handle the server's response
xmlHttpRequest.onload = function () {
  if (xmlHttpRequest.status >= 200 && xmlHttpRequest.status < 400) {
    // The request has been successful
    console.log('Success:', xmlHttpRequest.responseText);
  } else {
    // The request has failed
    console.error('Error:', xmlHttpRequest.status, xmlHttpRequest.statusText);
  }
};

