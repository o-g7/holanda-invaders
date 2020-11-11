const LARGURA_CANVAS = 1300
const ALTURA_CANVAS = 675

class Sprite {
    constructor(x, y, largura, altura, imagem) {
        this.x = x
        this.y = y
        this.largura = largura
        this.altura = altura
        this.imagem = imagem
        }
        cria(ctx) {
            if (this.imagem) {
                ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura)
            }
            else {
                ctx.fillRect(this.x, this.y, this.largura, this.altura)
            }
        }

        get centro() {
            return {
                x: this.x + this.largura / 2,
                y: this.y + this.altura / 2
            }
        }

        batercom(outraSprite) {
            let c1 = Math.abs(outraSprite.centro.x - this.centro.x)
            let c2 = Math.abs(outraSprite.centro.y - this.centro.y)
            let h = Math.sqrt(c1 ** 2 + c2 ** 2)
            let r1 = this.altura / 2
            let r2 = outraSprite.altura / 2

            return h <= r1 + r2
        }
}

class Inimigo extends Sprite {
            constructor() {
                super(1200, Math.random() * ALTURA_CANVAS, 100, 100,imagemInimigo)
                this.velocidadeX = 3 * Math.random() + 3
            }

            andar() {
                this.x -= this.velocidadeX

                if (this.x <= 0) {
                    this.x = 1200
                    this.y = Math.random() * ALTURA_CANVAS
                }
            }
            morrer() {
                this.x = 1200
                this.y = Math.random() * ALTURA_CANVAS
            }

        }
class Tiro extends Sprite{
    constructor(holandes){
            super(holandes.centro.x , holandes.centro.y , 25 , 50)
            this.velocidadeX = + 16
        }
            
    andar(){
        this.x += this.velocidadeX
        if(this.x>=LARGURA_CANVAS){
            this.podesermorto = true
            } 
        }
    }
 
let canvasEl = document.querySelector('#jogo')
let ctx = canvasEl.getContext('2d')
let vidas = 3
let imagemHolandes = new Image()
imagemHolandes.src = "images/musicicon.png"
let holandes = new Sprite(50,56,128,128,imagemHolandes)
let imagemInimigo = new Image()
imagemInimigo.src = "images/musicicon.png"
let inimigos = []
inimigos.push(new Inimigo())
inimigos.push(new Inimigo())
inimigos.push(new Inimigo())
ctx.strokeStyle = "white"
ctx.font = "30px Arial"
ctx.strokeText(`Vidas : ${vidas}` , 100, 600 )

imagemHolandes.addEventListener('load', (evento) => {
    recria()
})

canvasEl.addEventListener('mousemove', (evento) => {
    holandes.y = evento.offsetY
    recria()
})

function recria(){
    ctx.clearRect(0,0,1300,675)
    holandes.cria(ctx)
    for (let inimigo of inimigos){
        inimigo.cria(ctx)
    }
}

function atualizar(){
    for(let inimigo of inimigos){
        inimigo.andar(ctx)
    }
} 

function jogar(){
    recria()
    atualizar()
    verificasebateu()
}

function verificasebateu() {

    for (let inimigo of inimigos) {
        const atingiuHolandes = inimigo.batercom(holandes)
        if (atingiuHolandes) {
            inimigo.morrer()
            vidas --
            if(vidas<1){
                alert("Game over!")
                window.location.reload()
            }
       }
    }
}
setInterval(jogar,33)