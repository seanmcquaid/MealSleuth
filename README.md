# MealSleuth

## Contents
    * Description
    * Technologies
    * Challenges and Solutions
    * MVP
    * Stretch Goals
    * Authors

## Description
This project is a front-end only application designed to search for certain restaurants based on user input like location, price range, etc. The application returns the results most closely matching the user's input and renders it within the browser. The user can then get directions to the resulting location(s) via Google Maps.

### Features
* Distance Calculation
    * The application asks the user to share their current location. If allowed, the location input is populated with the user's location, which can then be changed to another address by the user if they so choose.
    * The address is put into a URL that is inputted into a JSON request. From there the latitude and longitude are extracted from the results, which are then plugged into a call to Google Nearby Places. 
    * This call returns an array of results, which is then parsed for a single result to render in the DOM based on a randomization function. The latitude and longitude of the rendered result are used to determine the distance between the starting and ending points.
* 

## Technologies
* HTML/CSS/JavaScript
* Google Maps API
* Google Places API

## Challenges and Solutions
* Distance Calculation
    At one point we had tried implementing the Haversine formula in order to calculate the distance between two pairs of coordinates, but using that formula would only calculate the distance in terms of a straight line between the two points. Given that we needed to calculate the distance in terms of actual traversable terrain (i.e. roads, sidewalks, etc.), this formula would not work for our purposes.

    In order to better calculate traversable distance, we used Google Maps API's distance matrix to return that actual distance in miles from origin to destination.

* 

## MVP
* To be declared...

## Stretch Goals
* Display map and directions within results that shows user's location in proximity to restaurant location.
* Enable search by type of food.
* Autocompleting search input for food type.

## Authors
* Sean McQuaid
    * Contributions:
        * Concept, Project Management, Google Places API Implementation, Responsive Design
    * [GitHub Profile](https://github.com/seanmcquaid)
* Greg Roques
    * Contributions:
        * Desktop Wireframing, Google Places API Implementation
    * [GitHub Profile](https://github.com/GregRoques)
* Michael Rubino
    * Contributions:
        * Mobile Wireframing, CSS, Google Places API Implementation, Zomato API Implementation, Responsive Design
    * [GitHub Profile](https://github.com/rubinoAM)