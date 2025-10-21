class Prof {
    constructor(){
        this.node = document.createElement('img')
        this.node.id = 'prof'
        this.node.src = "../assets/img/prof-stable.png"
        gameBoxNode.append(this.node)
        this.node.style.position = 'absolute'
        this.node.style.zIndex = 8

         //add the initial values of position and dimensions
        this.width = 148
        this.height = 119
        this.x = 886
        this.y = 961

        //adjust the node with initial values
        this.node.style.width = `${this.width}px`
        this.node.style.height = `${this.height}px`
        this.node.style.top = `${this.y}px`
        this.node.style.left = `${this.x}px`

        //movements
        this.moveSpeed = 12
    }
}