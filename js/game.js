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
                super(1300, Math.random() * ALTURA_CANVAS, 100, 100,imagemInimigo)
                this.velocidadeX = 8 * Math.random() + 3
            }

            andar() {
                this.x -= this.velocidadeX

                if (this.x <= 0) {
                    this.x = 1200
                    this.y = Math.random() * ALTURA_CANVAS
                    passardefase()
                }
            }
            morrer() {
                this.x = 1200
                this.y = Math.random() * ALTURA_CANVAS
            }

    }
 
let canvasEl = document.querySelector('#jogo')
let ctx = canvasEl.getContext('2d')
let vidas = 3
let inimigomorreu = 0
let novafase = 3
let novavelocidade = 5
let imagemHolandes = new Image()
imagemHolandes.src = "images/musicicon.png"
let holandes = new Sprite(20,56,128,128,imagemHolandes)
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

document.addEventListener('keydown',(evento) => {
    if(evento.key == 'ArrowUp'){
        if(holandes.y>128)
            holandes.y -= 110
    }
    else if(evento.key == 'ArrowDown'){
        if(holandes.y<ALTURA_CANVAS-228)
            holandes.y += 110
    }
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

function passardefase(){
    inimigomorreu++
    if(novafase==inimigomorreu){
        novafase = novafase + (inimigomorreu*2)
        novavelocidade+=3
        holandes.x+=225
        inimigos.push(new Inimigo)
        if(holandes.x>=LARGURA_CANVAS){
            alert("VOCÊ GANHOU!")
            window.location.reload()
        }
        recria()
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