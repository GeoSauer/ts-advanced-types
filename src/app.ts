//?intersection types

//* could also be done with interfaces like this
// interface Admin {
//   name: string;
//   privileges: string[];
// }
// interface Employee {
//   name: string;
//   startDate: Date;
// }
// interface ElevatedEmployee extends Employee, Admin {}

type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  //* date is a type supported by TS built on the Date object in JS
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "Geo",
  privileges: ["create-server"],
  startDate: new Date(),
};

//?  easy example of intersection types
//* & and | intersection operators
type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

//?type guards allow functions to accept multiple types while executing different things at runtime
//* helps with union types by allowing different types but then using typeof to see check and allow different things to happen based on the type supplied

// function add(a: Combinable, b: Combinable) {
//   if (typeof a === "string" || typeof b === "string") {
//     return a.toString() + b.toString();
//   }
//   return a + b;
// }

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: Employee) {
  console.log("Name: ", emp.name);
  //* we start getting errors because type Employee does not have privileges
  //* a typeof check won't work either because both Employee and Admin are objects, and this check runs at runtime (JS land) and JS doesn't recognize TS types
  //* so we use an in check instead since JS knows it
  if ("privileges" in emp) {
    console.log("Privileges: ", emp.privileges);
  }
  if ("startDate" in emp) {
    console.log("Start Date: ", emp.startDate);
  }
}

printEmployeeInformation(e1);
printEmployeeInformation({ name: "Kallyn", startDate: new Date() });

class Car {
  drive() {
    console.log("Driving...");
  }
}

class Truck {
  drive() {
    console.log("Driving a truck...");
  }
  loadCargo(amount: number) {
    console.log("loading cargo..." + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  //* we can also use an instanceof check as a type guard
  //* instanceof works because classes use constructor functions which JS knows
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);

//?discriminated union
//* a pattern that helps with union types on objects
//* having a common property in each interface that describes the object
//* now we can use that common type to have 100% type safety

interface Bird {
  //* add a literal type assignment tells TS it doesn't just need to be a string, it HAS to be the string 'bird'
  type: "bird";
  flyingSpeed: number;
}

interface Horse {
  type: "horse";
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;
  switch (animal.type) {
    //* TS adds some great autocomplete to help with this, and immediate errors on typos
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
      break;
  }
  //* instanceof doesn't work here because we're working with interfaces which JS doesn't know
  console.log("Moving with speed: " + speed);
}

moveAnimal({ type: "bird", flyingSpeed: 27.5 });

//?type casting
//* helps you tell TS that a value is a specific type even if TS can't tell on it's own, but you as a dev know it is for sure

//? the setup for this was just adding an empty <p></p> tag in index.html
//* hovering on this shows that it's either gonna be a paragraph or null, ie it exists or it doesn't
const paragraph = document.querySelector("p");

//* hovering on this one, TS can only infer that it's an HTML element or null, it can't tell that's it a <p></p>
const paragraph2 = document.getElementById("message-output");

// const userInputElement = document.getElementById("user-input")!;
//* this throws an error because TS can't properly infer the input exists, so there's a possibility of it being null
//* even adding a bang at the end doesn't help tell TS it for sure exists, but TS can confirm that the object has a value property
// userInputElement.value = "Hi there!";

//? two approaches to fixing this

//? first approach is to add a tag at the beginning describing what the element is
//* this can look similar to calling JSX components though
const userInputElement1 = <HTMLInputElement>document.getElementById("user-input")!;
userInputElement1.value = "Hi there!";

//? second approach is adding the element type to the end with the 'as' keyword
const userInputElement2 = document.getElementById("user-input")! as HTMLInputElement;
userInputElement2.value = "Hi there!";

//? a secret third thing!
//* if you DON'T know for sure if an element will return null or not and aren't using the !, you also can't typecast
//* this requires an if check to see if the thing exists, and then some funky syntax
const userInputElement3 = document.getElementById("user-input");
if (userInputElement3) {
  (userInputElement3 as HTMLInputElement).value = "Hi there!";
}

//? index types
//* a feature that lets us create objects that are more flexible in what they can hold
//* it allows flexibility because it doesn't strictly define the property names in the object or how many there will be

interface ErrorContainer {
  // { email: 'Not a valid email', username: 'Must start with a character'}
  //* prop here is a booger but convention is usually key or prop
  //* this tells TS that you don't know what the key (prop) will be called or how many there will be, but that they will be type string and the value will be type string
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  //*this can get a little confusing because you could do..
  //? 1: 'Not a valid email' <- this would work because numbers can be strings
  //? email: 'Not a valid email' <- but if you had defined the prop as a number in the interface this wouldn't work because strings can't be numbers
  email: "Not a valid email",
  username: "Must start with a capital character",
};

//? function overloads
//* telling TS what result type to expect based on input types
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}

const result = add(1, 5);

const result2 = add("Geo", " Sauer");
result2.split(" ");

//? optional chaining
const fetchedUserData = {
  id: "u1",
  name: "Geo",
  job: { title: "CEO", description: "My own company" },
};

//* with job removed from the object TS throws a (justified) fit
console.log(fetchedUserData.job.title);

//* this is a JS way of checking
console.log(fetchedUserData.job && fetchedUserData.job.title);

//* optional chaining, checks if the thing in front of the ? exists before trying to dig in and access the next thing. Avoids a runtime error
console.log(fetchedUserData?.job?.title);

//? nullish coalescing
const userInput = null;

//* logical or is a common way of input checking but only checks if it is falsy, so '' or 0 would print 'DEFAULT'
const storedData = userInput || "DEFAULT";

//* nullish coalescing operator checks if the value on the left is specifically null or undefined
const storedDatas = userInput ?? "DEFAULT";

console.log(storedDatas);
