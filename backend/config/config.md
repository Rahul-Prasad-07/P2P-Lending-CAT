### what is use case of building separate config folder ?

- The use case of building a separate config folder in your backend project is to allow you to configure different settings for each environment your application is deployed in, such as development, staging, and production.

- Having separate configuration files for each environment allows you to easily switch between different configurations without modifying your application code. 

- For example, you might want to use a different database connection string or API key depending on whether you are developing the application locally or deploying it to a production server. 
  
  - By defining these settings in separate configuration files, you can keep your application code the same and simply switch between different configurations by loading the appropriate configuration file.

Additionally, having a separate config folder can help you organize your application code and make it more maintainable. By keeping your configuration settings in a separate folder, you can easily find and modify them without having to search through your application code. This can save you time and reduce the risk of introducing bugs when modifying configuration settings.

Overall, building a separate config folder can help you build a more flexible and maintainable backend application that is easy to configure and deploy in different environments.

```
project/
├── config/
│   ├── development/
│   │   ├── database.json
│   │   ├── api_keys.json
│   │   └── ...
│   ├── staging/
│   │   ├── database.json
│   │   ├── api_keys.json
│   │   └── ...
│   ├── production/
│   │   ├── database.json
│   │   ├── api_keys.json
│   │   └── ...
│   └── common/
│       ├── constants.json
│       ├── functions.js
│       └── ...
├── src/
│   ├── index.js
│   ├── routes/
│   └── ...
└── package.json

```