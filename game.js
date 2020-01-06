export class Game{
    constructor(players){
        this.players = players;
        

        this.players.forEach(player => {
            player.joinGame(this);
        });
        console.log("A game has started!");
    }
    playerTurn 
}
class CLinkedList{
    constructor(elements){
        this.head = null;
        this.tail = null;
        elements.forEach(element => {
            new
        });
    }
    add(element){
        if(this.head==null){
            this.head = this.tail = new Node(element);
            this.head.next = this.head;
            this.head.previous = this.head;
        } else {
            this.tail.next = new Node(element);
            this.tail = this.tail.next();
            this.tail
            
        }
    }
}
class Node{
    constructor(element){
        this.previous;
        this.next;
        this.element = element;
    }
    set next(next){
        this.next = next;
    }
    set previous(previous){
        this.previous = previous;
    }
    get next(){
        return this.next();
    }
    get previous(){
        return this.previous();
    }
    get element(){
        return this.element;
    }
}