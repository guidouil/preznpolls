# NOT AS ROOT
cd
rm -rf preznpolls-source
rm -rf builds
git clone https://github.com/guidouil/preznpolls.git preznpolls-source
cd preznpolls-source
meteor npm install --save highcharts
meteor npm install --save moment
meteor build ../builds/. --server-only
cd ../builds/
tar xzf preznpolls-source.tar.gz
cd
forever stop preznpolls
rm -rf preznpolls
cd builds
mv bundle ../preznpolls
cd ../preznpolls/programs/server/
npm install
cd
export MONGO_URL='mongodb://127.0.0.1:27017/preznpolls'
export PORT=3000
export ROOT_URL='http://preznpolls.com'
forever start --append --uid "preznpolls" preznpolls/main.js
date
