export default class TokenNotFoundException extends Error {
    constructor(message, status){
        super(message);
        this.message = message;
        this.status =  status
    }
}