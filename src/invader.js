class Invader {
    constructor(randomX){

        this.node = document.createElement("img")
        this.node.src = "../assets/img/ground-alien.png"
        this.node.style.zIndex = 2
        this.node.style.position = 'absolute'
        gameBoxNode.append(this.node) //to add the node to game box on pipe creation


        //add the initial values of position and dimensions
        this.width = 37
        this.height = 76
        this.x = 941 + randomX
        this.y = 497

        //adjust the node with initial values
        this.node.style.width = `${this.width}px`
        this.node.style.height = `${this.height}px`
        this.node.style.top = `${this.y}px`
        this.node.style.left = `${this.x}px`

        //movements
        this.speed = 1

        //life

        this.life = 5

        this.dieFx = new Audio('../assets/audio/music/alien-exploded.mp3')
    }

    automaticMovement(){
        this.y += this.speed
        this.node.style.top = `${this.y}px`
        this.node.style.width = this.width + (this.width * (0.5 / 100))
        this.node.style.height = this.height + (this.height * (0.5 / 100))
    }

    die(){
        playSfx(this.dieFx)
        score = score + 5
        this.node.src = "../assets/img/ground-alien.png"
        setTimeout(() => {
            this.node.remove()
        }, 1000)
    }
}