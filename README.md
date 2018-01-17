# GuppyII

A game the player control a submarine walking in a maze under sea, using the sonar to view whats around it.

- Play Now!: https://dbasilioesp.itch.io/gumppy-ii
- Jam Site: UNISINOS
- Jam Year: 2017
- Platforms: Web standard (HTML5, Java, JavaScript, Flash)
- Technology: PhaserJS

## Download Sounds

https://www.dropbox.com/sh/9tvx6tftmxktnc3/AAAQMiASLtipq-oPc0XOSkANa?dl=0

## Credits

Programmer - David Basilio Espitalher

Ilustrator - Mauricio Ribeiro Leitão

Designer - Sue Ellen Basilio Espitalher

Assets - Bunch: http://opengameart.org/users/buch

Images 
	- http://unidcolor.deviantart.com/art/Underwater-Temple-202580919

## How to program

### Starting

O projeto inicia pelo arquivo _src/app.ts_ onde inicialmente é setados todos states do jogo e inicializado pelo _BootState_. Nesse ponto também é configurado o tamanho do jogo (ex: 800x600).

### Booting

A fase de boot é onde é configurado a escala e alinhamento do jogo na tela. Também é configurado efeitos como o som. Seguindo para a fase de loading.

### Loading

Nessa fase é carregado todos assets do jogo mostrando um tela de porcentagem do que falta carregar. Seguindo para a fase setada no arquivo _src/config.ts_.

### Libs

Esse pasta possui códigos que ajudam a construir o jogo sem necessariamente estarem vinculados ao phaser.

### Schemes

Aqui fica o mapeamento dos assets que serão carregados pela fase de loading.