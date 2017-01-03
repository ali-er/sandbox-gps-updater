

const fs = require('fs')
const path = require('path')
module.exports = {


    save(data) {
        if (!data || !data.length) {
            return
        }

        let ROOT_APP_PATH = fs.realpathSync('.')
        console.log(ROOT_APP_PATH)


        var wstream = fs.createWriteStream(__dirname + "/" + new Date().toLocaleTimeString() + ".txt");

        wstream.on('open', function (fd) {
            for (let i = 0; i < data.length; ++i) {
                wstream.write(JSON.stringify(data[i]))
            }

            wstream.end();
        })

        wstream.on('finish', function () {
            console.log('file has been written');
        });

    }



}