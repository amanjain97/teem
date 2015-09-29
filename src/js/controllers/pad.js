'use strict';

/**
 * @ngdoc function
 * @name Pear2Pear.controller:ChatCtrl
 * @description
 * # Chat Ctrl
 * Show Pad for a given project
 */

angular.module('Pear2Pear')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/communities/:comId/projects/:id/pad', {
        templateUrl: 'pad/show.html',
        controller: 'PadCtrl'
      });
  }])
  .controller('PadCtrl', [
              'SwellRTSession', 'pear', '$rootScope', '$scope', '$route', '$location', '$timeout', 'SharedState',
              function(SwellRTSession, pear, $rootScope, $scope, $route, $location, $timeout, SharedState){

    $scope.urlId = pear.urlId;
    $scope.communityId = $route.current.params.comId;

    SwellRTSession.onLoad(function(){
      pear.projects.find($route.current.params.id)
        .then(function(proxy) {
          $scope.project = proxy;
        });

      pear.timestampProjectAccess($route.current.params.id);
    });

    // Should use activeLinks, but https://github.com/mcasimir/mobile-angular-ui/issues/262
    $scope.nav = function(id) {
      return id === 'pad' ? 'active' : '';
    };

    $scope.titleReminder = function titleReminder() {
      SharedState.turnOff('projectTitleReminder');

      document.querySelector('.project-title input').focus();
    };

    // Do not leave pad without giving a title to the project
    $rootScope.$on('$routeChangeStart', function(event) {
      if ($scope.project.title === undefined || $scope.project.title === '') {
        event.preventDefault();

        SharedState.turnOn('projectTitleReminder');
      }
    });

    angular.element(document.querySelector('.swellrt-editor')).on(
      'focusin',
      function(){
        pear.projects
          .addContributor($route.current.params.id);
      });
  }]);
