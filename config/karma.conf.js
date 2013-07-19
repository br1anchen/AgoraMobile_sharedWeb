basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/lib/angular/angular.js',
  'app/lib/angular/angular-*.js',
  'test/lib/angular/angular-mocks.js',
  'app/lib/angular-ui/*.js' ,
  'app/lib/underscore.js' ,
  'app/lib/jquery-1.10.1.js',
  'app/lib/moment.min.js',
  'app/js/**/*.js',
  'test/mock-data/*.js',
  'test/unit/**/*.js'
];

autoWatch = true;

browsers = ['PhantomJS'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
