#!/bin/bash

X=`pwd`
JARBASE=`basename "$X"`
JAR=$JARBASE.jar
echo "Building $JARBASE.jar"
mkdir -p build/chrome
pushd chrome
zip -r ../build/chrome/$JAR * -x \*.svn\* -x \*CVS\*
popd
if [ -f install.rdf ]; then
  cp install.rdf build/
fi
if [ -f install.js ]; then
  cp install.js build/
fi
if [ -d defaults/ ]; then
  cp -R defaults/ build/defaults/
fi
pushd build
zip -r ../$JARBASE.xpi *
popd
rm -rf build/
