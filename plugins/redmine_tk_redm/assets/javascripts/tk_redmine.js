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
    this._userIssueInfo = {};
    this.__projectIssueInfo = {};
}

WorkInfo.prototype = new Object();

WorkInfo.prototype.launch = function () {
    this._userIssueInfo = new UserIssueInfo();
    this._userIssueInfo._create();
    this._projectIssueInfo = new ProjectIssueInfo();
    this._projectIssueInfo._create();
    this.addButListener();
};

WorkInfo.prototype.addButListener = function () {
    var _projectIssueInfo = this._projectIssueInfo;
    var _userIssueInfo = this._userIssueInfo;
    $('#showIssueInfo').click(function () {
        _projectIssueInfo.hide();
        _userIssueInfo.show();
        $(this).css('color', 'gray');
        $('#showProjectInfo').css('color', '');
    }).click();
    $('#showProjectInfo').click(function () {
        _userIssueInfo.hide();
        _projectIssueInfo.show();
        $(this).css('color', 'gray');
        $('#showIssueInfo').css('color', '');
    });
}

function UserIssueInfo() {
    this._contentId = 'issue_info_contents';
    this._containerId = 'issue_info';
    this._content = '';
    this._json = {};
    this._title = '您好, 2013年10月份的工作信息如下:';
};

UserIssueInfo.prototype = new Object();

UserIssueInfo.prototype.init = function () {
    this._json = $.evalJSON($('#' + this._contentId).text());
    this._content = $('#' + this._containerId);
};

UserIssueInfo.prototype._create = function () {
    try {
        this.init();
    } catch (ex) {
        $('#' + this._containerId).text($('#' + this._contentId).text());
        return;
    }
    this._content.append('<h3>' + this._title + '</h3>');
    var _totalInfoHTML = '<div><ul>';
    _totalInfoHTML += '<li>已分配任务的总工时: ' + this._json.planingTime + ' 小时。</li>';
    _totalInfoHTML += '<li>已关闭的任务总工时: ' + this._json.finishedTime + ' 小时。</li>';
    _totalInfoHTML += '</ul></div>';
    this._content.append(_totalInfoHTML);

    this._generateView();
};

UserIssueInfo.prototype._generateView = function () {
    if (this._json && this._json.issues && this._json.issues.length > 0) {
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
            _html += '<td><a href="/projects/' + issue.project.identifier + '/issues" target="_blank">' + issue.project.name + '</a></td>';
            _html += '<td><a href="/issues/' + issue.id + '" target="_blank">' + issue.subject + '</a></td>';
            _html += '<td><a href="/users/' + issue.assignedUser.id + '" target="_blank">' + issue.assignedUser.name + '</a></td>';
            _html += '<td>' + issue.startDate + '</td>';
            _html += '<td>' + issue.dueDate + '</td>';
            _html += '<td>' + issue.estimatedHours + '</td>';
            _html += '</tr>';
        });
        _html += '</table>';

        this._content.addClass('autoscroll').append(_html);
    }
};

UserIssueInfo.prototype.show = function () {
    $('#issue_info_container').show();
}

UserIssueInfo.prototype.hide = function () {
    $('#issue_info_container').hide();
}

function ProjectIssueInfo() {
    this._contentId = 'project_info_contents';
    this._containerId = 'project_info';
    this._content = '';
    this._json = {};
    this._title = '您好, 2013年10月份你所管理的项目情况如下:';
};

ProjectIssueInfo.prototype = new Object();

ProjectIssueInfo.prototype.init = function () {
    this._json = $.evalJSON($('#' + this._contentId).text());
    this._content = $('#' + this._containerId);
};

ProjectIssueInfo.prototype._create = function () {
    try {
        this.init();
        if (this._json && this._json.length > 0) {
            $('#project_menu').show();
        }
    } catch (ex) {
        $('#' + this._containerId).text($('#' + this._contentId).text());
        return;
    }
    this._content.append('<h3>' + this._title + '</h3>');

    this._generateView();
};

ProjectIssueInfo.prototype._generateView = function () {
    if (this._json && this._json.length > 0) {
        var _html = '<table class="list issues">';
        _html += '<thead><tr><th>id</th><th>状态</th>';
        _html += '<th>项目</th>';
        _html += '<th>标题</th><th>责任人</th><th>开始日期</th><th>结束日期</th><th>预计耗时</th></tr></thead>';
        var today = new Date().getDate();
        $.each(this._json, function (i, prjInfo) {
            var _count = 0;
            $.each(prjInfo.issues, function (n, issue) {
                if (issue.isClosed) {
                    _count += 1;
                }
            })
            _html += '<tr class="group ';
            if (_count !== prjInfo.issues.length) {
                _html += ' open';
            }
            _html += '"><td colspan="8">';
            _html += '<span class="expander" onclick="toggleRowGroup(this);">&nbsp;</span>';
            _html += '<a href="javascript:void(0)" onclick="toggleRowGroup(this);">' + prjInfo.project.name + '</a>';
            _html += '<span id="' + prjInfo.project.id + '_count" class="count">' + _count + '/' + prjInfo.issues.length + '</span>';
            _html += '<a class="toggle-all" href="#" onclick="toggleAllRowGroups(this); return false;">Collapse all/Expand all</a>';
            _html += '</td></tr>'
            $.each(prjInfo.issues, function (n, issue) {
                _html += '<tr class="issue ';
                var dueDay = parseInt(/-(\d+)$/.exec(issue.dueDate)[1]);
                if ((n + 1) % 2 == 0) {
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
                _html += '"';
                if (_count === prjInfo.issues.length) {
                    _html += ' style="display:none;"';
                }
                _html += '><td>' + issue.id + '</td>';
                _html += '<td>' + issue.statusName + '</td>';
                _html += '<td><a href="/projects/' + issue.project.identifier + '/issues" target="_blank">' + issue.project.name + '</a></td>';
                _html += '<td><a href="/issues/' + issue.id + '" target="_blank">' + issue.subject + '</a></td>';
                _html += '<td><a href="/users/' + issue.responsibleUser.id + '" target="_blank">' + issue.responsibleUser.name + '</a></td>';
                _html += '<td>' + issue.startDate + '</td>';
                _html += '<td>' + issue.dueDate + '</td>';
                _html += '<td class="spent" pid="' + prjInfo.project.id + '">' + issue.estimatedHours + '</td>';
                _html += '</tr>';
            })
        });
        _html += '</table>';
        this._content.addClass('autoscroll').append(_html);
    }
};

ProjectIssueInfo.prototype.show = function () {
    this._content.show();
}

ProjectIssueInfo.prototype.hide = function () {
    this._content.hide();
}