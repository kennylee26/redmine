class WorkInfoController < ApplicationController
  unloadable

  @@service_ip = 'http://127.0.0.1:8090/rmh/controller'

  def index
    require_login || return
    user = User.current
    if user.admin then
      redirect_to :action => 'user_detail', :id => user.id
    else
      redirect_to :action => 'user_detail', :id => user.id
    end
  end

  def user_detail
    require_login || return
    @user = User.current
    if @user.admin and (params[:user_id]!= nil or params[:id]!=nil) then
      uid = params[:user_id]
      if (uid==nil)
        uid = params[:id]
      end
      @users = User.all(:conditions => ['status = 1 and id not in (1,33,22,7,25,44,45,48)'], :order => 'firstname')
    else
      uid = @user.id
    end
    @tid = uid.to_s
    service_url = @@service_ip + '/ajax/user/work_info/'+@tid+'?type=all';

    require 'net/http'
    require 'uri'

    @project_info_contents = ''
    begin
      res = Net::HTTP.get_response(URI(service_url))
      @issue_info_contents = res.body #.to_s.force_encoding('UTF-8')
      service_url = @@service_ip + '/ajax/project/work_info/'+@user.id.to_s;
      res = Net::HTTP.get_response(URI(service_url))
      @project_info_contents = res.body #.to_s.force_encoding('UTF-8')
    rescue
      @issue_info_contents = 'Remote Server ERROR!'
      @project_info_contents = 'Remote Server ERROR!'
    end
  end

  def project_list
    require_login || return
    @user = User.current
    if @user.admin and (params[:user_id]!= nil or params[:id]!=nil) then
      uid = params[:user_id]
      if (uid==nil)
        uid = params[:id]
      end
    else
      uid = @user.id
    end
    @tid = uid.to_s
    remote_url = @@service_ip + '/ajax/project/work_info/'+@tid;

    require 'net/http'
    require 'uri'
    begin
      res = Net::HTTP.get_response(URI(remote_url))
      @web_contents = res.body #.to_s.force_encoding('UTF-8')
    rescue
      @web_contents = 'Remote Server ERROR!'
    end
  end
end
