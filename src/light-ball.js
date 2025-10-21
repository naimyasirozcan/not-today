class LightBall {
    constructor(profX){

        this.node = document.createElement("img")
        this.node.src = "../assets/img/light-ball.png"
        this.node.style.zIndex = 7
        this.node.style.position = 'absolute'
        gameBoxNode.append(this.node) //to add the node to game box on pipe creation


        //add the initial values of position and dimensions
        this.width = 39
        this.height = 39
        this.x = profX + 54
        this.y = 961

        //adjust the node with initial values
        this.node.style.width = `${this.width}px`
        this.node.style.height = `${this.height}px`
        this.node.style.top = `${this.y}px`
        this.node.style.left = `${this.x}px`

        //movements
        this.speed = 1

        //life
    }

    automaticMovement(){
        this.y -= this.speed
        this.node.style.top = `${this.y}px`
        this.width = this.width - (this.width * (0.2 / 100))
        this.height = this.height - (this.height * (0.2 / 100))

        this.node.style.width = `${this.width}px`
        this.node.style.height = `${this.height}px`
    }
}