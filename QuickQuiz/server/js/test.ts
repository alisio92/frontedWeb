/**
 * Created by alisio on 16/12/2014.
 */
module Quiz {
    var players:Array<Test> = new Array<Test>();
    export class Test {
        id;
        ip;
        name;
        img;
        registered;
        admin;
        score;

        constructor(id, ip, name, img, registered, admin) {
            this.id = id;
            this.ip = ip;
            this.name = name;
            this.img = img;
            this.registered = registered;
            this.admin = admin;
            this.score = 0;
        }

        addUser(player):void {
            players.push(player);
        }
    }
}