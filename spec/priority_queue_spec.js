describe("PriorityQueue", function() {
    var queue;
    var ascendingNumberComparator;

    beforeEach(function() {
        ascendingNumberComparator = new ajs.AscendingRelationalComparator();
    });

    it("should yield null when peeking on an empty queue", function() {
        expect(new ajs.PriorityQueue([], ascendingNumberComparator).peek()).toBeNull();
    });

    it("should yield the first element when peeking", function() {
        expect(new ajs.PriorityQueue([2, 67], ascendingNumberComparator).peek()).toBe(2);
    });

    it("should yield its size", function() {
        expect(new ajs.PriorityQueue([5, 3, 77], ascendingNumberComparator).size()).toBe(3);
    });

    it("should be empty when it has no data", function() {
        expect(new ajs.PriorityQueue([], ascendingNumberComparator).isEmpty()).toBe(true);
    });

    it("should not be empty when it has data", function() {
        expect(new ajs.PriorityQueue([44], ascendingNumberComparator).isEmpty()).toBe(false);
    });

    it("should be able to add a single item", function() {
        queue = new ajs.PriorityQueue([], ascendingNumberComparator);
        queue.add(4);
        expect(queue.peek()).toBe(4);
        expect(queue.size()).toBe(1);
    });

    it("should be able to add a child whose priority is greater than the root priority", function() {
        queue = new ajs.PriorityQueue([], ascendingNumberComparator);
        queue.add(5);
        queue.add(6);
        assertOrderOfDeletion(queue, [5, 6]);
    });

    it("should be able to add a child whose priority is less than the priority of the root", function() {
        queue = new ajs.PriorityQueue([], ascendingNumberComparator);
        queue.add(5);
        queue.add(4);
        assertOrderOfDeletion(queue, [4, 5]);
    });

    it("should be able to add an item that will have a parent and a child", function() {
        queue = new ajs.PriorityQueue([], ascendingNumberComparator);
        queue.add(5);
        queue.add(8);
        queue.add(19);
        queue.add(20);
        queue.add(9);
        assertOrderOfDeletion(queue, [5, 8, 9, 19, 20]);
    });

    it("should be able to add a single item in bulk", function() {
        queue = new ajs.PriorityQueue([], ascendingNumberComparator);
        queue.addAll(64);
        expect(queue.size()).toBe(1);
        expect(queue.peek()).toBe(64);
    });

    it("should be able to add multiple items at the same time", function() {
        queue = new ajs.PriorityQueue([], ascendingNumberComparator);
        queue.addAll(8, 3, 5, 1, 9);
        assertOrderOfDeletion(queue, [1, 3, 5, 8, 9]);
    });

    it("should be able to add an array with a single item in bulk", function() {
        queue = new ajs.PriorityQueue([], ascendingNumberComparator);
        queue.addAll([34]);
        expect(queue.size()).toBe(1);
        expect(queue.peek()).toBe(34);
    });

    it("should be able to add an array of items at the same time", function() {
        queue = new ajs.PriorityQueue([], ascendingNumberComparator);
        queue.addAll([20, 6, 11, 7, 1, 4]);
        assertOrderOfDeletion(queue, [1, 4, 6, 7, 11, 20]);
    });

    it("should yield null when removing from the head of an empty queue", function() {
        expect(new ajs.PriorityQueue([], ascendingNumberComparator).poll()).toBeNull();
    });

    it("should yield and remove the root node when there is only when item", function() {
        queue = new ajs.PriorityQueue([5], ascendingNumberComparator);
        expect(queue.poll()).toBe(5);
        expect(queue.isEmpty()).toBe(true);
    });

    it("should yield and remove head when polling with two elements", function() {
        queue = new ajs.PriorityQueue([4, 5], ascendingNumberComparator);
        expect(queue.poll()).toBe(4);
        expect(queue.peek()).toBe(5);
    });

    it("should yield and remove head when polling with three elements", function() {
        queue = new ajs.PriorityQueue([4, 5, 6], ascendingNumberComparator);
        expect(queue.poll()).toBe(4);
        assertOrderOfDeletion(queue, [5, 6]);
    });

    it("should yield and remove head when polling with four elements", function() {
        queue = new ajs.PriorityQueue([3, 4, 5, 6], ascendingNumberComparator);
        expect(queue.poll()).toBe(3);
        assertOrderOfDeletion(queue, [4, 5, 6]);
    });

    it("should be able to delete all elements in ascending order until the queue becomes empty", function() {
        queue = new ajs.PriorityQueue([6, 11, 3, 20, 44, 22, 75, 90, 10, 2], ascendingNumberComparator);
        assertOrderOfDeletion(queue, [2, 3, 6, 10, 11, 20, 22, 44, 75, 90]);
    });

    it("should order the elements it is constructed with", function() {
        queue = new ajs.PriorityQueue([5, 20, 1, 19, 30, 15, 7, 60, 17], ascendingNumberComparator);
        assertOrderOfDeletion(queue, [1, 5, 7, 15, 17, 19, 20, 30, 60]);
    });

    it("should make a copy of the underlying data so the queue cannot be tampered with", function() {
        var data = [];
        queue = new ajs.PriorityQueue(data, ascendingNumberComparator);
        data.push(9);
        expect(queue.isEmpty()).toBe(true);
    });

    it("should, by default, use compareTo of the underlying object to determine order", function() {
        var Item = function(value) {
            this.value = value;
        };
        Item.prototype.compareTo = function(other) {
            if(this.value < other.value) {
                return -1;
            } else if(this.value === other.value) {
                return 0;
            }
            return 1;
        };

        queue = new ajs.PriorityQueue();

        var firstItem = new Item(7);
        var secondItem = new Item(3);
        var thirdItem = new Item(9);
        var fourthItem = new Item(5);
        var expectedOrderOfItems = [secondItem, fourthItem, firstItem, thirdItem];

        queue.addAll(firstItem, secondItem, thirdItem, fourthItem);

        while(!queue.isEmpty()) {
            expect(queue.poll().value).toBe(expectedOrderOfItems.shift().value);
        }
    });

    it("should apply ascending order when constructed with items but no comparator", function() {
        queue = new ajs.PriorityQueue([9, 4, 7, 1], ascendingNumberComparator);
        assertOrderOfDeletion(queue, [1, 4, 7, 9]);
    });

    it("should take a comparator to order the initial items in descending order", function() {
        queue = new ajs.PriorityQueue([6, 9, 8, 4, 7], new ajs.DescendingRelationalComparator());
        assertOrderOfDeletion(queue, [9, 8, 7, 6, 4]);
    });

    it("should take a comparator without items and order added items in descending order", function() {
        queue = new ajs.PriorityQueue(new ajs.DescendingRelationalComparator());
        queue.addAll(4, 2, 8, 1, 9, 5);
        assertOrderOfDeletion(queue, [9, 8, 5, 4, 2, 1]);
    });

    it("should be able to order a non numeric value", function() {
        queue = new ajs.PriorityQueue(["a", "c", "d", "b"], ascendingNumberComparator);
        assertOrderOfDeletion(queue, ["a", "b", "c", "d"]);
    });

    it("should become empty when cleared", function() {
        queue = new ajs.PriorityQueue([1, 2, 3], new ajs.DescendingRelationalComparator());
        queue.clear();
        expect(queue.isEmpty()).toBe(true);
    });

    foreach({"null": null, "undefined": undefined}, function(name, item) {
        it("should raise an exception when " + name + " elements are added to it as single items", function() {
            queue = new ajs.PriorityQueue();
            var exceptionToBeThrownWhenAddingNullItem = function() {
                queue.add(item);
            };
            expect(exceptionToBeThrownWhenAddingNullItem).toThrow('Cannot add null or undefined items');
        });

        it("should raise an exception when constructed with " + name + " elements", function() {
            var exceptionToBeThrownWhenConstructingWithNullItem = function() {
                new ajs.PriorityQueue([item])
            };
            expect(exceptionToBeThrownWhenConstructingWithNullItem).toThrow('Cannot add null or undefined items');
        });
    });

    foreach({"null": null, "undefined": undefined, "null array": [null], "null arguments": [undefined]},
        function(name, item) {
            it("should raise an exception when adding " + name + " in bulk", function() {
                var exceptionToBeThrownWhenAddingItemsInBulk = function() {
                    queue = new ajs.PriorityQueue();
                    queue.addAll(item);
                };
                expect(exceptionToBeThrownWhenAddingItemsInBulk).toThrow('Cannot add null or undefined items');
            });
        });

    function assertOrderOfDeletion(queue, orderOfDeletedElements) {
        expect(queue.size()).toBe(orderOfDeletedElements.length);

        while(!queue.isEmpty()) {
            expect(queue.poll()).toBe(orderOfDeletedElements.shift());
        }
    }

    function foreach(map, callback) {
        for(var property in map) {
            if(map.hasOwnProperty(property)) {
                callback(property, map[property]);
            }
        }
    }
});
