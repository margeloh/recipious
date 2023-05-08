// configuration
let url = 'https://api.spoonacular.com/recipes/complexSearch';
let key = 'af5f7845c84b4bab91d240a9186692b4';

// implementation
function buildReceipeElement(myMeal, resultEl)
{
	let recipeElement = document.createElement('div');
	recipeElement.dataset.recipeId = myMeal.id;
	recipeElement.classList.add('one-recipe');
	recipeElement.classList.add('hidden');
	console.info(myMeal);
	
	const mealSummary = myMeal.summary.replace(/(<([^>]+)>)/gi, '');
	recipeElement.innerHTML = `
		<h2>${myMeal.title}</h2>
		<div class="recipe-image">
			<img src=${myMeal.image}>
		</div>
		<h3>Ingredients</h3>
		<div class="ingredients-block"></div>
		<h3>Recipe Summary</h3>
		<p class="details">
			${mealSummary}
		</p>
		<h3>Instructions</h3>
		<div class="instructions-block"></div>
		
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
		child.textContent = `${measure} ${i.originalName}`;
		ingredientsList.appendChild(child);
	});
	recipeElement.querySelector(".ingredients-block").appendChild(ingredientsList);
	
	// create visual representation of step-by-step instructions
	const instructionsList = document.createElement("ul");
	let titleFound = false;
	myMeal.analyzedInstructions.forEach((i) => {
		const hasTitle = i.name.trim().length > 0;
		if (hasTitle || titleFound) {
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
	recipeElement.querySelector('.instructions-block').appendChild(instructionsList);
	
	return recipeElement;
}

document.getElementById('search-form').addEventListener("submit", (evt) => {
	evt.preventDefault();
	const resultEl = document.getElementById('result');
	let userInp = document.getElementById("user-inp").value;
	if (userInp.length == 0) {
		result.innerHTML = '<h3 class="error">Input Field Cannot Be Empty</h3>';
	} else {
		fetch(url + '?apiKey=' + key + '&includeIngredients='+ encodeURIComponent(userInp) + '&instructionsRequired=true&fillIngredients=true&addRecipeInformation=true&sort=random&number=15')
			.then((response) => response.json())
			.then((data) => {
				resultEl.innerHTML = '<h2 class="search-results"></h2><button class="back-button hidden">Back to Results</button><ul class="recipe-list"></ul>';
const recipeListTitle = resultEl.querySelector('h2');
const recipeListButton = resultEl.querySelector('button');
const recipeList = resultEl.querySelector('.recipe-list');
const sortedResults = data.results.sort((a, b) => a.readyInMinutes - b.readyInMinutes);

sortedResults.forEach((myMeal) => {
  const timeEl = document.createElement('span');
  const itemEl = document.createElement('li');
  const recipeEl = buildReceipeElement(myMeal, resultEl);
  itemEl.textContent = myMeal.title;
  
  // Add hourglass symbol
  const hourglassSymbol = document.createElement('span');
  hourglassSymbol.textContent = '\u231B'; // Unicode for hourglass symbol
  timeEl.appendChild(hourglassSymbol);
  
  timeEl.textContent += ' ' + new Date(1000 * myMeal.readyInMinutes * 60).toISOString().substr(11, 5);
  timeEl.classList.add('time-info');
  itemEl.appendChild(timeEl);

  recipeList.appendChild(itemEl);
  resultEl.appendChild(recipeEl);
  itemEl.addEventListener('click', () => {
    recipeList.classList.add('hidden');
    recipeListTitle.classList.add('hidden');
    recipeListButton.classList.remove('hidden');
    recipeEl.classList.remove('hidden');
  });
});

recipeListTitle.textContent = `Found ${sortedResults.length} recipes`;
			})
			.catch((e) => {
			    console.error(e);
				resultEl.innerHTML = '<h3 class="error">Invalid Input</h3>';
			}
		);
	}
});
