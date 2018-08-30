var myApp = angular.module('myApp', []);


myApp.factory('downloadFileService', ['$http', '$q',
    function downloadFilefunc($http, $q) {
        console.log('downloadFile fired');

        // interface
        var service = {
            downloadFile: downloadFile
        };
        return service;

        // implementation
        function downloadFile(getCsvTemplateUrl) {
            var def = $q.defer();
            console.log('coming in downloadFile : ' + getCsvTemplateUrl);
            $http.get(getCsvTemplateUrl).then(function successCallback(response) {
                def.resolve(response);
                console.log('Ajax call is successful.');
            }, function errorCallback(response) {
                alert('Not able to call get CSV URL.');
                console.log('Error : ' + JSON.stringify(response));
                def.reject('Not able to get data!' + JSON.stringify(response));
            });
            return def.promise;
        }
    }
]);

myApp.controller('myCtrl', function ($scope, $http, downloadFileService) {
    $scope.filename = 'Default.csv';
    var getCsvTemplateUrl = '<URL to download file>';
    /* var config = {
     };
     
     $scope.downloadFile = function (name) {
     $http.get(getCsvTemplateUrl,config).then(function successCallback(response) {
     console.log('Success : ' + JSON.stringify(response));
     }, function errorCallback(response) {
     alert('Not Read successfully.');
     console.log('Error : ' + JSON.stringify(response));
     });
     };
     */

    $scope.doDownload = function (name) {
        downloadFileService.downloadFile(getCsvTemplateUrl).then(
                function (response) {
                    var a = document.getElementById(name);

                    //get the file
                    var octetStreamMime = 'application/octet-stream';

                    //get the headers' content disposition
                    var cd = response.headers["content-disposition"];

                    //get the file name with regex
                    var regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    var match = regex.exec(cd);
                    console.log('regex : ' + regex);
                    console.log('match : ' + match);
                    //is there a file name?
                    var fileName = name+'.csv';//"myDefaultFileName.csv";

                    //replace leading and trailing slashes that C# added to your file name
                    fileName = fileName.replace(/\"/g, "");

                    //determine the content type from the header or default to octect stream
                    var contentType = response.headers["content-type"] || octetStreamMime;

                    //finally, download it
                    try {
                        var blob = new Blob([response.data], {type: contentType});

                        //downloading the file depends on the browser
                        //IE handles it differently than chrome/webkit
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            console.log("123....");
                            window.navigator.msSaveOrOpenBlob(blob, fileName);
                        } else {
                            console.log("1234....");
                            var objectUrl = URL.createObjectURL(blob);
                           // window.open(objectUrl);
                            a.href = objectUrl;
                            a.download = fileName;
                            a.click();
                            window.URL.revokeObjectURL(objectUrl);
                        }
                    } catch (exc) {
                        console.log("Save Blob method failed with the following exception.");
                        console.log(exc);
                    }

                },
                function (error) {
                    //an error occurred while trying the API, handle this
                    console.log(error);
                }
        );
    };

});
    