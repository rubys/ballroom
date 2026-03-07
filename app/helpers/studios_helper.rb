module StudiosHelper
  def ballroom_options
    count = Event.current.ballrooms || 1
    count = case count
            when 1 then 1
            when 2, 3, 4 then 2
            when 5 then 3
            when 6 then 4
            else 2
            end
    ('A'..'Z').first(count)
  end
end
