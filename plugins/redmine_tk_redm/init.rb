require 'redmine'

require_dependency 'hooks/tk_view_layouts_base_html_head_hook'

Redmine::Plugin.register :redmine_tk_redm do
  name 'Timekey Redmine辅助插件'
  author 'KennyLee'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'http://example.com/path/to/plugin'
  author_url 'http://example.com/about'

  menu :account_menu, :work_info, {:controller => 'work_info', :action => 'index'}, :if => Proc.new { User.current.logged? }, :caption => '本月绩效信息', :first => true
end
