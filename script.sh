#!/bin/bash
echo "Bash version ${BASH_VERSION}..."  
echo "current: "$(env | grep CURRENT)
currentStr=$(printenv CURRENT)
current=$(($currentStr + 0))
currentStr=$(printenv TOTAL)
total=$(($currentStr + 0))
default=500
for (( i=$current; i<=$total; i+= $default ))
  do
        echo "current: "$current
        sum=$(($default + $i))
        cross-env BARRAMENTO=$i,$sum node index.js
        export CURRENT=$current
 done