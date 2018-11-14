# Computational time measurement

Computation time required for each step mentioned in [J. Lee, W. Lin and Y. Huang, "A lightweight authentication protocol for Internet of Things," 2014 International Symposium on Next-Generation Electronics (ISNE), Kwei-Shan, 2014.](https://ieeexplore.ieee.org/document/6839375) is calculated and stored

## Setup
* create `./data` directory in root of project
* to generate trials, run `node hash.js`
* to get averages, run `node average.js`

## Editing code
* Time measuring code is in `hash.js` file
* Code to average data is in `average.js` file
* Configuration parameters are in `config.js` file

## Features
* Data for each trial is stored in a file inside `.data` directory
* Average values are stored inside `.data` directory
* No of trials can be changed from within `config.js`
* Hash function can be changed from within `config.js`
