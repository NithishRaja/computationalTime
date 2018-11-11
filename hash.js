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
  // Setting parameters for node 1
  const node1 = {
    "id": "12121212",
    "privateKey": "12345678"
  };
  // Setting parameters for node 2
  const node2 = {
    "id": "99133063",
    "privateKey": "g3f1kzyn"
  };
  // Hashing data 1
  let a = hashFunction(node2.privateKey+node1.id);
  // Hashing data 2
  let b = hashFunction(node1.privateKey+node2.id);
  // Calculating S[i][j]
  let time = process.hrtime();
  let res = XOR(a, b);
  let diff = process.hrtime(time);
  // Calculating a[i]
  let time_ai = process.hrtime();
  let ai = XOR(res, a);
  let diff_ai = process.hrtime(time_ai);
  // Calculating z[i]
  // Generating random number
  let time_zi = process.hrtime();
  const t1 = Math.round(Math.random()*Math.pow(10, a.length));
  let zi = hashFunction(ai+t1.noExponents());
  let diff_zi = process.hrtime(time_zi);
  // Verifying z[i]
  let time_verify_zi = process.hrtime();
  let verify_zi = hashFunction(b+t1.noExponents());
  let diff_verify_zi = process.hrtime(time_verify_zi);
  // Calculating a[j]
  let time_aj = process.hrtime();
  aj = XOR(res, b);
  let diff_aj = process.hrtime(time_aj);
  // Calculating z[j]
  // Generating rendom number
  let time_zj = process.hrtime();
  const t2 = Math.round(Math.random()*Math.pow(10, a.length));
  let zj = hashFunction(aj+t2.noExponents());
  let diff_zj = process.hrtime(time_zj);
  // Verifying z[j]
  let time_verify_zj = process.hrtime();
  let verify_zj = hashFunction(a+t2.noExponents());
  let diff_verify_zj = process.hrtime(time_verify_zj);
  // Generating shared key k[i][j]
  let time_kij = process.hrtime();
  let ait1 = XOR(ai, t1.noExponents());
  let ajt2 = XOR(aj, t2.noExponents());
  let kij = hashFunction(ait1+ajt2);
  let diff_kij = process.hrtime(time_kij);
  // Generating y[i][j]
  let time_yij = process.hrtime();
  let titj = XOR(t1.noExponents(), t2.noExponents());
  let yij = hashFunction(kij, titj);
  let diff_yij = process.hrtime(time_yij);
  // Returning data
  return {
    "sij": diff[0]*NS_PER_SEC+diff[1],
    "ai": diff_ai[0]*NS_PER_SEC+diff_ai[1],
    "zi": diff_zi[0]*NS_PER_SEC+diff_zi[1],
    "verify_zi": diff_verify_zi[0]*NS_PER_SEC+diff_verify_zi[1],
    "aj": diff_aj[0]*NS_PER_SEC+diff_aj[1],
    "zj": diff_zj[0]*NS_PER_SEC+diff_zj[1],
    "verify_zj": diff_verify_zj[0]*NS_PER_SEC+diff_verify_zj[1],
    "kij": diff_kij[0]*NS_PER_SEC+diff_kij[1],
    "yij": diff_yij[0]*NS_PER_SEC+diff_yij[1]
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
