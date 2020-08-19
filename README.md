![Image of UI](https://github.com/yww325/ng-app/blob/master/docs/Capture1.PNG)
![Image of UI2](https://github.com/yww325/ng-app/blob/master/docs/Capture2.PNG)
# NgApp

This project was a playground both for learning angular, also serving as personal photo album online, 
was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

# Feature
* tree like folder structure of photos, videos and sound files
* logg-in user can have admin feature
* pagination of photos thumbnail display 
* filter by tag
* full image viewing and slide forward and backward. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## backend code is needed to run
https://github.com/yww325/MyPhotoWebApi
call the ingest api in swagger to create thumbnail and folder structures in db

