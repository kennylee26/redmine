class WorkInfoController < ApplicationController
  unloadable

  def user_list
    require_login || return
    user = User.current
    if user.admin then
      #@web_contents = 'Im admin'
      redirect_to :action => 'user_detail'
    else
      redirect_to :action => 'user_detail'
    end
  end

  def user_detail
    require_login || return
    user = User.current
    if user.admin and params[:id]!= nil then
      uid = params[:id]
    else
      uid = user.id
    end
    remote_url = 'http://192.168.1.99:8090/rmh/controller/user/spent/'+uid.to_s;

    require 'net/http'
    require 'uri'
    res = Net::HTTP.get_response(URI(remote_url))
    @web_contents = res.body
  end
end
