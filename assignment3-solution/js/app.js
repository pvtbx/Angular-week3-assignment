(function (){
        angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItems);

        NarrowItDownController.$inject = ['MenuSearchService'];
        function NarrowItDownController(MenuSearchService){
            var $showList = this;
            $showList.searchTerm = '';
            $showList.foundItems = [];

            $showList.getMatchedMenuItems = function(searchTerm){
                if(searchTerm){
                    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
                    promise.then(function(items){
                        if(items.length > 0){
                            $showList.foundItems = items;
                        }
                    });
                }
            }

            $showList.removeItem = function(index){
                $showList.foundItems.splice(index,1);
            }
        }

        MenuSearchService.$inject = ['$http'];
        function MenuSearchService($http){
            var service = this;

            service.getMatchedMenuItems = function(searchTerm){
                return $http({
                    method: 'GET',
                    url: ('https://davids-restaurant.herokuapp.com/menu_items.json')
                }).then(function(response){
                    var foundItems = [];
                    console.log(response.data);

                    for(var i = 0; i < response.data['menu_items'].length;i++){
                        if(searchTerm.length > 0 && response.data['menu_items'][i]['description']
                        .toLowerCase().indexOf(searchTerm) !== -1){
                            foundItems.push(response.data['menu_items'][i]);
                        }
                    }
                    console.log(foundItems);
                    return foundItems;
                })
            };
        }

        function FoundItems(){
            var ddo = {

                templateUrl: 'foundItems.html', //
                scope:{
                    found: '<',
                    onRemove: '&'
                },
                controller: NarrowItDownController,
                controllerAs: 'showList',
                bindToController: true
            };
            return ddo;
        }

})();