new Vue({
    el: '#app',
    data: {
        playerHealth: 100,
        monsterHealth: 100,
        log: [],
        monStyle: {
            backgroundColor: 'pink'
        },
        playerStyle: {
            backgroundColor: 'lightBlue'
        },
        gameRunning: false
    },
    methods: {
        attackByMonster: function () {
            let monsterAttack = Math.floor(10 * Math.random())
            this.log.push(`Monster delt ${monsterAttack} damage`);
            return monsterAttack;
        },
        attackByPlayer: function (type) {
            let playerAttack = Math.floor(10 * Math.random())
            if (type === 'special') {
                this.log.push(`Player delt special attack ${playerAttack} damage`);
                return 20
            } else {
                this.log.push(`Player delt ${playerAttack} damage`);
                return playerAttack;
            }
        },
        attackButton: function () {
            if (this.playerHealth <= 0 ) {
                this.playerHealth = 0;
                return
            } else {
                this.playerHealth -= this.attackByMonster();
            }
            
            if (this.monsterHealth <= 0) {
                this.monsterHealth = 0;
                return
            } else {
                this.monsterHealth -= this.attackByPlayer();
            }
        },
        specialAttack: function () {
            this.monsterHealth -= this.attackByPlayer('special');
            this.playerHealth -= this.attackByMonster();
        },
        heal: function () {
            this.playerHealth += 10;
            this.log.push('Player healed 10HP')
            this.playerHealth -= this.attackByMonster();
        },
        startGame: function () {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.log = [];
            this.gameRunning = true; 
        },
        giveUp: function () {
            const response = confirm('Are you sure you want to give up?');
            if (response === true) {
                this.startGame();
            }
        }
    },
    watch: {
        monsterHealth: function () {
            if (this.monsterHealth <= 0) {
                this.monsterHealth = 0
                this.gameRunning = false

                const response = confirm('You won! Play again?');
                if (response === true) {
                    this.startGame();
                }
                return;
            }
        },
        playerHealth: function () {
            if (this.playerHealth <= 0) {
                this.playerHealth = 0
                this.gameRunning = false
                const response = confirm('You lost! Play again?');
                if (response === true) {
                    this.startGame();
                }
                return;
            }
        }
    }

})
