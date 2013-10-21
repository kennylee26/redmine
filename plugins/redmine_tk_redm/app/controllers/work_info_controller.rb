class WorkInfoController < ApplicationController
  unloadable

  @@service_ip = 'http://127.0.0.1:8090/rmh/controller'

  def user_list
    require_login || return
    user = User.current
    if user.admin then
      #@web_contents = 'Im admin'
      redirect_to :action => 'user_detail', :id => user.id
    else
      redirect_to :action => 'user_detail', :id => user.id
    end
  end

  def user_detail
    require_login || return
    @user = User.current
    if @user.admin and params[:id]!= nil then
      uid = params[:id]
      @users = User.all(:conditions => ["status = 1"])
    else
      uid = @user.id
    end
    remote_url = @@service_ip + '/ajax/user/work_info/'+uid.to_s+'?type=all';

    require 'net/http'
    require 'uri'

    begin
      res = Net::HTTP.get_response(URI(remote_url))
      @web_contents = res.body
    rescue
      @web_contents = 'Remote Server ERROR!'
    end
  end
end
