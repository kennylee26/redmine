module RedmineTkRedm
  module Hooks
    class ViewLayoutsBaseHtmlHeadHook < Redmine::Hook::ViewListener
      def view_layouts_base_html_head(context={})
        if context[:controller] and (context[:controller].is_a?(IssuesController))
          return stylesheet_link_tag('tk_redmine.css', :plugin => 'redmine_tk_redm', :media => 'screen') +
              javascript_include_tag('tk_redmine.js', :plugin => 'redmine_tk_redm')
        end
      end
    end
  end
end
