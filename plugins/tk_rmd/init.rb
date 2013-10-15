Redmine::Plugin.register :tk_rmd do
  name 'Timekey Redmine辅助插件'
  author 'KennyLee'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'http://example.com/path/to/plugin'
  author_url 'http://example.com/about'

  project_module :work_info do
    permission :all_rmd, :work_info => :user_list
    permission :view_rmd, :work_info => :user_detail
  end
  menu :account_menu, :work_info, { :controller => 'work_info', :action => 'user_list' },:if => Proc.new{ User.current.logged? } , :caption => '本月绩效信息',:first => true, :param => :user_id
end
