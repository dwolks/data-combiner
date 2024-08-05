// NODE JS - Require File System and Require CSV-PARSER
const fileSystem = require('fs');
const csv = require('csv-parser');
const { stringify } = require('querystring');

// Read and Parse the JSON File
const jsonFile = 'restaurants_list.json';
const jsonData = JSON.parse(fileSystem.readFileSync(jsonFile, 'utf8'));

//Log Data to see if this works
//console.log(jsonData);

// Read and Parse the CSV File
const csvFile = 'restaurants_info.csv';
const csvData = [];

//Read file using createReadStream(path, options) method
fileSystem.createReadStream(csvFile)
    // Pipe the readable CSV data into the CSV Parser - initalise csv parser and separate by ; 
    .pipe(csv({separator: ';'}))
    // after each row is parse take the parsed data add it to the csvData array
    .on('data', row => {
        csvData.push(row);
    })
    // combine both files into JSON
    .on('end', () => {
        //map over the json data
        const combinedData = jsonData.map((obj) => {
            //find the corresponding object in the csvData with matching objectID
            const csvArr = csvData.find((csvArr) => csvArr.objectID == obj.objectID);

            //Create a new object and copy properties from obj (jsonData being mapped)
            let combinedObj = {};
            for(let key in obj) {
                if(obj.hasOwnProperty(key)) {
                    combinedObj[key] = obj[key];
                }
            }

            // If corresponding csvArr is found copy its properties to the combinedObj
            if(csvArr) {
                for(let key in csvArr) {
                    if(csvArr.hasOwnProperty(key)) {
                        combinedObj[key] = csvArr[key];
                    }
                }
            }

            return combinedObj;

        });
        //console.log(combinedData);

        //write combined data to a new file 
        fileSystem.writeFileSync('combinedData.json', JSON.stringify(combinedData, null, 2));
    });
