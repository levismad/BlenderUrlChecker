#!/bin/bash
echo "Bash version ${BASH_VERSION}..."  
echo "current: "$(env | grep CURRENT)
currentStr=$(printenv CURRENT)
CURRENT=$(($currentStr + 0))
currentStr=$(printenv TOTAL)
total=$(($currentStr + 0))
default=500
for (( i=$CURRENT; i<=$total; i+= $default ))
  do
        echo "current: "$CURRENT
        CURRENT=$(($default + $i))
        cross-env BARRAMENTO=$i,$CURRENT node index.js
        export CURRENT
 done