var ClientUtilities = {
	EMPTY_STRING : "", 
		
	DAILY_BAR_UNIT_COUNT : 40,
	
	ONE_SECOND : 1000,

	TWO_SECONDS : 1000 * 2,

	FIVE_SECONDS : 1000 * 5,

	TEN_SECONDS : 1000 * 10,

	ONE_MINUTE : 1000 * 60,

	FIVE_MINUTES : 1000 * 60 * 5,

	TEN_MINUTES : 1000 * 60 * 10,
	
	ONE_HOUR : 1000 * 60 * 60,
	
	FIVE_HOUR : 1000 * 60 * 60 * 5,
	
	ONE_DAY : 1000 * 60 * 60 * 24, // // ARIES-5081 썸머타임 문제해결시 체크해야함
	
	PI2 : Math.PI * 2,
	
	HALF_PI : Math.PI /2 ,
	
	MINUS_HALF_PI :  -(Math.PI /2) ,
	
	getMaxValue : function(maxValue) {
		if(maxValue === 0) {
			return 0;
		}
		
		var exponent; // exponent of range
		var fraction; // fractional part of range
		var niceFraction; // rounded fraction
		var tempMaxValue = maxValue * (100/98.5); //차트의 value는 축 maxValue의 98.5% 넘지 않는다. highChart 참고  

		var log10Range = Math.log(tempMaxValue) / Math.log(10);

		exponent = Math.floor(log10Range);
		fraction = tempMaxValue / Math.pow(10, exponent);

		niceFraction = Math.ceil(fraction);

		var returnValue = niceFraction * Math.pow(10, exponent);

		return parseInt(returnValue * 100) / 100;
	},
	
	getTimeLineUnitValue : function(maxValue) {
		var exponent; // exponent of range
		var fraction; // fractional part of range
		var niceFraction; // rounded fraction
		
		var unitValue = maxValue / 20;
		var log10Range = Math.log(unitValue) / Math.log(10);

		exponent = Math.floor(log10Range);
		
		fraction = unitValue / Math.pow(10, exponent);
		var niceFraction = Math.ceil(fraction*10)/10;

		var niceUnitValue = Math.pow(10, exponent) * niceFraction;
//		$.log("maxValue !! " + maxValue);
//		$.log("unitValue !! " + unitValue);
		
		//return parseInt(niceUnitValue);
		return niceUnitValue |0;
	},
	
	getProperValue : function(value, height){
		for(var i=-5; i<8; i++){
			var pow = Math.pow(10, i) ; 
			if(pow < value && value <= Math.pow(10, i+1)){
				//var fixValue = parseInt(value / Math.pow(10, i)) * Math.pow(10, i);
				var fixValue = ((value / pow) | 0) * pow;
				
				return fixValue;
			}
		}
		
		return 0;
	},
	
	getSplitUnit : function(maxValue, height) {
		let exponent = Math.ceil(Math.log(maxValue) / Math.log(10));

		//기대치는 최소 60px 당 1개 표시. 60px 이하의 간격으로도 구성될수 있다.
	    let expectCountOfLine = Math.floor(height / 60);
		if (expectCountOfLine < 1)
			expectCountOfLine = 1;

		let unitValue = Math.pow(10, exponent);
		let countOfLine = maxValue / unitValue;

		while(expectCountOfLine >= countOfLine) {
			if(unitValue < Math.pow(10, exponent)) exponent -= 1;
			unitValue = (unitValue === 5 * Math.pow(10, exponent))? unitValue * 0.4 : unitValue * 0.5;
			countOfLine = maxValue / unitValue;
		}

		return unitValue;
	},
	
	getTimeUnit : function(scale) {
		var result = scale;
		if (scale <= this.ONE_SECOND) {
			result = this.ONE_SECOND;
		} else if (scale <= this.ONE_SECOND * 2) {
			result = this.ONE_SECOND * 2;
		} else if (scale <= this.ONE_SECOND * 5) {
			result = this.ONE_SECOND * 5;
		} else if (scale <= this.ONE_SECOND * 10) {
			result = this.ONE_SECOND * 10;
		} else if (scale <= this.ONE_SECOND * 15) {
			result = this.ONE_SECOND * 15;
		} else if (scale <= this.ONE_SECOND * 30) {
			result = this.ONE_SECOND * 30;
		} else if (scale <= this.ONE_MINUTE) {
			result = this.ONE_MINUTE;
		} else if (scale <= this.ONE_MINUTE * 2) {
			result = this.ONE_MINUTE * 2;
		} else if (scale <= this.ONE_MINUTE * 5) {
			result = this.ONE_MINUTE * 5;
		} else if (scale <= this.ONE_MINUTE * 10) {
			result = this.ONE_MINUTE * 10;
		} else if (scale <= this.ONE_MINUTE * 15) {
			result = this.ONE_MINUTE * 15;
		} else if (scale <= this.ONE_MINUTE * 30) {
			result = this.ONE_MINUTE * 30;
		} else if (scale <= this.ONE_HOUR) {
			result = this.ONE_HOUR;
		} else if (scale <= this.ONE_HOUR * 2) {
			result = this.ONE_HOUR * 2;
		} else if (scale <= this.ONE_HOUR * 3) {
			result = this.ONE_HOUR * 3;
		} else if (scale <= this.ONE_HOUR * 4) {
			result = this.ONE_HOUR * 4;
		} else if (scale <= this.ONE_HOUR * 6) {
			result = this.ONE_HOUR * 6;
		} else if (scale <= this.ONE_HOUR * 12) {
			result = this.ONE_HOUR * 12;
		}
		return result;
	},

	getTimeHHmmssOrHHmm : function(timeStamp, needSec) {
		var hours = Math.floor(timeStamp/ClientUtilities.ONE_HOUR);

        var HH = ("0" + hours).slice(-2);
        var mm = ("0" + Math.floor((timeStamp%ClientUtilities.ONE_HOUR)/ClientUtilities.ONE_MINUTE)).slice(-2);
        var ss = ("0" + Math.floor((timeStamp%ClientUtilities.ONE_MINUTE)/ClientUtilities.ONE_SECOND)).slice(-2);

        //100시간이 넘을때는 3자리 이상이다.
        if(timeStamp/ClientUtilities.ONE_HOUR/100 >= 1) HH = Math.floor(timeStamp/ClientUtilities.ONE_HOUR/100) + HH;

        return (needSec)? HH+":"+mm+":"+ss : HH+":"+mm;
	}
	
};

export {ClientUtilities};