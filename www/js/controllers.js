angular.module('starter.controllers', [])

.controller('GlobalCtrl', function($scope, $rootScope, $log, $ionicLoading, $ionicPopup){
  $log.debug('app started....');
  
    // Setup the loader
  $scope.show = function() {
    $ionicLoading.show({
      template: 'loading...',
//      template: '<ion-spinner icon="lines" class="spinner-stable"></ion-spinner>',//ionic 1.0.1@2015/07/25
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 50,
      showDelay: 0
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };
  
  $scope.alert = function(msg){
    var alertPopup = $ionicPopup.alert({
      title: '应用提示',
      template: msg,
      okText: '好的',
    });
  };


  $scope.$on('refresh', function(event){
    $scope.show();
  });
  $scope.$on('complete', function(event){
    $scope.hide();
  });
  $scope.$on('error', function(event, msg){
    $scope.hide();
    $scope.alert(msg);
  });
  
})


.controller('DashCtrl', function($scope, $http, $ionicLoading, $ionicPopup, $log) {
  
  $scope.loggedin = window.localStorage.getItem('loggedin')=='true'?true:false;
  
  $scope.user = {};
  $scope.user.username = window.localStorage.getItem('username');
  $scope.user.title = window.localStorage.getItem('title');
  $scope.user.image = window.localStorage.getItem('avatar');
  
  $scope.login = function(){
  	var userName = $scope.user.userName;
  	var password = $scope.user.password;
  	
    var url = 'http://203.81.28.218/kstart/login';
    var data = {phone:userName, password:password};
    
    $http.post(url, data).success(function(obj, status, headers, config) {
        $scope.$parent.hide();
        if(typeof(obj.meta) == 'undefined'){//login success
          $scope.loadUserInfo(obj.token);
          
          $scope.loggedin = true;//change the card state now!
          
          $scope.save('loggedin', 'true');//save it to cache
          $scope.save('token', obj.token);//save it to cache
          
          return;
        }
      
        if(obj.meta.code == 400 || obj.meta.code == 401){//failure
          $scope.$parent.alert('登录失败!');
        }
      }).error(function(data, status, headers, config) {
        $scope.$parent.hide();
        $scope.$parent.alert('登录失败!');
      });
    // $log.debug("log in ..."); 
    $scope.$parent.show();

  };//end of login
  
  $scope.loadUserInfo = function(token){
    $http.get("http://203.81.28.218/kstart/userinformation/"+token).
      success(function(result){      
        $scope.$parent.hide();
        var data = result.data;
        $scope.user = data;//bind to form data
        $scope.save('avatar', data.image);
        $scope.save('username', data.username);
        $scope.save('company', data.company);
        $scope.save('title', data.title);
      }).
      error(function(data){
        $scope.$parent.hide();
        $scope.$parent.alert("获取用户资料失败!");
      });
  };
  
  $scope.save = function(key, value){
    window.localStorage.setItem(key, value);
  };
  
})

.controller('ChatsCtrl', function($scope, $log, $ionicPopup, $location, $http) {
  $scope.loggedin = window.localStorage.getItem('loggedin')=='true'?true:false;
  $scope.user = {};
  $scope.invitation = {};
  
  $scope.generate = function(){
    var phone  = $scope.user.phonenumber;
    var url = 'http://203.81.28.218/kstart/invitation/'+phone+'?token='+$scope.fetch('token');
    $http.get(url).success(function(result, status, headers, config) {
        $scope.$parent.hide();
        $log.debug(result.data);
        $scope.invitation = result.data.data;
      
      }).error(function(data, status, headers, config) {
        $scope.$parent.hide();
        $scope.$parent.alert('生成邀请码失败!');
      });
    // $log.debug("log in ..."); 
    $scope.$parent.show();
  }
  
  // An alert dialog
  $scope.showAlert = function() {
    if($scope.loggedin) return;
    
    var alertPopup = $ionicPopup.alert({
     title: '提示',
     template: '先登录！'
    });
    alertPopup.then(function(res) {
      $location.path('#/tab/dash');
    });
  };
  
  $scope.showAlert();
  
  $scope.fetch = function(key){
    return window.localStorage.getItem(key);
  };
  
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: false
  };
});
