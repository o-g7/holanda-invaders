const LARGURA_CANVAS = 675
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
                super(Math.random() * LARGURA_CANVAS, 500, 100, 100)
                this.velocidadeY = 3 * Math.random() + 3
            }

            andar() {
                this.y -= this.velocidadeY

                if (this.y <= 0) {
                    this.y = 570
                    this.x = Math.random() * LARGURA_CANVAS
                }
            }
            morrer() {
                this.y = 570
                this.x = Math.random() * LARGURA_CANVAS
            }

        }

        class Tiro extends Sprite{
            constructor(nave){
                super(nave.centro.x , nave.centro.y , 25 , 50)
                this.velocidadeY = + 16
            }
            
            andar(){
                this.y += this.velocidadeY
                if(this.y>ALTURA_CANVAS){
                    this.podesermorto = true
                } 
            }
        }
        
let canvasEl = document.querySelector('#jogo');
let ctx = canvasEl.getContext('2d');
ctx.fillStyle = "darkred"        
let vidas = 3
let pontos = 0
let nave = new Sprite(0, 675, 100, 100)
let tiros = []
let inimigos = []
inimigos.push(new Inimigo())
inimigos.push(new Inimigo())
inimigos.push(new Inimigo())

        document.body.addEventListener('click',()=>{
            let tiro = new Tiro(nave)
            tiros.push(tiro)
        })

        imagemNave.addEventListener('load', (evento) => {
            recria()
        })
        canvasEl.addEventListener('mousemove', (evento) => {
            nave.x = evento.offsetX
            nave.y = evento.offsetY

            recria()
        })
        function recria() {
            ctx.clearRect(0, 0, 1350, 625)
            nave.cria(ctx)
            for (let inimigo of inimigos) {
                inimigo.cria(ctx)
            }
            for (let tiro of tiros){
                tiro.cria(ctx)
            }


            ctx.strokeStyle = "white"
            ctx.font = "30px Arial"
            ctx.strokeText(`Vidas : ${vidas}` , 100, 600 )
            ctx.strokeText(`Pontos: ${pontos}` , 100, 500 )
              
        }
        function verificasebateu() {

            for (let inimigo of inimigos) {
                const atingiuNave = inimigo.batercom(nave)
                if (atingiuNave) {
                    inimigo.morrer()
                    vidas --
                    if(vidas<1){
                        alert("Game over!")
                        window.location.reload()
                    }
               }
            }
            

            for (let inimigo of inimigos){
                for(let tiro of tiros){
                    const atingiuinimigo = tiro.batercom(inimigo)
                    if(atingiuinimigo){
                        inimigo.morrer()
                        tiro.podesermorto = true
                        pontos +=100
                        if(pontos>10000){
                            alert(`Parabéns ${nome}!!! Você agora é o melhor patruleiro da galáxia contra os bugs galáticos!!! Agora te mandarei no tempo para criar um paradoxo de você salvando a galáxia !!! `)
                            window.location.reload()
                        }
                    }
                }
            }
        }
        function atualizar(){
            for (let inimigo of inimigos) {
                    inimigo.andar(ctx)
            }
        }
         
        function dartiro(){
            for (let tiro of tiros){
                tiro.andar(ctx)
            }
            for (let i = 0; i < tiros.length; i++) {
                if (tiros[i].podesermorto) {
                    tiros.splice(i, 1);
                }
            }
        }

        function ojogo(){
            recria()
            atualizar()
            dartiro()
            verificasebateu()
        }
            setInterval(ojogo, 33);