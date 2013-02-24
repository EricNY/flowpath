describe("PriorityQueue", function() {
    var underlyingData, queue;

    beforeEach(function() {
        underlyingData = [];
        queue = new ajs.PriorityQueue(underlyingData);
    });

    it("should yield the first element when peeking", function() {
        underlyingData.push(2, 67);
        expect(queue.peek()).toBe(2);
    });

    it("should yield its size", function() {
        underlyingData.push(5, 3, 77);
        expect(queue.size()).toBe(3);
    });

    it("should be empty when it has no data", function() {
        expect(queue.isEmpty()).toBe(true);
    });

    it("should not be empty when it has data", function() {
        underlyingData.push(44);
        expect(queue.isEmpty()).toBe(false);
    });

    it("should be able to add a single item", function() {
        queue.add(4);
        expect(underlyingData).toEqual([4]);
    });

    it("should be able to add a child whose priority is greater than the root priority", function() {
        queue.add(5);
        queue.add(6);
        expect(underlyingData).toEqual([5, 6]);
    });

    it("should be able to add a child whose priority is less than the priority of the root", function() {
        queue.add(5);
        queue.add(4);
        expect(underlyingData).toEqual([4, 5]);
    });

    it("should be able to add an item that will have a parent and a child", function() {
        queue.add(5);
        queue.add(8);
        queue.add(19);
        queue.add(20);
        queue.add(9);
        expect(underlyingData).toEqual([5, 8, 19, 20, 9]);
    });

    it("should be able to add multiple items at the same time", function() {
        queue.addAll(8, 3, 5, 1, 9);
        expect(underlyingData).toEqual([1, 3, 5, 8, 9]);
    });

    it("should be able to add an array of items at the same time", function() {
        queue.addAll([20, 6, 11, 7, 1, 4]);
        expect(underlyingData).toEqual([1, 6, 4, 20, 7, 11]);
    });

    it("should yield null when removing from the head of an empty queue", function() {
        expect(queue.poll()).toBeNull();
    });

    it("should yield and remove the root node when there is only when item", function() {
        underlyingData.push(5);
        expect(queue.poll()).toBe(5);
        expect(queue.isEmpty()).toBe(true);
    });

    it("should reorganise when polling and there are two elements", function() {
        underlyingData.push(4, 5);
        expect(queue.poll()).toBe(4);
        expect(underlyingData).toEqual([5]);
    });

    it("should reorganise when polling and there are three elements", function() {
        underlyingData.push(6, 5, 4);
        expect(queue.poll()).toBe(6);
        expect(underlyingData).toEqual([4, 5]);
    });

    it("should reorganise when polling and there are four elements", function() {
        underlyingData.push(6, 5, 4, 3);
        expect(queue.poll()).toBe(6);
        expect(underlyingData).toEqual([3, 4, 5]);
    });
});
