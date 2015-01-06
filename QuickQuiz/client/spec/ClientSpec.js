/**
 * Created by alisio on 1/12/2014.
 */
//naam van de suite, javescript functie met de run
describe("Client test", function () {
    beforeEach(function () {
        //jasmine.addMatchers(customMatcher);
    });

    //of calc een bestaande obj is
    /*it("should be a Server", function () {
        expect(init).toBeDefined();
        //expect typeof
    });*/

    describe("init", function() {
        it("says hello", function() {
            expect(init()).toEqual("Hello world!");
        });
    });
    /*it("should be able to add 1 + 1", function(){
     //var calculator = new Calculator();
     expect(calculator.add(1,1)).toBe(2);
     });

     it("should be able to devide 8 / 4", function(){
     //var calculator = new Calculator();
     expect(calculator.divide(8,4)).toBe(2);
     });

     it("should be able to devide by 0", function(){
     expect(calculator.divide(8,0)).toBe(Infinity);
     });

     it("should be able to devide 8 / 3", function(){
     //expect(calculator.divide(8,3)).toBeLessThan(4);
     //expect(calculator.divide(8,3)).toBeGreaterThan(2);
     expect(calculator.divide(8,3)).toBeBetween(2,4);
     });*/
});