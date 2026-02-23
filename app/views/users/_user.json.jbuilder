json.extract! user, :id, :userid, :email, :name1, :name2, :password, :token, :link, :sites, :created_at, :updated_at
json.url user_url(user, format: :json)
