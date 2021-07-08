import { Component } from 'react'

class Recipe extends Component {
    state = {
        recipeId: 716429,
        title: '',
        imageSrc: '',
        description: '',
        instrictions: '',
        ingredients: {
            pressent: [],
            missing:[]
        },
        example: [
            {
                "vegetarian": false,
                "vegan": false,
                "glutenFree": false,
                "dairyFree": false,
                "veryHealthy": false,
                "cheap": false,
                "veryPopular": false,
                "sustainable": false,
                "weightWatcherSmartPoints": 17,
                "gaps": "no",
                "lowFodmap": false,
                "aggregateLikes": 209,
                "spoonacularScore": 83,
                "healthScore": 19,
                "creditsText": "Full Belly Sisters",
                "license": "CC BY-SA 3.0",
                "sourceName": "Full Belly Sisters",
                "pricePerServing": 163.15,
                "extendedIngredients": [
                    {
                        "id": 1001,
                        "aisle": "Milk, Eggs, Other Dairy",
                        "image": "butter-sliced.jpg",
                        "consistency": "solid",
                        "name": "butter",
                        "nameClean": "butter",
                        "original": "1 tbsp butter",
                        "originalString": "1 tbsp butter",
                        "originalName": "butter",
                        "amount": 1,
                        "unit": "tbsp",
                        "meta": [],
                        "metaInformation": [],
                        "measures": {
                            "us": {
                                "amount": 1,
                                "unitShort": "Tbsp",
                                "unitLong": "Tbsp"
                            },
                            "metric": {
                                "amount": 1,
                                "unitShort": "Tbsp",
                                "unitLong": "Tbsp"
                            }
                        }
                    },
                    {
                        "id": 10011135,
                        "aisle": "Produce",
                        "image": "cauliflower.jpg",
                        "consistency": "solid",
                        "name": "cauliflower florets",
                        "nameClean": "cauliflower florets",
                        "original": "about 2 cups frozen cauliflower florets, thawed, cut into bite-sized pieces",
                        "originalString": "about 2 cups frozen cauliflower florets, thawed, cut into bite-sized pieces",
                        "originalName": "about frozen cauliflower florets, thawed, cut into bite-sized pieces",
                        "amount": 2,
                        "unit": "cups",
                        "meta": [
                            "frozen",
                            "thawed",
                            "cut into bite-sized pieces"
                        ],
                        "metaInformation": [
                            "frozen",
                            "thawed",
                            "cut into bite-sized pieces"
                        ],
                        "measures": {
                            "us": {
                                "amount": 2,
                                "unitShort": "cups",
                                "unitLong": "cups"
                            },
                            "metric": {
                                "amount": 473.176,
                                "unitShort": "ml",
                                "unitLong": "milliliters"
                            }
                        }
                    },
                    {
                        "id": 1041009,
                        "aisle": "Cheese",
                        "image": "cheddar-cheese.png",
                        "consistency": "solid",
                        "name": "cheese",
                        "nameClean": "cheese",
                        "original": "2 tbsp grated cheese (I used romano)",
                        "originalString": "2 tbsp grated cheese (I used romano)",
                        "originalName": "grated cheese (I used romano)",
                        "amount": 2,
                        "unit": "tbsp",
                        "meta": [
                            "grated",
                            "(I used romano)"
                        ],
                        "metaInformation": [
                            "grated",
                            "(I used romano)"
                        ],
                        "measures": {
                            "us": {
                                "amount": 2,
                                "unitShort": "Tbsps",
                                "unitLong": "Tbsps"
                            },
                            "metric": {
                                "amount": 2,
                                "unitShort": "Tbsps",
                                "unitLong": "Tbsps"
                            }
                        }
                    },
                    {
                        "id": 1034053,
                        "aisle": "Oil, Vinegar, Salad Dressing",
                        "image": "olive-oil.jpg",
                        "consistency": "liquid",
                        "name": "extra virgin olive oil",
                        "nameClean": "extra virgin olive oil",
                        "original": "1-2 tbsp extra virgin olive oil",
                        "originalString": "1-2 tbsp extra virgin olive oil",
                        "originalName": "extra virgin olive oil",
                        "amount": 1,
                        "unit": "tbsp",
                        "meta": [],
                        "metaInformation": [],
                        "measures": {
                            "us": {
                                "amount": 1,
                                "unitShort": "Tbsp",
                                "unitLong": "Tbsp"
                            },
                            "metric": {
                                "amount": 1,
                                "unitShort": "Tbsp",
                                "unitLong": "Tbsp"
                            }
                        }
                    },
                    {
                        "id": 11215,
                        "aisle": "Produce",
                        "image": "garlic.png",
                        "consistency": "solid",
                        "name": "garlic",
                        "nameClean": "garlic",
                        "original": "5-6 cloves garlic",
                        "originalString": "5-6 cloves garlic",
                        "originalName": "garlic",
                        "amount": 5,
                        "unit": "cloves",
                        "meta": [],
                        "metaInformation": [],
                        "measures": {
                            "us": {
                                "amount": 5,
                                "unitShort": "cloves",
                                "unitLong": "cloves"
                            },
                            "metric": {
                                "amount": 5,
                                "unitShort": "cloves",
                                "unitLong": "cloves"
                            }
                        }
                    },
                    {
                        "id": 20420,
                        "aisle": "Pasta and Rice",
                        "image": "fusilli.jpg",
                        "consistency": "solid",
                        "name": "pasta",
                        "nameClean": "pasta",
                        "original": "6-8 ounces pasta (I used linguine)",
                        "originalString": "6-8 ounces pasta (I used linguine)",
                        "originalName": "pasta (I used linguine)",
                        "amount": 6,
                        "unit": "ounces",
                        "meta": [
                            "(I used linguine)"
                        ],
                        "metaInformation": [
                            "(I used linguine)"
                        ],
                        "measures": {
                            "us": {
                                "amount": 6,
                                "unitShort": "oz",
                                "unitLong": "ounces"
                            },
                            "metric": {
                                "amount": 170.097,
                                "unitShort": "g",
                                "unitLong": "grams"
                            }
                        }
                    },
                    {
                        "id": 1032009,
                        "aisle": "Spices and Seasonings",
                        "image": "red-pepper-flakes.jpg",
                        "consistency": "solid",
                        "name": "red pepper flakes",
                        "nameClean": "red pepper flakes",
                        "original": "couple of pinches red pepper flakes, optional",
                        "originalString": "couple of pinches red pepper flakes, optional",
                        "originalName": "couple of red pepper flakes, optional",
                        "amount": 2,
                        "unit": "pinches",
                        "meta": [
                            "red"
                        ],
                        "metaInformation": [
                            "red"
                        ],
                        "measures": {
                            "us": {
                                "amount": 2,
                                "unitShort": "pinches",
                                "unitLong": "pinches"
                            },
                            "metric": {
                                "amount": 2,
                                "unitShort": "pinches",
                                "unitLong": "pinches"
                            }
                        }
                    },
                    {
                        "id": 1102047,
                        "aisle": "Spices and Seasonings",
                        "image": "salt-and-pepper.jpg",
                        "consistency": "solid",
                        "name": "salt and pepper",
                        "nameClean": "salt and pepper",
                        "original": "salt and pepper, to taste",
                        "originalString": "salt and pepper, to taste",
                        "originalName": "salt and pepper, to taste",
                        "amount": 2,
                        "unit": "servings",
                        "meta": [
                            "to taste"
                        ],
                        "metaInformation": [
                            "to taste"
                        ],
                        "measures": {
                            "us": {
                                "amount": 2,
                                "unitShort": "servings",
                                "unitLong": "servings"
                            },
                            "metric": {
                                "amount": 2,
                                "unitShort": "servings",
                                "unitLong": "servings"
                            }
                        }
                    },
                    {
                        "id": 11291,
                        "aisle": "Produce",
                        "image": "spring-onions.jpg",
                        "consistency": "solid",
                        "name": "scallions",
                        "nameClean": "spring onions",
                        "original": "3 scallions, chopped, white and green parts separated",
                        "originalString": "3 scallions, chopped, white and green parts separated",
                        "originalName": "scallions, chopped, white and green parts separated",
                        "amount": 3,
                        "unit": "",
                        "meta": [
                            "white",
                            "green",
                            "separated",
                            "chopped"
                        ],
                        "metaInformation": [
                            "white",
                            "green",
                            "separated",
                            "chopped"
                        ],
                        "measures": {
                            "us": {
                                "amount": 3,
                                "unitShort": "",
                                "unitLong": ""
                            },
                            "metric": {
                                "amount": 3,
                                "unitShort": "",
                                "unitLong": ""
                            }
                        }
                    },
                    {
                        "id": 14106,
                        "aisle": "Alcoholic Beverages",
                        "image": "white-wine.jpg",
                        "consistency": "liquid",
                        "name": "white wine",
                        "nameClean": "dry white wine",
                        "original": "2-3 tbsp white wine",
                        "originalString": "2-3 tbsp white wine",
                        "originalName": "white wine",
                        "amount": 2,
                        "unit": "tbsp",
                        "meta": [
                            "white"
                        ],
                        "metaInformation": [
                            "white"
                        ],
                        "measures": {
                            "us": {
                                "amount": 2,
                                "unitShort": "Tbsps",
                                "unitLong": "Tbsps"
                            },
                            "metric": {
                                "amount": 2,
                                "unitShort": "Tbsps",
                                "unitLong": "Tbsps"
                            }
                        }
                    },
                    {
                        "id": 99025,
                        "aisle": "Pasta and Rice",
                        "image": "breadcrumbs.jpg",
                        "consistency": "solid",
                        "name": "whole wheat bread crumbs",
                        "nameClean": "whole wheat breadcrumbs",
                        "original": "1/4 cup whole wheat bread crumbs (I used panko)",
                        "originalString": "1/4 cup whole wheat bread crumbs (I used panko)",
                        "originalName": "whole wheat bread crumbs (I used panko)",
                        "amount": 0.25,
                        "unit": "cup",
                        "meta": [
                            "whole wheat",
                            "(I used panko)"
                        ],
                        "metaInformation": [
                            "whole wheat",
                            "(I used panko)"
                        ],
                        "measures": {
                            "us": {
                                "amount": 0.25,
                                "unitShort": "cups",
                                "unitLong": "cups"
                            },
                            "metric": {
                                "amount": 59.147,
                                "unitShort": "ml",
                                "unitLong": "milliliters"
                            }
                        }
                    }
                ],
                "id": 716429,
                "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
                "readyInMinutes": 45,
                "servings": 2,
                "sourceUrl": "http://fullbellysisters.blogspot.com/2012/06/pasta-with-garlic-scallions-cauliflower.html",
                "image": "https://spoonacular.com/recipeImages/716429-556x370.jpg",
                "imageType": "jpg",
                "summary": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs might be just the main course you are searching for. This recipe makes 2 servings with <b>636 calories</b>, <b>21g of protein</b>, and <b>20g of fat</b> each. For <b>$1.83 per serving</b>, this recipe <b>covers 24%</b> of your daily requirements of vitamins and minerals. From preparation to the plate, this recipe takes about <b>45 minutes</b>. This recipe is liked by 209 foodies and cooks. If you have pasta, salt and pepper, cheese, and a few other ingredients on hand, you can make it. To use up the extra virgin olive oil you could follow this main course with the <a href=\"https://spoonacular.com/recipes/peach-crisp-healthy-crisp-for-breakfast-487698\">Peach Crisp: Healthy Crisp for Breakfast</a> as a dessert. All things considered, we decided this recipe <b>deserves a spoonacular score of 86%</b>. This score is tremendous. Try <a href=\"https://spoonacular.com/recipes/cauliflower-gratin-with-garlic-breadcrumbs-318375\">Cauliflower Gratin with Garlic Breadcrumbs</a>, <a href=\"https://spoonacular.com/recipes/pasta-with-cauliflower-sausage-breadcrumbs-30437\">Pasta With Cauliflower, Sausage, & Breadcrumbs</a>, and <a href=\"https://spoonacular.com/recipes/pasta-with-roasted-cauliflower-parsley-and-breadcrumbs-30738\">Pasta With Roasted Cauliflower, Parsley, And Breadcrumbs</a> for similar recipes.",
                "cuisines": [],
                "dishTypes": [
                    "lunch",
                    "main course",
                    "main dish",
                    "dinner"
                ],
                "diets": [],
                "occasions": [],
                "winePairing": {
                    "pairedWines": [],
                    "pairingText": "No one wine will suit every pasta dish. Pasta in a tomato-based sauce will usually work well with a medium-bodied red, such as a montepulciano or chianti. Pasta with seafood or pesto will fare better with a light-bodied white, such as a pinot grigio. Cheese-heavy pasta can pair well with red or white - you might try a sangiovese wine for hard cheeses and a chardonnay for soft cheeses. We may be able to make a better recommendation if you ask again with a specific pasta dish.",
                    "productMatches": []
                },
                "instructions": "",
                "analyzedInstructions": [],
                "originalId": null,
                "spoonacularSourceUrl": "https://spoonacular.com/pasta-with-garlic-scallions-cauliflower-breadcrumbs-716429"
            }
        ],

        descriptionExample: {
            "id": 716429,
            "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
            "summary": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs requires around <b>45 minutes</b> from start to finish. This recipe serves 2 and costs $1.63 per serving. This main course has <b>584 calories</b>, <b>19g of protein</b>, and <b>20g of fat</b> per serving. 209 people have tried and liked this recipe. A mixture of butter, whole wheat bread crumbs, white wine, and a handful of other ingredients are all it takes to make this recipe so delicious. It is brought to you by fullbellysisters.blogspot.com. Overall, this recipe earns an <b>outstanding spoonacular score of 83%</b>. If you like this recipe, take a look at these similar recipes: <a href=\"https://spoonacular.com/recipes/pasta-with-garlic-scallions-cauliflower-breadcrumbs-1229673\">Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs</a>, <a href=\"https://spoonacular.com/recipes/pasta-with-garlic-scallions-cauliflower-breadcrumbs-1229721\">Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs</a>, and <a href=\"https://spoonacular.com/recipes/pasta-with-garlic-scallions-cauliflower-breadcrumbs-1229751\">Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs</a>."
        }
    }

    componentDidMount(){
        // this.fetchRecipeInfomation()
        // this.summariseRecipe()
    }


    async fetchRecipeInfomation () {
        
        const { recipeId } = this.state

        console.log('Logging')

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=f1e60ea98b204bac9657574150fa57ec`

        const spoonacularRes = await fetch(spoonacularEndpoint)

        const spoonacularData = await spoonacularRes.json()

        console.log(spoonacularData)

        this.setState({...this.state, 
            title: spoonacularData['title'], 
            imageSrc: spoonacularData['title']
        })
    }

    async summariseRecipe (){
        const { recipeId } = this.state

        console.log('Getting recipe description')

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/summary?&apiKey=f1e60ea98b204bac9657574150fa57ec`

        const summaryRes = await fetch(spoonacularEndpoint)

        const summary = await summaryRes.json()

        console.log(summary)

    }

    removeHtmlTagsFromString(string){
        return string.replace(/(<([^>]+)>)/gi, "")
    }

    render(){
        const { title, imageSrc, description, example, descriptionExample } = this.state
        return (
            <div>
                <section>
                    <img src={example[0].image}/>
                    <h1>{example[0].title}</h1>
                </section>
                <section className="recipe-container">
                    <div className="ingredients-container">
                    </div>
                    <div className="instructions-container">
                     <p className='recipe-description'></p>
                        { this.removeHtmlTagsFromString(descriptionExample.summary)}
                    </div>
                </section>
            </div>
        )
    }
}

export default Recipe 