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

// Function to generate random number
const generateRandomNumber = function(length){
  return Math.round(Math.random()*Math.pow(10, length));
};

// Function to convert exponent to string
Number.prototype.noExponents = function(){
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
  const x = "50749371";
  // Setting node parameters
  const node1 = {
    "id": "9791312"
  };
  // Registration phase
  // Calculating f1i
  const time_f1i = process.hrtime();
  const f1i = hashFunction(node1.id+x);
  const diff_f1i = process.hrtime(time_f1i);
  // Calculating f2i
  const time_f2i = process.hrtime();
  const f2i = hashFunction(f1i);
  const diff_f2i = process.hrtime(time_f2i);
  // Calculating f3i
  const time_f3i = process.hrtime();
  const f3i = XOR(PSK, f1i);
  const diff_f3i = process.hrtime(time_f3i);
  // Getting random number
  // Authentication phase - step 1
  const R1 = generateRandomNumber(f2i.length).noExponents();
  const time_M1 = process.hrtime();
  const M1 = XOR(hashFunction(f2i), R1);
  const diff_M1 = process.hrtime(time_M1);
  const time_AIDi = process.hrtime();
  const AIDi = hashFunction(XOR(R1, node1.id));
  const diff_AIDi = process.hrtime(time_AIDi);
  const time_M2 = process.hrtime();
  const M2 = hashFunction(R1+M1+AIDi);
  const diff_M2 = process.hrtime(time_M1);
  // Authentication phase - step 3
  const time_verify_f1i = process.hrtime();
  const verify_f1i = XOR(PSK, f3i);
  const diff_verify_f1i = process.hrtime(time_verify_f1i);
  const time_verify_R1 = process.hrtime();
  const verify_R1 = XOR(M1, hashFunction(f2i));
  const diff_verify_R1 = process.hrtime(time_verify_R1);
  const time_verify_IDi = process.hrtime();
  const verify_IDi = XOR(AIDi, hashFunction(R1));
  const diff_verify_IDi = process.hrtime(time_verify_IDi);
  // Authentication phase - step 4
  const R2 = generateRandomNumber(f2i.length).noExponents();
  const time_AIDj = process.hrtime();
  const AIDj = hashFunction(XOR(R2, node1.id));
  const diff_AIDj = process.hrtime(time_AIDj);
  const time_M_1 = process.hrtime();
  const M_1 = XOR(f1i, hashFunction(node1.id));
  const diff_M_1 = process.hrtime(time_M_1);
  const time_M_2 = process.hrtime();
  const M_2 = hashFunction(M_1+AIDj+R2);
  const diff_M_2 = process.hrtime(time_M_2);
  // Authentication phase - step 5
  const time_skij = process.hrtime();
  const skij = hashFunction(R1+R2);
  const diff_skij = process.hrtime(time_skij);
  // Authentication phase - step 7
  const verify_R2 = XOR(AIDj, hashFunction(node1.id));
  // Authentication phase - step 8
  const time_M__1 = process.hrtime();
  const M__1 = XOR(skij, hashFunction(R2));
  const diff_M__1 = process.hrtime(time_M__1);
  // Returning result object
  return {
    "f1i": diff_f1i[0]*NS_PER_SEC+diff_f1i[1],
    "f2i": diff_f2i[0]*NS_PER_SEC+diff_f2i[1],
    "f3i": diff_f3i[0]*NS_PER_SEC+diff_f3i[1],
    "M1": diff_M1[0]*NS_PER_SEC+diff_M1[1],
    "AIDi": diff_AIDi[0]*NS_PER_SEC+diff_AIDi[1],
    "M2": diff_M2[0]*NS_PER_SEC+diff_M2[1],
    "verify_f1i": diff_verify_f1i[0]*NS_PER_SEC+diff_verify_f1i[1],
    "verify_R1": diff_verify_R1[0]*NS_PER_SEC+diff_verify_R1[1],
    "verify_IDi": diff_verify_IDi[0]*NS_PER_SEC+diff_verify_IDi[1],
    "AIDj": diff_AIDj[0]*NS_PER_SEC+diff_AIDj[1],
    "M_1": diff_M_1[0]*NS_PER_SEC+diff_M_1[1],
    "M_2": diff_M_2[0]*NS_PER_SEC+diff_M_2[1],
    "skij": diff_skij[0]*NS_PER_SEC+diff_skij[1],
    "M__1": diff_M__1[0]*NS_PER_SEC+diff_M__1[1]
  };
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
loop();
