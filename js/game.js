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


imagemHolandes.addEventListener('load', (evento) => {//Carrega a imagem do protagonista antes do jogo, ou seja no carregamento da página
    imagemInimigo.addEventListener('load', (evento) => {//Carrega a imagem do Português
        fundoImg.addEventListener('load', (evento) => {//Carrega o fundo
            recria()
        })
    })
})

document.addEventListener('keydown',(evento) => {//Quando presionar uma tecla...
    if(evento.key == 'ArrowUp'){
        evento.preventDefault()//Evita o rolamento da página pelas setas
        if(holandes.y>128)
            holandes.y -= 128//você anda pra cima se for abaixo que a barra de vida ...
    }
    else if(evento.key == 'ArrowDown'){
        evento.preventDefault()
        if(holandes.y<ALTURA_CANVAS-228)// ou pra baixo se for maior que a tela menos os sprites e o movimento
            holandes.y += 128
    }
    recria()
})

function recria(){//Desenha o jogo
    ctx.clearRect(0,0,1300,675)//Limpa a tela
    ctx.drawImage(fundoImg, 0, 0)//Desenha o Backgroud
    holandes.cria(ctx)
    for (let inimigo of inimigos){
        inimigo.cria(ctx)//Desenha o novo ponto do inimigo, que muda com o atualizar()
    }
    posição = (1+Math.floor(Math.random() * 4)) * 128//Atualiza a posição, pois assim quando o inimigo sair da tela ou morrer, tem uma nova altura
    ctx.fillStyle = "#00ff00"//Cor da barra de vida 
    ctx.fillRect(0,0,barradevidas,100)
}

function atualizar(){// Atualiza o andar do inimigo, ou seja qual a  próxima posição que ele vai aparecer no recria, muda o x e o recria desenha
    for(let inimigo of inimigos){//Tira todos os inimigos do vetor automaticamente pra verificar
        inimigo.andar(ctx)
    }
}

function passardefase(){//Serve para aproximar da praia , chegar no fim e ganhar, é chamada toda vez que um inimigo sai da tela pela esquerda
    inimigomorreu++//O inimigo morreu
    if(novafase==inimigomorreu){// Quando inimigos suficientes tiverem morrido pra passar de fase, muda o x do barcoo, aproxima da praia
        novafase = novafase + (inimigomorreu*2)
        holandes.x+=320
        inimigos.push(new Inimigo)//Mais um inimigo sempre que passa de fase
        if(holandes.x>=1300){
            alert("VOCÊ GANHOU!")
            window.location.reload()//Recomeça a página, tipo um F5
        }
        recria()//Recria pra você ir para frente
    }
}

function verificasebateu() {//Verifica se teve colisão

    for (let inimigo of inimigos) {//Tira todos os inimigos pra verificar
        const atingiuHolandes = inimigo.batercom(holandes)//Se os centro colidirem eles vão dar um valor constante do encontro de duas sprites...
        if (atingiuHolandes) {//Se esse valor for verdadeiro, os inimigos morrem e a barra de vida diminui
            inimigo.morrer() 
            barradevidas -= 434
            if(barradevidas<-434){
                recria()
                alert("Game over!")//Morreu
                window.location.reload()
            }
       }
    }
}

function jogar(){//Uma função pra na hora de ser chamada , chamar todas de uma vez
    recria()
    atualizar()
    verificasebateu()
}

setInterval(()=>{
    jogar()
},33)//Chama a função jogar de 33 em 33 milesegundos