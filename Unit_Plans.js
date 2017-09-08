const Elements = require('./Elements');
const Transitions = require('./Transitions');
const Plan = require('./Plan');

module.exports = class Unit_Plans{
    constructor(){
        this.plans = [new Plan(), new Plan(), new Plan(), new Plan(), new Plan(), new Plan()];
    }
    CreateFromJSON( _jsonString){
        if(_jsonString == ""){
            let tmp_up = new Unit_Plans(); // TODO
            for(let j=0; j<6; j++){
                let tmp_transitions = new Transitions([0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]);
                let tmp_elements = new Elements([0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]);
                tmp_up.plans[j] = new Plan(j, tmp_transitions, tmp_elements);
            }
            return tmp_up;
        }
        // return JsonUtility.FromJson<Unit_Plans>(_jsonString);
        let tmp_jsonString = JSON.parse(_jsonString);
        let tmp_up = new Unit_Plans(); // TODO
        for(let j=0; j<6; j++){
            let tmp_transitions = new Transitions(tmp_jsonString["plan"+j]["transitions"]["row0"], tmp_jsonString["plan"+j]["transitions"]["row1"], tmp_jsonString["plan"+j]["transitions"]["row2"], tmp_jsonString["plan"+j]["transitions"]["row3"], tmp_jsonString["plan"+j]["transitions"]["row4"]);
            let tmp_elements = new Elements(tmp_jsonString["plan"+j]["elements"]["row0"], tmp_jsonString["plan"+j]["elements"]["row1"], tmp_jsonString["plan"+j]["elements"]["row2"], tmp_jsonString["plan"+j]["elements"]["row3"], tmp_jsonString["plan"+j]["elements"]["row4"]);
            tmp_up.plans[j] = new Plan(tmp_transitions, tmp_elements);
        }
        return tmp_up;
    }
    /*
    CreateToJSON(){
        let _json = {};
        for(let j=0; j<6; j++){
            if(_json["plan"+j] == null){
                _json["plan"+j] = {};
            }
            if(_json["plan"+j]["transitions"] == null){
                _json["plan"+j]["transitions"] = {};
            }
            if(_json["plan"+j]["transitions"]["row0"] == null){
                _json["plan"+j]["transitions"]["row0"] = new Array(0,0,0);
            }
            // _json["plan"+j]["transitions"]["row0"] = this.plans[j].transitions.rows0;
            // let tmp_transitions = new Transitions(tmp_jsonString["plan"+j]["transitions"]["row0"], tmp_jsonString["plan"+j]["transitions"]["row1"], tmp_jsonString["plan"+j]["transitions"]["row2"], tmp_jsonString["plan"+j]["transitions"]["row3"], tmp_jsonString["plan"+j]["transitions"]["row4"]);
            // let tmp_elements = new Elements(tmp_jsonString["plan"+j]["elements"]["row0"], tmp_jsonString["plan"+j]["elements"]["row1"], tmp_jsonString["plan"+j]["elements"]["row2"], tmp_jsonString["plan"+j]["elements"]["row3"], tmp_jsonString["plan"+j]["elements"]["row4"]);
            // tmp_up.plans[j] = new Plan(tmp_transitions, tmp_elements);
        }
        return _json;
    }
    */
}