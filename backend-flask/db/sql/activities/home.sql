SELECT
  replies.uuid,
  reply_users.display_name,
  reply_users.handle,
  replies.message,
  replies.replies_count,
  replies.reposts_count,
  replies.likes_count,
  replies.reply_to_activity_uuid,
  replies.created_at
  (SELECT COALESCE(array_to_json(array_agg(row_to_json(array_row))),'[]'::json) FROM (
  SELECT
    activities.uuid,
    users.display_name,
    users.handle,
    activities.message,
    activities.replies_count,
    activities.reposts_count,
    activities.likes_count,
    activities.reply_to_activity_uuid,
    activities.created_at
  FROM public.activities replies
  WHERE 
    replies.reply_to_activity_uuid = activities.uuid
  LEFT JOIN public.users ON reply_users.uuid = replies.user_uuid
  ORDER BY activities.created_at ASC
  ) array_row) as replies
FROM public.activities
LEFT JOIN public.users ON users.uuid = activities.user_uuid
ORDER BY activities.created_at DESC