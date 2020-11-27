window.alert("Olá, você foi convocado para ser o novo membro da tropa dos Holandeses, você deve chegar a praia desviando dos portugueses, para isso use a  ⬆ e a ⬇, cada vez que você anda , mais vão aparecer , boa sorte!")
const LARGURA_CANVAS = 1300//Tamanho de largura em x
const ALTURA_CANVAS = 675//Tamanho de altura em y
class Sprite {//Como vai funcionar qualquer personagem
    constructor(x, y, largura, altura, imagem) {
        this.x = x//Tem um x da tela
        this.y = y//Tem um y
        this.largura = largura//Uma largura da imagem dele
        this.altura = altura//E uma altura
        this.imagem = imagem//E claro, a imagem
        }
        cria(ctx) {
            if (this.imagem) {
                ctx.drawImage(this.imagem, this.x, this.y, this.largura, this.altura)//Desenha o personagem e sua imagem no local certo
            }
        }

        get centro() {//Pega o centro da imagem para calcular colisões, sendo as colisões levadas como circulos
            return {
                x: this.x + this.largura / 2,
                y: this.y + this.altura / 2
            }
        }

        batercom(outraSprite) {//Calcula se o círculo do personagem bateu com algum outro, isso tudo pelos centro
            let c1 = Math.abs(outraSprite.centro.x - this.centro.x)
            let c2 = Math.abs(outraSprite.centro.y - this.centro.y)
            let h = Math.sqrt(c1 ** 2 + c2 ** 2)
            let r1 = this.altura / 2
            let r2 = outraSprite.altura / 2

            return h <= r1 + r2//Retorna o valor quando for chamado , se bateu ou não
        }
}

class Inimigo extends Sprite {//Como vai funcionar os inimigos, esses extende de spirte, ou seja, possuem as mesmas propriedades e mais
            constructor() {
                super(1300, posição, 80, 80 ,imagemInimigo)//Equivale ao x,y,imagem... do Sprite
                this.velocidadeX = 5 * Math.random() + 3//Gera uma velocidade aleatória maior que 3
            }

            andar() {
                this.x -= this.velocidadeX//Muda o x conforme a velocidade, indo da direita pra esquecer

                if (this.x <= -80) {//Quando sai totalmente da tela...
                    this.x = 1300//..reseta o x e da uma nova posição de y(altura)
                    this.y = posição
                    passardefase()//Chama a função pra passar de fase (explicação mais a frente)
                }
            }
            morrer() {
                this.x = 1300//Reseta o x e da uma nova posição de y(altura)
                this.y = posição
            }

    }
 
let canvasEl = document.querySelector('#jogo')//Pega o canvas para desenhar o jogo nele
let ctx = canvasEl.getContext('2d')//Ctx serve para "entender como vai escrever o jogo", tipo 2D vai ter uma altura e uma largura, ou seja um x e y , e dessa forma da para se ecrever os sprites
let barradevidas = 1300//A barra de vida verdinha
let inimigomorreu = 0//Quantos inimigos morreram, vai ser usada pra frente...
let novafase = 3//Qual a fase, vai ser mais usada pra frente...
let posição//A nova posição de y, vai ser usada para frente...
let imagemHolandes = new Image()//Imagem do protagonista
imagemHolandes.src = "images/Barco.png"
let holandes = new Sprite(128,128,100,100,imagemHolandes)//O protagonista
let imagemInimigo = new Image()//Imagem do inimigo
imagemInimigo.src = "images/Inimigo.png"
let inimigos = []//Um vetor de inimigos
var fundoImg = new Image()//O background
fundoImg.src = "images/Background-Holanda.png";
inimigos.push(new Inimigo())//Coloca mais um inimigo no vetor
inimigos.push(new Inimigo())
inimigos.push(new Inimigo())


imagemHolandes.addEventListener('load', (evento) => {//Quando a página carregar já desenha o jogo
    imagemInimigo.addEventListener('load', (evento) => {//Quando a página carregar já desenha o jogo
        fundoImg.addEventListener('load', (evento) => {//Quando a página carregar já desenha o jogo
            recria()
        })
    })
})

document.addEventListener('keydown',(evento) => {//Quando presionar uma tecla...
    if(evento.key == 'ArrowUp'){
        if(holandes.y>128)
            holandes.y -= 128//você anda pra cima se for abaixo que a barra de vida ...
    }
    else if(evento.key == 'ArrowDown'){
        if(holandes.y<ALTURA_CANVAS-228)// ou pra baixo se for maior que a tela menos os sprites e o movimento
            holandes.y += 128
    }
    recria()
})

function recria(){//Desenha o jogo
    ctx.clearRect(0,0,1300,675)//Limpa a tela
    ctx.drawImage(fundoImg, 0, 0)//desenha o Backgroud
    holandes.cria(ctx)
    for (let inimigo of inimigos){
        inimigo.cria(ctx)//desenha o inimigo conforme ele anda
    }
    posição = (1+Math.floor(Math.random() * 4)) * 128//Atualiza a posição, pois assim quando o inimigo sair da tela ou morrer, tem uma nova altura
    ctx.fillStyle = "#00ff00"
    ctx.fillRect(0,0,barradevidas,100)
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
        holandes.x+=320
        inimigos.push(new Inimigo)
        if(holandes.x>=1300){
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
            barradevidas -= 434
            if(barradevidas<-434){
                recria()
                alert("Game over!")
                window.location.reload()
            }
       }
    }
}
setInterval(()=>{
    jogar()
},33)