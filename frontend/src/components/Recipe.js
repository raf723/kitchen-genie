import { Component } from 'react'

class Recipe extends Component {
    state = {
        recipeId: 716400,
        title: '',
        imageSrc: '',
        description: '',
        instructions: [],
        ingredients: {
            pressent: [],
            missing:[]
        },
    }

 componentDidMount(){
         this.fetchRecipeInfomation()
         this.summariseRecipe()
         this.fetchRecipeIntructions()
    }


    async fetchRecipeInfomation () {
        
        const { recipeId } = this.state

        console.log('Logging')

        console.log(process.env.SPOONACULAR_API_KEY)

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/information?includeNutrition=false&apiKey=f1e60ea98b204bac9657574150fa57ec`

        const spoonacularRes = await fetch(spoonacularEndpoint)

        const spoonacularData = await spoonacularRes.json()

        console.log(spoonacularData)

        this.setState({ title: spoonacularData.title, imageSrc: spoonacularData.image })
    }

    async summariseRecipe (){

        const { recipeId } = this.state

        console.log('Getting recipe description')

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/summary?&apiKey=f1e60ea98b204bac9657574150fa57ec`
        
        const summaryRes = await fetch(spoonacularEndpoint)

        const  { summary } = await summaryRes.json()

        this.setState({ description: this.removeHtmlTagsFromString(summary)})

    }

    async fetchRecipeIntructions () {

        const { recipeId } = this.state 

        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?&apiKey=f1e60ea98b204bac9657574150fa57ec`

        const instructionRes = await fetch (spoonacularEndpoint)

        const [ { steps }]  = await instructionRes.json()

        this.setState({instructions: steps})

    }

    renderInstructions(instructionsArr){
        return instructionsArr.map(instruction => <li>{instruction.step}</li>)
    }

    removeHtmlTagsFromString(string){
        return string.replace(/(<([^>]+)>)/gi, "")
    }

    render(){
        const {  title, imageSrc, description, instructions } = this.state
        return (
            <div>
                <section>
                    <img src={imageSrc} alt=""/>
                    <h1>{title}</h1>
                </section>
                <section className="recipe-container">
                    <div className="ingredients-container">
                    <ul>
                    </ul>
                    </div>
                    <div className="instructions-container">
                    <p className='recipe-description'>{ description }</p>
                    <ul>
                        {this.renderInstructions(instructions)}
                    </ul>
                    </div>
                </section>
            </div>
        )
    }
}

export default Recipe 