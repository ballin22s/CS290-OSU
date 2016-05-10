function Automobile( year, make, model, type ){
    this.year = year; //integer (ex. 2001, 1995)
    this.make = make; //string (ex. Honda, Ford)
    this.model = model; //string (ex. Accord, Focus)
    this.type = type; //string (ex. Pickup, SUV)
}

// Prints an automobile object on a single line
Automobile.prototype.logMe = function(includeType) {
    var output = this.year + ' ' + this.make + ' ' + this.model;
    if (includeType) {
        output += ' ';
        output += this.type;
    }
    console.log(output);
};

var automobiles = [ 
    new Automobile(1995, "Honda", "Accord", "Sedan"),
    new Automobile(1990, "Ford", "F-150", "Pickup"),
    new Automobile(2000, "GMC", "Tahoe", "SUV"),
    new Automobile(2010, "Toyota", "Tacoma", "Pickup"),
    new Automobile(2005, "Lotus", "Elise", "Roadster"),
    new Automobile(2008, "Subaru", "Outback", "Wagon")
];

/*This function sorts arrays using an arbitrary comparator. 
You pass it a comparator and an array of objects appropriate 
for that comparator and it will return a new array which is sorted with 
the largest object in index 0 and the smallest in the last index*/
function sortArr( comparator, array ){
	var tmp;
	var swap;
	var length = array.length;
	
	do {
		swap = false;
		for (i = 0; i < 6; i++) {
			for (j = i+1; j < 6; j++) {
				if (comparator(array[i], array[j])) {
					tmp = array[j];
					array[j] = array[i];
					array[i] = tmp;
					swap = true;
				}
			}
		}
	} 
	while (swap == false)
	
	return array;
	
}

/*A comparator takes two arguments and uses some algorithm to compare them. 
If the first argument is larger or greater than the 2nd it returns true, 
otherwise it returns false. 
Here is an example that works on integers*/
function exComparator( int1, int2){
    if (int1 > int2){
        return true;
    } else {
        return false;
    }
}

/*For all comparators if cars are 'tied' according to the comparison rules 
then the order of those 'tied' cars is not specified and either can come first*/

/*This compares two automobiles based on their year. 
Newer cars are "greater" than older cars.*/
function yearComparator( auto1, auto2){
    /* your code here*/
	if (auto1.year < auto2.year) {
		return true;
	} else {
		return false;
	}
}

/*This compares two automobiles based on their make. 
It should be case insensitive and makes which are alphabetically earlier 
in the alphabet are "greater" than ones that come later.*/
function makeComparator( auto1, auto2){
    /* your code here*/
	var car1 = auto1.make.toLowerCase();
	var car2 = auto2.make.toLowerCase();
	
	return (car1 < car2);
}

/*This compares two automobiles based on their type. 
The ordering from "greatest" to "least" is as follows: 
roadster, pickup, suv, wagon, (types not otherwise listed). 
It should be case insensitive. If two cars are of equal type then the newest one 
by model year should be considered "greater".*/
function typeComparator( auto1, auto2){
    /* your code here*/
	var ascHierarchy = ["Wagon", "SUV", "Pickup", "Roadster"]; 

	car1 = ascHierarchy.indexOf(auto1.type);
	car2 = ascHierarchy.indexOf(auto2.type);
    
	if (car1 == car2) {
	    return yearComparator(auto1, auto2); 
	}
    
	return car1 < car2;
}

/*Your program should output the following to the console.log, 
including the opening and closing 5 stars. 
All values in parenthesis should be replaced with appropriate values. 
Each line is a seperate call to console.log.

Each line representing a car should be produced via a logMe function. 
This function should be added to the Automobile class and accept a single boolean argument. 
If the argument is 'true' then it prints "year make model type" 
with the year, make, model and type being the values appropriate for the automobile. 
If the argument is 'false' then the type is ommited and just the "year make model" is logged.
*/

console.log("*****");

console.log("The cars sorted by year are:");
var sortedByYear = sortArr(yearComparator, automobiles);
// year make model of the greatest -> least
sortedByYear.forEach(function(automobile) {
    automobile.logMe(false);
});

console.log();

console.log("*****");

console.log("The cars sorted by make are:");
var sortedByMake = sortArr(makeComparator, automobiles);
// year make model of the greatest -> least
sortedByMake.forEach(function(automobile) {
    automobile.logMe(false);
});

console.log();

console.log("*****");

console.log("The cars sorted by type are:");
var sortedByType = sortArr(typeComparator, automobiles);
// year make model of the greatest -> least
sortedByType.forEach(function(automobile) {
    automobile.logMe(true);
});

console.log();

console.log("*****");