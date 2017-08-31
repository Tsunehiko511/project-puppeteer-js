const Constants = require('./config');
const Elements = require('./Elements');
const Transitions = require('./Transitions');
const Plan = require('./Plan');
const Unit_Plans = require('./Unit_Plans');
const MapBoard = require('./MapBoard');
const Unit = require('./Unit');

module.exports = class GameMaster {
  constructor() {
    this.player1;
    this.player2;
    
    this.times;
    this.gameOver;
    this.Winner;
    this.DethSlot;
    this.Die_Count;
    // ボードの生成　初期化
    this.board;
    // スコアの初期化
    this.My_Left_Count;
    this.Enemy_Left_Count;
    this.My_KING_HP;
    this.Enemy_KING_HP;
    // ユニットの作成 & ボードに配置
    this.units;
    this.move_units;

  	// this.Unit_Plans;
    this.play_mode;
    this.IsGameOver;
    this.chara_Dic =[
                      [0,0],
                      [1,0],//クイーン1
                      [2,0],//ナイト1
                      [3,0],//ビショップ1
                      [3,1],//ビショップ2
                      [2,1],//ナイト2
                      [3,2],//ビショップ3
                      [2,2],//ナイト3
                      [1,1],//クイーン2
                      [1,2],//クイーン3
                      [4,0],// ポーン1
                      [4,1],// ポーン2
                      [4,2],// ポーン3
                      [5,0],// ルーク1
                      [5,1],// ルーク2
                      [5,2]// ルーク3
                      ];
  }



  Play(_player1, _player2){
    this.Init(_player1, _player2);
    this.MainPlay();
    return this.Winner;
  }


  Init(_player1, _player2){
    // 色の指定
    _player1.color = "RED";
    _player2.color = "BLUE";
    this.player1 = _player1;
    this.player2 = _player2;
    // 時間の生成
    this.times = 200;
    this.gameOver = false;
    this.Winner = "";
    this.DethSlot   = [0,0,0,0,0,0,0,0];
    this.Die_Count  = [0,0,0,0,0,0,0,0];

    // ボードの生成　初期化
    this.board = new MapBoard();

    // スコアの初期化
    this.My_Left_Count = 6;
    this.Enemy_Left_Count = 6;
    this.My_KING_HP = 500;
    this.Enemy_KING_HP = 500;

    // ユニットの作成 & ボードに配置
    this.units = [];
    this.move_units = new Array();

    this.SpawnUnit(0, this.player1);     // キング
    this.SpawnUnit(0, this.player2);     // キング
    this.SpawnUnit(1, this.player2);     // 中
    this.SpawnUnit(1, this.player1);     // 中
    this.SpawnUnit(2, this.player1);     // 上
    this.SpawnUnit(2, this.player2);     // 上
    this.SpawnUnit(3, this.player2);     // 下
    this.SpawnUnit(3, this.player1);     // 下
  }



  SpawnUnit(_id, _player){
    let tmp_position_x;
    let tmp_position_y = 0;
    let tmp_position_z = (Constants.MAP_SIZE_Z+1)/2;
    let _hp = 100;
    let _plans = new Unit_Plans();

    switch(_id){
      case 0:
      _hp = 500;
      tmp_position_y = 0.2;
      if(_player.color == "RED"){
        tmp_position_x = 3;
      }
      else{
        tmp_position_x = Constants.MAP_SIZE_X+1 -3;
      }
      break;
      case 1:
      if(_player.color == "RED"){
        tmp_position_x = 5;
      }
      else{
        tmp_position_x = Constants.MAP_SIZE_X+1 -5;
      }
      break;
      case 2:
      if(_player.color == "RED"){
        tmp_position_x = 5;
        tmp_position_z += 2;
      }
      else{
        tmp_position_x = Constants.MAP_SIZE_X+1 -5;
        tmp_position_z -= 2;
      }
      break;
      case 3:
      if(_player.color == "RED"){
        tmp_position_x = 5;
        tmp_position_z -= 2;
      }
      else{
        tmp_position_x = Constants.MAP_SIZE_X+1 -5;
        tmp_position_z += 2;
      }
      break;
      default:
      tmp_position_x = 3;
      break;
    }
    let _team = "My";
    if(_player.color == "BLUE"){
      _team = "Enemy";
    }   
    let cube =  new Unit(tmp_position_x, tmp_position_z, 2, 100+this.GetWaitDiff(this.GetType(_id, _player)) , _player, _hp, 25, 50, 4, _id, _player.plans[_id]);
    this.units.push(cube);
    this.board.SetMapBoard(tmp_position_x, tmp_position_z, cube);
  }



  GetType(_id, _player){
    let tmp_type = this.chara_Dic[_player.Units[_id]][0];
    switch(tmp_type){
      case 0:
      return "KING";
      case 1:
      return "QUEEN";
      case 2:
      return "KNIGHT";
      case 3:
      return "BISHOP";
      case 4:
      return "PAWN";
      case 5:
      return "ROOK";
      default:
      return "KNIGHT";
    }
  }

  Respown( _team){
    if(_team == "My"){
      this.My_Left_Count--;
      if(this.My_Left_Count <= 0){
        this.gameOver = true;
      }
    }
    else if (_team == "Enemy"){
      this.Enemy_Left_Count--;
      if(this.Enemy_Left_Count <= 0){
        this.gameOver = true;
      }
    }
  }
  /*
  GetWaitTime(_planList){
    let tmp_num = 0;
    let _array;
    for(let i=0; i<_planList.length; i++){
      _array = _planList[i];
      for(let j=0; j<_array.length; j++){
        if(_array[j] == 0){
          continue;
        }
        tmp_num++;
      }
    }
    tmp_num = (tmp_num/3)*3; // 0,1,2,3,4 = 0; 5,6,7,8,9 = 2; 
    return tmp_num;
  }*/

  GetWaitDiff(_type){
    switch(_type){
      case "KING":
      return 0;
      case "QUEEN":
      return 10;
      case "KNIGHT":
      return -20;
      case "BISHOP":
      return -10;
      case "PAWN":
      return -5;
      case "ROOK":
      return 5;
      default:
      return 0;
    }
  }
  //ゲーム開始
  MainPlay(){
    this.play_mode = "RESPOWN";
    this.IsGameOver = false;

    this.NextPhase();
  }
  
  NextPhase(){
    switch(this.play_mode){
      case "RESPOWN":
      this.ResPownPhase();
      this.play_mode = "SELECT";
      break;
      case "SELECT":
      this.SelectUnitPhase(this.units);
      this.play_mode = "GET_EVENT";
      break;
      case "GET_EVENT":
      this.GetEventPhase(this.move_units);
      this.play_mode = "MOVE_CAL";
      break;
      case "MOVE_CAL":
      this.MoveCalPhase(this.move_units);
      this.play_mode = "BATTLE_CAL";
      // console.log(this.board.map_Board);
      break;
      case "BATTLE_CAL":
      this.BattleCalPhase(this.move_units);
      this.play_mode = "DELETE";
      break;
      case "DELETE":
      this.DeletePhase();
      this.play_mode = "COUNT_DOWN";
      break;
      case "COUNT_DOWN":
      this.CountDownPhase();
      this.play_mode = "END";
      // console.log(this.times);
      break;
      case "END":
      this.EndPhase(this.move_units);
      break;
      case "GAME_OVER":
      this.GameOverPhase();
      return;
    }
    this.NextPhase();    
  }


  ResPownPhase(){
    // 死亡スロットを1増やし20なら復活
    for(let i=0; i<this.DethSlot.length; i++){
      if(this.DethSlot[i]>0){
        this.DethSlot[i]++;
      }
      if(this.DethSlot[i] == 20){
        this.DethSlot[i] = 0;
        if(i<4){
          this.SpawnUnit(i, this.player1);// 復活
        }
        else{
          this.SpawnUnit(i-4, this.player2);
        }
      }
    }
  }
  
  SelectUnitPhase(_units){//, _move_units){
    let can_move_count = 10000;
    let unit;
    for(let i=0; i<_units.length; i++){
      unit = _units[i];
      if(unit == null){
        continue;
      }
      let tmp_waitTime = unit.waitTime;
      // console.log(tmp_waitTime);

      // より早いunitがあればmove_unitsを新規作成
      if(can_move_count > tmp_waitTime){
        can_move_count = tmp_waitTime;
        this.move_units = [unit];
        // _move_units = [unit];
      }
      else if(can_move_count == tmp_waitTime){
        // 同じなら追加
        this.move_units.push(unit);
        // _move_units.push(unit);
      }
    }
    // console.log(this.move_units.length);
    //console.log(this.move_units[0].type);
    //console.log(this.move_units[1].type);
  }
  GetEventPhase(_move_units){
    let unit;
    for(let i=0; i<_move_units.length; i++){
      unit = _move_units[i];
      if(unit == null){
        continue;
      }
      unit.SetMEvent(this);
    }
  }
  MoveCalPhase(_move_units){
    // 移動関数 = 移動範囲を求める，ターゲットを決める，移動場所を決める
    let unit;
    for(let i=0; i<_move_units.length; i++){
      unit = _move_units[i];
      if(unit == null){
        continue;
      }
      unit.Move(this.board, this.units);
      // console.log("ID:"+unit._id+", 種類:"+unit.type+", ("+unit.xz_position+"), HP:"+unit.hp+", AT:"+unit.attack+", 行動:"+unit.action);
    }
  }

  BattleCalPhase(_move_units){
    // 攻撃関数 = ターゲットを決めてダメージ計算する
    let unit;
    for(let i=0; i<_move_units.length; i++){
      unit = _move_units[i];
      if(unit == null){
        continue;
      }
      unit.Battle(this.board);
    }
    //スタミナ計算
    for(let i=0; i<_move_units.length; i++){
      unit = _move_units[i];
      if(unit.IsAttack || unit.IsLongAttack || unit.IsS_LongAttack || unit.IsHeal || unit.IsCharge || unit.IsSpeedUP || unit.IsGuard){
        unit.StaminaDown();
      }
      else{
        unit.StaminaUp();
      }
      unit.sum_damage = 0;
      this.SetFalseFlag(unit);
    }
  }

  SetFalseFlag(_unit){
    _unit.IsAttack        = false;
    _unit.IsLongAttack    = false;
    _unit.IsS_LongAttack  = false;
    _unit.IsHeal      = false;
    _unit.IsCharge    = false;
    _unit.IsSpeedUP   = false;
    _unit.IsGuard     = false;
    // 受け
    _unit.IsDamage    = false;
    _unit.IsRecovery  = false;
    _unit.IsCharged   = false;
    _unit.IsSpeedUPed = false;
    _unit.IsGuarded   = false;
  } 

  DeletePhase(){
    let unit_count = this.units.length;
    let unit;
    for(let i=unit_count-1; i>=0; i--){
      unit = this.units[i];
      if(unit.type == "KING"){
        if(unit.team == "My"){
          this.My_KING_HP = unit.hp;
        }
        else{
          this.Enemy_KING_HP = unit.hp;
        }
      }
      if(unit.hp <= 0){
        this.units.splice(i,1); //Remove(unit);       // ユニットを排除
        if(unit.team == "My"){
          this.Die_Count[unit._id]++;
          this.DethSlot[unit._id]++;
        }
        else{
          this.Die_Count[unit._id+4]++;
          this.DethSlot[unit._id+4]++;
        }
        this.Respown(unit.team);
        this.board.SetMapBoard(unit.xz_position[0], unit.xz_position[1], null);
        if(unit.type == "KING"){
          this.gameOver = true;
          // SetLOSE(unit.team+"KING");
        }
        unit = null;
      }
    }
  }
  CountDownPhase(){
    this.times--;
    // console.log(this.times);
  }
  EndPhase(_move_units){
    // もしゲーム終了なら
    if(this.times < 1 || this.My_Left_Count < 1 || this.Enemy_Left_Count < 1 || this.gameOver){
      this.play_mode = "GAME_OVER";
      return;
    }
    else{
      this.play_mode = "RESPOWN";
    }

    // console.log(_move_units.length);
    let moved_waitTime = _move_units[0].waitTime;
    // unitのwaitTimeを引く
    let unit;
    for(let i=0; i<this.units.length; i++){
      unit = this.units[i];
      if(unit == null){
        continue;
      }
      unit.DownWaitTime(moved_waitTime);
      // console.log(unit.xz_position);
    }
    // 動いたユニットのwaittimeを戻す
    for(let i=0; i<_move_units.length; i++){
      unit = _move_units[i];
      if(unit == null){
        continue;
      }
      unit.ResetWaitTime();
    }
  }
  GameOverPhase(){
    if(this.times < 1){// 時間切れなら キングのHPを比較
      if(this.My_KING_HP > this.Enemy_KING_HP){
        this.Winner = "RED";
      }
      else if(this.My_KING_HP < this.Enemy_KING_HP){
        this.Winner =  "BLUE";
      }
      else if(this.My_Left_Count > this.Enemy_Left_Count){
        this.Winner = "RED";
      }
      else if(this.My_Left_Count < this.Enemy_Left_Count){
        this.Winner = "BLUE";
      }
      else{
        this.Winner = "Draw";
      }
    }
    else{// 時間内ならユニット破壊かキングのHP
      if(this.My_KING_HP < 1 && this.Enemy_KING_HP < 1){
        this.Winner = "Draw";
      }
      else if(this.My_KING_HP < 1){
        this.Winner = "BLUE";
      }
      else if(this.Enemy_KING_HP < 1){
        this.Winner = "RED";
      }
      else if(this.My_Left_Count < 1 && this.Enemy_Left_Count  < 1 ){
        this.Winner = "Draw";
      }
      else if(this.My_Left_Count < 1){
        this.Winner = "BLUE";
      }
      else if(this.Enemy_Left_Count < 1){
        this.Winner = "RED";
      }
      else{
        this.Winner = "Draw";
      }
    }
    return;
  }
}