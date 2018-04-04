var app = angular.module('msisCapstone');

app.factory(
    'pagedItemList',
    function($filter) {

        // constructor for the pagedItemList object
        function pagedItemList(items, sortingOrder, itemsPerPage, searchField, query) {
            this.items = items;
            this.sortingOrder = sortingOrder || '';
            this.itemsPerPage = itemsPerPage || 3;
            this.searchField = searchField || '';
            this.query = query || '';
            this.filteredItems = [];
            this.groupedItems = [];
            this.pagedItems = [];
            this.currentPage = 0;

            this.search();
        };

        // returns true if needle is in haystack
        var searchMatch = function (haystack, needle) {
                if (!needle) {
                    return true;
                }
                return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };

        // assign public methods to the pagedItemList object
        pagedItemList.prototype = {

            // change the query string
            setQuery: function(query) {
                this.query = query;
            },

            // gets a group of paged items that match the query string
            search : function () {
                var self = this;

                // filter the items by the query string
                this.filteredItems = $filter('filter')(this.items, function (item) {
                    if (searchMatch(item[self.searchField], self.query)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });

                // sort the items by the sorting order
                if (this.sortingOrder !== '') {
                    this.filteredItems = $filter('orderBy')(this.filteredItems, this.sortingOrder);
                };

                // set the current page to 0
                this.currentPage = 0;

                // group by pages
                this.groupToPages();
            },
//
//                // show items per page
//                perPage: function () {
//                    this.groupToPages();
//                },

            // group the items to pages
            groupToPages: function () {
                this.pagedItems = [];

                // loop through each of the filtered items
                for (var i = 0; i < this.filteredItems.length; i++) {
                    // if i is a multiple of items per page
                    if (i % this.itemsPerPage === 0) {
                        // assign an array with the item at index i in filtered items to the appropriate page
                        this.pagedItems[Math.floor(i / this.itemsPerPage)] = [ this.filteredItems[i] ];
                    } else {
                        // otherwise push the item at index i in filtered items to the array of items at the appropriate page
                        this.pagedItems[Math.floor(i / this.itemsPerPage)].push(this.filteredItems[i]);
                    }
                }
            },

            // return a range of numbers from start to end
            range: function (start, end) {
                var ret = [];
                if (!end) {
                    end = start;
                    start = 0;
                };
                for (var i = start; i < end; i++) {
                    ret.push(i);
                };
                return ret;
            },

            // move back one page
            prevPage: function () {
                if (this.currentPage > 0) {
                    this.currentPage--;
                }
            },

            // move forward one page
            nextPage: function () {
                if (this.currentPage < this.pagedItems.length - 1) {
                    this.currentPage++;
                }
            },

            // set current page to n
            setPage: function (n) {
                this.currentPage = n;
            }

        }

        // return the object
        return pagedItemList;
    }
)
