const Unit_Plans = require('./Unit_Plans');
module.exports = class Player {
  constructor() {
    this.color = "";
    this.Units  = [0,1,2,3];
    this.plans = [new Unit_Plans(), new Unit_Plans(), new Unit_Plans(), new Unit_Plans()];
  }
  
  SetData(_ids, _json){
    for(let i=0; i<4; i++){
      this.plans[i] = this.plans[i].CreateFromJSON(_json[i]);
      this.Units[i] = _ids[i];
    }
  }
  /*
  GetDataJson(){
    let jsonList = new Array(4);
    for(let i=0; i<4; i++){
      jsonList[i] = this.plans[i].CreateToJSON()
    }
    return jsonList;
  }
  */
}