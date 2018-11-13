/*
 * File containing test code for hash functions
 *
 */

// Dependencies
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const config = require("./config");

// XOR function
const XOR = function(a, b){
  let res = "";
  // Calculating XOR
  a.split("").forEach(function(char, pos){
    let temp=char.charCodeAt(0)^b.charCodeAt(pos);
    res+=String.fromCharCode(temp);
  });
  // Returning result
  return res;
};

// Function to generate hash and return it
const hashFunction = function(str){
  let hash = crypto.createHash(config.hashFunction);
  hash.update(str);
  return hash.digest("base64");
};

// Function to convert exponent to string
Number.prototype.noExponents= function(){
    var data= String(this).split(/[eE]/);
    if(data.length== 1) return data[0];

    var  z= '', sign= this<0? '-':'',
    str= data[0].replace('.', ''),
    mag= Number(data[1])+ 1;

    if(mag<0){
        z= sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;
    while(mag--) z += '0';
    return str + z;
};

// Hash function
const authenticate = function(){
  const NS_PER_SEC = 1e9;
  // Initializing pre-shared key
  const PSK = hashFunction("pre shared key");
  // Initializing authentication server secret key
  const x = 50749371;
  // Setting node parameters
  const node1 = {
    "id": 9791312
  };
  // Calculating f1i
  const f1i = hashFunction(node1.id+""+x);
  // Calculating f2i
  const f2i = hashFunction(f1i);
  // Calculating f3i
  const f3i = XOR(PSK, f1i);
};

const loop = function(){
  // Running loop for 100 tries
  for(let i=1;i<=config.noOfTrials;++i){
    // Calling authenticate function
    const resultObject = authenticate();
    // Saving trial data
    // Opening file
    fs.open(config.dataDir+"/trial"+i+".json", "w", function(err, fileDescriptor){
      if(!err&&fileDescriptor){
        // Writing to file
        // Converting resultObject to string
        const resultString = JSON.stringify(resultObject);
        fs.write(fileDescriptor, resultString, function(err){
          if(!err){
            fs.close(fileDescriptor, function(err){
              if(err){
                console.error("Error while closing file: trial"+i+".json");
                console.error("Error: ", err);
              }
            });
          }else{
            console.error("Error while writing to file file: trial"+i+".json");
            console.error("Error: ", err);
          }
        });
      }else{
        console.error("Error while opening file: trial"+i+".json");
        console.error("Error: ", err);
      }
    });
  }
};

// Callling loop function
authenticate();
