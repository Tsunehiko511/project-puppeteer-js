const Constants = require('./config');

module.exports = class MapBoard {
	constructor() {
		this.map_Board; // マップ構成
		this.map_Board_Unit;  // ユニット構成
		this.beginning_map_Board();
	}
	beginning_map_Board(){
		this.map_Board = new Array(Constants.MAP_SIZE_X+2);
		for(let i=0; i<Constants.MAP_SIZE_X+2; i++){
			this.map_Board[i] = new Array(Constants.MAP_SIZE_Z+2);
		}
		this.map_Board_Unit = new Array(Constants.MAP_SIZE_X+2);
		for(let i=0; i<Constants.MAP_SIZE_X+2; i++){
			this.map_Board_Unit[i] = new Array(Constants.MAP_SIZE_Z+2);
		}


		for(let x=0; x<Constants.MAP_SIZE_X+2; x++){
			for(let z=0; z<Constants.MAP_SIZE_Z+2; z++){
				// 外壁
				if(x===0 || x === (Constants.MAP_SIZE_X+1) || z===0 || z === Constants.MAP_SIZE_Z+1){
					// console.log([x,z]);
					this.map_Board[x][z] = -100;
					this.map_Board_Unit[x][z] = null;
					continue;
				}
				// ユニット排出場所
				if((x==1 && z==1) || (x===Constants.MAP_SIZE_X && z === Constants.MAP_SIZE_Z)
					|| (x==1 && z === Constants.MAP_SIZE_Z) || (x===Constants.MAP_SIZE_X && z == 1)){
					this.map_Board[x][z] = -50;
					this.map_Board_Unit[x][z] = null;	
					continue;
				}
				if(x == 3 && z == (Constants.MAP_SIZE_Z+1)/2
					|| x == 5 && z == (Constants.MAP_SIZE_Z+1)/2
					|| x == 5 && z == (Constants.MAP_SIZE_Z+1)/2 -2
					|| x == 5 && z == (Constants.MAP_SIZE_Z+1)/2 +2
					|| x == Constants.MAP_SIZE_X+1 -3 && z == (Constants.MAP_SIZE_Z+1)/2
					|| x == Constants.MAP_SIZE_X+1 -5 && z == (Constants.MAP_SIZE_Z+1)/2
					|| x == Constants.MAP_SIZE_X+1 -5 && z == (Constants.MAP_SIZE_Z+1)/2 - 2
					|| x == Constants.MAP_SIZE_X+1 -5 && z == (Constants.MAP_SIZE_Z+1)/2 + 2){
					this.map_Board[x][z] = -50;
					this.map_Board_Unit[x][z] = null;	
					continue;				
				}
				// それ以外
				this.map_Board[x][z] = -1;
				this.map_Board_Unit[x][z] = null;
			}			
		}
	}

	GetMapBoard(_x, _z){
		return this.map_Board[_x][_z];
	}
	SetMapBoard(_x, _z, _mCube){
		this.map_Board_Unit[_x][_z] = _mCube;
	}
	GetMapBoardUnit(_x, _z){
		if(_x < 0 || Constants.MAP_SIZE_X +1 < _x || _z < 0 || Constants.MAP_SIZE_Z +1 < _z){
			return null;
		}
		return this.map_Board_Unit[_x][_z];
	}
	SetClone2Array(_clone_array, _array){
		for(let i=0; i<_array.length; i++){
			for(let j=0; j<_array[0].length; j++){
				_clone_array[i][j] = _array[i][j];
			}
		}
	}
	GetMoveArea(_x, _y, _locomotion, _team){
		let map_Board_Clone = new Array(Constants.MAP_SIZE_X+2);
		for(let i=0; i<Constants.MAP_SIZE_X+2; i++){
			map_Board_Clone[i] = new Array(Constants.MAP_SIZE_Z+2);
		}
		this.SetClone2Array(map_Board_Clone, this.map_Board);
		// 初期を設定
		map_Board_Clone[_x][_y] = _locomotion;
		// 上下左右を調べる。
		if(_team == "My"){
			this.Search4(map_Board_Clone, _x, _y, _locomotion, _team, "right");
			this.Search4(map_Board_Clone, _x, _y, _locomotion, _team, "left");
			this.Search4(map_Board_Clone, _x, _y, _locomotion, _team, "up");
			this.Search4(map_Board_Clone, _x, _y, _locomotion, _team, "down");
		}
		else{
			this.Search4(map_Board_Clone, _x, _y, _locomotion, _team, "left");
			this.Search4(map_Board_Clone, _x, _y, _locomotion, _team, "right");
			this.Search4(map_Board_Clone, _x, _y, _locomotion, _team, "down");
			this.Search4(map_Board_Clone, _x, _y, _locomotion, _team, "up");
		}
		return map_Board_Clone;
	}

	// Search4(ref int[,] _clone_map, int _x, int _z, int _locomotion, string _team, string _text){
	Search4(_clone_map, _x, _z, _locomotion, _team, _text){
		let tmp_x = _x;
		let tmp_z = _z;
		switch(_text){
			case "up":
			tmp_z++;
			break;
			case "right":
			tmp_x ++;
			break;
			case "down":
			tmp_z--;
			break;
			case "left":
			tmp_x --;
			break;
			default:
			// Debug.Log("Search4エラー");
			break;
		}
		this.Search(_clone_map, tmp_x, tmp_z, _locomotion, _team, _text);
	}
	// Search(ref int[,] _clone_map, int _x, int _z,  int _locomotion, string _team, string _text){
	Search(_clone_map, _x, _z, _locomotion, _team, _text){
		// 壁にぶつかるなら終了
		if(_clone_map[_x][_z] == -100){
			return;
		}

		let tmp_loc = _locomotion;

		// 自分の敵なら-10
		if(this.map_Board_Unit[_x][_z] == null){
			tmp_loc += this.map_Board[_x][_z]; // 地形の影響を与える
		}
		else if(this.map_Board_Unit[_x][_z].enemy_team == _team){
			tmp_loc -= 10;
		}
		else if(this.map_Board_Unit[_x][_z].team == _team){
			tmp_loc += this.map_Board[_x][_z];
		}
		// 登録したやつより大きければ登録し直す。
		if(tmp_loc > _clone_map[_x][_z]){
			_clone_map[_x][_z] = tmp_loc;
		}
		if(tmp_loc <= 0){
			return;
		}
		if(_text != "left"){
			this.Search4(_clone_map, _x, _z, tmp_loc, _team, "right");
		}
		if(_text != "right"){
			this.Search4(_clone_map, _x, _z, tmp_loc, _team, "left");
		}
		if(_text != "down"){
			this.Search4(_clone_map, _x, _z, tmp_loc, _team, "up");
		}
		if(_text != "up"){
			this.Search4(_clone_map, _x, _z, tmp_loc, _team, "down");
		}
	}
}
