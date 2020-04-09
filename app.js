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
        gameRunning: false,
        specialAttackUsed: false,
        turn: 0
    },
    methods: {
        calculateDamage: function (min, max) {
            return Math.max(Math.floor(max * Math.random()), min)
        },
        attackByMonster: function () {
            let monsterAttack = this.calculateDamage(5, 15)
            this.log.push(`Monster delt ${monsterAttack} damage`);
            return monsterAttack;
        },
        attackByPlayer: function (factor) {
            let playerAttack = this.calculateDamage(3, 10) 
            if (factor != null) {
                this.log.push(`Player delt special attack ${playerAttack} damage`);
                return playerAttack * factor
            } else {
                this.log.push(`Player delt ${playerAttack} damage`);
                return playerAttack;
            }
        },
        attackButton: function () {
            const monsterDamage = this.attackByMonster()
            const playerDamage = this.attackByPlayer()

            if (this.playerHealth - monsterDamage <= 0 ) {
                this.playerHealth -= monsterDamage;
                this.playerHealth = 0;
                return
            } else {
                this.playerHealth -= monsterDamage;
            }
            
            if (this.monsterHealth - playerDamage <= 0) {
                this.monsterHealth -= playerDamage
                this.monsterHealth = 0;
                return
            } else {
                this.monsterHealth -= playerDamage;
            }
            this.turn -= 1
        },
        specialAttack: function (used, factor=2) {
            if (used) {
                alert(`You already used the special attack, wait ${this.turn} ${this.turn === 1 ? 'turn' : 'turns'}`);
                return 
            }

            const playerDamage = this.attackByPlayer(factor);
            const monsterDamage = this.attackByMonster();

            if (this.monsterHealth - playerDamage <= 0) {
                this.monsterHealth -= playerDamage;
                this.monsterHealth = 0;
                return;
            }

            this.monsterHealth -= playerDamage;
            this.playerHealth -= monsterDamage;
            this.turn = 3;
            this.specialAttackUsed = true
        },
        heal: function (num = 10) {
            const monsterDamage = this.attackByMonster();

            if (this.playerHealth === 100) {
                return;
            } else if (this.playerHealth + num > 100) {
                this.playerHealth = 100;
                this.playerHealth -= monsterDamage;
                this.turn -= 1;
                return;
            }

            this.playerHealth += num;
            this.log.push(`Player healed ${num}HP`)
            this.playerHealth -= monsterDamage;
            this.turn -= 1;
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
                this.gameRunning = false;
            }
        },
        gameOver: function(result, entity) {
            entity = 0
            this.gameRunning = false

            const response = confirm(`You ${result} Play again?`);
            if (response === true) {
                this.startGame();
            } 
            return;
        }
    },
    watch: {
        monsterHealth: function () {
            if (this.monsterHealth <= 0) {
                this.gameOver('Win!', this.monsterHealth)
            }
    
        },
        playerHealth: function () {
            if (this.playerHealth <= 0) {
                this.gameOver('Lose!', this.playerHealth)
            }
        }, 
        turn: function() {
            if (this.turn <= 0) {
                this.specialAttackUsed = false;
            }
        }
    }

})
