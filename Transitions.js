module.exports = class Transitions{
    constructor(_id, _row0, _row1, _row2, _row3, _row4){
        this.id = _id;
        this.row0 = _row0;
        this.row1 = _row1;
        this.row2 = _row2;
        this.row3 = _row3;
        this.row4 = _row4;
        this.count = 5;
    }
    GetRow(_num){
        switch(_num){
            case 0:
            return this.row0;
            case 1:
            return this.row1;
            case 2:
            return this.row2;
            case 3:
            return this.row3;
            case 4:
            return this.row4;
            default:
            return this.row0;
        }
    }
    SetRow(_num, _row){
        switch(_num){
            case 0:
            this.row0 = _row;
            break;
            case 1:
            this.row1 = _row;
            break;
            case 2:
            this.row2 = _row;
            break;
            case 3:
            this.row3 = _row;
            break;
            case 4:
            this.row0 = _row;
            break;
            default:
            this.row0 = _row;
            break;
        }
    }
    SetColumn(_num, _column, _value){
        switch(_num){
            case 0:
            this.row0[_column] = _value;
            break;
            case 1:
            this.row1[_column] = _value;
            break;
            case 2:
            this.row2[_column] = _value;
            break;
            case 3:
            this.row3[_column] = _value;
            break;
            case 4:
            this.row4[_column] = _value;
            break;
            default:
            this.row0[_column] = _value;
            break;
        }
    }    
}
