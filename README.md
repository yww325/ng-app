# Introduction

This is a playground both for learning angular, also being used as personal photo album online(hosted somewhere else).
![Image of UI](https://github.com/yww325/ng-app/blob/master/docs/Capture1.PNG)
![Image of UI2](https://github.com/yww325/ng-app/blob/master/docs/Capture2.PNG)
* demo site: http://40.84.193.207/ng-app/
* backend(separated repo, see bottom) MongoDB + asp.net core webapi + oData http://40.84.193.207/MyPhotos/swagger
# Feature

* tree like folder structure of photos, videos and sound files
* logg-in user can have admin feature
* pagination of photos thumbnail display 
* filter by tag(supported by oData)
* full image viewing and slide forward and backward. 
* responsive UI (Flex layout)
* Angular Material
* NRGX

# NgApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version ~~7.3.8~~(updated to 10).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Working with backend
serve with different environment.ts, 
* in non-prod, the backend is hosted at http://localhost + /MyPhotos/ + path of each service.
* in prod, the backend is hosted at same domain's root +  /MyPhotos/ + path of each service.

## backend code is needed to run
* source: https://github.com/yww325/MyPhotoWebApi
* after upload files to MyPhotoSettings/RootFolder specified in appsettings.json, 
   go to Your Host/MyPhotos/swagger/index.html
* call the ingest POST api in swagger to create thumbnail and folder structures in db
* see the photo and videos in front end, and play with them.

