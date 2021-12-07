// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  
  // baseUrl:'https://insight.smartcadre.in/',
  // baseUrl2:'https://insight.smartcadre.in:8085/',
   baseUrl:'http://104.211.67.151/',
   baseUrl2:'http://104.211.67.151:8085/',
   devicesUrl: 'http://104.211.67.151:8087/',
  //  rulesUrl : 'http://40.81.80.138:8085/',
   rulesUrl : 'http://104.211.67.151:9095/',
   testBaseUrl:"http://104.211.67.151:9090/"
   
};
