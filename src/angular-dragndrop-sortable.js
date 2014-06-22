var app = angular.module('jmr-drag-drop-sortable', []);

app.directive('dragDropSortable', ['$window', function($window) {
        'use strict';

        /*
        Just a small helper to find the parent element of dragged or entered element
        JQuery could do this, but we don't want to depend on jquery.
        Instead we implement small helpers depend on angulars jqLite, which is a subset of jquery.
        */
        function sortableParent(element) {
            if (angular.element(element).hasClass('sortable')) {
                return element;
            } else {
                sortableParent(angular.element(element).parent());
            }
        }

        function indexOf(searchedChildElement, parentElement) {
            var elems = parentElement.children();
            for (var i = 0; i < elems.length; i++) {
                if (searchedChildElement === elems[i]) {
                    return i;
                }
            }
        }

        /*
          This is shared state between all sortable lists, 
          but I guess we never drag-n-drop-sort more than one list at a time.
        */
        var draggedItemIndex;

        function handleDragStart(item) {
            draggedItemIndex = item.index;
            item.node.style.opacity = '0.4';
        }

        function handleDragOver(e) {
            // by default dragging a link would navigate to that link
            if (e.preventDefault) {
                e.preventDefault(); 
            }

            // Required to display the move cursor
            e.dataTransfer.dropEffect = 'move';

            return false;
        }

        /** 
          Most "angular"-operations such as $http, ng-show, ng-click, and so on trigger 
          the digest-phase which refreshes the DOM if the models have changed. Apply used here
          is just a wrapper around digest which evaluates the given fn before calling digest.
          The mouse events bound by this directive do not trigger digest, so we must
          do it ourself. If the digest is already in progress, angular will throw an exception.
          To prevent the "digest-already-in-progress"-exception we call the apply only when
          digest is not already in progress. 

          I'm not a 100% sure this check is necessary. Take it as a safety precaution.
        */
        function safeApply($scope, fn) {
            var phase = $scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                // At least 99.9% of the times we come here.
                $scope.$root.$apply(fn);
            }
        }

        function swap(list, idx1, idx2) {
            if (idx1 !== idx2) {
                var tmp = list[idx1];
                list[idx1] = list[idx2];
                list[idx2] = tmp;
            }
        }

        function handleDragEnter(scope, item) {
            item.node.classList.add('over');
            var enteredItemIndex = item.index;

            /*
            Update the "sortable items" -collection of the parent controller and call apply, 
            which will make angular refresh the changes to the DOM.
            */
            safeApply(scope, function() {
                swap(scope.items, draggedItemIndex, enteredItemIndex);
                draggedItemIndex = enteredItemIndex;
            });            
        }

        function handleDragLeave(e) {
            // "this" refers to the node (suspicious but does not work with e.target.classList.remove)
            this.classList.remove('over'); // jshint ignore:line
        }

        function handleDrop(e) {
            // by default some browsers do a redirect on drop, which is prevented here
            if (e.stopPropagation) {
                e.stopPropagation(); 
            }

            return false;
        }

        function handleDragEnd(e) {
            // "this" refers to the node (does not work with e.target.classList,...)
            this.classList.remove('over'); // jshint ignore:line
            this.style.opacity = '1'; // jshint ignore:line
        }

        function resolveItem(node, rootElement) {
            return {node: node, index: indexOf(sortableParent(node), rootElement)};
        }

        function bindEvents(scope, rootElement) {
            rootElement.children()
                .attr('draggable', 'true')
                .off('dragstart,dragenter,dragover,dragleave,drop,dragend')
                // "this" refers to the node which is dragged or entered
                .on('dragstart', function(e) { handleDragStart(resolveItem(this, rootElement)); })
                .on('dragenter', function(e) { handleDragEnter(scope, resolveItem(this, rootElement)); })
                .on('dragover', handleDragOver)
                .on('dragleave', handleDragLeave)
                .on('drop', handleDrop)
                .on('dragend', handleDragEnd);
        }


        function link(scope, element, attrs) {
            /*
             If items are added or loaded from a backend we must bind events
             to them. Without this, the event handlers will not attach
             because the html-elements have not been rendered (do not exist yet).
            */ 
            scope.$watch('items.length', function(newVal, oldVal) {
                bindEvents(scope, element);
            });
        }

        return {
            restrict: 'A',
            link: link,
            scope: {
                items: "="
            }
        };
    }
]);