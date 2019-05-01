#!/bin/bash
echo "Bash version ${BASH_VERSION}..."  
echo "current: "$(env | grep CURRENT)
currentStr=$(printenv CURRENT)
current=$(($currentStr + 0))
default=1000
for i in {$current..159000..$default}
  do
        echo "current: "$current
        sum=$(($default + $i))
        cross-env BARRAMENTO=$i,$sum node index.js
        export CURRENT=$current
 done