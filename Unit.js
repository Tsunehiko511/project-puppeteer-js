const Constants = require('./config');

module.exports = class Unit{
	constructor(_x, _z, _loc, _waitTime, _player, _hp, _attack, _heal, _stamina, _id, _plans){
		// this.xz_position = [0,0];	// 現在地
		// this.locomotion;		// 移動力
		// this.waitTime_max;			// 待ち時間
		// this.waitTime;			// 待ち時間
		this.team;
		this.enemy_team;
		this.type;
		this._id;
		// ths. state; 				// 現在の状態
		// this.plan;
		this.filter1;
		this.filter2;
		this.target_condition;
		this.action;
		this.plans;
		this.Max_hp;
		this.hp;
		this.attack; 				// 現在の状態
		this.defense; 				// 現在の状態
		this.heal;
		this.Max_stamina;
		this.stamina;
		this.charge;       // ため攻撃系
		this.guard;       // ため攻撃系
		this.speedUP;       // ため攻撃系

		this.sum_damage;
		this.IsAttack;
		this.IsLongAttack;
		this.IsHeal;
		this.IsDamage;
		this.IsDamaged;
		this.IsRecovery;
		this.IsCharge;
		this.IsCharged;
		this.IsGuard;
		this.IsGuarded;
		this.IsSpeedUP;
		this.IsSpeedUPed;
		this.IsS_LongAttack;

		this.attackRange;
		this.attackRange_LONG;
		this.attackRange_S_LONG;
		this.healRange;
		this.supportRange;

		this.plan_eventFlags = new Array(50);
	    for(let i=0; i<this.plan_eventFlags.length; i++){
	      this.plan_eventFlags[i] = false;
	    }
		this.plan_eventFlag;
		this.connectStartId = -1;

		this.target_position = [-1, -2];
		this.target_unit = null;

		this.point_positions =[ // 左奥，右奥，左前，右前
				[Constants.MAP_SIZE_X, Constants.MAP_SIZE_Z],
				[Constants.MAP_SIZE_X, 1],
				[1, Constants.MAP_SIZE_Z],
				[1, 1]
			];

		this.xz_position = [_x, _z];
		this.locomotion 		= _loc;
		this.waitTime_max		= _waitTime;
		this.waitTime 			= _waitTime;
		this.action 			= Constants.A_WAIT;
		if(_player.color == "RED"){
			this.team = "My";
			this.enemy_team = "Enemy";
		}
		else{
			this.team = "Enemy";			
			this.enemy_team = "My";			
		}

		/*--------
		* 初期設定 *
		----------*/
		this.Max_hp 	= _hp;
		this.hp 		= _hp;
		this.attack 	= _attack;
		this.defense 	= 0;
		this.heal 		= _heal;
		this.Max_stamina= _stamina;
		this.stamina 	= _stamina;
		this.type 		= this.GetType(_id, _player);
		this._id 		= _id;
		this.plans 		= _plans;

		this.plan 	= 0;
		this.charge = 0;
		this.guard 	= 0;

		if(this.team == "My"){
			this.attackRange 	= [[0,0], [0,1], [1,0], [0,-1], [-1,0]];
			this.healRange 		= [[0,2], [2,0], [0,-2], [-2,0], [0,1], [1,0], [0,-1], [-1,0], [0,0], [1,1], [-1,-1], [1,-1], [-1,1]];
			this.attackRange_LONG = [
										[0,3],[3,0],[0,-3],[-3,0], 
										[0,2], [2,0], [0,-2], [-2,0],
										[0,1], [1,0], [0,-1], [-1,0],
										[1,1],[-1,-1],[1,-1],[-1,1],
										[1,2], [2,1], [-1,-2], [-2,-1],
										[-1,2], [-2,1], [1,-2], [2,-1],
										[0,0]
									];
			this.supportRange 	= [[0,0], [0,1], [1,0], [0,-1], [-1,0]];
			this.attackRange_S_LONG = [
										[0,5],[5,0],[0,-5],[-5,0], 
										[0,4],[4,0],[0,-4],[-4,0], 
										[0,3],[3,0],[0,-3],[-3,0], 
										[0,2],[2,0],[0,-2],[-2,0], 
										[0,1],[1,0],[0,-1],[-1,0], 
										[1,1],[-1,-1],[1,-1],[-1,1],
										[1,2],[2,1], [-1,-2], [-2,-1],
										[-1,2], [-2,1], [1,-2], [2,-1],
										[2,2],[-2,-2],[2,-2],[-2,2],
										[1,3],[-1,-3],[1,-3],[-1,3],
										[3,1],[-3,-1],[3,-1],[-3,1],
										[1,4],[-1,-4],[1,-4],[-1,4],
										[4,1],[-4,-1],[4,-1],[-4,1],
										[2,3],[-2,-3],[2,-3],[-2,3],
										[3,2],[-3,-2],[3,-2],[-3,2],
										[0,0]
										];
		}
		else{
			this.attackRange 	= [[0,0], [0,-1], [-1,0], [0,1], [1,0]];
			this.healRange 		= [[0,-2], [-2,0], [0,2], [2,0], [0,-1], [-1,0], [0,1], [1,0],[0,0],[-1,-1],[1,1],[-1,1],[1,-1]];
			this.attackRange_LONG = [
									[0,-3],[-3,0],[0,3],[3,0], 
									[0,-2], [-2,0], [0,2], [2,0],
									[0,-1], [-1,0], [0,1], [1,0],
									[-1,-1],[1,1],[-1,1],[1,-1],
									[-1,-2], [-2,-1], [1,2], [2,1],
									[1,-2], [2,-1], [-1,2], [-2,1],
									[0,0]
									];
			this.supportRange 	= [[0,0], [0,-1], [-1,0], [0,1], [1,0]];
			this.attackRange_S_LONG = [
										[-1,-1],[1,1],[-1,1],[1,-1],
										[-1,-2],[-2,-1], [1,2], [2,1],
										[1,-2], [2,-1], [-1,2], [-2,1],
										[-2,-2],[2,2],[-2,2],[2,-2],
										[-1,-3],[1,3],[-1,3],[1,-3],
										[-3,-1],[3,1],[-3,1],[3,-1],
										[-1,-4],[1,4],[-1,4],[1,-4],
										[-4,-1],[4,1],[-4,1],[4,-1],
										[-2,-3],[2,3],[-2,3],[2,-3],
										[-3,-2],[3,2],[-3,2],[3,-2],
										[0,-5],[-5,0],[0,5],[5,0], 
										[0,-4],[-4,0],[0,4],[4,0], 
										[0,-3],[-3,0],[0,3],[3,0], 
										[0,-2],[-2,0],[0,2],[2,0], 
										[0,-1],[-1,0],[0,1],[1,0], 
										[0,0]
										];
		}
		this.sum_damage = 0;
		this.IsDamage = false;
		this.IsHeal 	= false;
	}

	GetType(_id, _player){
	    let chara_Dic =[
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

		const tmp_type = chara_Dic[_player.Units[_id]][0];
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

	ChangeSkill(_origin){
		if(_origin === Constants.A_SKILL){
			if(this.type == "KING" || this.type == "BISHOP"){
			  return Constants.A_LONG_ATTACK;
			}
			else if(this.type == "QUEEN"){
			  return Constants.A_HEAL;
			}
			else if(this.type == "KNIGHT"){
			  return Constants.A_CHARGE;
			}
			else if(this.type == "PAWN"){
			  return Constants.A_GUARD;
			  //return Constants.A_SPEEDUP;
			}
			else if(this.type == "ROOK"){
					return Constants.A_S_LONG_ATTACK;
			}
		}
		else if(_origin === Constants.A_RETREAT){
			return Constants.A_WAIT;
		}
		return _origin;
	}

	/*---------
	* 状態遷移 *
	---------*/

	// 遷移
	// 満たせば必ず遷移する
  	IsPlanSelect(s_plan, plan_event1, plan_event2, e_plan){
		if(e_plan < 0){
			return false;
		}
		if(this.plan != s_plan){
			return false; // 今の場所をリストから探す
		}

	  	let IsCondition1 = false;
	  	let IsCondition2 = false;
		// 無条件遷移も許す
		if(plan_event1 == 0 || this.plan_eventFlags[plan_event1]){
			IsCondition1 = true;
		}
		if(plan_event2 == 0 || this.plan_eventFlags[plan_event2]){
			IsCondition2 = true;
		}
		if(IsCondition1 && IsCondition2){
			this.plan = e_plan;
			return true;
		}
		return false;
	}
	IsActionSelect(_elements, _gameMaster){
		// Idの場所を取得
		if(this.plan != _elements.id){
			return false;      // 次のプラン
		}

		// ターゲット条件を確認し，アクションを決定する
		for(let i=0; i<5; i++){
			if(this.SetTarget(this.plans.GetPlan(this.plan).elements.GetRow(i)[0], 
									this.plans.GetPlan(this.plan).elements.GetRow(i)[1], 
									this.plans.GetPlan(this.plan).elements.GetRow(i)[2],
									this.ChangeSkill(this.plans.GetPlan(this.plan).elements.GetRow(i)[3]),
									_gameMaster)
			){
				this.filter1 = _elements.GetRow(i)[0];
				this.filter2 = _elements.GetRow(i)[1];
				this.target_condition = _elements.GetRow(i)[2];
				this.action = this.ChangeSkill(_elements.GetRow(i)[3]);
				return true; 
			}
		}
		// どれも当てはまらない
		this.filter1 = 0;
		this.filter2 = 0;
		this.target_condition = 0;
		this.action = 0;
		return true;
	}

  // 単純に現在のPlanから回す _transitions.id
  DoTransition(_plans, _gameMaster){
  	let idx = this.connectStartId;// 現在のPlanを取得
	if(idx < 0){
  		idx = 0;
  		this.plan = 0; //GetMinPlan();// Constants.P_INIT; // 初期Plan = 1 //NodeArrowは0,1,2,3で登録			
	}
  	for(let i=0; i<6; i++){
  		let num = (i+idx)%6;
  		for(let j=0; j<5; j++){
			// if(_plans.GetPlan(num).transitions.GetRow(j).length == 0){}
			if(this.IsPlanSelect(_plans.GetPlan(num).transitions.id, _plans.GetPlan(num).transitions.GetRow(j)[0], _plans.GetPlan(num).transitions.GetRow(j)[1], _plans.GetPlan(num).transitions.GetRow(j)[2]-1)){
				this.connectStartId = _plans.GetPlan(num).transitions.GetRow(j)[2]-1;
				break;
			}
  		}
  	}
  	// 条件から行動を選択
  	for(let i=0; i<6; i++){
  		if(this.IsActionSelect(_plans.GetPlan(i).elements, _gameMaster)){
  			break;
  		}
  	}
  	this.plan_eventFlag = 0;
  	this.RestFlag();
  }
  RestFlag(){
  	for(let i=0; i<this.plan_eventFlags.length; i++){
	  	this.plan_eventFlags[i] = false;
  	}
  }

	// もしPointに関することなら 赤＝＞青，緑＝＞黄色
  /*---------
  * イベント *
  ---------*/

	SetMEvent(_gameMaster){
		this.SetMINEHPEvent();// 自分のHPイベント
		this.SetStaminaEvent(); 											// スタミナイベントの設定
		this.SetScoreEvent(_gameMaster);
		this.SetTimeEvent(_gameMaster);
		this.SetKINGHPEvent(_gameMaster);
		this.SetPointEvent();
		this.SetUnitCount(_gameMaster);
		this.DieCountEvent(_gameMaster);
		// 状態遷移
		this.DoTransition(this.plans, _gameMaster);
	}

	SetMINEHPEvent(){
		if(this.Max_hp*75 <= this.hp*100){
			this.plan_eventFlags[Constants.F_HP_75_100] = true;
		}
		else if(this.Max_hp*50 <= this.hp*100){
			this.plan_eventFlags[Constants.F_HP_50_75] = true;
		}
		else if(this.Max_hp*25 <= this.hp*100){
			this.plan_eventFlags[Constants.F_HP_25_50] = true;
		}
		else if(this.Max_hp*0 <= this.hp*100){
			this.plan_eventFlags[Constants.F_HP_0_25] = true;
		}
	}

	SetStaminaEvent(){
		if(this.stamina == 4){
			this.plan_eventFlags[Constants.F_STAMINA_4] = true;
			this.plan_eventFlags[Constants.F_STAMINA_3_4] = true;
		}
		else if(this.stamina == 3){
			this.plan_eventFlags[Constants.F_STAMINA_3] = true;
			this.plan_eventFlags[Constants.F_STAMINA_3_4] = true;
		}
		else if(this.stamina == 2){
			this.plan_eventFlags[Constants.F_STAMINA_2] = true;
		}
		else if(this.stamina > -1){
			this.plan_eventFlags[Constants.F_STAMINA_0_1] = true;
		}
	}

	SetScoreEvent(_gameMaster){
		let red_left = _gameMaster.My_Left_Count;
		let blue_left = _gameMaster.Enemy_Left_Count;
		let myLeft;
		let EnemyLeft;

		if(this.team == "My"){
			myLeft = red_left;
			EnemyLeft = blue_left;
		}
		else{
			myLeft = blue_left;
			EnemyLeft = red_left;			
		}

		if(myLeft > 4){
			this.plan_eventFlags[Constants.F_LEFT_FRIEND_5_6] = true;
		}
		else if(myLeft > 2){
			this.plan_eventFlags[Constants.F_LEFT_FRIEND_3_4] = true;
		}
		else if(myLeft > 0){
			this.plan_eventFlags[Constants.F_LEFT_FRIEND_1_2] = true;
		}

		if(EnemyLeft > 4){
			this.plan_eventFlags[Constants.F_LEFT_ENEMY_5_6] = true;
		}
		else if(EnemyLeft > 2){
			this.plan_eventFlags[Constants.F_LEFT_ENEMY_3_4] = true;
		}
		else if(EnemyLeft > 0){
			this.plan_eventFlags[Constants.F_LEFT_ENEMY_1_2] = true;
		}
		if(myLeft > EnemyLeft){
			this.plan_eventFlags[Constants.F_LEFT_FRIEND_OVER_ENEMY] = true;
		}
		else if(EnemyLeft > myLeft){
			this.plan_eventFlags[Constants.F_LEFT_FRIEND_UNDER_ENEMY] = true;			
		}
		else{
			this.plan_eventFlags[Constants.F_LEFT_EQUAL] = true;			
		}
	}

	// ユニットの存在を調べる
	SetKINGHPEvent(_gameMaster){
		let tmp_units = _gameMaster.units;
		let my_king = this.GetUnit(this.team, "KING", tmp_units);
		let enemy_king = this.GetUnit(this.enemy_team, "KING", tmp_units);

		if(this.IsHP(enemy_king, 75, "Hight") && this.IsHP(enemy_king, 100, "Low")){
			this.plan_eventFlags[Constants.F_E_KING_HP_75_100] = true;
		}
		else if(this.IsHP(enemy_king, 50, "Hight") && this.IsHP(enemy_king, 75, "Low")){
			this.plan_eventFlags[Constants.F_E_KING_HP_50_75] = true;
		}
		else if(this.IsHP(enemy_king, 25, "Hight") && this.IsHP(enemy_king, 50, "Low")){
			this.plan_eventFlags[Constants.F_E_KING_HP_25_50] = true;
		}
		else if(this.IsHP(enemy_king, 0, "Hight") && this.IsHP(enemy_king, 25, "Low")){
			this.plan_eventFlags[Constants.F_E_KING_HP_0_25] = true;
		}

		if(this.IsHP(my_king, 75, "Hight") && this.IsHP(my_king, 100, "Low")){
			this.plan_eventFlags[Constants.F_F_KING_HP_75_100] = true;
		}
		else if(this.IsHP(my_king, 50, "Hight") && this.IsHP(my_king, 75, "Low")){
			this.plan_eventFlags[Constants.F_F_KING_HP_50_75] = true;
		}
		else if(this.IsHP(my_king, 25, "Hight") && this.IsHP(my_king, 50, "Low")){
			this.plan_eventFlags[Constants.F_F_KING_HP_25_50] = true;
		}
		else if(this.IsHP(my_king, 0, "Hight") && this.IsHP(my_king, 25, "Low")){
			this.plan_eventFlags[Constants.F_F_KING_HP_0_25] = true;
		}
		if(my_king.hp > enemy_king.hp){
			this.plan_eventFlags[Constants.F_F_KING_HP_WIN_E] = true;
		}
		else if(my_king.hp < enemy_king.hp){
			this.plan_eventFlags[Constants.F_F_KING_HP_LOSE_E] = true;
		}
		else{
			this.plan_eventFlags[Constants.F_KING_HP_EQUAL] = true;			
		}
	}

	SetTimeEvent(_gameMaster){
		let tmp_time = _gameMaster.times;
		if(150 <= tmp_time && tmp_time <= 200){
			this.plan_eventFlags[Constants.F_TIME_150_200] = true;
		}
		if(100 <= tmp_time && tmp_time <= 150){
			this.plan_eventFlags[Constants.F_TIME_100_150] = true;
		}
		if(50 <= tmp_time && tmp_time <= 100){
			this.plan_eventFlags[Constants.F_TIME_50_100] = true;
		}
		if(0 <= tmp_time && tmp_time <= 50){
			this.plan_eventFlags[Constants.F_TIME_0_50] = true;
		}
	}

	SetPointEvent(){
		let red_point		= this.GetManhattanDistance(this.xz_position, [this.point_positions[0][0],this.point_positions[0][1]]);
		let green_point 	= this.GetManhattanDistance(this.xz_position, [this.point_positions[1][0],this.point_positions[1][1]]);
		let yellow_point	= this.GetManhattanDistance(this.xz_position, [this.point_positions[2][0],this.point_positions[2][1]]);
		let blue_point 		= this.GetManhattanDistance(this.xz_position, [this.point_positions[3][0],this.point_positions[3][1]]);
		// 敵の場合は点対称にしないといけない
		if(this.team == "Enemy"){
			if(red_point < 2){
				this.plan_eventFlags[Constants.F_POINT_BLUE] = true;
			}
			if(green_point < 2){
				this.plan_eventFlags[Constants.F_POINT_YELLOW] = true;
			}
			if(yellow_point < 2){
				this.plan_eventFlags[Constants.F_POINT_GREEN] = true;
			}
			if(blue_point < 2){
				this.plan_eventFlags[Constants.F_POINT_RED] = true;
			}
			return;
		}
		if(red_point < 2){
			this.plan_eventFlags[Constants.F_POINT_RED] = true;
		}
		if(green_point < 2){
			this.plan_eventFlags[Constants.F_POINT_GREEN] = true;
		}
		if(yellow_point < 2){
			this.plan_eventFlags[Constants.F_POINT_YELLOW] = true;
		}
		if(blue_point < 2){
			this.plan_eventFlags[Constants.F_POINT_BLUE] = true;
		}
	}

	// 近くの敵，味方の数
	SetUnitCount(_gameMaster){
		let tmp_units = _gameMaster.units;		
		let tmp_friend_unit_count = 0;
		let tmp_enemy_unit_count 	= 0;
		let _unit;
		for(let i=0; i<tmp_units.length; i++){
			_unit = tmp_units[i];
			if(_unit == null){
				continue; // 死んでるやつは飛ばす
			}

			if(_unit.team == this.team){
				if(_unit._id == this._id){
					continue;
				}
				// _unitとの距離が_dist以下か？
				if(this.IsNearUnit(3, _unit)){
					tmp_friend_unit_count++;
				}
			}
			else{
				if(this.IsNearUnit(3, _unit)){
					tmp_enemy_unit_count++;
				}
			}
		}
		switch(tmp_friend_unit_count){
			case 0:
			this.plan_eventFlags[Constants.F_UNIT_F_COUNT_0] = true;
			break;
			case 1:
			this.plan_eventFlags[Constants.F_UNIT_F_COUNT_1] = true;
			break;
			case 2:
			this.plan_eventFlags[Constants.F_UNIT_F_COUNT_2] = true;
			break;
			case 3:
			this.plan_eventFlags[Constants.F_UNIT_F_COUNT_3] = true;
			break;
		}
		switch(tmp_enemy_unit_count){
			case 0:
			this.plan_eventFlags[Constants.F_UNIT_E_COUNT_0] = true;
			break;
			case 1:
			this.plan_eventFlags[Constants.F_UNIT_E_COUNT_1] = true;
			break;
			case 2:
			this.plan_eventFlags[Constants.F_UNIT_E_COUNT_2] = true;
			break;
			case 3:
			this.plan_eventFlags[Constants.F_UNIT_E_COUNT_3] = true;
			break;
			case 4:
			this.plan_eventFlags[Constants.F_UNIT_E_COUNT_4] = true;
			break;
		}
	}	

	DieCountEvent(_gameMaster){
		let tmp_die_count = _gameMaster.Die_Count;
		let tmp_id = this._id;
		if(this.team == "Enemy"){
			tmp_id += 4;
		}
		if(tmp_die_count[tmp_id] == 0){
			this.plan_eventFlags[Constants.F_DIE_COUNT_0] = true;
		}
		else{
			this.plan_eventFlags[Constants.F_DIE_COUNT_NOT_0] = true;
		}
	}


	GetUnits(_team, _type, _units, _action){
		let tmp_units = [];
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(this.IsTeamMate(_unit) != _team){
				continue;
			}
			if(this.IsMine(_unit)){
				continue;
			}
			if(_unit.type == "KING" && _action === Constants.A_HEAL){
				continue;
			}
			if(_type == "ALL"){
				tmp_units.push(_unit);				
			}
			else if(_unit.type == _type){
				 tmp_units.push(_unit);
			}
		}
		return tmp_units;
	}

	GetNotUnits(_type, _units){
		let tmp_units = [];
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(_unit == null){
				continue;
			}
			if(this.IsMine(_unit)){
				continue;
			}
			if(_unit.type != _type){
				tmp_units.push(_unit);
			}
		}
		return tmp_units;
	}

	GetUnit(_team , _type, _units){
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(this.IsTeamMate(_unit) != _team){
				continue;
			}
			if(_unit.type == _type){
				return _unit;
			}
		}
		return null;
	}

	// ユニットのHPが??以下であるかどうか
	IsHP(_unit, _par, _type){
		if(_type == "Low"){
			if(_unit.Max_hp*_par >= _unit.hp*100){
				return true;
			}
		}
		else if(_type == "Hight"){
			if(_unit.Max_hp*_par <= _unit.hp*100){
				return true;
			}
		}
		return false;
	}
	// ユニットのHPが??以下であるかどうか
	IsStamina(_unit, _value, _type){
		if(_type == "Low"){
			if(_unit.stamina <= _value){
				return true;
			}
		}
		else if(_type == "Hight"){
			if(_value <= _unit.stamina){
				return true;
			}
		}
		return false;
	}

	IsMine(_unit){
		if(this.IsTeamMate(_unit) == this.team){
			if(_unit._id == this._id){
				return true;
			}
		}
		return false;
	}
	/*------イベント終了------*/



	/*----------
	*移動フェイズ*
	-----------*/
	Move(_mcBoard, _units){
		// キングなら移動しない	
		if(this.type == "KING"){
			return;
		}
		// 待機は移動しない
		if(this.action === Constants.A_WAIT){
			return;
		}
		// console.log("action"+this.action);
		this.ViewArea(_mcBoard, _units);
	}	

	// 範囲内にポイントがあるかどうか
	IsNear4Point(_filter, _point){
		switch(_filter){
			case Constants.FI_DIST_1:
			return this.IsNearPoint("UNDER", 1, _point);
			case Constants.FI_DIST_4:
			return this.IsNearPoint("UNDER", 4, _point);
			case Constants.FI_DIST_7:
			return this.IsNearPoint("UNDER", 7, _point);
			case Constants.FI_DIST_ALL:
			return true;
			case Constants.FI_DIST_2_OVER:
			return this.IsNearPoint("OVER", 2, _point);
			case Constants.FI_DIST_5_OVER:
			return this.IsNearPoint("OVER", 5, _point);
			case Constants.FI_DIST_8_OVER:
			return this.IsNearPoint("OVER", 8, _point);
			return true;
			default:
			return true;
		}
	}
	IsNearPoint(_type, _dist, _point){
		let tmp_dist = this.GetManhattanDistance(this.xz_position, _point);
		if(_type == "UNDER"){
			if(tmp_dist <= _dist){
				return true;
			}
		}
		else if(_type == "OVER"){
			if(tmp_dist >= _dist){
				return true;
			}
		}
		return false;
	}

	GetPointChange(_team, _target_condition){
		if(_team == "Enemy"){
			switch(_target_condition){
				case Constants.T_POINT_0:
				return Constants.T_POINT_1;
				case Constants.T_POINT_1:
				return Constants.T_POINT_0;
				case Constants.T_POINT_2:
				return Constants.T_POINT_3;
				case Constants.T_POINT_3:
				return Constants.T_POINT_2;
				case Constants.T_E_UNIT_UP:
				return Constants.T_E_UNIT_DOWN;
				case Constants.T_E_UNIT_DOWN:
				return Constants.T_E_UNIT_UP;
				case Constants.T_F_UNIT_UP:
				return Constants.T_F_UNIT_DOWN;
				case Constants.T_F_UNIT_DOWN:
				return Constants.T_F_UNIT_UP;
				default:
				return _target_condition;
			}
		}
		return _target_condition;
	}

	TargetFilter(_target_condition, _action, _gameMaster){
		let tmp_units = [];
		let tmp_units_g = _gameMaster.units;		
		switch(_target_condition){
			case Constants.T_E_KING:
			tmp_units = this.GetUnits(this.enemy_team, "KING", tmp_units_g, _action);
			break;
			case Constants.T_E_QUEEN:
			tmp_units = this.GetUnits(this.enemy_team, "QUEEN", tmp_units_g, _action);
			break;
			case Constants.T_E_KNIGHT:
			tmp_units = this.GetUnits(this.enemy_team, "KNIGHT", tmp_units_g, _action);
			break;
			case Constants.T_E_BISHOP:
			tmp_units = this.GetUnits(this.enemy_team, "BISHOP", tmp_units_g, _action);
			break;
			case Constants.T_E_PAWN:
			tmp_units = this.GetUnits(this.enemy_team, "PAWN", tmp_units_g, _action);
			break;
			case Constants.T_E_ROOK:
			tmp_units = this.GetUnits(this.enemy_team, "ROOK", tmp_units_g, _action);
			break;
			case Constants.T_F_KING: // キングの回復を除外
			tmp_units = this.GetUnits(this.team, "KING", tmp_units_g, _action);
			break;
			case Constants.T_F_QUEEN:
			tmp_units = this.GetUnits(this.team, "QUEEN", tmp_units_g, _action);
			break;
			case Constants.T_F_KNIGHT:
			tmp_units = this.GetUnits(this.team, "KNIGHT", tmp_units_g, _action);
			break;
			case Constants.T_F_BISHOP:
			tmp_units = this.GetUnits(this.team, "BISHOP", tmp_units_g, _action);
			break;
			case Constants.T_F_PAWN:
			tmp_units = this.GetUnits(this.team, "PAWN", tmp_units_g, _action);
			break;
			case Constants.T_F_ROOK:
			tmp_units = this.GetUnits(this.team, "ROOK", tmp_units_g, _action);
			break;
			case Constants.T_E_UNIT:
			tmp_units = this.GetUnits(this.enemy_team, "ALL", tmp_units_g, _action);
			break;
			case Constants.T_E_UNIT_UP:
			tmp_units.push(this.GetFilToUnit(this.enemy_team, "上", tmp_units_g, _action));
			break;
			case Constants.T_E_UNIT_CENTER:
			tmp_units.push(this.GetFilToUnit(this.enemy_team, "中", tmp_units_g, _action));
			break;
			case Constants.T_E_UNIT_DOWN:
			tmp_units.push(this.GetFilToUnit(this.enemy_team, "下", tmp_units_g, _action));
			break;
			case Constants.T_F_UNIT: // キングの回復を除外
			tmp_units = this.GetUnits(this.team, "ALL", tmp_units_g, _action);
			break;
			case Constants.T_F_UNIT_UP:
			tmp_units.push(this.GetFilToUnit(this.team, "上", tmp_units_g, _action));
			break;
			case Constants.T_F_UNIT_CENTER:
			tmp_units.push(this.GetFilToUnit(this.team, "中", tmp_units_g, _action));
			break;
			case Constants.T_F_UNIT_DOWN:
			tmp_units.push(this.GetFilToUnit(this.team, "下", tmp_units_g, _action));
			break;
			case Constants.T_MINE:
			tmp_units.push(this.GetFilToUnit(this.team, "MINE", tmp_units_g, _action));
			break;			
			default:
			break;
		}
		return tmp_units;
	}


	SetTarget(_filter1, _filter2, _target_condition, _action, _gameMaster){
		let _target = null;
		let target_filter_units = [];

		_target_condition = this.GetPointChange(this.team, _target_condition);
		// ターゲットから絞る
		// ポイントなら終了
		switch(_target_condition){
			case Constants.T_POINT_0:
			let tmp_point0 = [this.point_positions[0][0], this.point_positions[0][1]];
			if(this.IsNear4Point(_filter1, tmp_point0)
				&& this.IsNear4Point(_filter2, tmp_point0)){
				this.target_position[0] = this.point_positions[0][0];// 赤
				this.target_position[1] = this.point_positions[0][1];
				this.target_unit = null;
				return true;
			}
			break;
			case Constants.T_POINT_3:
			let tmp_point1 = [this.point_positions[1][0], this.point_positions[1][1]];
			if(this.IsNear4Point(_filter1, tmp_point1)
				&& this.IsNear4Point(_filter2, tmp_point1)){
				this.target_position[0] = this.point_positions[1][0];// 緑
				this.target_position[1] = this.point_positions[1][1];
				this.target_unit = null;
				return true;
			}
			break;
			case Constants.T_POINT_2:
			let tmp_point2 = [this.point_positions[2][0], this.point_positions[2][1]];
			if(this.IsNear4Point(_filter1, tmp_point2)
				&& this.IsNear4Point(_filter2, tmp_point2)){
				this.target_position[0] = this.point_positions[2][0];//黄
				this.target_position[1] = this.point_positions[2][1];
				this.target_unit = null;
				return true;
			}
			break;
			case Constants.T_POINT_1:
			let tmp_point3 = [this.point_positions[3][0], this.point_positions[3][1]];
			if(this.IsNear4Point(_filter1, tmp_point3)
				&& this.IsNear4Point(_filter2, tmp_point3)){
				this.target_position[0] = this.point_positions[3][0];//青
				this.target_position[1] = this.point_positions[3][1];
				this.target_unit = null;
				return true;
			}
			break;
			default:
			// ポイント以外ならターゲットを絞る
			target_filter_units = this.TargetFilter(_target_condition, _action, _gameMaster);
			break;
		}

		let filter1_units = this.GetFilUnit(_filter1, target_filter_units, _target_condition, _action, _gameMaster);
		let filter2_units = this.GetFilUnit(_filter2, filter1_units, _target_condition, _action, _gameMaster);
		_target = this.GetNearUnit_Last(filter2_units, this, _action);
		// 絞り込んだ中で最も近いユニット
		this.target_unit = _target;
		if(_target == null){
			this.target_position[0] = -1;
			this.target_position[1] = -1;
			return false;
		}
		else{
			this.target_position[0] = _target.xz_position[0];
			this.target_position[1] = _target.xz_position[1];			
			//if(this.type == "BISHOP"){
			//Debug.Log("("+target_position[0]+","+target_position[1]+")");
			//}
			return true;
		}		
	}

	GetFilToUnit(_team, _type, _units, _action){
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			// 指定のチームでない
			if(this.IsTeamMate(_unit) != _team){
				continue;
			}
			// キングは回復しない
			if(_unit.type == "KING" && _action === Constants.A_HEAL){
				continue; //　キングを回復はしない
			}

			// 味方の上
			if(_type == "上" && _unit._id == 2 && _team == "My"){
				return _unit;
			}
			else if(_type == "上" && _unit._id == 3 && _team == "Enemy"){
				return _unit;
			}
			if(_type == "中" && _unit._id == 1){
				return _unit;
			}
			if(_type == "下" && _unit._id == 3 && _team == "My"){
				return _unit;
			}
			else if(_type == "下" && _unit._id == 2 && _team == "Enemy"){
				return _unit;
			}
			// 自分自身
			if(_type == "MINE" && _unit._id == this._id){
				return this;
			}

			// 指定のタイプで，自分自身は外す。　相手チームならok
			if((_unit.type == _type && _unit._id != this._id)
				|| (_unit.type == _type && _team != this.team)){
				return _unit;
			}
		}
		return null;
	}

	// filterにかければ
	GetFilUnit(_filter, _units, _target_condition, _action, _gameMaster){
		let tmp_units = [];
		switch(_filter){
			case Constants.FI_DIST_1:
			tmp_units = this.GetFilDIstUnit(1, "NEAR", _units, _target_condition);
			break;
			case Constants.FI_DIST_4:
			tmp_units = this.GetFilDIstUnit(4, "NEAR", _units, _target_condition);
			break;			
			case Constants.FI_DIST_7:
			tmp_units = this.GetFilDIstUnit(7, "NEAR", _units, _target_condition);
			break;
			case Constants.FI_DIST_ALL:
			tmp_units = this.GetFilDIstUnit(100, "NEAR", _units, _target_condition);
			break;
			case Constants.FI_DIST_8_OVER:
			tmp_units = this.GetFilDIstUnit(8, "OVER", _units, _target_condition);
			break;
			case Constants.FI_DIST_5_OVER:
			tmp_units = this.GetFilDIstUnit(5, "OVER", _units, _target_condition);
			break;
			case Constants.FI_DIST_2_OVER:
			tmp_units = this.GetFilDIstUnit(2, "OVER", _units, _target_condition);
			break;

			case Constants.FI_HP_0_25:
			tmp_units = this.GetHpFilterUnit(0, 25, _units);
			break;
			case Constants.FI_HP_25_50:
			tmp_units = this.GetHpFilterUnit(25, 50, _units);
			break;
			case Constants.FI_HP_50_75:
			tmp_units = this.GetHpFilterUnit(50, 75, _units);
			break;
			case Constants.FI_HP_75_100:
			tmp_units = this.GetHpFilterUnit(75, 100, _units);
			break;
			case Constants.FI_HP_0_75:
			tmp_units = this.GetHpFilterUnit(0, 75, _units);
			break;
			case Constants.FI_HP_25_100:
			tmp_units = this.GetHpFilterUnit(25, 100, _units);
			break;
			case Constants.FI_STAMINA_4:
			tmp_units = this.GetStaminaFilterUnit(4, _units);
			break;
			case Constants.FI_STAMINA_3:
			tmp_units = this.GetStaminaFilterUnit(3, _units);
			break;
			case Constants.FI_STAMINA_2:
			tmp_units = this.GetStaminaFilterUnit(2, _units);
			break;
			case Constants.FI_STAMINA_1:
			tmp_units = this.GetStaminaFilterUnit(1, _units);
			break;
			case Constants.FI_LOW_HP:
			tmp_units.push(this.GetMinHPUnit(this.team, _units));
			tmp_units.push(this.GetMinHPUnit(this.enemy_team, _units));
			break;
			case Constants.FI_NEAR_DIS: // キングの回復時は選択しない？
			tmp_units.push(this.GetNearUnit(this.team, _units, this, _action));
			tmp_units.push(this.GetNearUnit(this.enemy_team, _units, this, _action));
			break;
			case Constants.FI_NON_CHERGE:
			tmp_units = this.GetNonPowerUp(Constants.FI_NON_CHERGE, _units);
			break;
			case Constants.FI_NON_SPEEDUP:
			tmp_units = this.GetNonPowerUp(Constants.FI_NON_SPEEDUP, _units);
			break;
			case Constants.FI_NON_GUARD:
			tmp_units = this.GetNonPowerUp(Constants.FI_NON_GUARD, _units);
			break;

			case Constants.FI_NOT_KING:
			tmp_units = this.GetNotUnits("KING", _units);
			break;
			case Constants.FI_NOT_QUEEN:
			tmp_units = this.GetNotUnits("QUEEN", _units);
			break;
			case Constants.FI_NOT_KNIGHT:
			tmp_units = this.GetNotUnits("KNIGHT", _units);
			break;
			case Constants.FI_NOT_BISHOP:
			tmp_units = this.GetNotUnits("BISHOP", _units);
			break;
			case Constants.FI_NOT_PAWN:
			tmp_units = this.GetNotUnits("PAWN", _units);
			break;
			case Constants.FI_NOT_ROOK:
			tmp_units = this.GetNotUnits("ROOK", _units);
			break;


			case Constants.FI_DIE_COUNT_0:
			tmp_units = this.GetDieCount(true, 0, _units, _gameMaster);
			break;
			case Constants.FI_DIE_COUNT_NOT_0:
			tmp_units = this.GetDieCount(false, 0, _units, _gameMaster);
			break;
			default:
			tmp_units = _units;
			break;
		}
		return tmp_units;
	}

	GetDieCount(_bool, _count, _units, _gameMaster){
		let tmp_die_count = _gameMaster.Die_Count;
		let tmp_units = [];
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(_unit == null){
				continue;
			}
			let tmp_id = 0;
			if(_unit.team == "My"){
				tmp_id = _unit._id;
			}
			else{
				tmp_id = _unit._id+4;
			}
			if(_bool){
				if(tmp_die_count[tmp_id] == _count){
					tmp_units.push(_unit);
				}				
			}
			else{
				if(tmp_die_count[tmp_id] != _count){
					tmp_units.push(_unit);
				}				
			}
		}
		return tmp_units;
	}	

	// _unitsの中からHp条件にあうunitsをかえす
	GetHpFilterUnit(_min, _max, _units){
		let tmp_units = [];
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(_unit == null){
				continue;
			}
			if(_min*_unit.Max_hp <= 100*_unit.hp && 100*_unit.hp <= _max*_unit.Max_hp){
				tmp_units.push(_unit);
			}
		}
		return tmp_units;
	}

	GetStaminaFilterUnit(_value, _units){
		let tmp_units = [];
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(_unit == null){
				continue;
			}
			if(_unit.stamina == _value){
				tmp_units.push(_unit);
			}
		}
		return tmp_units;
	}

	// 距離感で判断？　歩数で判断？
	IsNearUnit(_dist, _unit){
		if(_unit == null){
			return false;
		}
		let tmp_dist = this.GetManhattanDistance(_unit.xz_position, this.xz_position);
		if(tmp_dist <= _dist){
			return true;
		}
		return false;
	}

	// 距離感で判断？　歩数で判断？
	IsOverUnit(_dist, _unit){
		if(_unit == null){
			return false;
		}
		let tmp_dist = this.GetManhattanDistance(_unit.xz_position, this.xz_position);
		if(tmp_dist >= _dist){
			return true;
		}
		return false;
	}	

	GetFilDIstUnit(_dist, _type, _units, _target_condition){
		let tmp_units = [];
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(_unit == null){
				continue;
			}
			if(_type == "NEAR"){
				if(_dist == 100){
					tmp_units.push(_unit);
				}
				else if(this.IsNearUnit(_dist, _unit)){//自分自身との距離が指定以下か
					tmp_units.push(_unit);
				}
			}
			else if(_type == "OVER"){
				if(this.IsOverUnit(_dist, _unit)){//自分自身との距離が指定以下か
					tmp_units.push(_unit);
				}
			}
		}
		return tmp_units;
	}
	GetNonPowerUp(_const_num, _units){		
		let tmp_units = [];
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(_unit == null){
				continue;
			}
			switch(_const_num){
				case Constants.FI_NON_CHERGE:
				if(_unit.charge == 0){
					tmp_units.push(_unit);
				}
				break;
				case Constants.FI_NON_SPEEDUP:
				if(_unit.speedUP == 0){
					tmp_units.push(_unit);
				}
				break;
				case Constants.FI_NON_GUARD:
				if(_unit.guard == 0){
					tmp_units.push(_unit);
				}
				break;
			}
		}
		return tmp_units;
	}

	// 近いUnit  ただし自分は外す
	GetNearUnit(_team, _units, s_unit, _action){
		let min_dist = 10000;
		let min_target = null;
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(this.IsTeamMate(_unit) != _team){
				continue;
			}
			if(this.IsMine(_unit)){
				continue;
			}
			if(_unit.type == "KING" && _action === Constants.A_HEAL){// && this.team == _team){
				continue; // 自分自身のキングの回復はしない
			}			

			let dist = this.GetManhattanDistance(s_unit.xz_position, _unit.xz_position);
			if(min_dist>dist){
				min_dist = dist;
				min_target = _unit;
			}
		}
		return min_target;
	}

	// 近いUnit  ただし自分は外す
	GetNearUnit_Last(_units, s_unit, _action){
		let min_dist = 10000;
		let min_target = null;
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(_unit == null){
				continue;
			}
			if(_unit.type == "KING" && _action === Constants.A_HEAL){
				continue; // 自分自身のキングの回復はしない
			}			

			let dist = this.GetManhattanDistance(s_unit.xz_position, _unit.xz_position);
			if(min_dist>dist){
				min_dist = dist;
				min_target = _unit;
			}
		}
		return min_target;
	}
	GetMinHPUnit(_team, _units){
		let min_hp = 10000;
		let min_target = null;
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(this.IsTeamMate(_unit) != _team){
				continue;
			}
			if(this.IsMine(_unit)){
				continue;
			}
			let tmp_hp = _unit.hp;
			if(min_hp>tmp_hp){
				min_hp = tmp_hp;
				min_target = _unit;
			}
		}
		return min_target;
	}

	IsTeamMate(_mCube){
		if(_mCube == null){
			return "Empty";
		}
		return _mCube.team;
	}
	/*-------ターゲットの決定終了---------*/


	/*-------移動描画------*/
	// 評価関数

	IsGoodValue(_action, _top_value, _compar_value){
		switch(_action){
			case Constants.A_ATTACK:
			case Constants.A_HEAL:
			case Constants.A_MOVE_TO:
			if(this.target_condition === Constants.T_MINE){
				return -1*this.IsSmallValue(_top_value, _compar_value);
			}
			return this.IsSmallValue(_top_value, _compar_value);
			case Constants.A_MOVE_FROM:
			case Constants.A_RETREAT:
			return -1*this.IsSmallValue(_top_value, _compar_value);
			default:
			return this.IsSmallValue(_top_value, _compar_value);
		}
	}

	// 0=同じ, 1=小さい＝近い， -1=大きい＝遠い
	IsSmallValue(_top_value, _compar_value){
		if(_top_value == _compar_value){//同じならランダム
			return 0; 
		}
		else if(_top_value > _compar_value){
			return 1;
		}
		else{
			return -1;
		}
	}

	SetTopValue(_action){
		switch(_action){
			case Constants.A_WAIT:
			case Constants.A_ATTACK:
			case Constants.A_HEAL:
			case Constants.A_MOVE_TO:
			if(this.target_condition === Constants.T_MINE){
				return -1000;
			}
			return 1000000;
			case Constants.A_MOVE_FROM:
			case Constants.A_RETREAT:
			return -1000;
			default:
			return 1000000;
		}
	}

	/*
	target_positionを決定する。
	ターゲットの４方で空いている場所でもっとも近い場所を取得。
	なければターゲット自身を選ぶ
	*/

	GetEvaluationDist(_action, _i, _j, _target_position, _units){
		let tmp_dist_target = this.distancePoint([_i,_j], _target_position);
		let tmp_dist_me = this.distancePoint(this.xz_position, [_i,_j]);
		if(_target_position[0] == -1){
			tmp_dist_target = 0;
		}

		if(_action === Constants.A_HEAL && this.target_condition === Constants.T_MINE){
			return this.GetAllEnemyUnitDistance([_i,_j], _units); //全ての敵からの距離			
		}

		switch(_action){
			case Constants.A_ATTACK:
			case Constants.A_HEAL:
			case Constants.A_MOVE_FROM:
			case Constants.A_MOVE_TO:
			return tmp_dist_target*6+tmp_dist_me;
			case Constants.A_RETREAT:
			return this.GetAllEnemyUnitDistance([_i,_j], _units); //全ての敵からの距離
			case Constants.A_S_LONG_ATTACK:
			let gmd = this.GetManhattanDistance([_i,_j], _target_position);
			tmp_dist_target = 2*gmd*gmd - tmp_dist_target;
			return tmp_dist_target*6+tmp_dist_me;
			default:
			return tmp_dist_target*6+tmp_dist_me;
		}
	}

	GetLocomotion(_action){
		if(this.stamina <= 1){
			return 1;
		}
		return this.locomotion;
	}

	GetAllEnemyUnitDistance(_start, _units){
		let sum_dist = 0;
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			if(this.IsTeamMate(_unit) == this.enemy_team){
				sum_dist += this.GetManhattanDistance(_start, _unit.xz_position);
			}
		}
		return sum_dist;
	}

	distancePoint(_next, _target){
		switch(this.target_condition){
			case Constants.T_POINT_0:
			case Constants.T_POINT_1:
			case Constants.T_POINT_2:
			case Constants.T_POINT_3:
			if(this.IsNearWall(this.xz_position[0], this.xz_position[1])){
				return (_target[0] - _next[0])*(_target[0] - _next[0]) + (_target[1] - _next[1])*(_target[1] - _next[1]);
			}
			return (_target[0] - _next[0])*(_target[0] - _next[0]) + (Constants.MAP_SIZE_X)*(Constants.MAP_SIZE_X)*(_target[1] - _next[1])*(_target[1] - _next[1]);
			default:
			return (_target[0] - _next[0])*(_target[0] - _next[0]) + (_target[1] - _next[1])*(_target[1] - _next[1]);
		}
	}

	IsNearWall(x, z){
		if(x==1 || x===Constants.MAP_SIZE_X || z==1 || z === Constants.MAP_SIZE_Z){
			return true;
		}
		return false;
	}


	IsWall(x, z){
		if(x==0 || x==Constants.MAP_SIZE_X+1 || z==0 || z == Constants.MAP_SIZE_Z+1){
			return true;
		}
		if((x==1 && z==1) || (x===Constants.MAP_SIZE_X && z === Constants.MAP_SIZE_Z)
			|| (x==1 && z === Constants.MAP_SIZE_Z) || (x===Constants.MAP_SIZE_X && z == 1)){
			return true;
		}
		if(x == 3 && z == (Constants.MAP_SIZE_Z+1)/2
			|| x == 5 && z == (Constants.MAP_SIZE_Z+1)/2
			|| x == 5 && z == (Constants.MAP_SIZE_Z+1)/2 -2
			|| x == 5 && z == (Constants.MAP_SIZE_Z+1)/2 +2
			|| x == Constants.MAP_SIZE_X+1 -3 && z == (Constants.MAP_SIZE_Z+1)/2
			|| x == Constants.MAP_SIZE_X+1 -5 && z == (Constants.MAP_SIZE_Z+1)/2
			|| x == Constants.MAP_SIZE_X+1 -5 && z == (Constants.MAP_SIZE_Z+1)/2 - 2
			|| x == Constants.MAP_SIZE_X+1 -5 && z == (Constants.MAP_SIZE_Z+1)/2 + 2){
			return true;
		}
		return false;
	}
	ViewArea(_mcBoard, _units){
		/*----- 移動場所の決定 ------*/
		let top_value = this.SetTopValue(this.action); // アクションに応じて　近くのか離れるのかを決める 近くなら初期距離 10000　離れるなら初期距離 -1000
		let next_position = [this.xz_position[0], this.xz_position[1]];
		let marea = _mcBoard.GetMoveArea(this.xz_position[0], this.xz_position[1], this.GetLocomotion(this.action), this.team);
		// 自分自身をチャージするなら動かない
		if(this.action === Constants.A_CHARGE && this.target_unit._id == this._id && this.target_unit.team == this.team){
		}
		else{
			let tmp_target = [this.target_position[0], this.target_position[1]];
			// console.log("old:"+this.xz_position);
			// console.log("target:"+tmp_target);
			// 対象が1ます以内なら四方をターゲットにしない
			if(this.distancePoint(this.xz_position, this.target_position)<=1){
			}
			else{
				// 4方向で行ける場所
				let arround_point = [
					[0,-1],
					[0,1],
					[1,0],
					[-1,0]
				];
				if(this.team == "Enemy"){
					arround_point = [
										[0,1],
										[0,-1],
										[-1,0],
										[1,0]
									];
				}
				switch(this.target_condition){
					case Constants.T_POINT_0:
					case Constants.T_POINT_1:
					case Constants.T_POINT_2:
					case Constants.T_POINT_3:
					if(this.team == "My"){
						arround_point = [
							[1,0],
							[-1,0],
							[0,-1],
							[0,1]
						];
					}
					else if(this.team == "Enemy"){
						arround_point = [
							[-1,0],
							[1,0],
							[0,1],
							[0,-1]
						];
					}
					break;
					default:
					break;
				}				

				let min_dist_arround = 10000;
				for(let i=0; i<arround_point.length; i++){
					let tmp_x_dist = this.target_position[0]+ arround_point[i][0];
					let tmp_z_dist = this.target_position[1]+ arround_point[i][1];
					if(this.IsWall(tmp_x_dist, tmp_z_dist)){
						continue;//壁
					}
					if(this.IsTeamMate(_mcBoard.GetMapBoardUnit(tmp_x_dist, tmp_z_dist)) != "Empty"){
						continue;//ユニットで埋まっている
					}
					// 相手いてい，もっとも近い場所に移動
					let tmp_dist_arround = this.GetManhattanDistance(this.xz_position, [tmp_x_dist, tmp_z_dist]);
					if(min_dist_arround>tmp_dist_arround){
						min_dist_arround = tmp_dist_arround;
						tmp_target = [tmp_x_dist, tmp_z_dist];
					}
				}				
			}
			// 対象が1マス以内ならその場で。　ただし，離れる処理はする
			if(this.distancePoint(this.xz_position, this.target_position)<=1  && this.action != Constants.A_MOVE_FROM && this.action != Constants.A_LONG_ATTACK && this.action != Constants.A_S_LONG_ATTACK){
			}
			else{
				for(let i_x=0; i_x<marea.length; i_x++){
					for(let j_y=0; j_y<marea[0].length; j_y++){
						let i = i_x;
						let j = j_y;
						if(this.team == "My"){
						}
						else{
							i = marea.length - i_x -1;
							j = marea[0].length - j_y -1;
						}
						if(marea[i][j] >= 0){
							// 仲間なら飛ばす 自分なら飛ばさない
							if(this.IsTeamMate(_mcBoard.GetMapBoardUnit(i,j)) == this.team && !(this.xz_position[0] == i && this.xz_position[1] == j)){
							// if(IsTeamMate(_mcBoard.GetMapBoardUnit(i,j)) == this.team){
								continue;
							}

							if(this.action === Constants.A_S_LONG_ATTACK && this.target_unit != null){
								// 遠距離攻撃なら離れる
								if(this.GetManhattanDistance(this.target_unit.xz_position, [i,j]) < 5){
									continue;
								}
							}
							else if(this.action === Constants.A_LONG_ATTACK && this.target_unit != null){
								// 遠距離攻撃なら離れる
								if(this.GetManhattanDistance(this.target_unit.xz_position, [i,j]) < 3){
									continue;
								}
							}

							// 評価関数
							let tmp_dist = this.GetEvaluationDist(this.action, i,j, tmp_target, _units);
							// 目的に地に対して 他の場所が今の場所より遠いなら今の場所がいい。

							if(this.IsGoodValue(this.action, top_value, tmp_dist) == 0){
								top_value = tmp_dist;
								next_position = [i,j];
							}
							else if(this.IsGoodValue(this.action, top_value, tmp_dist) == 1){
								top_value = tmp_dist;
								next_position = [i,j];
							}
						}
					}
				}
			}
		}
		_mcBoard.SetMapBoard(this.xz_position[0],this.xz_position[1], null); 			// 今の場所をボードから消す
		// console.log("next_position:"+next_position);
		/*----- 移動場所の決定終了 ------*/
		let path = this.GetPath(marea, next_position[0], next_position[1]);
		if(path.length > 0){
			let sum_time = 0.1;
			let play_time = 0.3;

			for(let i=0; i<path.length; i++){
				if(i==0){
					this.GetRoot(path[i]);
				}
				else{
					this.GetRoot(path[i]);
				}
				play_time += 0.2;
			}
			/*--- 移動場所までのパス取得終了 -----*/

			/*--- 移動アニメーション -----*/
		}
		_mcBoard.SetMapBoard(this.xz_position[0], this.xz_position[1], this);

	}

	// パスの取得 & 移動の更新
	GetRoot(_direction){
		switch(_direction){
			case "上":
			this.xz_position[1]++;
			return;// Vector3.forward*Constants.BLOCK_SIZE;
			case "右":
			this.xz_position[0]++;
			return;// Vector3.right*Constants.BLOCK_SIZE;
			case "下":
			this.xz_position[1]--;
			return;// Vector3.back*Constants.BLOCK_SIZE;
			case "左":
			this.xz_position[0]--;
			return;// Vector3.left*Constants.BLOCK_SIZE;
			default:
			return;// Vector3.zero;
		}
	}	

	GetPath(_marea, _target_x, _target_z){
		let tmp_path_text = [];
		let count = 0;
		let max = _marea[_target_x][_target_z];

		while(max < this.GetLocomotion(this.action)){
			count ++ ;
			if(count >2000){
				break;
			}
			let arround = [[1,0], [-1,0], [0,1], [0,-1]];
			let arround_text = ["左","右","下","上"];
			for(let i=0; i<arround.length; i++){
				let tmp_x = _target_x + arround[i][0];
				let tmp_z = _target_z + arround[i][1];

				let value = _marea[tmp_x][tmp_z];
				if(value > max){
					max = value;
					tmp_path_text.push(arround_text[i]);
					_target_x = tmp_x;
					_target_z = tmp_z;
				}
			}
		}
		tmp_path_text.reverse();
		// console.log("path:"+tmp_path_text);
		return tmp_path_text;
	}

	GetManhattanDistance(_start, _end){
		return Math.abs(_start[0] - _end[0]) + Math.abs(_start[1] - _end[1]);
	}


	/*-------バトルフェイズ　計算-----*/
	Battle(_mcBoard){
		switch(this.action){
			case Constants.A_ATTACK:
			this.Attack(_mcBoard, "Attack");
			break;
			case Constants.A_LONG_ATTACK:
			if(this.type == "KING" || this.type == "BISHOP"){
				this.Attack(_mcBoard, "Long_Attack");
			}
			break;
			case Constants.A_HEAL:
			if(this.type == "QUEEN"){
				this.Heal(_mcBoard);
			}
			break;
			case Constants.A_CHARGE:
			if(this.type == "KNIGHT"){
				this.Charge(_mcBoard);
			}
			break;
			//case Constants.A_SPEEDUP:
			case Constants.A_GUARD:
			if(this.type == "PAWN"){
				this.Guard(_mcBoard);
			}
			break;
			case Constants.A_S_LONG_ATTACK:
			if(this.type == "ROOK"){
				this.Attack(_mcBoard, "S_Long_Attack");
			}
			break;
			case Constants.A_WAIT:
			case Constants.A_MOVE_TO:
			case Constants.A_MOVE_FROM:
			case Constants.A_RETREAT:
			break;
		}
	}


	Attack(_mcBoard, _type){
		if(this.target_unit == null ){ // ターゲットがいないなら近くの敵を攻撃
			return;
		}
		else{
			if(!this.IsSkill(_type, _mcBoard)){ // ターゲットはいるけど攻撃が成功しないなら　近くの敵を攻撃
				return;
			}			
			// ダメージ計算をして終了
			let tmp_attack = this.attack;
			if(_type == "Long_Attack"){
				tmp_attack -= 10;
				this.IsLongAttack = true;
			}
			else if(_type == "S_Long_Attack"){
				tmp_attack -= 12;
				this.IsS_LongAttack = true;
			}
			else{
				this.IsAttack = true;
			}
			if(this.charge > 0){
				tmp_attack = 2*tmp_attack; // 攻撃力2倍
				this.charge--;							// 一回使用
			}

			if(this.type == "KNIGHT"){
				this.attack = this.attack+2;
			}
			else if(this.type == "BISHOP"){
				this.attack = Math.floor(this.attack*1.1)// (int)(this.attack*1.1f); // TODO キャスト
				// this.attack = Math.raou(this.attack*1.1)// (int)(this.attack*1.1f); // TODO キャスト
			}
			else if(this.type == "QUEEN"){
				this.target_unit.StaminaDown();
			}
			else if(this.type == "PAWN"){
				this.target_unit.waitTime_max = this.target_unit.waitTime_max + 30;
				//target_unit.waitTime_max = target_unit.waitTime_max + 15;
			}
			else if(this.type == "ROOK"){
				this.defense += 7;
				if(this.defense > 100){
					this.defense = 100;
				}
			}

			if(this.stamina < 2){
				tmp_attack = tmp_attack/2;
			}
			this.target_unit.OnDamage(tmp_attack);
		}
	}

	// 呼ばれるたびにHpが減る(防御力が優っていれば１) 
	OnDamage(_atk){
		this.IsDamage = true;
		let _damage = _atk;
		let damage_off = this.defense;
		if(this.guard > 0){
			damage_off += 50;
			this.guard--;
		}
		_damage = Math.floor((_damage*(100-damage_off))/100);
		if(_damage<0){
			_damage = 0;
		}
		this.sum_damage -= _damage;		
		this.hp -= _damage;
	}
	Heal(_mcBoard){
		if(this.target_unit == null){
			return;
		}
		if(!this.IsSkill("Heal", _mcBoard)){
			return;
		}
		// ターゲットを回復
		let tmp_heal = 50;
		if(this.stamina < 2){
			tmp_heal = tmp_heal/2;
		}		
		this.target_unit.OnRecovery(tmp_heal);
		// 自分自身の回復
		if(this.target_unit._id == this._id && this.target_unit.team == this.team){
			this.IsHeal = true;
		}
		else{
			this.IsHeal = true;
		}
	}
	OnRecovery(_heal){
		this.sum_damage += _heal;
		this.hp += _heal;
		if(this.Max_hp<this.hp){
			this.hp = this.Max_hp;
		}
		this.IsRecovery = true;
	}
	StaminaDown(){
		if(this.type == "KING"){
			return;
		}
		this.stamina--;
		if(this.stamina <= 0){
			this.stamina = 0;
		}
	}
	StaminaUp(){
		if(this.action === Constants.A_RETREAT){
			this.stamina += 2;
		}
		else if(this.action === Constants.A_WAIT){
			this.stamina += 2;
		}
		else{
			this.stamina += 1;
		}
		if(this.stamina > this.Max_stamina){
			this.stamina = this.Max_stamina;
		}
	}

	Charge(_mcBoard){
		if(this.target_unit == null){
			return;// ターゲットがいないなら何もしない
		}
		if(!this.IsSkill("Charge", _mcBoard)){
			return;// チャージが届かないなら何もしない
		}

		// スタミナがなければ
		if(this.stamina < 2){
			// 特になし
		}
		// ターゲットのチャージを + 1する
		this.target_unit.OnCharge();
		// 自分自身のチャージ
		this.IsCharge = true;//target_unit.type == this.type && target_unit.team == this.team
	}

	SpeedUP(_mcBoard){
		if(this.target_unit == null){
			return;// ターゲットがいないなら何もしない
		}
		if(!this.IsSkill("SpeedUP", _mcBoard)){
			return;// チャージが届かないなら何もしない
		}
		// スタミナがなければ
		if(this.stamina < 2){
			// 特になし
		}
		// ターゲットのチャージを + 1する
		this.target_unit.OnSpeedUP();
		// 自分自身のチャージ
		this.IsSpeedUP = true;//target_unit.type == this.type && target_unit.team == this.team
	}	
	Guard(_mcBoard){
		if(this.target_unit == null){
			return;// ターゲットがいないなら何もしない
		}
		if(!this.IsSkill("Guard", _mcBoard)){
			return;// チャージが届かないなら何もしない
		}

		// ターゲットのチャージを + 1する
		this.target_unit.OnGuard();
		// 自分自身のチャージ
		this.IsGuard = true;
	}

	OnCharge(){
		this.charge++;
		this.IsCharged = true;		
	}
	OnSpeedUP(){
		this.speedUP++;
		this.IsSpeedUPed = true;		
	}
	OnGuard(){
		this.guard++;
		this.IsGuarded = true;		
	}
	GetTargetUnit(_units, _type){
		let tmp_taeget_unit = null;
		// 評価 Evaluation
		let max_value = -1;
		let _unit;
		for(let i=0; i<_units.length; i++){
			_unit = _units[i];
			let value = this.GetEvaluation(_unit);
			if(max_value < value){
				max_value = value;
				tmp_taeget_unit = _unit;
			}
		}
		return tmp_taeget_unit;
	}

	// 評価関数
	GetEvaluation(_mCube){
		let value = 0;
		// ダメージがもっとも多い敵 得意
		return value;
	}

	// スキルが使えるかどうか
	IsSkill(_type, _mcBoard){
		if(_type == "Attack"){
			for(let i=0; i<this.attackRange.length; i++){
				// 攻撃範囲に敵がいるか調べる
				let tmp_x = this.xz_position[0]+this.attackRange[i][0];
				let tmp_z = this.xz_position[1]+this.attackRange[i][1];
				if(this.target_unit.xz_position[0] == tmp_x && this.target_unit.xz_position[1] == tmp_z){
					return true;
				}
			}
		}
		else if(_type == "Long_Attack"){
			for(let i=0; i<this.attackRange_LONG.length; i++){
				// 攻撃範囲に敵がいるか調べる
				let tmp_x = this.xz_position[0]+this.attackRange_LONG[i][0];
				let tmp_z = this.xz_position[1]+this.attackRange_LONG[i][1];
				if(this.target_unit.xz_position[0] == tmp_x && this.target_unit.xz_position[1] == tmp_z){
					return true;
				}
			}
		}
		else if(_type == "S_Long_Attack"){
			for(let i=0; i<this.attackRange_S_LONG.length; i++){
				// 攻撃範囲に敵がいるか調べる
				let tmp_x = this.xz_position[0]+this.attackRange_S_LONG[i][0];
				let tmp_z = this.xz_position[1]+this.attackRange_S_LONG[i][1];
				if(this.target_unit.xz_position[0] == tmp_x && this.target_unit.xz_position[1] == tmp_z){
					return true;
				}
			}
		}
		else if(_type == "Heal"){
			for(let i=0; i<this.healRange.length; i++){
				// 攻撃範囲に敵がいるか調べる
				let tmp_x = this.xz_position[0]+this.healRange[i][0];
				let tmp_z = this.xz_position[1]+this.healRange[i][1];
				if(this.target_unit.xz_position[0] == tmp_x && this.target_unit.xz_position[1] == tmp_z){
					return true;
				}
			}
		}
		else if(_type == "Charge" || _type == "SpeedUP" || _type == "Guard"){
			for(let i=0; i<this.supportRange.length; i++){
				// 攻撃範囲に敵がいるか調べる
				let tmp_x = this.xz_position[0]+this.supportRange[i][0];
				let tmp_z = this.xz_position[1]+this.supportRange[i][1];
				if(this.target_unit.xz_position[0] == tmp_x && this.target_unit.xz_position[1] == tmp_z){
					return true;
				}
			}
		}
		return false;
	}
	/*-------バトルフェイズ終了----------*/

	/*-------------
	* エンドフェイズ*
	--------------*/
	DownWaitTime(_moved_waitTime){
		if(this.stamina <= 1){
			_moved_waitTime = Math.floor(_moved_waitTime/2);
		}
		this.waitTime -= _moved_waitTime;
	}
	ResetWaitTime(){
		if(this.speedUP > 0){
			this.speedUP--;
			this.waitTime = Math.floor(this.waitTime_max/2);
			return;
		}
		this.waitTime = this.waitTime_max;
	}
}


