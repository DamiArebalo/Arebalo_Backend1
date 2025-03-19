export default class UserDto {
    constructor(user) {
        this.name = user.name;
        this.email = user.email;
        if(user.cart != null){
            this.cart = user.cart;
        }
        this.role = user.role;
        this.isOnline = user.isOnline;
        
        
    }
}