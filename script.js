
// for submit ingredients
let addIngredientsBtn = document.getElementById('addIngredientsBtn');
let ingredientList = document.querySelector('.ingredientList');
let ingredientDiv = document.querySelectorAll('.ingredientDiv')[0];



addIngredientsBtn.addEventListener('click', function () {
    let newIngredients = ingredientDiv.cloneNode(true);
    let input = newIngredients.getElementsByTagName('input')[0];
    input.value = '';
    ingredientList.appendChild(newIngredients);
})


































// let submitBtn = document.getElementById('submitBtn');
// let ingredient = document.querySelector('.ingredient');
// let containerDiv = document.querySelectorAll('.containerDiv')[0];



// submitBtn.addEventListener('click', function () {
//     let newIngredients = containerDiv.cloneNode(true);
//     let input = newIngredients.getElementsByTagName('input')[0];
//     input.value = '';
//     ingredient.appendChild(newIngredients);
// })




// document.addEventListener("DOMContentLoaded", function() {
//     // Select the button
//     var submitBtn = document.getElementById("submitBtn");

//     // Add event listener for click event
//     submitBtn.addEventListener("click", function() {
//         // Create a new input element
//         var newInput = document.createElement("input");
//         newInput.type = "text";
//         newInput.className = "form-control mt-1";
//         newInput.name = "ingredients";
//         newInput.id = "recipeName";
//         newInput.value = "";

//         // Find the parent element of the existing input tag
//         var parentDiv = document.querySelector('.form-group');

//         // Append the new input tag to the parent element
//         parentDiv.appendChild(newInput);
//     });
// });



// document.addEventListener("DOMContentLoaded", function() {
//     // Select the button
//     var submitBtn = document.getElementById("submitBtn");

//     // Add event listener for click event
//     submitBtn.addEventListener("click", function() {
//         // Find the container div
//         var containerDiv = document.querySelector('.form-group');

//         // Clone the existing input field
//         var existingInput = containerDiv.querySelector('input[name="ingredients"]');
//         var newInput = existingInput.cloneNode(true);
//         newInput.value = ""; // Clear the value of the cloned input

//         // Append the new input tag to the container div
//         containerDiv.appendChild(newInput);
//     });
// });




// $(document).ready(function () {

//     // var button = $("#submitButton");
//     // var inputFl = $("#ingredients");

//     // $(addButton).click(function (e) {
//     //     e.preventDefault();
//     //     var newInput = $("<input type='text'>");

//     //     inputFl.append(newInput);

//     // });
//     $('button').each(function(){
//         $('button').click(function(){
//            find('input[type="text"]').val() = "0";
//         });
//      });
// });

