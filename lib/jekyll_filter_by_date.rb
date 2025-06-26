def last_month_filter(posts)
    now = DateTime.now
    today = DateTime.new(now.year, now.month, now.day, 0, 0, 0, now.zone)
    target = today - 30

    posts.select do |post|
        postedOn = post.data['posted_on'].to_datetime

        #if postedOn < today && postedOn > target
            #post
        #end
    end
end
