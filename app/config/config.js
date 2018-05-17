const config = {
    production: {
        port: (process.env.PORT || 1101),
        database: 'mongodb://localhost:27017/medit',
    },
    default: {
        port: (process.env.PORT || 1191),
        // database: 'mongodb://192.168.1.6:27017/medit',
        // database: 'mongodb://192.168.0.100:27017/medit',
        database: 'mongodb://localhost:27017/dacsa',
        // database: 'mongodb://dascauser:dasca@123@ds123500.mlab.com:23500/dasca',
    }
}

exports.get = function get(env) {
    return config[env] || config.default;
}