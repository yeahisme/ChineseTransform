/*
	author:zhangdonghua
	qq:1141372981
*/
//用法 
//var chineseTransform = new ChineseTransform()
//var res = chineseTransform.transformIntoChineseNum(4294967295)
//console.log(res) 四十二亿九千四百九十六万七千二百九十五

//var res = chineseTransform.transformIntoNumber("四十二亿九千四百九十六万七千二百九十五")
//console.log(res) 4294967295

function ChineseTransform(){
	var numstring =""
	var CHN_CHAR_LENGTH  =1
	var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
	var chnUnitSection = [ "", "万", "亿", "万亿" ];
	var chnUnitChar = ["", "十", "百", "千"];
	var chnValuePair = [[ "十", 10, false ], [ "百", 100, false ], [ "千", 1000, false ], [ "万", 10000, true ], [ "亿", 100000000, true ],[ "万亿", 1000000000000, true ]]
	
	function ChineseToValue(string){
		return chnNumChar.indexOf(string)
	}
	function ChineseToUnit(string){
		var i = 0
		for(i;i<chnValuePair.length;i++){
			if(chnValuePair[i].indexOf(string)>-1){
				return chnValuePair[i];
			}
			
		}
		return -1;
	}
	this.transformIntoNumber = function(chnString){
		var rtn = 0
		var section = 0
		var pos = 0;
		var num = 0;
		var number = 0
		while(pos < chnString.length){
			num = ChineseToValue(chnString.substr(pos, CHN_CHAR_LENGTH));
			
			if(num >= 0){
				number = num;
				pos+= CHN_CHAR_LENGTH;
				if(pos >= chnString.length){
					section += number;
					rtn += section;
					break;
				}
			}else{
				var unit = ChineseToUnit(chnString.substr(pos, CHN_CHAR_LENGTH))
				if(unit == -1) return "";
				if(chnString.substr(pos, 2*CHN_CHAR_LENGTH)=="万亿"){
					unit = ChineseToUnit(chnString.substr(pos, 2*CHN_CHAR_LENGTH))
					pos += 2*CHN_CHAR_LENGTH;
				}else{
					pos +=CHN_CHAR_LENGTH;
				}
				if(unit[2]){
					section = (section + number) * unit[1];
					rtn += section;
					
					section = 0;
				}else{
					section += (number * unit[1]);
				}
				number = 0;
            	
				if(pos >= chnString.length){
					rtn += section;
					break;
           		}
			}
		}
		return rtn;
	}
	function sectionTransInto(section){
		var zero = true;
		var str;
		var unitPos = 0;
		
		while(section>0){
			var v = section % 10
			if(v == 0){
				if(!zero){
					zero = true
					numstring = chnNumChar[0]+numstring
				}
			}else{
				zero = false;
				numstring = (chnUnitChar[unitPos])+numstring
				numstring = (chnNumChar[v])+numstring
			}
			section = Math.floor(section/10)
			unitPos++
		}
	}
	this.transformIntoChineseNum = function(num){
		numstring =""
		var needZero = false;
		var unitPos = 0;
		
		if(isNaN(parseInt(num)) || num<0) return "";
		if(num == 0){
			return "零";
		}
		while(num>0){
			var section = num % 10000
			if(needZero){
				numstring = chnNumChar[0]+numstring
			}
			section != 0?(numstring = chnUnitSection[unitPos]+numstring):(numstring = chnUnitSection[0]+numstring)
			sectionTransInto(section)
			
			needZero = (section < 1000) && (section > 0);
			num = Math.floor(num/10000)
			unitPos++
		}
		return numstring;
	}
}
