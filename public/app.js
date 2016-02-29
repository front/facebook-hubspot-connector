'use strict';

angular.module('fb-hs', [])
.controller('MainCtrl', function ($scope, $timeout) {

  $scope.fbLogin = function () {
    // Only works after `FB.init` is called
    FB.login(function (res) {
      console.log('Login', res);
      $timeout(function () {
        $scope.login = res;
      });

      FB.api('/me/accounts', function (res) {
        console.log('Pages', res);
        $timeout(function () {
          $scope.pages = res;
        });
      });
    },
    {
      scope: 'manage_pages'
    });
  };

  $scope.subscribe = function (page) {
    if(!window.confirm('Are you sure?')) {
      return;
    }
    console.log('Subscring to the app', page);

    FB.api(
      '/' + page.id + '/subscribed_apps',
      'post',
      {
        access_token: page.access_token
      },
      function (res) {
        console.log('Subscribed... ', res);
        window.alert('Success. Check console for more info.');

        $timeout(function () {
          $scope.token = page.access_token;
        });
      }
    );
  };
});
