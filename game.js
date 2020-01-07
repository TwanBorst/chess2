export class Game {
    constructor(players) {
        this.players = players;
        this.playersTurn = new CLinkedList(this.players);

        this.players.forEach((player, index) => {
            player.joinGame(this);
            let toSend = player.toClient();
            toSend.playerNumber = index + 1;
            toSend.you = true;
            player.sendMessage({ type: 'addPlayer', data: toSend });
            // this.players.forEach((e)=>{
            //     if(player!=e){
            //         e.sendMessage({type: 'addPlayer', data: toSend});
            //     }
            // });
        });
        this.players.forEach((player, index) => {
            let toSend = player.toClient();
            toSend.playerNumber = index + 1;
            toSend.you = false;
            this.players.forEach((e) => {
                if (player != e) {
                    e.sendMessage({ type: 'addPlayer', data: toSend });
                }
            });
        });
        console.log("A game has started!");
    }
}
class CLinkedList {
    constructor(elements) {
        this.head = null;
        this.tail = null;
        this.current = null;
        elements.forEach(element => {
            this.add(element);
        });
    }
    add(element) {
        if (this.head == null) {
            this.current = this.head = this.tail = new Node(element);
            this.head.next = this.head;
            this.head.previous = this.head;
        } else {
            this.tail.next = new Node(element);
            this.tail = this.tail.next;
            this.tail.next = this.head;
        }
    }
    remove(element) {
        if (this.head != null) {
            let e = this.current;
            do {
                if (e.element == element) {
                    if (this.current == e) {
                        this.current = this.current.next;
                    }
                    e.previous.next = e.next;
                    e.next.previous = e.previous;
                    return e;
                } else {
                    e = e.next;
                }
            } while (e != this.current);
        }
    }
    getNext() {
        this.current = this.current.next;
        return this.current;
    }
}
class Node {
    constructor(element) {
        this.previous;
        this.next;
        this.element = element;
    }
}