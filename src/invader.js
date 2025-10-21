class Invader {
    constructor(randomX){

        this.node = document.createElement("img")
        this.node.src = "../assets/img/ground-alien.png"
        this.node.style.zIndex = 2
        this.node.style.position = 'absolute'
        gameBoxNode.append(this.node) //to add the node to game box on pipe creation


        //add the initial values of position and dimensions
        this.width = 23.6
        this.height = 49
        this.x = 941 + randomX
        this.y = 523

        //adjust the node with initial values
        this.node.style.width = `${this.width}px`
        this.node.style.height = `${this.height}px`
        this.node.style.top = `${this.y}px`
        this.node.style.left = `${this.x}px`

        //movements
        this.speed = 1

        //life

        this.life = 5

        this.dieFx = new Audio('../assets/audio/fx/alien-exploded.mp3')
        this.spawnFx = new Audio('../assets/audio/fx/alien-spawn-sound.mp3')
        this.occupyFx = new Audio('../assets/audio/fx/alien-spawn-sound.mp3')
    }

    automaticMovement(){
        this.y += this.speed
        this.node.style.top = `${this.y}px`


        this.width = this.width + (this.width * (0.4 / 100))
        this.height = this.height + (this.height * (0.4 / 100))

        this.node.style.width = `${this.width}px`
        this.node.style.height = `${this.height}px`
    }

    die(){
        this.node.src = "./assets/img/enemy-explosion.png"
        this.width = this.height 
        this.node.style.width = `${this.width}px`

        playSfx(this.dieFx)
        currentScore = currentScore + 5
        let formattedCurrentScore = currentScore.toString().padStart(6, '0')
        gbCurrentScoreNode.innerHTML = formattedCurrentScore
        setTimeout(() => {
            this.node.remove()
        }, 2000)
    }
}