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
* Renders search results into an array that is displayed beneath the search input within a separate container.

## Technologies
* HTML/CSS/JavaScript
* Google Maps API
* Google Places API

## Challenges and Solutions
* Distance Calculation
     At one point we had tried implementing the Haversine formula in order to calculate the distance between two pairs of coordinates, but using that formula would only calculate the distance in terms of a straight line between the two points. Given that we needed to calculate the distance in terms of actual traversable terrain (i.e. roads, sidewalks, etc.), this formula would not work for our purposes.

## MVP
* To be declared...

## Stretch Goals
* Display map and directions within results that shows user's location in proximity to restaurant location.
* Enable search by type of food.
* Autocompleting search input for food type.

## Authors
* Sean McQuaid
    * Contributions:
        * Concept, Project Management, Responsive Design
    * [GitHub Profile](https://github.com/seanmcquaid)
* Greg Roques
    * Contributions:
        * Desktop Wireframing, API Implementation
    * [GitHub Profile](https://github.com/GregRoques)
* Michael Rubino
    * Contributions:
        * Mobile Wireframing, CSS, API Implementation
    * [GitHub Profile](https://github.com/rubinoAM)