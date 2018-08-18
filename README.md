# Provably-fair dice game
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).  

## demo  
https://dice-demo.herokuapp.com  

## dev  
```npm run start```  

## prod  
```npm run build```  

## tests
```npm run test```  

## provably-fair  
1. concatenate: `user seed + '_' + current unix time + '_' + Math.random();`  
2. take that concatenation, hash with sha256  
3. take hash, and get first 10 hex characters (40 bits)  
4. convert that hex string to decimal  
5. decimal mod 10,001 for game result
