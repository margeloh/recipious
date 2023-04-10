//Initial References
let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = "https://api.spoonacular.com/recipes/complexSearch";
let key = "af5f7845c84b4bab91d240a9186692b4";

searchBtn.addEventListener("click", () => {
	let userInp = document.getElementById("user-inp").value;
	if (userInp.length == 0) {
		result.innerHTML = `<h3>Input Field Cannot Be Empty</h3>`;
	} else {
		fetch(url + '?apiKey=' + key + '&includeIngredients='+ encodeURIComponent(userInp) + '&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true&sort=random')
			.then((response) => response.json())
			.then((data) => {
				const myMeal = data.results[0];
				console.log(myMeal);
				/*
				console.log(myMeal.strMealThumb);
				console.log(myMeal.strMeal);
				console.log(myMeal.strArea);
				console.log(myMeal.strInstructions);
				*/
				
				result.innerHTML = `
					<h2>${myMeal.title}</h2>
					<div class="recipe-image">
						<img src=${myMeal.image}>
					</div>
					<h3>Recipe Summary</h3>
					<p class="details">
						${myMeal.summary}
					</p>
					<h3>Ingredients</h3>
					<div id="ingredients-block"></div>
					<h3>Instructions</h3>
					<div id="instructions-block"></div>
					
					<!--div id="recipe">
						<button id="hide-recipe">X</button>
					</div>
					<button id="show-recipe">View Recipe</button-->
				`;

				// create visual representation of ingredients
				const ingredientsList = document.createElement("ul");
     			myMeal.extendedIngredients.forEach((i) => {
					const measure = Math.round(i.measures.metric.amount) + ' ' + i.measures.metric.unitLong;
					const child = document.createElement("li");
					child.innerText = `${measure} ${i.originalName}`;
					ingredientsList.appendChild(child);
				});
				document.getElementById("ingredients-block").appendChild(ingredientsList);
				
				// create visual representation of step-by-step instructions
				const instructionsList = document.createElement("ul");
				let titleFound = false;
				myMeal.analyzedInstructions.forEach((i) => {
					const hasTitle = i.name.trim().length > 0;
					if (hasTitle || titleFound) {
							console.log(i.name);
						const stepSummary = document.createElement("li");
						stepSummary.textContent = (hasTitle ? i.name : 'Then') + ':';
						stepSummary.classList.add('step-summary');
						instructionsList.appendChild(stepSummary);
					}
					if (hasTitle) {
						titleFound = true;
					}
					i.steps.forEach((step) => {
						const stepChild = document.createElement("li");
						stepChild.textContent = step.step;
						instructionsList.appendChild(stepChild);
					});
				});
				document.getElementById("instructions-block").appendChild(instructionsList);
			
				const recipe = document.getElementById("recipe");
				const hideRecipe = document.getElementById("hide-recipe");
				const showRecipe = document.getElementById("show-recipe");

    			/*hideRecipe.addEventListener("click", () => {
					recipe.style.display = "none";
				});
				showRecipe.addEventListener("click", () => {
					recipe.style.display = "block";
				});
				*/
			})
			.catch((e) => {
					console.log(e);
				result.innerHTML = `<h3>Invalid Input</h3>`;
			}
		);
	}
});