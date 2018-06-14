var myString: string | number;
//this is delcaring a variable a string

myString = "Bee stinger";
//this declaring the variable a value of "Bee Stinger"

myString = 9;
// You have to declaire what type myString can be. You do this in the intial declaring uptop. 
// Therefore myString can be delcared a string or (|) a number.

function sayHello(name: string | number){
    return `Hello, ${name}!`;
 }
 console.log(sayHello(9))
 
 //The reason it was giving you an error is that again the name: key is delcared a string.
 // You can change 9 into "9" to get rid of the error hence turning it into a string.
 //Another way is again by changing the types to string or number for the name key.

 function fullName(firstName: string, lastName: string, middleName: string){
    let fullName = `${firstName} ${middleName} ${lastName}`;
    return fullName;
 }
 // This works:
 console.log(fullName("Mary", "Moore", "Tyler"));
 
 console.log(fullName("Jimbo", "", "Jones"));
 // You can work around the error by adding a empty "" tag. The function takes in three params.
 // Doing this fills the requirements and only the params with value will print. 

 interface Student {
    firstName: string;
    lastName: string;
    belts: number;
 }
 function graduate(ninja: Student){
    return `Congratulations, ${ninja.firstName} ${ninja.lastName}, you earned ${ninja.belts} belts!`;
 }
 
 const christine = {
    firstName: "Christine",
    lastName: "Yang",
    belts: 2
 }
 
 const jay = {
    firstName: "Jay",
    lastName: "Patel",
    belts: 4
 }
 
 console.log(graduate(christine));
 console.log(graduate(jay));
 
 //belts was belt when declaring the const for jay. YOU HAVE TO MAKE SURE ALL KEYS ARE THE SAME!

 class Ninja {
    fullName: string;
    constructor(
       public firstName: string,
       public lastName: string){
          this.fullName = `${firstName} ${lastName}`;
       }
    debug(){
       console.log("Console.log() is my friend.")
    }
 }
 
 
 const turing = new Ninja("Alan", "Turing");
 
 // You have to create another instance of  a class the way above
 // by declaring turning into  a new instance and adding the two fields into the params completes this.  
 
 
 function study(programmer: Ninja){
    return `Ready to whiteboard an algorithm, ${programmer.fullName}?`
 }
 
 console.log(study(turing));

 var increment = x => x + 1;
// This works great:
console.log(increment(3));

var square = x => x * x;
// This is not showing me what I want:
console.log(square(4));

//You have to take out the {} to make the function work. 

// This is not working:
var multiply = (x, y) => x * y;

console.log(multiply(4, 5));

// You have to have a () around your delcaration of two or more varialbes for the function.

var math = (x, y) => {
    let sum = x + y;
    let product = x * y;
    let difference = Math.abs(x - y);
    return [sum, product, difference];
}
console.log(math(4, 0));

