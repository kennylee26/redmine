class WorkInfoController < ApplicationController
  unloadable

  before_filter :authorize
  def user_list
    @user = User.current
    redirect_to "http://timekey.8866.org:3001/rmh/controller/user/spent/3"
  end

  def user_detail
    @user = User.current
    redirect_to "http://timekey.8866.org:3001/rmh/controller/user/spent/3"
  end
end
