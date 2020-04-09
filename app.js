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
        wait: 0,
        turns: 0,
    },
    methods: {
        calculateDamage: function (min, max) {
            return Math.max(Math.floor(max * Math.random()), min)
        },
        monsterAttack: function () {
            const damage = this.calculateDamage(5, 15)

            this.playerHealth -= damage;
            this.addToLog('Monster', damage, 'delt');
            if (this.playerHealth - damage <= 0) {
                this.playerHealth = 0
            }
        },
        playerDamage: function (factor) {
            let playerAttack = this.calculateDamage(3, 10) 
            if (factor != null) {
                return (playerAttack * factor)
            } else {
                return playerAttack;
            }
        },
        addToLog: function (whom, hp, action) {
            this.log.unshift({
                isPlayer: (whom === 'Player' ? true : false),
                text: `${whom} ${action} ${hp} HP`
            });
        },
        attackButton: function () {
            const damage = this.playerDamage()
        
            this.monsterHealth -= damage;
            this.addToLog('Player', damage, 'delt')

            if (this.monsterHealth - damage <= 0) {
                this.monsterHealth = 0;
                return;
            } 

            this.monsterAttack();
            this.wait -= 1
            this.turn += 1
        },
        specialAttack: function (used, factor=2) {
            if (used) {
                alert(`You already used the special attack, wait ${this.wait} ${this.wait === 1 ? 'turn' : 'turns'}`);
                return 
            }

            const damage = this.playerDamage(factor);

            this.monsterHealth -= damage;
            this.addToLog('Player', damage, 'delt')
            this.turns += 1;
            this.wait = 3;
            this.specialAttackUsed = true
            
            if (this.monsterHealth - damage <= 0) {
                this.monsterHealth = 0;
                return;
            }
            
            this.monsterAttack();
        },
        heal: function (num = 10) {

            if (this.playerHealth === 100) return;

            this.playerHealth += num;
            
            if (this.playerHealth + num > 100) {
                this.playerHealth = 100;
            }
            
            this.log.unshift({
                isPlayer: true,
                text: `Player healed ${num}HP`
            })
            this.wait -= 1;
            this.monsterAttack();
        },
        startGame: function () {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.log = [];
            this.gameRunning = true; 
            this.specialAttackUsed = false;
            this.wait = 0;
            this.turns = 0;
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
        wait: function() {
            if (this.wait === 0) {
                this.specialAttackUsed = false;
            }
        }
    }

})
