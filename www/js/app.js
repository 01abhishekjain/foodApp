// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngCordova'])

app.run(function($ionicPlatform, $cordovaGeolocation) {
	$ionicPlatform.ready(function( ) {




		var posOptions = {timeout: 10000, enableHighAccuracy: false};
		$cordovaGeolocation
			.getCurrentPosition(posOptions)
			.then(function (position) {
				console.log( position );
				// var lat  = position.coords.latitude
				// var long = position.coords.longitude
			}, function(err) {
				// error
				console.log( err );
			});






		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

	//NOTE: ionic.bundle.js is changed to fix bug: side menu not draggable when overflow scroll is true
	$ionicConfigProvider.scrolling.jsScrolling(false);

	$urlRouterProvider.otherwise("/landingPage");
	faker.locale = "en";

	$stateProvider
	.state('landingPage', {
		url: "/landingPage",
		templateUrl: "templates/landingPage.html",
		// controller: 'c_landingPage'
	})

	.state('cartPage', {
		url: "/cartPage",
		templateUrl: "templates/cartPage.html",
		// controller: 'c_landingPage'
	});

});

//create fake food datas
app.factory('foodFactory', function() {

	var foodProds = [];
	for( var i=0; i<4; i++ ){
		var singleProd = {};
		singleProd.prodName = generateRandomProduct();
		singleProd.amount = faker.finance.amount();
		// singleProd.maxQty = Math.floor (Math.random()*10)+1;
		singleProd.maxQty = 100;
		singleProd.prodId = 'food_'+i;
		singleProd.prodImg = "http://lorempixel.com/640/480/food/";
		singleProd.prodShortDesc = faker.lorem.sentences();

		singleProd.qty = 0; //qty that user will enter

		foodProds.push( singleProd );
	}
	return {
			foodProds: foodProds
	};
});

app.controller("c_landingPage", function($scope, foodFactory){
	console.log( "c_landingPage called" );
	// console.log( foodFactory );

	$scope.data = {};
	$scope.data.cart = {};
	$scope.data.cart.items = [];
	$scope.data.cart.totalCount = 0;

	$scope.data.foodFactory = foodFactory;

	$scope.changeQuantity = function(type){

		if( type == "minus" && this.item.qty>0){      
			for( var i=0; i<$scope.data.cart.items.length; i++ ){

				if( $scope.data.cart.items[i].prodId == this.item.prodId && $scope.data.cart.items[i].qty>1)
					$scope.data.cart.items[i].qty--;
				else if( $scope.data.cart.items[i].prodId == this.item.prodId && $scope.data.cart.items[i].qty==1 )
					$scope.data.cart.items.splice( i, 1 );

			}

			this.item.qty--;
			$scope.data.cart.totalCount--;

			// console.log( $scope.data );
		}

		else if( type == "plus" && this.item.qty<this.item.maxQty){

			// console.log( this.item );

			if( $scope.data.cart.items.length > 0 ){
				for( var i=0; i<$scope.data.cart.items.length; i++ ){

					if( $scope.data.cart.items[i].prodId == this.item.prodId ){
						$scope.data.cart.items[i].qty++;
						break;
					}
					else if( i == $scope.data.cart.items.length-1 ){
						var item = {};
						item.prodId = this.item.prodId;
						item.qty = 1;
						item.prodName = this.item.prodName;
						item.prodAmount = this.item.amount;
						$scope.data.cart.items.push( item );
						break;
					}
				}
			}
			else{
				var item = {};
				item.prodId = this.item.prodId;
				item.qty = 1;
				item.prodName = this.item.prodName;
				item.prodAmount = this.item.amount;
				$scope.data.cart.items.push( item );
			}

			this.item.qty++;
			$scope.data.cart.totalCount++;

			// console.log( $scope.data );
			
		}

	}

	$scope.totalCartAmount = function(){
		// console.log( $scope.data.cart.items );
		console.log( "totalCartAmount()" );

		var totalAmount = 0;
		for( var i=0; i<$scope.data.cart.items.length; i++ ){
			totalAmount += $scope.data.cart.items[i].prodAmount * $scope.data.cart.items[i].qty;
		}

		return totalAmount;
	}

	$scope.placeOrder = function(){
		console.log( "inside placeOrder" );
		
		
	}

});






























































app.factory('geoFactory', function() {

	var locationReceived = false;

	return {
		locationReceived: locationReceived
	};
});

function getGeo( lat, lng ){
	console.log( "inside getGeo" );
	var latlng = new google.maps.LatLng(lat, lng);
	var geocoder = new google.maps.Geocoder();
	return geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				return results;
			} else {
				return false;
			}
		} else {
			// console.log("Geocoder failed due to: " + status);
			return false;
		}
	});
}

function getLocation( geoPlugin, geoFactory ){

	console.log( "inide getLocation" );
	console.log( geoPlugin );

	console.log( geoFactory );

	console.log( locationReceived );

	var posOptions = {timeout: 1000, enableHighAccuracy: false};
	geoPlugin
			.getCurrentPosition(posOptions)
			.then(function (position) {
				console.log( "success------------" );
				console.log( position );
			}, function(err) {
				console.log( "error--------" );
				console.log( err );
			});
}

// app.controller('c_sideMenu', function($scope, $ionicSideMenuDelegate) {
//   console.log( "c_sideMenu called" );

//   $scope.showSearch = false;

//   $scope.toggleRight = function() {
//     $ionicSideMenuDelegate.toggleRight();
//   };

//   $scope.toggleSearch = function(){
//     $scope.showSearch = ($scope.showSearch == true) ? false : true;
//   }
// });