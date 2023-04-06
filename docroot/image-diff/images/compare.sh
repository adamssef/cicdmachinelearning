#!/bin/bash

compare -metric MSE $1 $2 diff/$(basename $1) 2>a.txt

percentage=$(cat a.txt)

if [ "$percentage" == "0 (0)" ]
then
	rm diff/$(basename $1)
fi

echo "" > a.txt
