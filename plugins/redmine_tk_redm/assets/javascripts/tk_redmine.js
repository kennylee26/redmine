$(document).ready(function () {
    try {
        //去掉原来的change事件，不知道有啥用而且会重置status控件
        if ($('#issue_status_id').size() > 0)
            $('#issue_status_id')[0].onchange = null;
        //修改状态时，默认选择指派的事件
        setStatusChange();
        //设置加班、休假的默认选项
        setVacationIssue();
    } catch (ex) {
        console.error('出错了，找李永坚...');
        console.error(ex);
    }
});

function setVacationIssue() {
    if ($('#issue_tracker_id option').filter(function () {
        return $(this).text() === '加班' || $(this).text() === '休假';
    }).size() > 0) {
        var _option = $('#issue_status_id option').filter(function (i) {
            return $(this).text() === '申请';
        });
        $('#issue_status_id option').filter(function () {
            return $(this).text() === '新建';
        }).remove();
        _option.siblings().prop('selected', false);
        _option.prop('selected', true);
        _option.trigger('change');
    }
}

function setStatusChange() {
    $('#issue_status_id').change(function () {
        var _option = $(this).find('option:selected');
        if (/(已关闭|已分配)/g.test(_option.text())) {
            if ($('#issue_custom_field_values_6 option').size() > 0) {
                var _sed = $('#issue_custom_field_values_6 option:selected');
                $('#issue_assigned_to_id option').siblings().prop('selected', false);
                $('#issue_assigned_to_id option[value="' + _sed.val() + '"]').prop('selected', true);
            }
        }
    });
}

function WorkInfo() {
    this._json = {};
    this._content = $('body');
}

WorkInfo.prototype = new Object();

WorkInfo.prototype.show = function () {
};

WorkInfo.prototype.init = function () {
    this._json = $.evalJSON($('#web_contents').text());
    this._content = $('#show');
};

function UserIssueInfo() {
};

UserIssueInfo.prototype = new WorkInfo();

UserIssueInfo.prototype.show = function () {
    this.init();
    this._content.append('<h2>2013年10月份的工作信息如下:</h2>');
    var _totalInfoHTML = '<div><ul>';
    _totalInfoHTML += '<li>已分配任务的总工时: ' + this._json.planingTime + ' 小时。</li>';
    _totalInfoHTML += '<li>已关闭的任务总工时: ' + this._json.finishedTime + ' 小时。</li>';
    _totalInfoHTML += '</ul></div>';
    this._content.append(_totalInfoHTML);

    this._generateIssueView();
};

UserIssueInfo.prototype._generateIssueView = function () {
    var _html = '<table class="list issues">';
    _html += '<thead><tr><th>id</th><th>状态</th>';
    _html += '<th>项目</th>';
    _html += '<th>标题</th><th>指派给</th><th>开始日期</th><th>结束日期</th><th>预计耗时</th></tr></thead>';
    var today = new Date().getDate();
    $.each(this._json.issues, function (i, issue) {
        _html += '<tr class="issue ';
        var dueDay = parseInt(/-(\d+)$/.exec(issue.dueDate)[1]);
        if ((i + 1) % 2 == 0) {
            _html += 'even ';
        } else {
            _html += 'odd ';
        }
        if (issue.isClosed == false) {
            var period = dueDay - today;
            if (period < 0) {//超时
                _html += 'issue_over_time ';
            } else if (period <= 2) {//紧张
                _html += 'issue_quick ';
            } else if (period <= 5) {//进程
                _html += 'issue_week ';
            }
        } else {
            _html += 'closed ';
        }
        _html += '">';
        _html += '<td>' + issue.id + '</td>';
        _html += '<td>' + issue.statusName + '</td>';
        _html += '<td><a href="/projects/' + issue.project.id + '" target="_blank">' + issue.project.name + '</a></td>';
        _html += '<td><a href="/issues/' + issue.id + '" target="_blank">' + issue.subject + '</a></td>';
        _html += '<td><a href="/users/' + issue.assignedUser.id + '" target="_blank">' + issue.assignedUser.name + '</a></td>';
        _html += '<td>' + issue.createdOn + '</td>';
        _html += '<td>' + issue.dueDate + '</td>';
        _html += '<td>' + issue.estimatedHours + '</td>';
        _html += '</tr>';
    });
    _html += '</table>';

    this._content.addClass('autoscroll').append(_html);
};