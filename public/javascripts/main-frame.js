$(document).ready(function() {
    //提示框控制
	$('#sus_tips').hide();
	$('#error_tips').hide();
	//通过把java变量封装到html组件中，使其在jquery中能获取此值
	var sus = $('#sus_value').attr("value");
	var error = $('#error_value').attr("value");
	//null is not null
	if(sus!='null')
	{
	
		$('#sus_tips').fadeToggle(300, function() {
			$('#sus_tips').fadeToggle(500);
		});
	} else if (error!='null') {
		
		$('#error_tips').fadeToggle(300, function() {
			$('#error_tips').fadeToggle(500);
		});
	}

	// if(info_sus)
	// {
	// alert(info_sus);
	// $('#sus_tips').show(1000,function(){
	// $('#sus_tips').hide();
	// });
	// }else if(info_error)
	// {
	// alert(info_error);
	// $('#error_tips').show(1000,function(){
	// $('#error_tips').hide();
	// });
	// }

});
