//exporting only that environment which is passed through command line


var environment = {}

environment.staging = {
    "port" : 3000,
    "envName" : "staging"
}

environment.production = {
    "port" : 5000,
    "envName" : "production"
}

//getting the environment from command line
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV : "";

//exporting the environment, setting staging as default
var environmentToExport = typeof(environment[currentEnvironment]) == 'object' ? environment[currentEnvironment] : staging;


module.exports = environmentToExport;