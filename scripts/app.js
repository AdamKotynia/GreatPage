(function() {


    var app = angular.module('myStore', ['ngRoute']);

    app.config(function($routeProvider){
        $routeProvider

            .when('/', {
                templateUrl: 'index.html',
                controller: ''
            })
            .when('/category', {
                templateUrl: 'category.html',
                controller: ''
            })
            .when('/product', {
                templateUrl: 'product.html',
                controller: ''
            })
            .when('/cart', {
                templateUrl: 'cart.html',
                controller: ''
            })
            .when('/form', {
                templateUrl: 'form.html',
                controller: ''
            })
            .when('/admin', {
                templateUrl: 'admin-panel.html',
                controller: ''
            })
            .when('/search', {
                templateUrl: 'search.html'
            })

    });

    app.directive('mainContent', function() {
        return {
            restrict: 'E',
            templateUrl: 'main-content.html',
            controller: function ($scope) {
                this.categories = $scope.team.data;
            },
            controllerAs: 'store'
        };
    });

    app.directive('navigationBar', function () {
        return {
            restrict: 'E',
            templateUrl: 'navigation-bar.html',
            controller: function() {
                this.el = navigation;
            },
            controllerAs: 'nav'
        };
    });

    app.directive('footery', function() {
        return {
            restrict: 'E',
            templateUrl: 'footery.html'
        };
    });

    app.directive('categoryProducts', function() {
        return {
            restrict: 'E',
            templateUrl: 'category-products.html',
            controller: function() {
                this.category = category;
            },
            controllerAs: 'catp'
        };
    });

    app.directive('categories', function() {
        return {
            restrict: 'E',
            templateUrl: 'categories.html',
            controller: function ($scope) {
                this.categories = $scope.team.data;
            },
            controllerAs: 'cat'
        };
    });

    app.directive('productMain', function() {
        return {
            restrict: 'E',
            templateUrl: 'product-main.html',
            controller: function() {
                this.category = category
            },
            controllerAs: 'prom'
        }

    });

    app.directive('productSuggest', function() {
        return {
            restrict: 'E',
            templateUrl: 'product-suggest.html',
            controller: function() {
                this.products = products
            },
            controllerAs: 'pros'
        }
    });

    app.directive('loginForm', function() {
        return {
            restrict: 'E',
            templateUrl: 'login-form.html'
        }
    });

    app.controller('ShopController', ['$scope', 'DataService', function($scope, DataService, $http) {
        $scope.products = products;
        $scope.count = 0;
        $scope.image = products[0].img;
        $scope.description = products[0].description;
        $scope.name = products[0].name;
        $scope.id = 0;
        $scope.total = 0;
        $scope.id1 = function() {
            var i = 0;
            $scope.products.forEach(function(){
                i += 1
            });
            return i;
        };

        $scope.addProduct = function() {
            $http.post("https://demo8644811.mockable.io/cyc", {
                "id": $scope.id1, "name": $scope.name1, "description": $scope.description1,
                "price": $scope.price1, "img": $scope.img1, "quantity": 0
            });
        };

        var promise = DataService.getProds();
        promise.then(function(data){
            $scope.team = data;
            console.log($scope.team)
        });

        $scope.addToCart = function(currentId) {
            $scope.count += 1;
            $scope.products[currentId].quantity += 1;
            $scope.orderSum();

        };

        $scope.loadProduct = function(currentId) {
            $scope.image = products[currentId].img;
            $scope.description = products[currentId].description;
            $scope.name = products[currentId].name;
            $scope.id = products[currentId].id
        };

        $scope.removeFromCart = function(currentId) {
            $scope.count -= 1;
            $scope.products[currentId].quantity -= 1;
            $scope.orderSum();
        };

        $scope.orderSum = function() {
            $scope.total = 0;
            $scope.products.forEach(function(product) {

                $scope.total += product.quantity * product.price;
            });
        };
    }]);

    app.controller('LoginController',function ($scope, $rootScope,  LogService) {
            var isLogged = false;

            var usrname = '';
            $scope.uName = LogService.getName();

            $rootScope.submit = function(){
                var login = $scope.username;
                var password = $scope.password;
                users.forEach(function (element){
                    if (element.login == login && element.haslo == password){
                        isLogged = true;
                        LogService.loggedIn();
                        alert("Success!");
                        usrname = element.imie;
                        LogService.setName(usrname);
                        if (element.login == 'x' && element.haslo == 'x') {
                            $scope.admin = true;
                        }
                    }
                });
                if (!isLogged)
                    alert("Login or password incorrect");
            };

            $scope.logout = function(){
                isLogged = false;
                LogService.loggedOut();
                $scope.count = 0;
                $scope.total = 0;
                $scope.products.forEach(function(product) {
                    product.quantity = 0;
                });
                $scope.admin = false;
            };

            $scope.isLoggedIn = function(){
                return (!LogService.ifLogged());
            };
        }
    );

    app.service('LogService', function() {

        var isInside = false;
        var uname = '';
        return {

            loggedIn: function(){
                isInside = true;
                return isInside;
            },

            loggedOut: function(){
                isInside = false;
                return isInside;
            },

            ifLogged: function(){
                return isInside;
            },

            setName: function(name){
                uname = name;
            },

            getName: function(){
                return uname;
            }
        }
    });

    app.controller('searchController', function($scope, $http){
        $scope.pgnumbers = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91];
        $scope.results = [];

        $scope.getResults = function(pgnumber){
            var url = 'https://www.googleapis.com/customsearch/v1?' +
                'googlehost=google.co.uk&safe=medium&searchType=image&start='+pgnumber+'&' +
                'key=AIzaSyCwA35ibvlnqrIbjGQepRtBVWJNHB3hMdA&cx=010146182105979843094:z2dcm8ayrqu&q=';
            $http.get(url + $scope.search_key + "'").success(function(data){
                $scope.results = data.items;
            })
        };
    });

    app.service('DataService', function($http, $q){
        var categori =  $q.defer();

        $http.get("scripts/json/package.json").then(function(data){
            categori.resolve(data);
        });

        this.getProds = function(){
            return categori.promise;
        };


    });

    var navigation = [
        {
            name: 'Main Page',
            link: '#/'
        },
        {
            name: 'Category Page',
            link: '#/category'
        },
        {
            name: 'Product Page',
            link: '#/product'
        },
        {
            name: 'Product Cart',
            link: '#/cart'
        },
        {
            name: 'Admin Panel',
            link: '#/admin'
        },
        {
            name: 'Search',
            link: '#/search'
        }
    ];

    var category = [
        {
            name: 'Lorem',
            img: 'images/content.jpg',
            link: '#/product'
        },
        {
            name: 'Lorem',
            img: 'images/content.jpg',
            link: '#/product'
        },
        {
            name: 'Lorem',
            img: 'images/content.jpg',
            link: '#/product'
        },
        {
            name: 'Lorem',
            img: 'images/content.jpg',
            link: '#/product'
        },
        {
            name: 'Lorem',
            img: 'images/content.jpg',
            link: '#/product'
        },
        {
            name: 'Lorem',
            img: 'images/content.jpg',
            link: '#/product'
        }
    ];

    var products = [
        {
            id: '0',
            name: 'lorem1',
            description: 'lorem ipsum1',
            price: 20,
            img: 'images/content.jpg',
            quantity: 0
        },
        {
            id: '1',
            name: 'lorem2',
            description: 'lorem ipsum2',
            price: 21,
            img: 'images/content1.jpg',
            quantity: 0
        },
        {
            id: '2',
            name: 'lorem3',
            description: 'lorem ipsum3',
            price: 22,
            img: 'images/content2.jpg',
            quantity: 0
        },
        {
            id: '3',
            name: 'lorem4',
            description: 'lorem ipsum4',
            price: 23,
            img: 'images/content3.jpg',
            quantity: 0
        },
        {
            id: '4',
            name: 'lorem5',
            description: 'lorem ipsum5',
            price: 24,
            img: 'images/content4.jpg',
            quantity: 0
        },
        {
            id: '5',
            name: 'lorem6',
            description: 'lorem ipsum6',
            price: 25,
            img: 'images/content5.jpg',
            quantity: 0
        }
    ];

    var users = [
        {imie: 'Aneta', login: 'student1', haslo: 'anetka123'},
        {imie: 'Adam', login: 'student2', haslo: 'ferrari87'},
        {imie: 'Alan', login: 'student3', haslo: 'youtube2015'},
        {imie: 'x', login: 'x', haslo: 'x'}
    ];
})();