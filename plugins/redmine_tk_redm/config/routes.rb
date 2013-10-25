# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html

RedmineApp::Application.routes.draw do
  match 'work_info/:action', :to => 'work_info#project_list'
  match 'work_info/:action', :to => 'work_info#index'
  match 'work_info/:action/:id', :to => 'work_info#user_detail'
end