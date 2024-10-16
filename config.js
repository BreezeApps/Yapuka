const fs = require('fs')

const base_config = JSON.stringify({
    mysql_database: false,
    database: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: ""
    }
})

if(!fs.existsSync('config.json')) {
    fs.writeFileSync('config.json', base_config)
}