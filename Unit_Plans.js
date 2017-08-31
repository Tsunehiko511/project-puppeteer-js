const Elements = require('./Elements');
const Transitions = require('./Transitions');
const Plan = require('./Plan');

module.exports = class Unit_Plans{
    constructor(){
        this.plan0;
        this.plan1;
        this.plan2;
        this.plan3;
        this.plan4;
        this.plan5;        
    }

    Init(_plan0, _plan1, _plan2, _plan3, _plan4, _plan5){
        this.plan0 = _plan0;
        this.plan1 = _plan1;
        this.plan2 = _plan2;
        this.plan3 = _plan3;
        this.plan4 = _plan4;
        this.plan5 = _plan5;
    }
    GetPlan(_num){
        switch(_num){
            case 0:
            return this.plan0;
            case 1:
            return this.plan1;
            case 2:
            return this.plan2;
            case 3:
            return this.plan3;
            case 4:
            return this.plan4;
            case 5:
            return this.plan5;
            default:
            return this.plan0;
        }
    }

    SetPlan(_num, _plan){        
        switch(_num){
            case 0:
            this.plan0 = _plan;
            break;
            case 1:
            this.plan1 = _plan;
            break;
            case 2:
            this.plan2 = _plan;
            break;
            case 3:
            this.plan3 = _plan;
            break;
            case 4:
            this.plan4 = _plan;
            break;
            case 5:
            this.plan5 = _plan;
            break;
            default:
            this.plan0 = _plan;
            break;
        }
    }

    /* TODO project papetter
    SaveToString(){
        let tmp_json = JsonUtility.ToJson(this);
        return tmp_json;
    }*/
    CreateFromJSON( _jsonString){
        if(_jsonString == ""){
            let tmp_up = new Unit_Plans(); // TODO
            for(let j=0; j<6; j++){
                let tmp_transitions = new Transitions(j, [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]);
                let tmp_elements = new Elements(j, [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]);
                tmp_up.SetPlan(j, new Plan(j, tmp_transitions, tmp_elements));
            }
            return tmp_up;
        }
        // return JsonUtility.FromJson<Unit_Plans>(_jsonString);
        let tmp_jsonString = JSON.parse(_jsonString);
        let tmp_up = new Unit_Plans(); // TODO
        for(let j=0; j<6; j++){
            let tmp_transitions = new Transitions(j, tmp_jsonString["plan"+j]["transitions"]["row0"], tmp_jsonString["plan"+j]["transitions"]["row1"], tmp_jsonString["plan"+j]["transitions"]["row2"], tmp_jsonString["plan"+j]["transitions"]["row3"], tmp_jsonString["plan"+j]["transitions"]["row4"]);
            let tmp_elements = new Elements(j,  tmp_jsonString["plan"+j]["elements"]["row0"], tmp_jsonString["plan"+j]["elements"]["row1"], tmp_jsonString["plan"+j]["elements"]["row2"], tmp_jsonString["plan"+j]["elements"]["row3"], tmp_jsonString["plan"+j]["elements"]["row4"]);
            tmp_up.SetPlan(j, new Plan(j, tmp_transitions, tmp_elements));
        }
        return tmp_up;
    }
}