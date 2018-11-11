/*
 * File containing code to average data
 *
 */

// Dependencies
const fs = require("fs");
const config = require("./config");

// Function
const average = function(){
  let sij_avg=0, ai_avg=0, zi_avg=0, verify_zi_avg=0, aj_avg=0, zj_avg=0, verify_zj_avg=0, kij_avg=0, yij_avg=0;
  // Looping through 100 times
  for(let i=1;i<=config.noOfTrials;++i){
    // Reading data from file
    fs.readFile(config.dataDir+"/trial"+i+".json", function(err, trialData){
      if(!err&&trialData){
        // Converting data into object
        trialDataObject = JSON.parse(trialData.toString());
        // Cumulating averages
        sij_avg+=parseInt(trialDataObject.sij)/100;
        ai_avg+=parseInt(trialDataObject.ai)/100;
        aj_avg+=parseInt(trialDataObject.aj)/100;
        zi_avg+=parseInt(trialDataObject.zi)/100;
        zj_avg+=parseInt(trialDataObject.zj)/100;
        verify_zi_avg+=parseInt(trialDataObject.verify_zi)/100;
        verify_zj_avg+=parseInt(trialDataObject.verify_zj)/100;
        kij_avg+=parseInt(trialDataObject.kij)/100;
        yij_avg+=parseInt(trialDataObject.yij)/100;
        // Saving averaged values
        // Opening file
        fs.open(config.dataDir+"/trial_average.json", "w", function(err, fileDescriptor){
          if(!err&&fileDescriptor){
            // Preparing data
            const averageData = {
              "sij": sij_avg,
              "ai": ai_avg,
              "zi": zi_avg,
              "verify_zi": verify_zi_avg,
              "aj": aj_avg,
              "zj": zj_avg,
              "verify_zj": verify_zj_avg,
              "kij": kij_avg,
              "yij": yij_avg
            };
            // Converting average_data to string
            const averageDataString = JSON.stringify(averageData);
            // Writing to file
            fs.write(fileDescriptor, averageDataString, function(err){
              if(!err){
                // Closing file
                fs.close(fileDescriptor, function(err){
                  if(err){
                    console.error("Error while closing file trial_average.json");
                    console.error("Error: ", err);
                  }
                });
              }else{
                console.error("Error while writing data to trail_average.json");
                console.error("Error: ", err);
              }
            });
          }else{
            console.error("Error while opening file trial_average.json");
            console.error("Error: ", err);
          }
        });
      }else{
        console.error("Error while reading data from trial"+i+".json");
        console.error("Error: ", err);
      }
    });
  }
};

// Calling function
average();
