$(document).ready(function(){
    try{
        //去掉原来的change事件，不知道有啥用而且会重置status控件
    	if($('#issue_status_id').size() > 0)
        $('#issue_status_id')[0].onchange = null;
        //修改状态时，默认选择指派的事件
        setStatusChange();
        //设置加班、休假的默认选项
    	setVacationIssue();
    }catch(ex){
       console.error('出错了，找李永坚...');
       console.error(ex);
    }
});

function setVacationIssue(){
	if($('#issue_tracker_id option').filter(function(i){
		return $(this).text() === '加班' || $(this).text() === '休假';
	}).size()>0){
		var _option = $('#issue_status_id option').filter(function(i){
			return $(this).text() === '申请';
		});
		$('#issue_status_id option').filter(function(i){
            return $(this).text() === '新建';
        }).remove();
		_option.siblings().prop('selected',false);
		_option.prop('selected',true) ;
		_option.trigger('change');
	}
}

function setStatusChange(){
    $('#issue_status_id').change(function(){
        var _option = $(this).find('option:selected');
        if(/(已关闭|已分配)/g.test(_option.text())){
            if($('#issue_custom_field_values_6 option').size() > 0){
                var _sed = $('#issue_custom_field_values_6 option:selected');
                $('#issue_assigned_to_id option').siblings().prop('selected',false);
                $('#issue_assigned_to_id option[value="'+_sed.val()+'"]').prop('selected',true);
            }
        }
    });
}
