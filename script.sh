#!/bin/bash
echo "Bash version ${BASH_VERSION}..."
for i in {9000..159000..1000}
  do
        default=1000
        sum=$(($default + $i))
        cross-env BARRAMENTO=$i,$sum node index.js
 done