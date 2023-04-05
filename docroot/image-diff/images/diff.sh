#compare images

TOTAL=$(ls before/ | wc -l)
i=1

for file in $(find before/ -type f -name "*.png");

do 

echo "Comparing image ${i} of ${TOTAL}";
./compare.sh before/$(basename $file) after/$(basename $file);
i=$((i+1));

done
