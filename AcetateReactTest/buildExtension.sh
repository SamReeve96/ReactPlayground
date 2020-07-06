#You may need to run the command 'chmod +x buildExtension.sh' to give this script permissions to execute first!

#!/bin/bash

## Clear previous build dir
echo 'Cleaing directory'
rm -rf extensionBuild
mkdir extensionBuild

# Copy Extension manifest
cp ./extensionSrc/manifest.json ./extensionBuild/

## Content script
echo 'Building content script react app'
# run create react app to build the content script
cd ./extensionSrc/contentscript/
npm run build

# Move build contents to extension folder
mv ./build ../../extensionBuild/content

## Compile Sass
echo 'Compiling Sass'
# Content
sass --no-source-map ./Sass/cardsContainer.scss ../../extensionBuild/content/cardsContainer.css
sass --no-source-map ./Sass/content.scss ../../extensionBuild/content/content.css

# Popup
sass --no-source-map ../popup/popup.scss ../../extensionBuild/popup/popup.css


## Compile typescript
echo 'Compiling typescript'
cd ../background/
tsc
cd ../popup/
tsc

echo 'Done!'
