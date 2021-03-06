//exporting only that environment which is passed through command line


var environments = {}

environments.staging = {
    "httpPort" : 3000,
    "httpsPort" : 3001,
    "envName" : "staging"
}

environments.production = {
    "httpPort" : 5000,
    "httpsPort" : 5001,
    "envName" : "production"
}

//getting the environment from command line
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : "";

//exporting the environment, setting staging as default
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;


module.exports = environmentToExport;