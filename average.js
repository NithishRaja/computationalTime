/*
 * File containing code to average data
 *
 */

// Dependencies
const fs = require("fs");
const config = require("./config");

// Function
const average = function(){
  let f1i_avg=0, f2i_avg=0, f3i_avg=0, M1_avg=0, AIDi_avg=0, M2_avg=0, verify_f1i_avg=0, verify_R1_avg=0, verify_IDi_avg=0, AIDj_avg=0, M_1_avg=0, M_2_avg=0, skij_avg=0, M__1_avg=0;
  // Looping through 100 times
  for(let i=1;i<=config.noOfTrials;++i){
    // Reading data from file
    fs.readFile(config.dataDir+"/trial"+i+".json", function(err, trialData){
      if(!err&&trialData){
        // Converting data into object
        trialDataObject = JSON.parse(trialData.toString());
        // Cumulating averages
        // sij_avg+=parseInt(trialDataObject.sij)/config.noOfTrials;
        // ai_avg+=parseInt(trialDataObject.ai)/config.noOfTrials;
        // aj_avg+=parseInt(trialDataObject.aj)/config.noOfTrials;
        // zi_avg+=parseInt(trialDataObject.zi)/config.noOfTrials;
        // zj_avg+=parseInt(trialDataObject.zj)/config.noOfTrials;
        // verify_zi_avg+=parseInt(trialDataObject.verify_zi)/config.noOfTrials;
        // verify_zj_avg+=parseInt(trialDataObject.verify_zj)/config.noOfTrials;
        // kij_avg+=parseInt(trialDataObject.kij)/config.noOfTrials;
        // yij_avg+=parseInt(trialDataObject.yij)/config.noOfTrials;
        f1i_avg+=parseInt(trialDataObject.f1i)/config.noOfTrials;
        f2i_avg+=parseInt(trialDataObject.f2i)/config.noOfTrials;
        f3i_avg+=parseInt(trialDataObject.f3i)/config.noOfTrials;
        M1_avg+=parseInt(trialDataObject.M1)/config.noOfTrials;
        AIDi_avg+=parseInt(trialDataObject.AIDi)/config.noOfTrials;
        M2_avg+=parseInt(trialDataObject.M2)/config.noOfTrials;
        verify_f1i_avg+=parseInt(trialDataObject.verify_f1i)/config.noOfTrials;
        verify_R1_avg+=parseInt(trialDataObject.verify_R1)/config.noOfTrials;
        verify_IDi_avg+=parseInt(trialDataObject.verify_IDi)/config.noOfTrials;
        AIDj_avg+=parseInt(trialDataObject.AIDj)/config.noOfTrials;
        M_1_avg+=parseInt(trialDataObject.M_1)/config.noOfTrials;
        M_2_avg+=parseInt(trialDataObject.M_2)/config.noOfTrials;
        skij_avg+=parseInt(trialDataObject.skij)/config.noOfTrials;
        M__1_avg+=parseInt(trialDataObject.M__1)/config.noOfTrials;
        // Saving averaged values
        // Opening file
        fs.open(config.dataDir+"/trial_average.json", "w", function(err, fileDescriptor){
          if(!err&&fileDescriptor){
            // Preparing data
            const averageData = {
              "f1i": f1i_avg,
              "f2i": f2i_avg,
              "f3i": f3i_avg,
              "M1": M1_avg,
              "AIDi": AIDi_avg,
              "M2": M2_avg,
              "verify_f1i": verify_f1i_avg,
              "verify_R1": verify_R1_avg,
              "verify_IDi": verify_IDi_avg,
              "AIDj": AIDj_avg,
              "M_1": M_1_avg,
              "M_2": M_2_avg,
              "skij": skij_avg,
              "M__1": M__1_avg
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
